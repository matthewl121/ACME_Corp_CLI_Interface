import 'dotenv/config';
import { promises as fs } from 'fs';  // Import fs promises
import { fetchContributorActivity, fetchRepoData } from "./api/GithubApi";
import { calcBusFactorScore, calcCorrectnessScore, calcLicenseScore, calcResponsivenessScore } from './metricCalcs';
import { writeFile } from './utils/utils';
import { extractNpmPackageName, extractGithubOwnerAndRepo, extractDomainFromUrl } from './utils/urlHandler'
import { fetchGithubUrlFromNpm } from './api/npmApi';

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
        const repoData = await fetchRepoData(owner, repo, token);
        if (!repoData.data?.data.repository) {
            console.log("Error fetching repo data for", inputURL);
            return;
        }

        console.log(repoData)

        const totalClosedIssues = repoData.data.data.repository.closedIssues;
        const recentPullRequests = repoData.data.data.repository.pullRequests;

        if (!recentPullRequests?.nodes) {
            console.log("No pull requests found for", inputURL);
            return;
        }

        const responsiveness = calcResponsivenessScore(totalClosedIssues.nodes, recentPullRequests.nodes);

        // Append the result to the output file
        await fs.appendFile('./src/data/out.txt', `${inputURL}, ${responsiveness}, ${totalClosedIssues.totalCount}, ${recentPullRequests.totalCount}\n`, 'utf-8');
        console.log(`Processed ${inputURL}, responsiveness: ${responsiveness}`);
    } catch (error) {
        console.error("Error processing URL:", inputURL, error);
    }
};

const processUrls = async () => {
    try {
        // Read URLs from the file
        await fs.writeFile('./src/data/out.txt', "");
        const data = await fs.readFile('./src/data/urls.txt', 'utf-8');
        
        // Split by new lines and filter out empty lines, trimming each URL to remove any trailing \r or \n
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
