import axios from "axios";

interface Collaborator {
    login: string;
    created_at: string;
}

class RampUpTimeMetric {
    private githubToken: string;
    private owner: string;
    private repo: string;

    constructor(githubToken: string, owner: string, repo: string) {
        this.githubToken = githubToken;
        this.owner = owner;
        this.repo = repo;
    }

    async getCollaborators(repo: string): Promise<string[]> {
        const url = `https://api.github.com/repos/${this.owner}/${repo}/collaborators`;
        const response = await axios.get<Collaborator[]>(url, {
            headers: { Authorization: `token ${this.githubToken}` }
        });
        return response.data.map(collaborator => collaborator.login);
    }
}

export default RampUpTimeMetric;