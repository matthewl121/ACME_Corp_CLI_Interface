import 'dotenv/config';
import { fetchCommits } from "./api";

const repoURL: string = "https://github.com/matthewl121/ACME_Corp_CLI_Interface";
const token: string = process.env.GITHUB_TOKEN || "";

const [owner, repo]: string[] = repoURL.split('/').slice(3) // {owner: "matthewl121", repo: "ACME_Corp_CLI_Interface"}

const main = async () => {
    const data = await fetchCommits(owner, repo, token);
}

main()
