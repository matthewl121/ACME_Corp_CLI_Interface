import axios, { AxiosRequestConfig } from 'axios';
<<<<<<< HEAD
import { ContributorActivity, IssueSearchResponse } from './types';
=======
import { Commit } from './types';
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0

interface GithubApiResponse<T> {
    data: T | null;
    error: string | null;
}

<<<<<<< HEAD
const BASE_URL: string = "https://api.github.com"
=======
const BASE_URL = "https://api.github.com"
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0

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

export const fetchRecentIssuesByState = async (owner: string, repo: string, state: string, token: string): Promise<IssueSearchResponse | null> => {
    const q = `repo:${owner}/${repo}+type:issue+state:${state}&per_page=100&page=1`
    const url = `${BASE_URL}/search/issues?q=${q}`;
    const response = await getApi<IssueSearchResponse>(url, token);

    if (response.error || !response.data) {
        console.error('Error fetching closed issue count:', response.error);
        return null;
    }

    return response.data;
};

<<<<<<< HEAD
export const fetchRecentPullRequests = async (owner: string, repo: string, token: string): Promise<IssueSearchResponse | null> => {
    const q = `repo:${owner}/${repo}+type:pr&sort=updated&order=desc&per_page=100`
    const url = `${BASE_URL}/search/issues?q=${q}`;
    const response = await getApi<IssueSearchResponse>(url, token);

    if (response.error || !response.data) {
        console.error('Error fetching recent pull requests:', response.error);
        return null;
    }

    return response.data;
};

=======
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
export const fetchLicense = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/license`;
    const response = await getApi(url, token);

    if (response.error) {
        console.error('Error fetching licenses:', response.error);
<<<<<<< HEAD
        return;
    }

    return response.data;
=======
    }

    return response.data
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
}

export const fetchReleases = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/releases/latest`;
    const response = await getApi(url, token);
    
    if (response.error) {
        console.error('Error fetching releases:', response.error);
<<<<<<< HEAD
        return;
    }

    return response.data;
=======
    }

    return response.data
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
}

export const fetchContributors = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/contributors`;
    const response = await getApi(url, token);

    if (response.error) {
        console.error('Error fetching contributors:', response.error);
<<<<<<< HEAD
        return;
=======
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
    }

    return response.data;
};

export const fetchRepoMetadata = async (owner: string, repo: string, token: string) => {
    const url = `${BASE_URL}/repos/${owner}/${repo}`;
    const response = await getApi(url, token);

    if (response.error) {
        console.error('Error fetching repo metadata:', response.error);
    }

    return response.data;
};
<<<<<<< HEAD

export const fetchCommits = async (owner: string, repo: string, token: string): Promise<ContributorActivity[] | null> => {
    const url = `${BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
    const response = await getApi<ContributorActivity[]>(url, token);

    if (response.error) {
        console.error('Error fetching contributor commit activity', response.error);
        return null;
    }

    return response.data;
}

// export const fetchRecentCommits = async (owner: string, repo: string, token: string) => {
//     const url = `${BASE_URL}/repos/${owner}/${repo}/commits`;
//     const response = await getApi<Commit[]>(url, token);

//     if (response.error) {
//         console.error('Error fetching data:', response.error);
//         return;
//     }

//     return response.data
// };

// export const fetchRecentIssues = async (owner: string, repo: string, token: string) => {
//     const url = `${BASE_URL}/repos/${owner}/${repo}/issues`;
//     const params = {
//         state: 'all',
//     };
//     const response = await getApi(url, token, params);
    
//     if (response.error) {
//         console.error('Error fetching issues:', response.error);
//         return;
//     }

//     return response.data;
// };
=======
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
