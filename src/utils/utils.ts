import { promises as fs } from 'fs';

export const writeFile = async (data: any, filename: string) => {
    const dataString = JSON.stringify(data, null, 2);
    await fs.writeFile(filename, dataString);
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