import { MetricManager } from '../src/metricManager';
import { getRepoDetails } from '../src/index';

describe('Test suite', () => {
    test('npm/ts-node, bus factor', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;

        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const busFactor = await manager.getBusFactor();
        expect(busFactor).toBe(2);
    });
    test('npm/ts-node, correctness', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;

        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const correctness = await manager.getCorrectness();
        expect(parseFloat(correctness?.toFixed(2) ?? '0')).toBe(0.86); // round to 2 decimal points
    });
    // test('npm/ts-node, ramp up', async () => {
    //     const token = process.env.GITHUB_TOKEN || "";
    //     const inputURL = "https://www.npmjs.com/package/ts-node";

    //     const repoDetails = await getRepoDetails(token, inputURL);
    //     const [owner, repo, repoURL]: [string, string, string] = repoDetails;

    //     const manager = new MetricManager(owner, repo, token, repoURL);
        
    //     // const busFactor = await manager.getBusFactor();
    //     // expect(busFactor).toBe(2);
    // });
    test('npm/ts-node, responsiveness', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;

        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const responsiveness = await manager.getResponsiveness();
        expect(parseFloat(responsiveness?.toFixed(2) ?? '0')).toBe(0.36); // round to 2 decimal points
    });
    test('npm/ts-node, license', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://www.npmjs.com/package/ts-node";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;

        const manager = new MetricManager(owner, repo, token, repoURL);
        
        const license = await manager.getLicense();
        expect(license).toBe(1);
    });
});