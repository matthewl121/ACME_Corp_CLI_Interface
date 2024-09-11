import RampUpTimeMetric from "./RampUpTimeMetric";
import * as axios from 'axios';

class GitHubRepoCollaborators {
    private repoOwner: string;
    private repoName: string;
    private token: string;
    private apiUrl: string;
    private headers: { [key: string]: string };

    constructor(repoOwner: string, repoName: string, token: string) {
        this.repoOwner = repoOwner;
        this.repoName = repoName;
        this.token = token;
        this.apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/collaborators`;
        this.headers = {
            'Authorization': `token ${this.token}`,
            'Accept': 'application/vnd.github.v3+json'
        };
    }

    async fetchCollaborators(): Promise<any[]> {
        try {
            const response = await axios.get<any[]>(this.apiUrl, { headers: this.headers });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.error('Repository not found.');
                    } else if (error.response.status === 403) {
                        console.error('Forbidden: Check your authentication token.');
                    } else {
                        console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
                    }
                } else {
                    console.error('An error occurred:', error.message);
                }
            }
            return [];
        }
    }

    async printCollaborators(): Promise<void> {
        const collaborators = await this.fetchCollaborators();
        if (collaborators.length > 0) {
            console.log(`Collaborators of ${this.repoOwner}/${this.repoName}:`);
            collaborators.forEach(collaborator => {
                console.log(`- ${collaborator.login} (${collaborator.type})`);
            });
        } else {
            console.log('No collaborators found or error in fetching data.');
        }
    }
}

// Example usage:
const repoOwner = 'octocat';
const repoName = 'Hello-World';
const token = 'your_github_token_here';

const githubCollaborators = new GitHubRepoCollaborators(repoOwner, repoName, token);
githubCollaborators.printCollaborators();
