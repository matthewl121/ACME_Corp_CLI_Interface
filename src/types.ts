<<<<<<< HEAD
export interface ContributorActivity {
    total: number;
    author: {
        login: string;
    }
=======
export interface Commit {
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
}

export interface Contributor {
    login: string;
    contributions: string;
<<<<<<< HEAD
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
=======
}
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
