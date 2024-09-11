/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchContributorActivity, fetchRecentPullRequests } from "./api/GithubApi";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs';
import { writeFile } from './utils/utils';
import { extractNpmPackageName, extractGithubOwnerAndRepo, extractDomainFromUrl } from './utils/urlHandler'
import { fetchGithubUrlFromNpm } from './api/npmApi';
import { ContributorResponse } from './types';
import { MetricManager } from './metricManager';

const main = async () => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = "https://www.npmjs.com/package/ts-node"

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

    /* 
        Now that the repo owner (owner) and repo name (repo) have
        been parsed, we can use the github api to calc metrics
    */

    // // Bus Factor
    // const contributorActivity = await fetchContributorActivity(owner, repo, token);
    // if (!contributorActivity?.data) {
    //     return;
    // }
    
    // await writeFile(contributorActivity, "contributorActivity.json");
    // const busFactor = calcBusFactor(contributorActivity.data);

    // // Correctness
    // const totalOpenIssues = await fetchRecentIssuesByState(owner, repo, "open", token);
    // const totalClosedIssues = await fetchRecentIssuesByState(owner, repo, "closed", token);
    // if (!totalOpenIssues?.data || !totalClosedIssues?.data) {
    //     return;
    // }

    // await writeFile(totalOpenIssues, "totalOpenIssues.json")
    // await writeFile(totalClosedIssues, "totalClosedIssues.json")
    // const correctness = calcCorrectness(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count)

    // // Responsive Maintainer
    // const recentPullRequests = await fetchRecentPullRequests(owner, repo, token)
    // if (!recentPullRequests?.data) {
    //     return;
    // }

    // await writeFile(recentPullRequests, "recentPullRequests.json")
    // const responsiveness = calcResponsiveness(totalClosedIssues.data.items, recentPullRequests.data.items);

    // // Licenses
    // const licenses = await fetchLicense(owner, repo, token);
    // if (!licenses?.data) {
    //     return;
    // }

    // await writeFile(licenses, "licenses.json")
    // const license = licenses.data.license.name

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
        
}

main()
