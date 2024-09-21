import { MetricManager } from '../src/metricManager';
import { extractDomainFromUrl, extractNpmPackageName, extractGithubOwnerAndRepo } from '../src/utils/urlHandler.js';
import { fetchGithubUrlFromNpm } from '../src/api/npmApi.js';
import { getRepoDetails } from '../src/index';

describe('Test suite', () => {
    test('npm, ts-node, bus factor', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;

        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const busFactor = await manager.getBusFactor();
        expect(busFactor).toBe(2);
    });
});