import 'dotenv/config';
import { fetchRecentIssuesByState, fetchLicense, fetchContributorActivity, fetchRecentPullRequests } from "./api/GithubApi.js";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs.js';
import { writeFile } from './utils/utils.js';

// metrics.ts
export interface Metrics {
    busFactor: number | null;
    correctness: number | null;
    responsiveness: number | null;
    license: string | null;
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
        
        console.log("correctness", correctness);
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
        console.log("responsiveness", responsiveness);
        return responsiveness;
    }

    // Fetches and calculates the license
    public async getLicense(): Promise<string | null> {
        const licenses = await fetchLicense(this.owner, this.repo, this.token);
        if (!licenses?.data) {
            return null;
        }

        await writeFile(licenses, "licenses.json")
        const license = licenses.data.license.name
        console.log("responsiveness", license); 
        return license;
    }

    // Combined method to calculate all metrics
    public async calculateAllMetrics(): Promise<void> {
        const busFactor = await this.getBusFactor();
        const correctness = await this.getCorrectness();
        const responsiveness = await this.getResponsiveness();

        console.log("Final Metrics:");
        console.log({ busFactor, correctness, responsiveness });
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

    // Optionally, calculate and log all metrics
    public async calculateAndLogMetrics(): Promise<void> {
        try {
            const metrics = await this.getMetrics();
            console.log("Final Metrics:", metrics);
        } catch (error) {
            console.error("Error calculating metrics:", error);
        }
    }
}
