export interface Commit {
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
}