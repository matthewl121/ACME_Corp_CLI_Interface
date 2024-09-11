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
var axios = require("axios");
var GitHubRepoCollaborators = /** @class */ (function () {
    function GitHubRepoCollaborators(repoOwner, repoName, token) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.token = token;
        this.apiUrl = "https://api.github.com/repos/".concat(repoOwner, "/").concat(repoName, "/collaborators");
        this.headers = {
            'Authorization': "token ".concat(this.token),
            'Accept': 'application/vnd.github.v3+json'
        };
    }
    GitHubRepoCollaborators.prototype.fetchCollaborators = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios.get(this.apiUrl, { headers: this.headers })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        if (axios.isAxiosError(error_1)) {
                            if (error_1.response) {
                                if (error_1.response.status === 404) {
                                    console.error('Repository not found.');
                                }
                                else if (error_1.response.status === 403) {
                                    console.error('Forbidden: Check your authentication token.');
                                }
                                else {
                                    console.error("Error: ".concat(error_1.response.status, " - ").concat(error_1.response.statusText));
                                }
                            }
                            else {
                                console.error('An error occurred:', error_1.message);
                            }
                        }
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GitHubRepoCollaborators.prototype.printCollaborators = function () {
        return __awaiter(this, void 0, void 0, function () {
            var collaborators;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fetchCollaborators()];
                    case 1:
                        collaborators = _a.sent();
                        if (collaborators.length > 0) {
                            console.log("Collaborators of ".concat(this.repoOwner, "/").concat(this.repoName, ":"));
                            collaborators.forEach(function (collaborator) {
                                console.log("- ".concat(collaborator.login, " (").concat(collaborator.type, ")"));
                            });
                        }
                        else {
                            console.log('No collaborators found or error in fetching data.');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return GitHubRepoCollaborators;
}());
// Example usage:
var repoOwner = 'octocat';
var repoName = 'Hello-World';
var token = 'your_github_token_here';
var githubCollaborators = new GitHubRepoCollaborators(repoOwner, repoName, token);
githubCollaborators.printCollaborators();
