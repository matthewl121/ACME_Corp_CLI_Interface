/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { extractDomainFromUrl, extractNpmPackageName, extractGithubOwnerAndRepo } from './utils/urlHandler.js';
import { fetchGithubUrlFromNpm } from './api/npmApi.js';
import { MetricManager } from './metricManager.js';
import { initLogFile, logToFile } from './utils/log.js';
import * as fs from 'fs';
import * as readline from 'readline';

const main = async (filePath: string) => {
    initLogFile();
    const token = process.env.GITHUB_TOKEN || "";
    // const inputURL = "https://www.npmjs.com/package/ts-node";

    // Create an array to store the lines (URLs)
    const urlsArray: string[] = [];

    // Create a read stream to read the file line by line
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Read each line and store it in the array
    for await (const line of rl) {
        const inputURL = line.trim();
        if (inputURL) {
            urlsArray.push(inputURL);  // Store the URL in the array
        }

    // Process each URL in the array
    for (const url of urlsArray) {
        // Extract hostname (www.npm.js or github.com or null)
        const hostname = extractDomainFromUrl(url)
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
            // const metricManager = new MetricManager(owner, repo, token, repoURL);

            // Calculate and log all metrics (bus factor, correctness, responsiveness)
            const manager = new MetricManager(owner, repo, token, repoURL);

            // Get metrics and do something with them
            const metricsALL = await manager.calculateAndLogMetrics();

        } catch (error) {
            // Handle any errors that might occur during the API calls or calculations
            console.error("An error occurred in the main function:", error);
        }
    }
        
}
}

main(process.argv[2]).catch(console.error);
