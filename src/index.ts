/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/

import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchContributorActivity, fetchRecentPullRequests, fetchReadme } from "./api/GithubApi";
import { calcBusFactorScore, calcCorrectnessScore, calcLicenseScore, calcResponsivenessScore } from './metricCalcs';
import { hasLicenseHeading, writeFile } from './utils/utils';
import { extractNpmPackageName, extractGithubOwnerAndRepo, extractDomainFromUrl } from './utils/urlHandler'
import { fetchGithubUrlFromNpm } from './api/npmApi';

const main = async () => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = "https://github.com/defunkt/exception_logger"

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

    // Bus Factor
    const contributorActivity = await fetchContributorActivity(owner, repo, token);
    await writeFile(contributorActivity, "contributorActivity.json");
    if (!contributorActivity?.data || !Array.isArray(contributorActivity.data)) {
        console.error('Invalid contributor activity data:', contributorActivity.data);
        return;
    }
    
    const busFactor = calcBusFactorScore(contributorActivity.data);

    // Correctness
    const totalOpenIssues = await fetchRecentIssuesByState(owner, repo, "open", token);
    const totalClosedIssues = await fetchRecentIssuesByState(owner, repo, "closed", token);
    if (!totalOpenIssues?.data || !totalClosedIssues?.data) {
        return;
    }

    await writeFile(totalOpenIssues, "totalOpenIssues.json")
    await writeFile(totalClosedIssues, "totalClosedIssues.json")
    const correctness = calcCorrectnessScore(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count)

    // Responsive Maintainer
    const recentPullRequests = await fetchRecentPullRequests(owner, repo, token)
    if (!recentPullRequests?.data) {
        return;
    }

    await writeFile(recentPullRequests, "recentPullRequests.json")
    const responsiveness = calcResponsivenessScore(totalClosedIssues.data.items, recentPullRequests.data.items);

    // licenseResponse
    // TODO: CHECK IF LICENSE IN README
    const licenseResponse = await fetchLicense(owner, repo, token);
    if (!licenseResponse?.data) {
        console.error("Error retrieving license information.");
        return;
    }

    await writeFile(licenseResponse, "licenseResponse.json");


    const readmeResponse = await fetchReadme(owner, repo, token)
    await writeFile(readmeResponse, "readme.json");
    if (readmeResponse.error || !readmeResponse.data) {
        return;
    }

    const base64Content = readmeResponse.data?.content;
    const buffer = Buffer.from(base64Content, 'base64');
    const readmeContent = buffer.toString('utf-8');

    await writeFile(readmeContent, "readmeContent.txt")
    
    const license = calcLicenseScore(licenseResponse.data, readmeContent)
    // Log the metrics
    console.log(`
        --- METRICS ---       --- SCORE --- 
        
        Bus Factor Score:     ${busFactor.toFixed(2)}
        Correctness Score:    ${correctness.toFixed(2)}
        Responsiveness Score: ${responsiveness.toFixed(2)}
        License Score:        ${license.toFixed(2)}
    `);
}

main()
