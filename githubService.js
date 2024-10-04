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


// Helper function to create a new branch 
async function createNewBranch(githubApiBase, newBranchName, latestCommitSha) {
    const branchCreateAPI = `${githubApiBase}/git/refs`;
    const response = await fetch(branchCreateAPI, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ref: `refs/heads/${newBranchName}`,
            sha: latestCommitSha
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error creating new branch: ${data.message}`);
    }

    return newBranchName;
}


// Helper function to get the SHA of the README.md file if it exists 
async function getReadmeSha(githubApiBase, branch, filePath) {
    const url = `${githubApiBase}/contents/${filePath}?ref=${branch}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (response.status === 403) {
        throw new Error('Access denied: you do not have permission to modify this file');
    } else if (response.status === 404) {
        console.log("README.md file does not exist. It will be created");
        return null; // no readme exists 
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(`Error getting README file SHA: ${data.message}`)
    }

    return data.sha;
}


//  Helper function to create or update readme file 
async function createOrUpdateReadme(githubApiBase, newBranchName, filePath, generatedReadmeContent, fileSha = null) {
    const fetchUrl = `${githubApiBase}/contents/${filePath}`;
    // convert to buffer 
    const bufferGeneratedReadmeContent = await Buffer.from(generatedReadmeContent).toString('base64');

    const payload = {
        message: 'Populating README.md for review',
        content: bufferGeneratedReadmeContent, // convert content to base 64 
        branch: newBranchName,
        sha: fileSha // only needed if file exists 
    }

    const response = await fetch(fetchUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Error staging README.md: ${data.message}`);
    }

    const linkToReadme = `https://github.com/${githubApiBase.split('/repos/')[1]}/edit/${newBranchName}/${filePath}`;
    console.log("This is the link generated to read me: /n" + linkToReadme);
    return linkToReadme;
}


// overall function called from index.js 
async function createBranchAndStageReadme(userSlashRepoName, branch = "main", generatedReadmeContent) {
    console.log("this is generatedreadme " + generatedReadmeContent);

    const filepath = "README.md";
    const githubApiBase = GITHUB_API_BASE + userSlashRepoName;

    console.log(" This is how we see generated readme content in the create branch function " + generatedReadmeContent);

    // Get the latest commit SHA for the main branch
    try {
        const latestCommitSha = await getLatestCommitSha(githubApiBase, "main");

        //  create a new branch with latest commit sha 
        const branchDateName = `readme-update-${Date.now()}`;
        const newBranchName = await createNewBranch(githubApiBase, branchDateName, latestCommitSha);
        console.log("This is new branch name " + newBranchName);


        // Get the sha of the current README.md if exists 
        const readmeFileSha = await getReadmeSha(githubApiBase, newBranchName, filepath);

        // Create/Update README in the new branch 
        const githubUrl = await createOrUpdateReadme(githubApiBase, newBranchName, filepath, generatedReadmeContent, readmeFileSha);

        //  Output to user to paste into browser 
        console.log(`View and edit the README here: ${githubUrl}`);
        return githubUrl;

    } catch (error) {
        console.log(`Error staging README for review: ${error.message}`);
    }
}

// Export the function to make it available 
export default createBranchAndStageReadme;