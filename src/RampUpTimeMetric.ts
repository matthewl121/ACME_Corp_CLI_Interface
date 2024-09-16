import axios from "axios";

class RampUpTimeMetric {
    private githubToken: string;
    private owner: string;
    private repo: string;

    constructor(githubToken: string, owner: string, repo: string) {
        this.githubToken = githubToken;
        this.owner = owner;
        this.repo = repo;
    }

    async getRampUpTime() {
        const url = `https://api.github.com/repos/${this.owner}/${this.repo}/comm`;
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${this.githubToken}`
            }
        });
    }

    
}