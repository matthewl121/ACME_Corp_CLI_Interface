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

    // scale bus factor values using sigmoid function
    const averageBusFactor = 3;

    // if bus factor is 10+, thats more than enough
    if (busFactor > 9) {
        return 1;
    }
    
    return Math.exp(-(busFactor ** 2) / (2 * averageBusFactor ** 2));
}

export const calcCorrectnessScore = (totalOpenIssuesCount: number, totalClosedIssuesCount: number): number => {
    const totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;
    if (totalIssues == 0) {
        return 1;
    }

    return totalClosedIssuesCount / totalIssues;
}

// Need to calc score
export const calcResponsivenessScore = (
    closedIssues: ClosedIssueNode[], 
    openIssues: OpenIssueNode[], 
    pullRequests: PullRequestNode[],
    isLocked: boolean
): number => {
    const calcCloseTime = (created_at: string, closed_at: string): number => {
        const startTime = new Date(created_at);
        const endTime = new Date(closed_at);
        
        // close time in hours
        return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    };
  
    const calcOpenTime = (created_at: string): number => {
        const startTime = new Date(created_at);
        const now = new Date();
        
        // open time in hours (from creation to current time)
        return (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    };

    if (isLocked) {
        // repo is no longer maintained
        console.log('Repo is locked')
        return 0;
    }

    // calc total time for closed issue resolution
    let totalIssueCloseTime = 0;
    for (const issue of closedIssues) {
        totalIssueCloseTime += calcCloseTime(issue.createdAt, issue.closedAt);
    }

    // calc total time for open issue penalization
    let totalOpenIssueTime = 0;
    for (const issue of openIssues) {
        totalOpenIssueTime += calcOpenTime(issue.createdAt);
    }

    // calc total time for PR closing
    let totalPRCloseTime = 0;
    for (const pr of pullRequests) {
        const prCloseTime = pr.closedAt || new Date().toISOString();
        totalPRCloseTime += calcCloseTime(pr.createdAt, prCloseTime);
    }

    // handle div by 0 with empty case
    const avgIssueCloseTime = closedIssues.length > 0 
        ? totalIssueCloseTime / closedIssues.length
        : 0;
    
    const avgOpenIssueTime = openIssues.length > 0 
        ? totalOpenIssueTime / openIssues.length
        : 0;

    const avgPRCloseTime = pullRequests.length > 0 
        ? totalPRCloseTime / pullRequests.length
        : 0;

    // Calculate the final score (you can tweak the weight of open issues)
    return (avgIssueCloseTime + avgPRCloseTime + avgOpenIssueTime) / 3;
  }
  

// export const calcLicenseScore = (license: LicenseInfo, readmeText: string): number => {
//     // if no LICENSE file, check README for license header
//     if (license.spdxId === "NOASSERTION") {
//         return hasLicenseHeading(readmeText) ? 1 : 0;
//     }

//     return 1;
// };

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
  
    if (fs.existsSync(licenseFilePath)) {
      return 1;
    }
  
    if (fs.existsSync(readmeFilePath)) {
      const readmeText = fs.readFileSync(readmeFilePath, 'utf8');
      return hasLicenseHeading(readmeText) ? 1 : 0;
    }
  
    return 0;
  };