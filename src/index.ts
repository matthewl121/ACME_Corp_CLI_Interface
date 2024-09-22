/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { fetchContributorActivity, fetchRepoData, getReadmeDetails, checkFolderExists } from "./api/githubApi";
import { calcBusFactorScore, calcCorrectnessScore, calcLicenseScore, calcResponsivenessScore } from './metricCalcs';
import { writeFile } from './utils/utils';
import { extractNpmPackageName, extractGithubOwnerAndRepo, extractDomainFromUrl } from './utils/urlHandler'
import { fetchGithubUrlFromNpm } from './api/npmApi';
import * as path from 'path';
import {Metrics} from './types'
import {logToFile} from './utils/log'
// import { initLogFile, logToFile } from './utils/log.js';
import { get } from 'axios';
import { read } from 'fs';

export const main = async (url: string) => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = url
    

    // Extract hostname (www.npm.js or github.com or null)
    const hostname = extractDomainFromUrl(inputURL)
    if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
        return;
    }

    let repoURL ="";

    // If url is npm, fetch the github repo
    if (hostname === "www.npmjs.com") {
        const npmPackageName = extractNpmPackageName(inputURL)
        if (!npmPackageName) {
            return;
        }

        // Fetch the Github repo url from npm package
        const npmResponse = await fetchGithubUrlFromNpm(npmPackageName);
        if (!npmResponse?.data) {
            return;
        }

        repoURL = npmResponse.data
    } else {
        // URL must be github, so use it directly
        repoURL = inputURL
    }

    const repoDetails = extractGithubOwnerAndRepo(repoURL)
    if (!repoDetails) {
        return;
    }

    const [owner, repo]: [string, string] = repoDetails



    /* 
        Now that the repo owner (owner) and repo name (repo) have
        been parsed, we can use the github api to calc metrics
    */

    // Bus Factor
    let busFactor;
    const contributorActivity = await fetchContributorActivity(owner, repo, token);
    if (!contributorActivity?.data || !Array.isArray(contributorActivity.data)) {
        busFactor = -1
    } else {
        busFactor = calcBusFactorScore(contributorActivity.data);
    }
    

    const repoData = await fetchRepoData(owner, repo, token);
    if (!repoData.data) {
        console.log("Error fetching repo data")
        return;
    }

    await writeFile(repoData, "repoData.json")


    const totalOpenIssues = repoData.data.data.repository.openIssues;
    const totalClosedIssues = repoData.data.data.repository.closedIssues;
    const recentPullRequests = repoData.data.data.repository.pullRequests;
    const isArchived = repoData.data.data.repository.isArchived;
    const readMeMd = repoData.data.data.repository.readmeMd;
    const readMeNoExt = repoData.data.data.repository.readmeNoExt;
    const readMeTxt = repoData.data.data.repository.readmeTxt;
    const readMeRDoc = repoData.data.data.repository.readmeRDoc;
    const readMeHtml = repoData.data.data.repository.readmeHtml;
    const readmeadoc = repoData.data.data.repository.readmeAdoc;
    const readmemarkdown = repoData.data.data.repository.readmemarkdown;
    const readmeyaml = repoData.data.data.repository.readmeyaml;
    const readmerst = repoData.data.data.repository.readmerst;
    const examplesFolder = repoData.data.data.repository.examplesFolder;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    // DEBUG:
    // await writeFile(contributorActivity, "contributorActivity.json");
    // await writeFile(totalOpenIssues, "totalOpenIssues.json")
    // await writeFile(totalClosedIssues, "totalClosedIssues.json")
    // await writeFile(recentPullRequests, "recentPullRequests.json")
    // await writeFile(licenseResponse, "licenseResponse.json");
    // await writeFile(readmeResponse, "readmeResponse.txt")

    // Correctness
    if (!totalOpenIssues || !totalClosedIssues) {
        return;
    }
    const correctness = calcCorrectnessScore(totalOpenIssues.totalCount, totalClosedIssues.totalCount)

    // Responsive Maintainer
    if (!recentPullRequests?.nodes) {
        return;
    }
    const responsiveness = calcResponsivenessScore(totalClosedIssues.nodes, totalOpenIssues.nodes, recentPullRequests.nodes, oneMonthAgo, isArchived);

    // License
    const localDir = path.join("./repos", `${owner}_${repo}`)
    const license = await calcLicenseScore(repoURL, localDir)

    let readMe = null;
    if(readMeMd?.text) {
        readMe = readMeMd;
    } else if(readMeNoExt?.text) {
        readMe = readMeNoExt;
    } else if(readMeTxt?.text) {
        readMe = readMeTxt;
    } else if(readMeRDoc?.text) {
        readMe = readMeRDoc;
    } else if(readMeHtml?.text) {
        readMe = readMeHtml;
    } else if(readmeadoc?.text) {
        readMe = readmeadoc;
    } else if(readmemarkdown?.text) {
        readMe = readmemarkdown;
    } else if(readmeyaml?.text) {
        readMe = readmeyaml;
    } else if(readmerst?.text) {
        readMe = readmerst;
    }

    let rampUp = null;
    if(!readMe?.text) {
        rampUp = 0.9;
    } else {
        rampUp = await getReadmeDetails(readMe.text, examplesFolder);
    }

        const metrics: Metrics = {
            URL: inputURL,
            NetScore: null,
            RampUp: rampUp,
            BusFactor: busFactor,
            Correctness: correctness,
            ResponsiveMaintainer: responsiveness,
            License: license
        };

        // const weightedMetrics: Metrics = {
        //     URL: repoURL,
        //     NetScore: null,
        //     BusFactor: (metrics.BusFactor ?? 0) * 0.25,
        //     Correctness: (metrics.Correctness ?? 0) * 0.30,
        //     ResponsiveMaintainer: (metrics.ResponsiveMaintainer ?? 0) * 0.15,
        //     License: (license) * 0.10,
        // };

        const netScore = (busFactor*0.25) + (correctness*0.30) + (responsiveness*0.15) + (license*0.10);
        metrics.NetScore = netScore;
        logToFile("Metrics Output (JSON):", 1);
        logToFile(JSON.stringify(metrics, null, 2), 1);


    // Log the metrics
    // const manager = new MetricManager(owner, repo, token, repoURL);
    // const metricsALL = await manager.calculateAndLogMetrics();
    // console.log(`
    //     --- METRICS ---       --- SCORE --- 
        
    //     Bus Factor Score:     ${busFactor.toFixed(2)}
    //     Ramp Up Time:         ${rampUp}
    //     Correctness Score:    ${correctness.toFixed(2)}
    //     Responsiveness Score: ${responsiveness.toFixed(2)}
    //     License Score:        ${license.toFixed(2)}
    // `);
}
