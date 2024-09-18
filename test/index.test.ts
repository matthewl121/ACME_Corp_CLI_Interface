import { MetricManager } from '../src/metricManager';
import { extractDomainFromUrl, extractNpmPackageName, extractGithubOwnerAndRepo } from '../src/utils/urlHandler.js';
import { fetchGithubUrlFromNpm } from '../src/api/npmApi.js';

describe('Test suite', () => {
    test('npm, ts-node, bus factor', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        // Extract hostname (www.npm.js or github.com or null)
        const hostname = extractDomainFromUrl(inputURL);
        if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
            return;
        }

        let repoURL: string = "";

        // If url is npm, fetch the github repo
        if (hostname === "www.npmjs.com") {
            const npmPackageName = extractNpmPackageName(inputURL);
            if (!npmPackageName) {
                return;
            }

            // Fetch the Github repo url from npm package
            const npmResponse = await fetchGithubUrlFromNpm(npmPackageName);
            if (!npmResponse?.data) {
                return;
            }

            repoURL = npmResponse.data;
        } else {
            // URL must be github, so use it directly
            repoURL = inputURL;
        }

        const repoDetails = extractGithubOwnerAndRepo(repoURL);
        if (!repoDetails) {
            return;
        }

        const [owner, repo]: [string, string] = repoDetails;
        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const busFactor = await manager.getBusFactor();
        expect(busFactor).toBe(2);
    });
});