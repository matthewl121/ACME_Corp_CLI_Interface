import 'dotenv/config';
import { fetchContributors, fetchCommits, fetchIssues, fetchLicense, fetchReleases, fetchRepoMetadata } from "./api";
import { writeFile } from './utils/utils';
import { Commit, Contributor } from './types';

const repoURL: string = "https://github.com/matthewl121/ACME_Corp_CLI_Interface";
const token: string = process.env.GITHUB_TOKEN || "";

const owner = "lodash"
const repo = "lodash"

const calculateBusFactor = (commitCount: number, contributors: Contributor[]) => {

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

    // metadata
    const metadata = await fetchRepoMetadata(owner, repo, token);
    await writeFile(metadata, "metadata.json")

    if (commitHistory) {
        // calculateBusFactor(commitCount, contributors)
    }

}

main()
