import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchCommits, fetchRecentPullRequests } from "./api/GithubApi";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs';
import { writeFile, extractNpmPackageName, extractGithubOwnerAndRepo } from './utils/utils';
import { fetchGithubUrlFromNpm } from './api/npmApi';
import { ContributorActivity } from './types';

const main = async () => {
    const token: string = process.env.GITHUB_TOKEN || "";

    const inputURL = "https://www.npmjs.com/package/ts-node"
    const domain = inputURL.split('/')[2]
    let npmPackageName = "";
    let repoURL = "";
    let owner = "";
    let repo = "";
    // if url is npm
    if (domain === "www.npmjs.com") {
        npmPackageName = inputURL.split('/')[4]
        const response = await fetchGithubUrlFromNpm(npmPackageName);
        repoURL = response.data || "";
    } else {
        // url is github
        repoURL = inputURL
    }

    const res = extractGithubOwnerAndRepo(repoURL)
    if (res !== null) {
        [owner, repo] = res
    } else {
        console.error('Failed to extract owner and repo from repoURL');
        return;
    }

    
    // bus factor
    const commitActivity = await fetchCommits(owner, repo, token);
    await writeFile(commitActivity, "commitActivity.json")
    
    let busFactor: number | null = null;
    if (commitActivity !== null && commitActivity.data !== null) {
        busFactor = calcBusFactor(commitActivity.data);

        console.log("bus factor", busFactor)
    }

    // correctness
    const totalOpenIssues = await fetchRecentIssuesByState(owner, repo, "open", token);
    const totalClosedIssues = await fetchRecentIssuesByState(owner, repo, "closed", token);
    await writeFile(totalOpenIssues, "totalOpenIssues.json")
    await writeFile(totalClosedIssues, "totalClosedIssues.json")

    let correctness: number | null = null;
    if (totalOpenIssues !== null && totalClosedIssues !== null && totalOpenIssues.data && totalClosedIssues.data) {
        correctness = calcCorrectness(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count)

        console.log("correctness", correctness)
    }

    // responsive maintainer
    const recentPullRequests = await fetchRecentPullRequests(owner, repo, token)
    await writeFile(recentPullRequests, "recentPullRequests.json")

    let responsiveness: number | null = null
    if (totalOpenIssues !== null && totalClosedIssues !== null && recentPullRequests !== null && totalClosedIssues.data && recentPullRequests.data) {
        const responsiveness = calcResponsiveness(totalClosedIssues.data.items, recentPullRequests.data.items);

        console.log("responsiveness", responsiveness);
    }

    // // licenses
    // const licenses = await fetchLicense(owner, repo, token);
    // await writeFile(licenses, "licenses.json")
}

main()
