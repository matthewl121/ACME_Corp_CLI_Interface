// import { MetricManager } from '../src/metricManager';
import { fetchRepoData } from "../src/api/githubApi";
import { getRepoDetails } from '../src/utils/urlHandler';
import { calculateMetrics } from "../src/metricCalcs";

describe('Test suite', () => {
    test('github/jspec, bus factor', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://github.com/wycats/jspec";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;
        const repoData = await fetchRepoData(owner, repo, token);

        let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);

        expect(parseFloat(metrics?.BusFactor?.toFixed(2) ?? '0')).toBe(0.05);
    });
    test('github/jspec, correctness', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://github.com/wycats/jspec";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;
        const repoData = await fetchRepoData(owner, repo, token);

        let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);

        expect(parseFloat(metrics?.Correctness?.toFixed(2) ?? '0')).toBe(1.00);
    });
    test('github/jspec, ramp up', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://github.com/wycats/jspec";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;
        const repoData = await fetchRepoData(owner, repo, token);

        let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);

        expect(parseFloat(metrics?.RampUp?.toFixed(2) ?? '0')).toBe(0.90);
    });
    test('github/jspec, responsiveness', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://github.com/wycats/jspec";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;
        const repoData = await fetchRepoData(owner, repo, token);

        let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);

        expect(parseFloat(metrics?.ResponsiveMaintainer?.toFixed(2) ?? '0')).toBe(0.00);
    });
    test('github/jspec, license', async () => {
        const token = process.env.GITHUB_TOKEN || "";
        const inputURL = "https://github.com/wycats/jspec";

        const repoDetails = await getRepoDetails(token, inputURL);
        const [owner, repo, repoURL]: [string, string, string] = repoDetails;
        const repoData = await fetchRepoData(owner, repo, token);

        let metrics = await calculateMetrics(owner, repo, token, repoURL, repoData, inputURL);

        expect(parseFloat(metrics?.License?.toFixed(2) ?? '0')).toBe(1.00);
    });
});