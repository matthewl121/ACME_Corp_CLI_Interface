export const extractDomainFromUrl = (url: string): string | null => {
    // unsure if we would receive a url without this
    if(url == null) {
        console.error('URL is null');
        return null;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

export const extractNpmPackageName = (npmUrl: string): string | null => {
    if (!npmUrl) {
        console.error('npmUrl is undefined or empty');
        return null;
    }

    const parts = npmUrl.split('/');
    const packageName = parts.pop();

    if (!packageName) {
        console.error('Unable to extract package name from URL');
        return null;
    }

    return packageName;
};

export const extractGithubOwnerAndRepo = (repoURL: string): [string, string] | null => {
    const parts = repoURL.split('/').slice(3);

    if (parts.length < 2) {
        console.error('repoURL does not contain enough parts');
        return null;
    }

    const [owner, repo] = parts;

    return [owner, repo];
};