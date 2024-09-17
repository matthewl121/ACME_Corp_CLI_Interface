import { apiGetRequest, ApiResponse } from './apiUtils'
import { ContributorResponse, IssueSearchResponse, LicenseResponse } from '../types';

const GITHUB_BASE_URL: string = "https://api.github.com"

/*  Fetches contributor commit activity for the given repository.
    Metrics Used: Bus Factor 

    Example 200 response:
    data: {
        total: number; // total number of commits by author
        weeks: []; // not needed
        author: {
            login: string; // author's github username
        },
    }
*/
export const fetchContributorActivity = async (
    owner: string, 
    repo: string, 
    token: string
): Promise<ApiResponse<ContributorResponse[] | null>> => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
    const response = await apiGetRequest<ContributorResponse[]>(url, token);

    if (response.error) {
        console.error('Error fetching contributor commit activity', response.error);
        return { data: null, error: response.error };
    }

    return { data: response.data, error: null };
}

/*  Fetches 100 most recent issues for the given repository filtered by state (open/closed).
    Metrics Used: Correctness, Responsive Maintainer

    Example 200 response:
    data: {
        total_count: number; // total issues matching the query state
        items: [
            {
                created_at: string; // issue creation date
                updated_at: string; // last update date
                closed_at: string | null; // issue closing date (null if open)
            },
        ],
    }
*/
export const fetchRecentIssuesByState = async (
    owner: string, 
    repo: string, 
    state: string, 
    token: string
): Promise<ApiResponse<IssueSearchResponse | null>> => {
    const q = `repo:${owner}/${repo}+type:issue+state:${state}&per_page=100`;
    const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
    const response = await apiGetRequest<IssueSearchResponse>(url, token);

    if (response.error) {
        console.error('Error fetching issues:', response.error);
        return { data: null, error: response.error };
    }

    return { data: response.data, error: null };
}

/*  Fetches 100 most recent pull requests for the given repository, sorted by the most recently updated.
    Metrics Used: Responsive Maintainer

    Example 200 response:
    data: {
        total_count: number; // total number of pull requests
        items: [
            {
                created_at: string; // pull request creation date
                updated_at: string; // last update date
                closed_at: string | null; // pull request closing date (null if open)
            },
        ],
    }
*/
export const fetchRecentPullRequests = async (
    owner: string, 
    repo: string, 
    token: string
): Promise<ApiResponse<IssueSearchResponse | null>> => {
    const q = `repo:${owner}/${repo}+type:pr&sort=updated&order=desc&per_page=100`
    const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
    const response = await apiGetRequest<IssueSearchResponse>(url, token);

    if (response.error || !response.data) {
        console.error('Error fetching recent pull requests:', response.error);
        return { data: null, error: response.error };
    }

    return { data: response.data, error: null };
};

/*  Fetches the license information for the given repository.
    Metrics Used: License

    Example 200 response:
    data: {
        license: {
            key: string; // license identifier (e.g., 'mit')
            name: string; // full license name (e.g., 'MIT License')
            spdx_id: string; // SPDX identifier (e.g., 'MIT')
            url: string; // URL to the license text
        },
    }
*/
export const fetchLicense = async (
    owner: string, 
    repo: string, 
    token: string
): Promise<ApiResponse<LicenseResponse | null> | "NO_LICENSE"> => {
    const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/license`;
    const response = await apiGetRequest<LicenseResponse>(url, token);

    if (response.error) {
        if (response.error === "Not Found") {
            return "NO_LICENSE"
        }
        console.error('Error fetching licenses:', response.error);
        return { data: null, error: response.error };
    }

    return { data: response.data, error: null };
}
// export const fetchReleases = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/releases/latest`;
//     const response = await apiGetRequest(url, token);
    
//     if (response.error) {
//         console.error('Error fetching releases:', response.error);
//         return;
//     }

//     return response.data;
// }

// export const fetchContributors = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/contributors`;
//     const response = await apiGetRequest(url, token);

//     if (response.error) {
//         console.error('Error fetching contributors:', response.error);
//         return;
//     }

//     return response.data;
// };

// export const fetchRepoMetadata = async (owner: string, repo: string, token: string) => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}`;
//     const response = await apiGetRequest(url, token);

//     if (response.error) {
//         console.error('Error fetching repo metadata:', response.error);
//     }

//     return response.data;
// };

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