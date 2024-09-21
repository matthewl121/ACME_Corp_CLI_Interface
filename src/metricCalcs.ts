import { clone } from 'isomorphic-git';
import * as fs from 'fs';
import http from 'isomorphic-git/http/node';
import { ContributorResponse, ClosedIssueNode, PullRequestNode, OpenIssueNode } from "./types";
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

    const averageBusFactor = 3;
    // if bus factor is 10+, thats more than enough
    if (busFactor > 9) {
        return 1;
    }

    // scale bus factor values using sigmoid function
    return 1 - Math.exp(-(busFactor ** 2) / (2 * averageBusFactor ** 2));
}

export const calcCorrectnessScore = (totalOpenIssuesCount: number, totalClosedIssuesCount: number): number => {
    const totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;
    if (totalIssues == 0) {
        return 1;
    }

    return totalClosedIssuesCount / totalIssues;
}

export const calcResponsivenessScore = (
    closedIssues: ClosedIssueNode[], 
    openIssues: OpenIssueNode[], 
    pullRequests: PullRequestNode[],
    sinceDate: Date,
    isArchived: boolean
): number => {
    if (isArchived) {
        // repo is no longer maintained
        return 0;
    }

    let openIssueCount = 0;
    let closedIssueCount = 0;
    let openPRCount = 0;
    let closedPRCount = 0;

    for (let i = 0; i < Math.max(pullRequests.length, openIssues.length, closedIssues.length); ++i) {
        if (i < pullRequests.length && new Date(pullRequests[i].createdAt) >= sinceDate && !pullRequests[i].closedAt) {
            openPRCount++;
        }
        if (i < pullRequests.length && new Date(pullRequests[i].createdAt) >= sinceDate && pullRequests[i].closedAt) {
            closedPRCount++;
        }
        if (i < openIssues.length && new Date(openIssues[i].createdAt) >= sinceDate) {
            openIssueCount++;
        }
        if (i < closedIssues.length && new Date(closedIssues[i].createdAt) >= sinceDate) {
            closedIssueCount++;
        }
    }

    const totalRecentIssues = openIssueCount + closedIssueCount;
    const totalRecentPRs = openPRCount + closedPRCount;

    const issueCloseRatio = totalRecentIssues > 0 
        ? closedIssueCount / totalRecentIssues 
        : 0;
    const prCloseRatio = totalRecentPRs > 0 
        ? closedPRCount / totalRecentPRs 
        : 0;
    
    return 0.5 * issueCloseRatio + 0.5 * prCloseRatio
};

export const calcLicenseScore = async (repoUrl: string, localDir: string): Promise<number> => {
    await clone({
        fs,
        http,
        dir: localDir,
        url: repoUrl,
        singleBranch: true,
        depth: 1,
    });
  
    const licenseFilePath = `${localDir}/LICENSE`;
    const readmeFilePath = `${localDir}/README.md`;
    const packageJsonPath = `${localDir}/package.json`;

    if (fs.existsSync(licenseFilePath)) {
        return 1;
    }
  
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.license) {
            return 1;
        }
    }

    if (fs.existsSync(readmeFilePath)) {
        const readmeText = fs.readFileSync(readmeFilePath, 'utf8');
        return hasLicenseHeading(readmeText) ? 1 : 0;
    }
  
    return 0;
};