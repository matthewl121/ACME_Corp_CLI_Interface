import axios, { AxiosRequestConfig } from 'axios';

interface GithubApiResponse<T> {
    data: T | null;
    error: string | null;
}

export interface GithubSecret {
    name: string;
    created_at: string;
    updated_at: string;
}

export interface GithubSecretsResponse {
    total_count: number;
    secrets: GithubSecret[];
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

export const getApi = async <T>(url: string, token?: string): Promise<GithubApiResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
        };

        const response = await axios.get<T>(url, config);
        return { data: response.data, error: null };
    } catch (error: any) {
        return { data: null, error: error.message || 'Something went wrong' };
    }
};

export const fetchCommits = async (url: string, token: string) => {
    const response = await getApi<Commit[]>(url, token);

    if (response.error) {
        console.error('Error fetching data:', response.error);
    } else {
        console.log('Commit history:', response.data);
    }
};

export const listRepoSecrets = async (
    owner: string,
    repo: string,
    token: string
): Promise<GithubSecretsResponse | null> => {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/secrets`;

    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        };

        const response = await axios.get<GithubSecretsResponse>(url, config);
        return response.data;
    } catch (error: any) {
        console.error('Failed to fetch secrets:', error.message);
        return null;
    }
};
