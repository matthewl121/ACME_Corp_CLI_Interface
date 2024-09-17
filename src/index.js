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
require("dotenv/config");
var urlHandler_js_1 = require("./utils/urlHandler.js");
var npmApi_js_1 = require("./api/npmApi.js");
var metricManager_js_1 = require("./metricManager.js");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var token, inputURL, hostname, repoURL, npmPackageName, npmResponse, repoDetails, owner, repo, metricManager, manager, metricsALL, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = process.env.GITHUB_TOKEN || "";
                inputURL = "https://www.npmjs.com/package/ts-node";
                hostname = (0, urlHandler_js_1.extractDomainFromUrl)(inputURL);
                if (!hostname || (hostname !== "www.npmjs.com" && hostname !== "github.com")) {
                    return [2 /*return*/];
                }
                repoURL = "";
                if (!(hostname === "www.npmjs.com")) return [3 /*break*/, 2];
                npmPackageName = (0, urlHandler_js_1.extractNpmPackageName)(inputURL);
                if (!npmPackageName) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, npmApi_js_1.fetchGithubUrlFromNpm)(npmPackageName)];
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
                repoDetails = (0, urlHandler_js_1.extractGithubOwnerAndRepo)(repoURL);
                if (!repoDetails) {
                    return [2 /*return*/];
                }
                owner = repoDetails[0], repo = repoDetails[1];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                metricManager = new metricManager_js_1.MetricManager(owner, repo, token);
                manager = new metricManager_js_1.MetricManager(owner, repo, token);
                return [4 /*yield*/, manager.calculateAndLogMetrics()];
            case 5:
                metricsALL = _a.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                // Handle any errors that might occur during the API calls or calculations
                console.error("An error occurred in the main function:", error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
main().catch(console.error);
