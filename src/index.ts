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
import { Metrics, WorkerResult } from './types'
import { logToFile } from './utils/log'
// import { initLogFile, logToFile } from './utils/log.js';
import { get } from 'axios';
import { read } from 'fs';
import { ApiResponse, GraphQLResponse } from './types';
import { resolveNaptr } from 'dns';
import { Worker } from 'worker_threads';


export async function getRepoDetails(token: string, inputURL: string): Promise<[string, string, string]> {
    // Extract hostname (www.npm.js or github.com or null)
    const hostname = extractDomainFromUrl(inputURL);
    if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
        process.exit(1);
    }

    let repoURL: string = "";

    // If url is npm, fetch the github repo
    if (hostname === "www.npmjs.com") {
        const npmPackageName = extractNpmPackageName(inputURL);
        if (!npmPackageName) {
            process.exit(1);
        }

        // Fetch the Github repo url from npm package
        const npmResponse = await fetchGithubUrlFromNpm(npmPackageName);
        if (!npmResponse?.data) {
            process.exit(1);
        }

        repoURL = npmResponse.data;
    } else {
        // URL must be github, so use it directly
        repoURL = inputURL;
    }

    const repoDetails = extractGithubOwnerAndRepo(repoURL);
    if (!repoDetails) {
        process.exit(1);
    }

    const extendedDetails: [string, string, string] = [...repoDetails, repoURL];

    return extendedDetails;
}

export async function calcBusFactor(owner: string, repo: string, token: string): Promise<number> {
    let busFactor;
    const contributorActivity = await fetchContributorActivity(owner, repo, token);
    if (!contributorActivity?.data || !Array.isArray(contributorActivity.data)) {
        busFactor = -1
    } else {
        busFactor = calcBusFactorScore(contributorActivity.data);
    }

    return busFactor;
}

export function calcCorrectness(repoData: ApiResponse<GraphQLResponse | null>): number {
    const totalOpenIssues = repoData.data?.data.repository.openIssues;
    const totalClosedIssues = repoData.data?.data.repository.closedIssues;

    if (!totalOpenIssues || !totalClosedIssues) {
        return -1;
    }
    const correctness = calcCorrectnessScore(totalOpenIssues.totalCount, totalClosedIssues.totalCount);

    return correctness;
}

export function calcResponsiveness(repoData: ApiResponse<GraphQLResponse | null>): number {
    const recentPullRequests = repoData.data?.data.repository.pullRequests;
    const isArchived = repoData.data?.data.repository.isArchived;
    const totalOpenIssues = repoData.data?.data.repository.openIssues;
    const totalClosedIssues = repoData.data?.data.repository.closedIssues;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (!recentPullRequests?.nodes || !totalClosedIssues?.nodes || !totalOpenIssues?.nodes) {
        return -1;
    }
    const responsiveness = calcResponsivenessScore(totalClosedIssues.nodes, totalOpenIssues.nodes, recentPullRequests.nodes, oneMonthAgo, isArchived ?? false);

    return responsiveness;
}

export async function calcLicense(owner: string, repo: string, repoURL: string): Promise<number> {
    const localDir = path.join("./repos", `${owner}_${repo}`);
    const license = await calcLicenseScore(repoURL, localDir);

    return license;
}

export async function calcRampUp(repoData: ApiResponse<GraphQLResponse | null>): Promise<number> {
    const readMeMd = repoData.data?.data.repository.readmeMd;
    const readMeNoExt = repoData.data?.data.repository.readmeNoExt;
    const readMeTxt = repoData.data?.data.repository.readmeTxt;
    const readMeRDoc = repoData.data?.data.repository.readmeRDoc;
    const readMeHtml = repoData.data?.data.repository.readmeHtml;
    const readmeadoc = repoData.data?.data.repository.readmeAdoc;
    const readmemarkdown = repoData.data?.data.repository.readmemarkdown;
    const readmeyaml = repoData.data?.data.repository.readmeyaml;
    const readmerst = repoData.data?.data.repository.readmerst;
    const examplesFolder = repoData.data?.data.repository.examplesFolder;
    
    // Readme
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

    return rampUp;
}

// Function to create and manage worker threads
export function runWorker(owner: string, repo: string, token: string, repoURL: string, repoData: ApiResponse<GraphQLResponse | null>, metric: string): Promise<WorkerResult> {
    return new Promise((resolve, reject) => {
        // PATH TO WORKER SCRIPT
        const worker = new Worker('./src/utils/worker.ts');
        
        // SEND DATA TO WORKER AND START THE WORKER
        worker.postMessage({owner, repo, token, repoURL, repoData, metric});

        // GET THE WORKER'S RESULT
        worker.on('message', (result: WorkerResult) => {
            resolve(result);
            worker.terminate();
        });

        // HANDLE ERRORS
        worker.on('error', (error) => {
            reject(error);
            worker.terminate();
        });

        // EXIT
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

export async function calculateMetrics(owner: string, repo: string, token: string, repoURL: string, repoData: ApiResponse<GraphQLResponse | null>, inputURL: string): Promise<Metrics | null> {
    // concurrently calculate metrics
    const busFactorWorker = runWorker(owner, repo, token, repoURL, repoData, "busFactor");
    const correctnessWorker = runWorker(owner, repo, token, repoURL, repoData, "correctness");
    const rampUpWorker = runWorker(owner, repo, token, repoURL, repoData, "rampUp");
    const responsivenessWorker = runWorker(owner, repo, token, repoURL, repoData, "responsiveness");
    const licenseWorker = runWorker(owner, repo, token, repoURL, repoData, "license");

    const results = await Promise.all([busFactorWorker, correctnessWorker, rampUpWorker, responsivenessWorker, licenseWorker]);

    // parse metric scores and latencies
    let busFactor = results[0].score;
    let correctness = results[1].score;
    let rampUp = results[2].score;
    let responsiveness = results[3].score;
    let license = results[4].score;

    let busFactorLatency = results[0].latency;
    let correctnessLatency = results[1].latency;
    let rampUpLatency = results[2].latency;
    let responsivenessLatency = results[3].latency;
    let licenseLatency = results[4].latency;

    // verify calculations
    if (correctness == -1) {
        logToFile("Unable to calculate correctness", 1);
        return null;
    }
    if (responsiveness == -1) {
        logToFile("Unable to calculate responsiveness", 1);
        return null;
    }

    // calculate net score
    const begin = Date.now();
    const netScore = (busFactor*0.25) + (correctness*0.30) + (rampUp*0.20) + (responsiveness*0.15) + (license*0.10);
    const end = Date.now();

    const metrics: Metrics = {
        URL: inputURL,
        NetScore: netScore,
        NetScore_Latency: (end - begin) / 1000,
        RampUp: rampUp,
        RampUp_Latency: rampUpLatency,
        Correctness: correctness,
        Correctness_Latency: correctnessLatency,
        BusFactor: busFactor,
        BusFactor_Latency: busFactorLatency,
        ResponsiveMaintainer: responsiveness,
        ResponsiveMaintainer_Latency: responsivenessLatency,
        License: license,
        License_Latency: licenseLatency
    };

    return metrics;
}


export const main = async (url: string) => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = url;
    
    const repoDetails = await getRepoDetails(token, inputURL);

    const [owner, repo, repoURL]: [string, string, string] = repoDetails;

    /* 
        Now that the repo owner (owner) and repo name (repo) have
        been parsed, we can use the github api to calc metrics
    */

   const repoData = await fetchRepoData(owner, repo, token);
   if (!repoData.data) {
       logToFile("Error fetching repo data", 1);
       return;
    }

    // calculate all metrics (concurrently)
    let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);
    if (metrics == null) {
        return;
    }

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
