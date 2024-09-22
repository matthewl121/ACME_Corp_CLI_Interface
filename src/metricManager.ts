import 'dotenv/config';
import { fetchContributorActivity } from "./api/githubApi.js";
import { calcBusFactorScore, calcCorrectnessScore, calcResponsivenessScore } from './metricCalcs.js';
import { writeFile } from './utils/utils';
import { logToFile } from './utils/log';
import { Metrics } from './types';
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
                logToFile("No metrics found", 2);
                // console.log("No metrics found");
                return;
            }
            // Calculate weighted metrics
            const weightedMetrics = await this.getWeightedMetrics(metrics);
            const netScore = weightedMetrics.BusFactor + weightedMetrics.Correctness + weightedMetrics.ResponsiveMaintainer + weightedMetrics.License;
            metrics.NetScore = netScore;


            logToFile("Metrics Output (JSON):", 1);
            logToFile(JSON.stringify(metrics, null, 2), 1); // Pretty-print with 2-space indentation
        } catch (error) {
            logToFile(`Error calculating metrics: ${error}`, 2);
        }
    }
}
