//  githubService.js 
import dotenv from 'dotenv';
dotenv.config()
import fetch from 'node-fetch';

const GITHUB_API_BASE = "https://api.github.com/repos/";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

//  Helper function to get the latest commit sha for a branch 
async function getLatestCommitSha(githubApiBase, branch) {
    const fetchAPI = githubApiBase + "/git/ref/heads/" + branch;

    let response = await fetch(fetchAPI, {
        method: "GET",
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (response.status === 403) {
        throw new Error("Access denied: You do not have permission to access this repository");
    } else if (response.status === 404) {
        throw new Error("Repository not found or branch does not exist");
    }

    let data = await response.json();
    if (!response.ok) {
        throw new Error(`Error getting branch info: ${data.message}`);
    }

    const latestCommitSha = data.object.sha;
    console.log("Latest commit sha on the main branch ", latestCommitSha);
    return latestCommitSha;
}

// overall function called from index.js 
async function createBranchAndStageReadme(userSlashRepoName, branch = "main", generatedReadmeContent) {
    const filepath = "README.md";
    const githubApiBase = GITHUB_API_BASE + userSlashRepoName;

    const latestCommitSha = getLatestCommitSha(githubApiBase, "main");
}

// Export the function to make it available 
export default createBranchAndStageReadme;