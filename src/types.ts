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