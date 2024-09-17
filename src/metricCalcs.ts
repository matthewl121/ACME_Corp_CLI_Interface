import { ContributorResponse, Issue, IssueSearchResponse, LicenseResponse } from "./types";
import { hasLicenseHeading } from "./utils/utils";

export const calcBusFactor = (contributorActivity: ContributorResponse[]): number => {
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

    // max is half the total contributors
    const maxBusFactor = Math.max(1, Math.floor((totalContributors + 1) / 2));
    const averageBusFactor = 4

    let busFactorScore = Math.min(1, busFactor / averageBusFactor)
    // account for smaller repos w/ less contirbutors
    if (maxBusFactor < averageBusFactor) {
        busFactorScore = Math.min(1, busFactorScore);
    }

    return busFactorScore;
}

export const calcCorrectness = (totalOpenIssuesCount: number, totalClosedIssuesCount: number): number => {
    const totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;
    if (totalIssues == 0) {
        return 100;
    }

    return (totalClosedIssuesCount / totalIssues) * 100;
}

// Potential rework: Responsiveness score currently caps open PRs max close time to be
//                   30 days. Open to other methods of penalization for open PRs
export const calcResponsiveness = (closedIssues: Issue[], pullRequests: Issue[]): number => {
    const calcCloseTime = (created_at: string, closed_at: string): number => {
        const startTime = new Date(created_at);
        const endTime = new Date(closed_at);
    
        // calc the difference in hours
        const diffMs = endTime.getTime() - startTime.getTime();
        // Convert milliseconds to hours
        return diffMs / (1000 * 60 * 60);
    };

    const MAX_CLOSE_TIME_HOURS = 24 * 30 // cap stagnant open PRs at 30 days response time

    let totalIssueCloseTime = 0;
    for (const issue of closedIssues) {
        totalIssueCloseTime += calcCloseTime(issue.created_at, issue.closed_at);
    }
    
    // calc avg time for PR closing
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

    return (avgIssueCloseTime + avgPRCloseTime) / 2;
}

export const calcLicenseScore = (license: LicenseResponse, readmeContent: string): number => {
    if (license.license?.spdx_id === "NOASSERTION") {
        return hasLicenseHeading(readmeContent) ? 1 : 0;
    }

    return license.hasLicense ? 1 : 0;
};

