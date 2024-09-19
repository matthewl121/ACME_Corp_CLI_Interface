import axios from 'axios';
import 'dotenv/config';
import { writeFile } from '../utils/utils';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const GITHUB_TOKEN: string = process.env.GITHUB_TOKEN || "";

const query = `
{
  repository(owner: "nodejs", name: "node") {
    # License Information
    licenseInfo {
      key
      name
      spdxId
      url
    }

    # Readme Content
    readme: object(expression: "HEAD:README.md") {
      ... on Blob {
        text
      }
    }

    # Recent Open Issues
    openIssues: issues(first: 100, states: [OPEN], orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
    }

    # Recent Closed Issues
    closedIssues: issues(first: 100, states: [CLOSED], orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }

    # Recent Pull Requests
    pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        createdAt
        updatedAt
        closedAt
      }
    }
  }
}`;

// Define the function to fetch data
const fetchGitHubRepoData = async () => {
    try {
        const response = await axios.post(
            GITHUB_GRAPHQL_URL,
            { query },
            {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        
        const data = response.data;
        if (data.errors) {
            console.error('GraphQL Errors:', data.errors);
        } else {
            await writeFile(data.data.repository, 'RepositoryData.json');
        }

    } catch (error) {
        console.error('Error fetching data from GitHub API:', error);
    }
}

fetchGitHubRepoData();
