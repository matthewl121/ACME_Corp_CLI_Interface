"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractGithubOwnerAndRepo = exports.extractNpmPackageName = exports.extractDomainFromUrl = void 0;
var extractDomainFromUrl = function (url) {
    // unsure if we would receive a url without this
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    try {
        var parsedUrl = new URL(url);
        return parsedUrl.hostname;
    }
    catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
};
exports.extractDomainFromUrl = extractDomainFromUrl;
var extractNpmPackageName = function (npmUrl) {
    if (!npmUrl) {
        console.error('npmUrl is undefined or empty');
        return null;
    }
    var parts = npmUrl.split('/');
    var packageName = parts.pop();
    if (!packageName) {
        console.error('Unable to extract package name from URL');
        return null;
    }
    return packageName;
};
exports.extractNpmPackageName = extractNpmPackageName;
var extractGithubOwnerAndRepo = function (repoURL) {
    var parts = repoURL.split('/').slice(3);
    if (parts.length < 2) {
        console.error('repoURL does not contain enough parts');
        return null;
    }
    var owner = parts[0], repo = parts[1];
    return [owner, repo];
};
exports.extractGithubOwnerAndRepo = extractGithubOwnerAndRepo;
