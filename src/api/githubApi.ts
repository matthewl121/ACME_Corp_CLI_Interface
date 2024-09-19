import { apiGetRequest, apiPostRequest } from './apiUtils'
import { ApiResponse, GraphQLResponse, ReadmeResponse } from '../types';
import { ContributorResponse, IssueSearchResponse, LicenseResponse } from '../types';
import { getRepoDataQuery } from './graphqlQueries';

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

export const fetchRepoData = async (
    owner: string,
    repo: string,
    token: string
): Promise<ApiResponse<GraphQLResponse | null>> => {
    const url = `${GITHUB_BASE_URL}/graphql`;
    const query = getRepoDataQuery(owner, repo);
    const body = JSON.stringify({ query });

    const response = await apiPostRequest<GraphQLResponse>(url, body, token);
    if (response.error || !response.data) {
        console.error('Error fetching repository data:', response.error);
        return { data: null, error: response.error };
    }

    return { data: response.data, error: null };
};

// /*  Fetches 100 most recent issues for the given repository filtered by state (open/closed).
//     Metrics Used: Correctness, Responsive Maintainer

//     Example 200 response:
//     data: {
//         total_count: number; // total issues matching the query state
//         items: [
//             {
//                 created_at: string; // issue creation date
//                 updated_at: string; // last update date
//                 closed_at: string | null; // issue closing date (null if open)
//             },
//         ],
//     }
// */
// export const fetchRecentIssuesByState = async (
//     owner: string, 
//     repo: string, 
//     state: string, 
//     token: string
// ): Promise<ApiResponse<IssueSearchResponse | null>> => {
//     const q = `repo:${owner}/${repo}+type:issue+state:${state}&per_page=100`;
//     const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
//     const response = await apiGetRequest<IssueSearchResponse>(url, token);

//     if (response.error) {
//         console.error('Error fetching issues:', response.error);
//         return { data: null, error: response.error };
//     }

//     return { data: response.data, error: null };
// }

// /*  Fetches 100 most recent pull requests for the given repository, sorted by the most recently updated.
//     Metrics Used: Responsive Maintainer

//     Example 200 response:
//     data: {
//         total_count: number; // total number of pull requests
//         items: [
//             {
//                 created_at: string; // pull request creation date
//                 updated_at: string; // last update date
//                 closed_at: string | null; // pull request closing date (null if open)
//             },
//         ],
//     }
// */
// export const fetchRecentPullRequests = async (
//     owner: string, 
//     repo: string, 
//     token: string
// ): Promise<ApiResponse<IssueSearchResponse | null>> => {
//     const q = `repo:${owner}/${repo}+type:pr&sort=updated&order=desc&per_page=100`
//     const url = `${GITHUB_BASE_URL}/search/issues?q=${q}`;
//     const response = await apiGetRequest<IssueSearchResponse>(url, token);

//     if (response.error || !response.data) {
//         console.error('Error fetching recent pull requests:', response.error);
//         return { data: null, error: response.error };
//     }

//     return { data: response.data, error: null };
// };

// /*  Fetches the license information for the given repository.
//     Metrics Used: License

//     Example 200 response:
//     data: {
//         license: {
//             key: string; // license identifier (e.g., 'mit')
//             name: string; // full license name (e.g., 'MIT License')
//             spdx_id: string; // SPDX identifier (e.g., 'MIT')
//             url: string; // URL to the license text
//         },
//     }
// */
// export const fetchLicense = async (
//     owner: string, 
//     repo: string, 
//     token: string
// ): Promise<ApiResponse<LicenseResponse>> => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/license`;
//     const response = await apiGetRequest<LicenseResponse>(url, token);

//     await writeFile(response, "licenserep.json");

//     if (response.error) {
//         if (response.error === "Not Found") {
//             return { data: { license: null, hasLicense: false }, error: null };
//         }
//         console.error('Error fetching licenses:', response.error);
//         return { data: null, error: response.error };
//     }

//     const data = response.data ?? { license: null, hasLicense: false };
//     return { data: { ...data, hasLicense: true }, error: null };
// };

// export const fetchReadme = async (
//     owner: string,
//     repo: string,
//     token: string
// ): Promise<ApiResponse<ReadmeResponse | null>> => {
//     const url = `${GITHUB_BASE_URL}/repos/${owner}/${repo}/readme`;
//     const response = await apiGetRequest<ReadmeResponse>(url, token)

//     if (response.error || !response.data?.content) {
//         console.error('Error fetching issues:', response.error);
//         return { data: null, error: response.error };
//     }
    
//     return { data: response.data, error: null};
// };
