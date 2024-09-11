"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var GithubApi_1 = require("./api/GithubApi");
var metricCalcs_1 = require("./metricCalcs");
var utils_1 = require("./utils/utils");
var npmApi_1 = require("./api/npmApi");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var token, inputURL, domain, npmPackageName, repoURL, owner, repo, response, res, commitActivity, busFactor, totalOpenIssues, totalClosedIssues, correctness, recentPullRequests, responsiveness, responsiveness_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = process.env.GITHUB_TOKEN || "";
                inputURL = "https://www.npmjs.com/package/ts-node";
                domain = inputURL.split('/')[2];
                npmPackageName = "";
                repoURL = "";
                owner = "";
                repo = "";
                if (!(domain === "www.npmjs.com")) return [3 /*break*/, 2];
                npmPackageName = inputURL.split('/')[4];
                return [4 /*yield*/, (0, npmApi_1.fetchGithubUrlFromNpm)(npmPackageName)];
            case 1:
                response = _a.sent();
                repoURL = response.data || "";
                return [3 /*break*/, 3];
            case 2:
                // url is github
                repoURL = inputURL;
                _a.label = 3;
            case 3:
                res = (0, utils_1.extractGithubOwnerAndRepo)(repoURL);
                if (res !== null) {
                    owner = res[0], repo = res[1];
                }
                else {
                    console.error('Failed to extract owner and repo from repoURL');
                    return [2 /*return*/];
                }
                return [2 /*return*/];
            case 4:
                commitActivity = _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(commitActivity, "commitActivity.json")];
            case 5:
                _a.sent();
                busFactor = null;
                if (commitActivity !== null) {
                    busFactor = (0, metricCalcs_1.calcBusFactor)(commitActivity);
                    console.log("bus factor", busFactor);
                }
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentIssuesByState)(owner, repo, "open", token)];
            case 6:
                totalOpenIssues = _a.sent();
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentIssuesByState)(owner, repo, "closed", token)];
            case 7:
                totalClosedIssues = _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(totalOpenIssues, "totalOpenIssues.json")];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(totalClosedIssues, "totalClosedIssues.json")];
            case 9:
                _a.sent();
                correctness = null;
                if (totalOpenIssues !== null && totalClosedIssues !== null) {
                    correctness = (0, metricCalcs_1.calcCorrectness)(totalOpenIssues.total_count, totalClosedIssues.total_count);
                    console.log("correctness", correctness);
                }
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentPullRequests)(owner, repo, token)];
            case 10:
                recentPullRequests = _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(recentPullRequests, "recentPullRequests.json")];
            case 11:
                _a.sent();
                responsiveness = null;
                if (totalOpenIssues !== null && totalClosedIssues !== null && recentPullRequests !== null) {
                    responsiveness_1 = (0, metricCalcs_1.calcResponsiveness)(totalClosedIssues.items, recentPullRequests.items);
                    console.log("responsiveness", responsiveness_1);
                }
                return [2 /*return*/];
        }
    });
}); };
main();
