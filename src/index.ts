import 'dotenv/config';
import { fetchCommits, fetchIssues } from "./api";
import { writeFile } from './utils/utils';

const repoURL: string = "https://github.com/matthewl121/ACME_Corp_CLI_Interface";
const token: string = process.env.GITHUB_TOKEN || "";

const [owner, repo]: string[] = repoURL.split('/').slice(3) // {owner: "matthewl121", repo: "ACME_Corp_CLI_Interface"}

const main = async () => {
    // bus factor
    const commitHistory = await fetchCommits(owner, repo, token);
    await writeFile(commitHistory, "commits.json")

    // correctness
    const issueHistory = await fetchIssues(owner, repo, token);
    await writeFile(issueHistory, "issues.json")
}

main()
