export interface ContributorResponse {
    total: number;
    author: {
        login: string;
    }
}

export interface Issue {
    created_at: string;
    updated_at: string;
    closed_at: string;
}

export interface IssueSearchResponse {
    total_count: number;
    items: Issue[];
}

export interface LicenseResponse {
    license: {
        key: string;
        name: string;
        spdx_id: string;
        url: string;
    } | null,
    hasLicense: boolean;
}

export interface ReadmeResponse {
    content: string
}

export interface NpmApiResponse {
    repository: {
        url: string;
    };
}

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
}

export interface LicenseInfo {
    key: string;
    name: string;
    spdxId: string;
    url: string;
}

export interface Readme {
    text: string;
}

export interface OpenIssueNode {
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

export interface ClosedIssueNode {
    createdAt: string;
    updatedAt: string;
    closedAt: string;
}

export interface OpenIssues {
    totalCount: number;
    nodes: OpenIssueNode[];
}

export interface ClosedIssues {
    totalCount: number;
    nodes: ClosedIssueNode[];
}

export interface PullRequestNode {
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

export interface PullRequests {
    totalCount: number;
    nodes?: PullRequestNode[];
}

export interface RepositoryResponse {
    licenseInfo: LicenseInfo;
    readme: Readme;
    openIssues: OpenIssues;
    closedIssues: ClosedIssues;
    pullRequests: PullRequests;
}

export interface GraphQLResponse {
    data: {
        repository: RepositoryResponse;
    }
}