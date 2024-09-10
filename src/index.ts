import 'dotenv/config';
import { fetchContributors, fetchCommits, fetchIssues, fetchLicense, fetchReleases } from "./api";
import { writeFile } from './utils/utils';
import { Commit } from './types';

const repoURL: string = "https://github.com/matthewl121/ACME_Corp_CLI_Interface";
const token: string = process.env.GITHUB_TOKEN || "";

const owner = "lodash"
const repo = "lodash"

const parseCommitHistory = (commits: Commit[]) => {
    for (const commit of commits) {
        console.log(commit.commit.author.name)
    }
}

const main = async () => {
    // bus factor
    const commitHistory = await fetchCommits(owner, repo, token);
    await writeFile(commitHistory, "commits.json")

    // // correctness
    // const issueHistory = await fetchIssues(owner, repo, token);
    // await writeFile(issueHistory, "issues.json")

    // // licenses
    // const licenses = await fetchLicense(owner, repo, token);
    // await writeFile(licenses, "licenses.json")

    // collaborators
    const contributors = await fetchContributors(owner, repo, token);
    await writeFile(contributors, "contributors.json")

    if (commitHistory) {
        parseCommitHistory(commitHistory)
    }

}

main()
