import 'dotenv/config';
<<<<<<< HEAD
import { fetchContributors, fetchRecentIssuesByState, fetchLicense, fetchReleases, fetchRepoMetadata, fetchCommits, fetchRecentPullRequests } from "./api";
import { calcBusFactor, calcCorrectness, calcResponsiveness } from './metricCalcs';
import { writeFile } from './utils/utils';
import { Contributor, ContributorActivity } from './types';
import { isNullishCoalesce } from 'typescript';
=======
import { fetchContributors, fetchCommits, fetchIssues, fetchLicense, fetchReleases, fetchRepoMetadata } from "./api";
import { writeFile } from './utils/utils';
import { Commit, Contributor } from './types';
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0

const repoURL: string = "https://github.com/matthewl121/ACME_Corp_CLI_Interface";
const token: string = process.env.GITHUB_TOKEN || "";

const owner = "lodash"
const repo = "lodash"

<<<<<<< HEAD

=======
const calculateBusFactor = (commitCount: number, contributors: Contributor[]) => {

}
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0

const main = async () => {
    // bus factor

    const commitActivity = await fetchCommits(owner, repo, token);
    await writeFile(commitActivity, "commitActivity.json")
    
    let busFactor: number | null = null;
    if (commitActivity !== null) {
        busFactor = calcBusFactor(commitActivity);

        // console.log(busFactor)
    }

<<<<<<< HEAD
    // correctness
    const totalOpenIssues = await fetchRecentIssuesByState(owner, repo, "open", token);
    const totalClosedIssues = await fetchRecentIssuesByState(owner, repo, "closed", token);
    await writeFile(totalOpenIssues, "totalOpenIssues.json")
    await writeFile(totalClosedIssues, "totalClosedIssues.json")

    let correctness: number | null = null;
    if (totalOpenIssues !== null && totalClosedIssues !== null) {
        correctness = calcCorrectness(totalOpenIssues.total_count, totalClosedIssues.total_count)

        // console.log(correctness)
    }

    // responsive maintainer
    const recentPullRequests = await fetchRecentPullRequests(owner, repo, token)
    await writeFile(recentPullRequests, "recentPullRequests.json")

    let responsiveness: number | null = null
    if (totalOpenIssues !== null && totalClosedIssues !== null && recentPullRequests !== null) {
        const responsiveness = calcResponsiveness(totalClosedIssues.items, recentPullRequests.items);

        console.log(responsiveness);
    }
=======
    // // correctness
    // const issueHistory = await fetchIssues(owner, repo, token);
    // await writeFile(issueHistory, "issues.json")
>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0

    // // licenses
    // const licenses = await fetchLicense(owner, repo, token);
    // await writeFile(licenses, "licenses.json")

<<<<<<< HEAD
    // // collaborators
    // const contributors = await fetchContributors(owner, repo, token);
    // await writeFile(contributors, "contributors.json")

    // // metadata
    // const metadata = await fetchRepoMetadata(owner, repo, token);
    // await writeFile(metadata, "metadata.json")
=======
    // collaborators
    const contributors = await fetchContributors(owner, repo, token);
    await writeFile(contributors, "contributors.json")

    // metadata
    const metadata = await fetchRepoMetadata(owner, repo, token);
    await writeFile(metadata, "metadata.json")

    if (commitHistory) {
        // calculateBusFactor(commitCount, contributors)
    }

>>>>>>> 978aafc1219aab965874cd1b5c803abcc157f8d0
}

main()
