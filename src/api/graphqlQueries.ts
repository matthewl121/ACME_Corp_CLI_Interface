export const getRepoDataQuery = (owner: string, repo: string) => `
{
  repository(owner: "${owner}", name: "${repo}") {
    openIssues: issues(first: 100, states: [OPEN], orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }

    closedIssues: issues(first: 100, states: [CLOSED], orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }

    pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }

    licenseInfo {
      key
      name
      spdxId
      url
    }

    readme: object(expression: "HEAD:README.md") {
      ... on Blob {
        text
      }
    }
    isArchived
  }
}
`;
