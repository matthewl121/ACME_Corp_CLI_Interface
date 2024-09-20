import 'dotenv/config';
import { promises as fs } from 'fs';  // Import fs promises
import { fetchContributorActivity, fetchRepoData } from "./api/GithubApi";
import { calcBusFactorScore, calcCorrectnessScore, calcLicenseScore, calcResponsivenessScore } from './metricCalcs';
import { writeFile } from './utils/utils';
import { extractNpmPackageName, extractGithubOwnerAndRepo, extractDomainFromUrl } from './utils/urlHandler'
import { fetchGithubUrlFromNpm } from './api/npmApi';
import * as path from 'path';

const main = async (url: string) => {
    const token: string = process.env.GITHUB_TOKEN || "";
    const inputURL: string = url;

    console.log(url)

    const repoDetails = extractGithubOwnerAndRepo(inputURL);
    if (!repoDetails) {
        console.log("Invalid URL:", inputURL);
        return;
    }

    const [owner, repo]: [string, string] = repoDetails;
    console.log(owner, repo)

    try {
        try {
            // Create a unique directory for the cloned repo (e.g., ./repos/owner_repo)
            const localDir = path.join("./repos", `${owner}_${repo}`);
            
            // Call the function and pass the unique directory
            const res = await calcLicenseScore(url, localDir);
        
            console.log("License score:", res);
            return
        } catch (error) {
            console.error("Error processing the repository:", error);
            return
        }
        
        const repoData = await fetchRepoData(owner, repo, token);
        if (!repoData.data?.data) {
            console.log("Error fetching repo data for", inputURL);
            return;
        }

        await writeFile(repoData, "repoData.json")

        const totalClosedIssues = repoData.data.data.repository.closedIssues;
        const totalOpenIssues = repoData.data.data.repository.openIssues;
        const recentPullRequests = repoData.data.data.repository.pullRequests;
        const isLocked = repoData.data?.data.repository.isLocked

        if (!recentPullRequests?.nodes) {
            console.log("No pull requests found for", inputURL);
            return;
        }

        const responsiveness = calcResponsivenessScore(totalClosedIssues.nodes, totalOpenIssues.nodes, recentPullRequests.nodes, isLocked);

        await fs.appendFile('./src/data/out.txt', `${inputURL}, ${responsiveness}, ${totalClosedIssues.totalCount}, ${recentPullRequests.totalCount}\n`, 'utf-8');
        await fs.appendFile('./src/data/resp.txt', `${responsiveness}\n`);
        console.log(`Processed ${inputURL}, responsiveness: ${responsiveness}`);
    } catch (error) {
        console.error("Error processing URL:", inputURL, error);
    }
};

const processUrls = async () => {
    try {
        await fs.writeFile('./src/data/out.txt', "URL, Score, Closed Issue Count, PR Count\n");
        await fs.writeFile('./src/data/resp.txt', "Score\n");
        const data = await fs.readFile('./src/data/url.txt', 'utf-8');
        
        const urls = data.split('\n').map(url => url.trim()).filter(url => url.length > 0);

        for (const url of urls) {
            await main(url);
        }
    } catch (error) {
        console.error("Error reading or processing URLs:", error);
    }
};

// Start processing URLs
processUrls();