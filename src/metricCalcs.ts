import { ContributorResponse, Issue, LicenseResponse } from "./types";
import { hasLicenseHeading } from "./utils/utils";

export const calcBusFactorScore = (contributorActivity: ContributorResponse[]): number => {
    if (!contributorActivity) {
        return 0;
    }

    let totalCommits = 0;
    let totalContributors = 0;
    for (const contributor of contributorActivity) {
        totalCommits += contributor.total
        ++totalContributors
    }

    const threshold = Math.ceil(totalCommits * 0.5); // 50% of commits

    let curr = 0;
    let busFactor = 0;

    // contributorActivity default sorting is least to greatest, so iterate R to L 
    for (let i = contributorActivity.length - 1; i >= 0; i--) {
        curr += contributorActivity[i].total;
        busFactor++;

        if (curr >= threshold) {
            break;
        }
    }

    // scale bus factor values using sigmoid function
    const averageBusFactor = 3;
    return busFactor < 9 ? 1 - Math.exp(-(busFactor ** 2) / (2 * averageBusFactor ** 2)) : 1;
}

export const calcCorrectnessScore = (totalOpenIssuesCount: number, totalClosedIssuesCount: number): number => {
    const totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;
    if (totalIssues == 0) {
        return 1;
    }

    return totalClosedIssuesCount / totalIssues;
}

// Potential rework: Responsiveness score currently caps open PRs max close time to be
//                   30 days. Open to other methods of penalization for open PRs
export const calcResponsivenessScore = (closedIssues: Issue[], pullRequests: Issue[]): number => {
    const calcCloseTime = (created_at: string, closed_at: string): number => {
        const startTime = new Date(created_at);
        const endTime = new Date(closed_at);
        
        // close time in hours
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    };

    const MAX_CLOSE_TIME_HOURS = 24 * 30 // cap stagnant open PRs at 30 days response time

    // calc total time for issue closing
    let totalIssueCloseTime = 0;
    for (const issue of closedIssues) {
        totalIssueCloseTime += calcCloseTime(issue.created_at, issue.closed_at);
    }
    
    // calc total time for PR closing
    let totalPRCloseTime = 0;
    for (const pr of pullRequests) {
        // if PR is open, set close time to current time
        const closeTime = pr.closed_at || new Date().toISOString();
        totalPRCloseTime += Math.min(calcCloseTime(pr.created_at, closeTime), MAX_CLOSE_TIME_HOURS);
    }

    // handle div by 0 with empty case
    const avgIssueCloseTime = closedIssues.length > 0 
        ? totalIssueCloseTime / closedIssues.length
        : 0;
    const avgPRCloseTime = pullRequests.length > 0 
        ? totalPRCloseTime / pullRequests.length
        : 0;

    console.log("avgIssueCloseTime:", avgIssueCloseTime, "avgPRCloseTime", avgPRCloseTime)

    return (avgIssueCloseTime + avgPRCloseTime) / 2;
}

export const calcLicenseScore = (license: LicenseResponse, readmeContent: string): number => {
    // if no LICENSE file, check README for license header
    if (license.license?.spdx_id === "NOASSERTION") {
        return hasLicenseHeading(readmeContent) ? 1 : 0;
    }

    return license.hasLicense ? 1 : 0;
};

