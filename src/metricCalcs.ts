import { ContributorResponse, Issue, IssueSearchResponse } from "./types";

export const calcBusFactor = (contributorActivity: ContributorResponse[]) => {
    const totalCommits = contributorActivity.reduce((sum, contributor) => sum + contributor.total, 0)
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

    return busFactor;
}

export const calcCorrectness = (totalOpenIssuesCount: number, totalClosedIssuesCount: number): number => {
    const totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;

    return (totalClosedIssuesCount / totalIssues);
}

// Potential rework: Responsiveness score currently caps open PRs max close time to be
//                   30 days. Open to other methods of penalization for open PRs
export const calcResponsiveness = (closedIssues: Issue[], pullRequests: Issue[]): number => {
    const calcCloseTime = (created_at: string, closed_at: string): number => {
        const startTime = new Date(created_at);
        const endTime = new Date(closed_at);

        // Calculate the difference in hours
        const diffMs = endTime.getTime() - startTime.getTime();
        // Convert milliseconds to hours
        return diffMs / (1000 * 60 * 60);
    };

    const MAX_CLOSE_TIME_HOURS = 24 * 30; // Cap stagnant open PRs at 30 days response time
    let totalIssueCloseTime = 0;

    for (const issue of closedIssues) {
        totalIssueCloseTime += calcCloseTime(issue.created_at, issue.closed_at);
    }

    // Calculate average time for PR closing
    let totalPRCloseTime = 0;
    for (const pr of pullRequests) {
        // If PR is open, set close time to current time
        const closeTime = pr.closed_at || new Date().toISOString();
        totalPRCloseTime += Math.min(calcCloseTime(pr.created_at, closeTime), MAX_CLOSE_TIME_HOURS);
    }

    // Handle division by 0 with empty case
    const avgIssueCloseTime = closedIssues.length > 0 
        ? totalIssueCloseTime / closedIssues.length
        : MAX_CLOSE_TIME_HOURS; // Treat no issues as max close time
    const avgPRCloseTime = pullRequests.length > 0 
        ? totalPRCloseTime / pullRequests.length
        : MAX_CLOSE_TIME_HOURS; // Treat no PRs as max close time

    // Calculate the overall average close time
    const avgCloseTime = (avgIssueCloseTime + avgPRCloseTime) / 2;

    // Normalize the result to a [0,1] scale where 0 is the worst and 1 is the best
    // A lower average close time is better responsiveness
    const normalizedResponsiveness = Math.max(0, 1 - (avgCloseTime / MAX_CLOSE_TIME_HOURS));

    return normalizedResponsiveness;
};
