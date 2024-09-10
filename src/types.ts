export interface Commit {
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}

export interface Contributor {
    login: string;
    contributions: string;
}