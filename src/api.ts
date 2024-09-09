import axios, { AxiosRequestConfig } from 'axios';

interface GithubApiResponse<T> {
    data: T | null;
    error: string | null;
}

interface Commit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}

const BASE_URL = "https://api.github.com"

export const getApi = async <T>(url: string, token?: string, params?: Record<string, any>): Promise<GithubApiResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            params,
        };

        const response = await axios.get<T>(url, config);
        return { data: response.data, error: null };
    } catch (error: any) {
        console.error('Error details:', error.response?.data || error.message || error);
        return { data: null, error: error.response?.data?.message || error.message || 'Something went wrong' };
    }
};

export const fetchCommits = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/commits`;
    const response = await getApi<Commit[]>(url, token);

    if (response.error) {
        console.error('Error fetching data:', response.error);
    }

    return response.data
};

export const fetchIssues = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/issues`;
    const params = {
        state: 'all',
    };
    const response = await getApi(url, token, params);
    
    if (response.error) {
        console.error('Error fetching issues:', response.error);
    }

    return response.data;
};
