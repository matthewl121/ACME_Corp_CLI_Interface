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
import { MetricManager } from './metricManager.js';
// import { initLogFile, logToFile } from './utils/log.js';
import { get } from 'axios';

const main = async () => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = "https://www.npmjs.com/package/unlicensed"
    

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
    const contributorActivity = await fetchContributorActivity(owner, repo, token);
    if (!contributorActivity?.data || !Array.isArray(contributorActivity.data)) {
        console.error('Invalid contributor activity data:', contributorActivity.data);
        return;
    }
    const busFactor = calcBusFactorScore(contributorActivity.data);

    const repoData = await fetchRepoData(owner, repo, token);
    if (!repoData.data) {
        console.log("Error fetching repo data")
        return;
    }

    await writeFile(repoData, "repoData.json")

    return


    const totalOpenIssues = repoData.data.data.repository.openIssues;
    const totalClosedIssues = repoData.data.data.repository.closedIssues;
    const recentPullRequests = repoData.data.data.repository.pullRequests;
    const isArchived = repoData.data.data.repository.isArchived;
    const readMe = repoData.data.data.repository.readme;

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

    
    let rampUp = null;
    if(!readMe?.text) {
        rampUp = 'High (readme has no information)';
    } else {
        const exampleFolder = await checkFolderExists(owner, repo, token);
        rampUp = await getReadmeDetails(readMe, exampleFolder);

        await writeFile(exampleFolder, "exampleFolder.json")
    }

    // Log the metrics
    // const manager = new MetricManager(owner, repo, token, repoURL);
    // const metricsALL = await manager.calculateAndLogMetrics();
    console.log(`
        --- METRICS ---       --- SCORE --- 
        
        Bus Factor Score:     ${busFactor.toFixed(2)}
        Ramp Up Time:         ${rampUp}
        Correctness Score:    ${correctness.toFixed(2)}
        Responsiveness Score: ${responsiveness.toFixed(2)}
        License Score:        ${license.toFixed(2)}
    `);
}

main()
