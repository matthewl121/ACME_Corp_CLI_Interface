import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchContributorActivity, fetchRecentPullRequests } from "./api/GithubApi.js";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs.js';
import { writeFile } from './utils/utils.js';
import { logToFile } from './utils/log.js';

// metrics.ts
export interface Metrics {
    URL: string; // Added URL field to the Metrics class
    NetScore:  number | null;
    BusFactor: number | null;
    Correctness: number | null;
    ResponsiveMaintainer: number | null;
    License: number | null;
}

export class MetricManager {
    private owner: string;
    private repo: string;
    private token: string;
    private url: string;

    constructor(owner: string, repo: string, token: string, url: string) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
        this.url = url;
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
            URL: this.url,
            NetScore: null,
            BusFactor: busFactor,
            Correctness: correctness,
            ResponsiveMaintainer: responsiveness,
            License: license,
        };

        return metrics;
    }

    // Calculates weighted metrics based on provided metrics
    public async getWeightedMetrics(metrics: Metrics): Promise<Metrics> {
        // Handle license as 1 or 0 based on its presence
        const licenseValue = metrics.License != null ? 1 : 0;
        const weightedMetrics: Metrics = {
            URL: this.url,
            NetScore: null,
            BusFactor: (metrics.BusFactor ?? 0) * 0.25,
            Correctness: (metrics.Correctness ?? 0) * 0.30,
            ResponsiveMaintainer: (metrics.ResponsiveMaintainer ?? 0) * 0.15,
            License: (licenseValue) * 0.10, //?? 0) * 0.10, // Assuming license should be numeric for weighting
        };

        return weightedMetrics;
    }

    // Optionally, calculate and log all metrics
    public async calculateAndLogMetrics(): Promise<void> {
        try {
            const metrics = await this.getMetrics();
            if (!metrics) {
                console.log("No metrics found");
                return;
            }
            // Calculate weighted metrics
            const weightedMetrics = await this.getWeightedMetrics(metrics);
            const netScore = weightedMetrics.BusFactor + weightedMetrics.Correctness + weightedMetrics.ResponsiveMaintainer + weightedMetrics.License;
            metrics.NetScore = netScore;

            // console.log("Final Metrics:", metrics);
            // console.log("Weighted Metrics:", weightedMetrics);
            // console.log("Net Score:", netScore);
            // Create JSON output

            // Log the JSON output
            logToFile("Metrics Output (JSON):", 1);
            logToFile(JSON.stringify(metrics, null, 2), 1); // Pretty-print with 2-space indentation
        } catch (error) {
            console.error("Error calculating metrics:", error);
        }
    }
}
