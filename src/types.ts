export interface ContributorActivity {
    total: number;
    author: {
        login: string;
    }
}

export interface Contributor {
    login: string;
    contributions: string;
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
