/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { extractDomainFromUrl, extractNpmPackageName, extractGithubOwnerAndRepo } from './utils/urlHandler.js';
import { fetchGithubUrlFromNpm } from './api/npmApi.js';
import { MetricManager } from './metricManager.js';

const main = async () => {
    const token = process.env.GITHUB_TOKEN || "";
    const inputURL = "https://www.npmjs.com/package/ts-node";

    // Extract hostname (www.npm.js or github.com or null)
    const hostname = extractDomainFromUrl(inputURL)
    if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
        return;
    }

    let repoURL: string = "";

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

    // Log the metrics
    try {
        // Create an instance of MetricManager with necessary details
        const metricManager = new MetricManager(owner, repo, token);

        // Calculate and log all metrics (bus factor, correctness, responsiveness)
        const manager = new MetricManager(owner, repo, token);

        // Get metrics and do something with them
        const metrics = await manager.getMetrics();
        // console.log("Metrics Object:", metrics);
        console.log(`
            --- METRICS --- 
            
            Bus Factor:     ${metrics.busFactor} devs
            Correctness:    ${metrics.correctness}%
            Responsiveness: ${metrics.responsiveness} hours
            License:        ${metrics.license}
        `);

        // await metricManager.calculateAllMetrics();

    } catch (error) {
        // Handle any errors that might occur during the API calls or calculations
        console.error("An error occurred in the main function:", error);
    }
        
};

main().catch(console.error);
