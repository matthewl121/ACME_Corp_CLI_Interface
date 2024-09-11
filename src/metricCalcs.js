"use strict";
exports.__esModule = true;
exports.calcResponsiveness = exports.calcCorrectness = exports.calcBusFactor = void 0;
var calcBusFactor = function (contributorActivity) {
    var totalCommits = contributorActivity.reduce(function (sum, contributor) { return sum + contributor.total; }, 0);
    var threshold = Math.ceil(totalCommits * 0.5); // 50% of commits
    var curr = 0;
    var busFactor = 0;
    // contributorActivity default sorting is least to greatest, so iterate R to L 
    for (var i = contributorActivity.length - 1; i >= 0; i--) {
        curr += contributorActivity[i].total;
        busFactor++;
        if (curr >= threshold) {
            break;
        }
    }
    return busFactor;
};
exports.calcBusFactor = calcBusFactor;
var calcCorrectness = function (totalOpenIssuesCount, totalClosedIssuesCount) {
    var totalIssues = totalOpenIssuesCount + totalClosedIssuesCount;
    return (totalClosedIssuesCount / totalIssues) * 100;
};
exports.calcCorrectness = calcCorrectness;
// Potential rework: Responsiveness score currently caps open PRs max close time to be
//                   30 days. Open to other methods of penalization for open PRs
var calcResponsiveness = function (closedIssues, pullRequests) {
    var calcCloseTime = function (created_at, closed_at) {
        var startTime = new Date(created_at);
        var endTime = new Date(closed_at);
        // calc the difference in hours
        var diffMs = endTime.getTime() - startTime.getTime();
        // Convert milliseconds to hours
        return diffMs / (1000 * 60 * 60);
    };
    var MAX_CLOSE_TIME_HOURS = 24 * 30; // cap stagnant open PRs at 30 days response time
    var totalIssueCloseTime = 0;
    for (var _i = 0, closedIssues_1 = closedIssues; _i < closedIssues_1.length; _i++) {
        var issue = closedIssues_1[_i];
        totalIssueCloseTime += calcCloseTime(issue.created_at, issue.closed_at);
    }
    // calc avg time for PR closing
    var totalPRCloseTime = 0;
    for (var _a = 0, pullRequests_1 = pullRequests; _a < pullRequests_1.length; _a++) {
        var pr = pullRequests_1[_a];
        // if PR is open, set close time to current time
        var closeTime = pr.closed_at || new Date().toISOString();
        totalPRCloseTime += Math.min(calcCloseTime(pr.created_at, closeTime), MAX_CLOSE_TIME_HOURS);
    }
    // handle div by 0 with empty case
    var avgIssueCloseTime = closedIssues.length > 0
        ? totalIssueCloseTime / closedIssues.length
        : 0;
    var avgPRCloseTime = pullRequests.length > 0
        ? totalPRCloseTime / pullRequests.length
        : 0;
    return (avgIssueCloseTime + avgPRCloseTime) / 2;
};
exports.calcResponsiveness = calcResponsiveness;
