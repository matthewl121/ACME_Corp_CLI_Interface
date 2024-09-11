import { apiGetRequest, ApiResponse } from './apiUtils';

const NPM_BASE_URL: string = "https://registry.npmjs.org";

export interface NpmApiResponse {
    repository: {
        url: string;
    };
}

export const fetchGithubUrlFromNpm = async (packageName: string): Promise<ApiResponse<string | null>> => {
    const url = `${NPM_BASE_URL}/${packageName}`;
    const response = await apiGetRequest<NpmApiResponse>(url);

    if (response.error || !response.data || !response.data.repository || !response.data.repository.url) {
        return { data: null, error: 'Repository URL not found' };
    }

    const repoUrl: string = response.data.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
    return { data: repoUrl, error: null };
};
