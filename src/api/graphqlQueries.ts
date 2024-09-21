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

    pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }

    isArchived

    object(expression: "HEAD:README.md") {
      ... on Blob {
        text
      }
    }

    examplesFolder: object(expression: "HEAD:examples/") {
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
  }
}
`;
