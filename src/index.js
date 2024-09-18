"use strict";
/*
    This file is an example logical flow from a URL to
    fetching and parsing repo data and calculating some metrics
*/
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
        while (_) try {
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
exports.__esModule = true;
require("dotenv/config");
var GithubApi_1 = require("./api/GithubApi");
var metricCalcs_1 = require("./metricCalcs");
var utils_1 = require("./utils/utils");
var urlHandler_1 = require("./utils/urlHandler");
var npmApi_1 = require("./api/npmApi");
var log_js_1 = require("./utils/log.js");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var token, inputURL, hostname, repoURL, npmPackageName, npmResponse, repoDetails, owner, repo, contributorActivity, busFactor, totalOpenIssues, totalClosedIssues, correctness, recentPullRequests, responsiveness, licenses, license, rampUp, readMe, exampleFolder;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, log_js_1.initLogFile)();
                token = process.env.GITHUB_TOKEN || "";
                inputURL = "https://github.com/mrdoob/three.js/";
                hostname = (0, urlHandler_1.extractDomainFromUrl)(inputURL);
                if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
                    return [2 /*return*/];
                }
                repoURL = "";
                if (!(hostname === "www.npmjs.com")) return [3 /*break*/, 2];
                npmPackageName = (0, urlHandler_1.extractNpmPackageName)(inputURL);
                if (!npmPackageName) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, npmApi_1.fetchGithubUrlFromNpm)(npmPackageName)];
            case 1:
                npmResponse = _a.sent();
                if (!(npmResponse === null || npmResponse === void 0 ? void 0 : npmResponse.data)) {
                    return [2 /*return*/];
                }
                repoURL = npmResponse.data;
                return [3 /*break*/, 3];
            case 2:
                // URL must be github, so use it directly
                repoURL = inputURL;
                _a.label = 3;
            case 3:
                repoDetails = (0, urlHandler_1.extractGithubOwnerAndRepo)(repoURL);
                if (!repoDetails) {
                    return [2 /*return*/];
                }
                owner = repoDetails[0], repo = repoDetails[1];
                return [4 /*yield*/, (0, GithubApi_1.fetchContributorActivity)(owner, repo, token)];
            case 4:
                contributorActivity = _a.sent();
                if (!(contributorActivity === null || contributorActivity === void 0 ? void 0 : contributorActivity.data)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.writeFile)(contributorActivity, "contributorActivity.json")];
            case 5:
                _a.sent();
                busFactor = (0, metricCalcs_1.calcBusFactor)(contributorActivity.data);
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentIssuesByState)(owner, repo, "open", token)];
            case 6:
                totalOpenIssues = _a.sent();
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentIssuesByState)(owner, repo, "closed", token)];
            case 7:
                totalClosedIssues = _a.sent();
                if (!(totalOpenIssues === null || totalOpenIssues === void 0 ? void 0 : totalOpenIssues.data) || !(totalClosedIssues === null || totalClosedIssues === void 0 ? void 0 : totalClosedIssues.data)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.writeFile)(totalOpenIssues, "totalOpenIssues.json")];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(totalClosedIssues, "totalClosedIssues.json")];
            case 9:
                _a.sent();
                correctness = (0, metricCalcs_1.calcCorrectness)(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count);
                return [4 /*yield*/, (0, GithubApi_1.fetchRecentPullRequests)(owner, repo, token)];
            case 10:
                recentPullRequests = _a.sent();
                if (!(recentPullRequests === null || recentPullRequests === void 0 ? void 0 : recentPullRequests.data)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.writeFile)(recentPullRequests, "recentPullRequests.json")];
            case 11:
                _a.sent();
                responsiveness = (0, metricCalcs_1.calcResponsiveness)(totalClosedIssues.data.items, recentPullRequests.data.items);
                return [4 /*yield*/, (0, GithubApi_1.fetchLicense)(owner, repo, token)];
            case 12:
                licenses = _a.sent();
                if (!(licenses === null || licenses === void 0 ? void 0 : licenses.data)) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, utils_1.writeFile)(licenses, "licenses.json")];
            case 13:
                _a.sent();
                license = licenses.data.license.name;
                rampUp = null;
                return [4 /*yield*/, (0, GithubApi_1.fetchReadMe)(owner, repo, token)];
            case 14:
                readMe = _a.sent();
                if (!!(readMe === null || readMe === void 0 ? void 0 : readMe.data)) return [3 /*break*/, 15];
                rampUp = 'High (readme has no information)';
                return [3 /*break*/, 19];
            case 15: return [4 /*yield*/, (0, GithubApi_1.fetchExamplesFolder)(owner, repo, token)];
            case 16:
                exampleFolder = _a.sent();
                return [4 /*yield*/, (0, GithubApi_1.getReadmeDetails)(readMe, exampleFolder)];
            case 17:
                rampUp = _a.sent();
                return [4 /*yield*/, (0, utils_1.writeFile)(exampleFolder, "exampleFolder.json")];
            case 18:
                _a.sent();
                _a.label = 19;
            case 19:
                // Log the metrics
                // const manager = new MetricManager(owner, repo, token, repoURL);
                // const metricsALL = await manager.calculateAndLogMetrics();
                console.log("\n        --- METRICS --- \n        \n        Bus Factor:     ".concat(busFactor, " devs\n        Correctness:    ").concat(correctness, "%\n        Responsiveness: ").concat(responsiveness, " hours\n        License:        ").concat(license, "\n    "));
                return [2 /*return*/];
        }
    });
}); };
main();
