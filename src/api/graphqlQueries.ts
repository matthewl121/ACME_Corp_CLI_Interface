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

    readmeMd: object(expression: "HEAD:README.md") {
      ... on Blob {
        text
      }
    }

    readmeNoExt: object(expression: "HEAD:README") {
      ... on Blob {
        text
      }
    }
    
    readmeTxt: object(expression: "HEAD:README.txt") {
      ... on Blob {
        text
      }
    }

    readmeRDoc: object(expression: "HEAD:README.rdoc") { 
      ... on Blob {
        text
      }
    }

    readmehtml: object(expression: "HEAD:README.html") {
      ... on Blob {
        text
      }
    }

    readmeadoc: object(expression: "HEAD:README.adoc") {
      ... on Blob {
        text
      }
    }

    readmemarkdown: object(expression: "HEAD:README.markdown") {
      ... on Blob {
        text
      }
    }

    readmeyaml: object(expression: "HEAD:README.yaml") {
      ... on Blob {
        text
      }
    }

    readmerst: object(expression: "HEAD:README.rst") {
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
