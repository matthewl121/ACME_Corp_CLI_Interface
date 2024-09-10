import axios, { AxiosRequestConfig } from 'axios';
import { apiGetRequest } from './apiUtils'
import { ContributorActivity, IssueSearchResponse } from '../types';

const GITHUB_BASE_URL: string = "https://api.github.com"

export const fetchRecentIssuesByState = async (owner: string, repo: string, state: string, token: string): Promise<IssueSearchResponse | null> => {
    const q = `repo:${owner}/${repo}+type:issue+state:${state}&per_page=100&page=1`
    const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
    const response = await apiGetRequest<IssueSearchResponse>(url, token);

    if (response.error || !response.data) {
        console.error('Error fetching closed issue count:', response.error);
        return null;
    }

    return response.data;
};

export const fetchRecentPullRequests = async (owner: string, repo: string, token: string): Promise<IssueSearchResponse | null> => {
    const q = `repo:${owner}/${repo}+type:pr&sort=updated&order=desc&per_page=100`
    const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
    const response = await apiGetRequest<IssueSearchResponse>(url, token);

    if (response.error || !response.data) {
        console.error('Error fetching recent pull requests:', response.error);
        return null;
    }

    return response.data;
};

export const fetchLicense = async (owner: string, repo: string, token: string) => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/license`;
    const response = await apiGetRequest(url, token);

    if (response.error) {
        console.error('Error fetching licenses:', response.error);
        return;
    }

    return response.data;
}

export const fetchReleases = async (owner: string, repo: string, token: string) => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/releases/latest`;
    const response = await apiGetRequest(url, token);
    
    if (response.error) {
        console.error('Error fetching releases:', response.error);
        return;
    }

    return response.data;
}

export const fetchContributors = async (owner: string, repo: string, token: string) => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/contributors`;
    const response = await apiGetRequest(url, token);

    if (response.error) {
        console.error('Error fetching contributors:', response.error);
        return;
    }

    return response.data;
};

export const fetchRepoMetadata = async (owner: string, repo: string, token: string) => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}`;
    const response = await apiGetRequest(url, token);

    if (response.error) {
        console.error('Error fetching repo metadata:', response.error);
    }

    return response.data;
};

export const fetchCommits = async (owner: string, repo: string, token: string): Promise<ContributorActivity[] | null> => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
    const response = await apiGetRequest<ContributorActivity[]>(url, token);

    if (response.error) {
        console.error('Error fetching contributor commit activity', response.error);
        return null;
    }

    return response.data;
}

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