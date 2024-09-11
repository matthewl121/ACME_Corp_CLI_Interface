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
exports.fetchLicense = exports.fetchRecentPullRequests = exports.fetchRecentIssuesByState = exports.fetchContributorActivity = void 0;
var apiUtils_1 = require("./apiUtils");
var GITHUB_BASE_URL = "https://api.github.com";
/*  Fetches contributor commit activity for the given repository.
    Metrics Used: Bus Factor

    Example 200 response:
    data: {
        total: number; // total number of commits by author
        weeks: []; // not needed
        author: {
            login: string; // author's github username
        },
    }
*/
var fetchContributorActivity = function (owner, repo, token) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(GITHUB_BASE_URL, "/repos/").concat(owner, "/").concat(repo, "/stats/contributors");
                return [4 /*yield*/, (0, apiUtils_1.apiGetRequest)(url, token)];
            case 1:
                response = _a.sent();
                if (response.error) {
                    console.error('Error fetching contributor commit activity', response.error);
                    return [2 /*return*/, { data: null, error: response.error }];
                }
                return [2 /*return*/, { data: response.data, error: null }];
        }
    });
}); };
exports.fetchContributorActivity = fetchContributorActivity;
/*  Fetches 100 most recent issues for the given repository filtered by state (open/closed).
    Metrics Used: Correctness, Responsive Maintainer

    Example 200 response:
    data: {
        total_count: number; // total issues matching the query state
        items: [
            {
                created_at: string; // issue creation date
                updated_at: string; // last update date
                closed_at: string | null; // issue closing date (null if open)
            },
        ],
    }
*/
var fetchRecentIssuesByState = function (owner, repo, state, token) { return __awaiter(void 0, void 0, void 0, function () {
    var q, url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = "repo:".concat(owner, "/").concat(repo, "+type:issue+state:").concat(state, "&per_page=100");
                url = "".concat(GITHUB_BASE_URL, "/search/issues?q=").concat(q);
                return [4 /*yield*/, (0, apiUtils_1.apiGetRequest)(url, token)];
            case 1:
                response = _a.sent();
                if (response.error) {
                    console.error('Error fetching issues:', response.error);
                    return [2 /*return*/, { data: null, error: response.error }];
                }
                return [2 /*return*/, { data: response.data, error: null }];
        }
    });
}); };
exports.fetchRecentIssuesByState = fetchRecentIssuesByState;
/*  Fetches 100 most recent pull requests for the given repository, sorted by the most recently updated.
    Metrics Used: Responsive Maintainer

    Example 200 response:
    data: {
        total_count: number; // total number of pull requests
        items: [
            {
                created_at: string; // pull request creation date
                updated_at: string; // last update date
                closed_at: string | null; // pull request closing date (null if open)
            },
        ],
    }
*/
var fetchRecentPullRequests = function (owner, repo, token) { return __awaiter(void 0, void 0, void 0, function () {
    var q, url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                q = "repo:".concat(owner, "/").concat(repo, "+type:pr&sort=updated&order=desc&per_page=100");
                url = "".concat(GITHUB_BASE_URL, "/search/issues?q=").concat(q);
                return [4 /*yield*/, (0, apiUtils_1.apiGetRequest)(url, token)];
            case 1:
                response = _a.sent();
                if (response.error || !response.data) {
                    console.error('Error fetching recent pull requests:', response.error);
                    return [2 /*return*/, { data: null, error: response.error }];
                }
                return [2 /*return*/, { data: response.data, error: null }];
        }
    });
}); };
exports.fetchRecentPullRequests = fetchRecentPullRequests;
/*  Fetches the license information for the given repository.
    Metrics Used: License

    Example 200 response:
    data: {
        license: {
            key: string; // license identifier (e.g., 'mit')
            name: string; // full license name (e.g., 'MIT License')
            spdx_id: string; // SPDX identifier (e.g., 'MIT')
            url: string; // URL to the license text
        },
    }
*/
var fetchLicense = function (owner, repo, token) { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "".concat(GITHUB_BASE_URL, "/repos/").concat(owner, "/").concat(repo, "/license");
                return [4 /*yield*/, (0, apiUtils_1.apiGetRequest)(url, token)];
            case 1:
                response = _a.sent();
                if (response.error) {
                    console.error('Error fetching licenses:', response.error);
                    return [2 /*return*/, { data: null, error: response.error }];
                }
                return [2 /*return*/, { data: response.data, error: null }];
        }
    });
}); };
exports.fetchLicense = fetchLicense;
// export const fetchReleases = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/releases/latest`;
//     const response = await apiGetRequest(url, token);
//     if (response.error) {
//         console.error('Error fetching releases:', response.error);
//         return;
//     }
//     return response.data;
// }
// export const fetchContributors = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/contributors`;
//     const response = await apiGetRequest(url, token);
//     if (response.error) {
//         console.error('Error fetching contributors:', response.error);
//         return;
//     }
//     return response.data;
// };
// export const fetchRepoMetadata = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}`;
//     const response = await apiGetRequest(url, token);
//     if (response.error) {
//         console.error('Error fetching repo metadata:', response.error);
//     }
//     return response.data;
// };
// export const fetchRecentCommits = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/commits`;
//     const response = await apiGetRequest<Commit[]>(url, token);
//     if (response.error) {
//         console.error('Error fetching data:', response.error);
//         return;
//     }
//     return response.data
// };
// export const fetchRecentIssues = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/issues`;
//     const params = {
//         state: 'all',
//     };
//     const response = await apiGetRequest(url, token, params);
//     if (response.error) {
//         console.error('Error fetching issues:', response.error);
//         return;
//     }
//     return response.data;
// };
