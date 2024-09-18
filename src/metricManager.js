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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.MetricManager = void 0;
require("dotenv/config");
var GithubApi_js_1 = require("./api/GithubApi.js");
var metricCalcs_js_1 = require("./metricCalcs.js");
var utils_js_1 = require("./utils/utils.js");
var MetricManager = /** @class */ (function () {
    function MetricManager(owner, repo, token) {
        this.owner = owner;
        this.repo = repo;
        this.token = token;
    }
    // Fetches and calculates the bus factor
    MetricManager.prototype.getBusFactor = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contributorActivity, busFactor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, GithubApi_js_1.fetchContributorActivity)(this.owner, this.repo, this.token)];
                    case 1:
                        contributorActivity = _a.sent();
                        if (!(contributorActivity === null || contributorActivity === void 0 ? void 0 : contributorActivity.data)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, utils_js_1.writeFile)(contributorActivity, "contributorActivity.json")];
                    case 2:
                        _a.sent();
                        busFactor = (0, metricCalcs_js_1.calcBusFactor)(contributorActivity.data);
                        return [2 /*return*/, busFactor];
                }
            });
        });
    };
    // Fetches and calculates the correctness
    MetricManager.prototype.getCorrectness = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalOpenIssues, totalClosedIssues, correctness;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, GithubApi_js_1.fetchRecentIssuesByState)(this.owner, this.repo, "open", this.token)];
                    case 1:
                        totalOpenIssues = _a.sent();
                        return [4 /*yield*/, (0, GithubApi_js_1.fetchRecentIssuesByState)(this.owner, this.repo, "closed", this.token)];
                    case 2:
                        totalClosedIssues = _a.sent();
                        if (!(totalOpenIssues === null || totalOpenIssues === void 0 ? void 0 : totalOpenIssues.data) || !(totalClosedIssues === null || totalClosedIssues === void 0 ? void 0 : totalClosedIssues.data)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, utils_js_1.writeFile)(totalOpenIssues, "totalOpenIssues.json")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, utils_js_1.writeFile)(totalClosedIssues, "totalClosedIssues.json")];
                    case 4:
                        _a.sent();
                        correctness = (0, metricCalcs_js_1.calcCorrectness)(totalOpenIssues.data.total_count, totalClosedIssues.data.total_count);
                        console.log("correctness", correctness);
                        return [2 /*return*/, correctness];
                }
            });
        });
    };
    // Fetches and calculates the responsiveness
    MetricManager.prototype.getResponsiveness = function () {
        return __awaiter(this, void 0, void 0, function () {
            var recentPullRequests, totalClosedIssues, responsiveness;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, GithubApi_js_1.fetchRecentPullRequests)(this.owner, this.repo, this.token)];
                    case 1:
                        recentPullRequests = _a.sent();
                        return [4 /*yield*/, (0, GithubApi_js_1.fetchRecentIssuesByState)(this.owner, this.repo, "closed", this.token)];
                    case 2:
                        totalClosedIssues = _a.sent();
                        if (!(recentPullRequests === null || recentPullRequests === void 0 ? void 0 : recentPullRequests.data) || !(totalClosedIssues === null || totalClosedIssues === void 0 ? void 0 : totalClosedIssues.data)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, utils_js_1.writeFile)(recentPullRequests, "recentPullRequests.json")];
                    case 3:
                        _a.sent();
                        responsiveness = (0, metricCalcs_js_1.calcResponsiveness)(totalClosedIssues.data.items, recentPullRequests.data.items);
                        console.log("responsiveness", responsiveness);
                        return [2 /*return*/, responsiveness];
                }
            });
        });
    };
    // Fetches and calculates the license
    MetricManager.prototype.getLicense = function () {
        return __awaiter(this, void 0, void 0, function () {
            var licenses, license;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, GithubApi_js_1.fetchLicense)(this.owner, this.repo, this.token)];
                    case 1:
                        licenses = _a.sent();
                        if (!(licenses === null || licenses === void 0 ? void 0 : licenses.data)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, utils_js_1.writeFile)(licenses, "licenses.json")];
                    case 2:
                        _a.sent();
                        license = licenses.data.license.name;
                        console.log("responsiveness", license);
                        return [2 /*return*/, license];
                }
            });
        });
    };
    // Combined method to calculate all metrics
    MetricManager.prototype.calculateAllMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var busFactor, correctness, responsiveness;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBusFactor()];
                    case 1:
                        busFactor = _a.sent();
                        return [4 /*yield*/, this.getCorrectness()];
                    case 2:
                        correctness = _a.sent();
                        return [4 /*yield*/, this.getResponsiveness()];
                    case 3:
                        responsiveness = _a.sent();
                        console.log("Final Metrics:");
                        console.log({ busFactor: busFactor, correctness: correctness, responsiveness: responsiveness });
                        return [2 /*return*/];
                }
            });
        });
    };
    // Calculates all metrics and returns them in a structured format
    MetricManager.prototype.getMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var busFactor, correctness, responsiveness, license, metrics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBusFactor()];
                    case 1:
                        busFactor = _a.sent();
                        return [4 /*yield*/, this.getCorrectness()];
                    case 2:
                        correctness = _a.sent();
                        return [4 /*yield*/, this.getResponsiveness()];
                    case 3:
                        responsiveness = _a.sent();
                        return [4 /*yield*/, this.getLicense()];
                    case 4:
                        license = _a.sent();
                        metrics = {
                            busFactor: busFactor,
                            correctness: correctness,
                            responsiveness: responsiveness,
                            license: license,
                        };
                        return [2 /*return*/, metrics];
                }
            });
        });
    };
    // Optionally, calculate and log all metrics
    MetricManager.prototype.calculateAndLogMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metrics, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getMetrics()];
                    case 1:
                        metrics = _a.sent();
                        console.log("Final Metrics:", metrics);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error calculating metrics:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MetricManager;
}());
exports.MetricManager = MetricManager;
