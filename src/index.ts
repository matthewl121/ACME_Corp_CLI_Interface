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

const main = async () => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = "https://github.com/prathameshnetake/libvlc"

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
    console.log(repoURL)
    const contributorActivity = await fetchContributorActivity(owner, repo, token);
    await writeFile(contributorActivity, "contributorActivity.json");
    if (!contributorActivity?.data || !Array.isArray(contributorActivity.data)) {
        console.error('Invalid contributor activity data:', contributorActivity.data);
        return;
    }
    
    const busFactor = calcBusFactor(contributorActivity.data);

    // Correctness
    const totalOpenIssues = await fetchRecentIssuesByState(owner, repo, "open", token);
    const totalClosedIssues = await fetchRecentIssuesByState(owner, repo, "closed", token);
    if (!totalOpenIssues?.data || !totalClosedIssues?.data) {
        return;
    }

    await writeFile(totalOpenIssues, "totalOpenIssues.json")
    await writeFile(totalClosedIssues, "totalClosedIssues.json")
    const correctness = calcCorrectness(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count)

    // Responsive Maintainer
    const recentPullRequests = await fetchRecentPullRequests(owner, repo, token)
    if (!recentPullRequests?.data) {
        return;
    }

    await writeFile(recentPullRequests, "recentPullRequests.json")
    const responsiveness = calcResponsiveness(totalClosedIssues.data.items, recentPullRequests.data.items);

    // Licenses
    // TODO: CHECK IF LICENSE IN README
    const licenses = await fetchLicense(owner, repo, token);
    let license = "";
    if (licenses === "NO_LICENSE") {
        license = "None"
    } else {
        if (!licenses?.data) {
            return;
        }
    
        await writeFile(licenses, "licenses.json")
        license = licenses.data.license.name
    }
    
    // Log the metrics
    console.log(`
        --- METRICS --- 
        
        Bus Factor:     ${busFactor} devs
        Correctness:    ${correctness}%
        Responsiveness: ${responsiveness} hours
        License:        ${license}
    `);
        
}

main()
