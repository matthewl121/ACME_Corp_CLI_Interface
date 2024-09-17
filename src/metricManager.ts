import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchContributorActivity, fetchRecentPullRequests } from "./api/GithubApi.js";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs.js';
import { writeFile } from './utils/utils.js';
import { logToFile } from './utils/log.js';

// metrics.ts
export interface Metrics {
    busFactor: number | null;
    correctness: number | null;
    responsiveness: number | null;
    license: number | null;
}

export class MetricManager {
    private owner: string;
    private repo: string;
    private token: string;

    constructor(owner: string, repo: string, token: string) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }

    // Fetches and calculates the bus factor
    public async getBusFactor(): Promise<number | null> {
        const contributorActivity = await fetchContributorActivity(this.owner, this.repo, this.token);
        if (!contributorActivity?.data) {
            return null;
        }
        await writeFile(contributorActivity, "contributorActivity.json");
        const busFactor = calcBusFactor(contributorActivity.data);
        return busFactor;
    }

    // Fetches and calculates the correctness
    public async getCorrectness(): Promise<number | null> {
        const totalOpenIssues = await fetchRecentIssuesByState(this.owner, this.repo, "open", this.token);
        const totalClosedIssues = await fetchRecentIssuesByState(this.owner, this.repo, "closed", this.token);

        if (!totalOpenIssues?.data || !totalClosedIssues?.data) {
            return null;
        }

        await writeFile(totalOpenIssues, "totalOpenIssues.json");
        await writeFile(totalClosedIssues, "totalClosedIssues.json");
        const correctness = calcCorrectness(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count);
        return correctness;
    }

    // Fetches and calculates the responsiveness
    public async getResponsiveness(): Promise<number | null> {
        const recentPullRequests = await fetchRecentPullRequests(this.owner, this.repo, this.token)
        const totalClosedIssues = await fetchRecentIssuesByState(this.owner, this.repo, "closed", this.token);
        if (!recentPullRequests?.data || !totalClosedIssues?.data) {
            return null;
        }

        await writeFile(recentPullRequests, "recentPullRequests.json")
        const responsiveness = calcResponsiveness(totalClosedIssues.data.items, recentPullRequests.data.items);
        return responsiveness;
    }

    // Fetches and calculates the license
    public async getLicense(): Promise<number | null> {
        const licenses = await fetchLicense(this.owner, this.repo, this.token);
        if (!licenses?.data) {
            return null;
        }

        await writeFile(licenses, "licenses.json")
        const license = licenses.data.license.name
        // Handle license as 1 or 0 based on its presence
        const licenseValue = license != null ? 1 : 0;
        return licenseValue;
    }

    // Calculates all metrics and returns them in a structured format
    public async getMetrics(): Promise<Metrics> {
        const busFactor = await this.getBusFactor();
        const correctness = await this.getCorrectness();
        const responsiveness = await this.getResponsiveness();
        const license = await this.getLicense();
        const metrics: Metrics = {
            busFactor,
            correctness,
            responsiveness,
            license,
        };

        return metrics;
    }

    // Calculates weighted metrics based on provided metrics
    public async getWeightedMetrics(metrics: Metrics): Promise<Metrics> {
        // Handle license as 1 or 0 based on its presence
        const licenseValue = metrics.license != null ? 1 : 0;
        const weightedMetrics: Metrics = {
            busFactor: (metrics.busFactor ?? 0) * 0.25,
            correctness: (metrics.correctness ?? 0) * 0.30,
            responsiveness: (metrics.responsiveness ?? 0) * 0.15,
            license: (licenseValue) * 0.10, //?? 0) * 0.10, // Assuming license should be numeric for weighting
        };

        return weightedMetrics;
    }

    // Optionally, calculate and log all metrics
    public async calculateAndLogMetrics(): Promise<void> {
        try {
            const metrics = await this.getMetrics();
            if (!metrics) {
                logToFile("No metrics found", 2);
                // console.log("No metrics found");
                return;
            }
            // Calculate weighted metrics
            const weightedMetrics = await this.getWeightedMetrics(metrics);
            const finalScore = weightedMetrics.busFactor + weightedMetrics.correctness + weightedMetrics.responsiveness + weightedMetrics.license;

            logToFile("Final Metrics:", 1); 
            logToFile(metrics, 1); // pass object directly
            logToFile("Weighted Metrics:", 1);
            logToFile(weightedMetrics, 1); // pass object directly
            logToFile(`Final Score: ${finalScore}`, 1);
        } catch (error) {
            logToFile(`Error calculating metrics: ${error}`, 2);
        }
    }
}
