/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { fetchContributorActivity, fetchRepoData, getReadmeDetails, checkFolderExists } from "./api/githubApi";
// import { calcBusFactorScore, calcCorrectnessScore, calcLicenseScore, calcResponsivenessScore } from './metricCalcs';
// import { writeFile } from './utils/utils';
import { getRepoDetails } from './utils/urlHandler';
// import { fetchGithubUrlFromNpm } from './api/npmApi';
// import * as path from 'path';
import { Metrics, WorkerResult } from './types';
import { logToFile } from './utils/log';
// import { initLogFile, logToFile } from './utils/log.js';
// import { get } from 'axios';
// import { read } from 'fs';
import { ApiResponse, GraphQLResponse } from './types';
// import { resolveNaptr } from 'dns';
import { Worker } from 'worker_threads';
import { calculateMetrics } from './metricCalcs';


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
