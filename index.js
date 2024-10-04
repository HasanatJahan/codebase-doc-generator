// #!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from "uuid";

// Import functions 
import createBranchAndStageReadme from './githubService.js';

// TODO: to be removed added the dotenv - to be removed later  
// const dotenv = require("dotenv");
dotenv.config()

// Allow user input for API key and Github token through environment variables or cli arguments 
const GREPTILE_API_KEY = process.env.GREPTILE_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_URL = "https://api.greptile.com/v2/repositories";
const STANDARD_GITHUB_URL = "github.com";
const QUERY_URL = "https://api.greptile.com/v2/query";

// Prompts 
const README_QUERY = "Generate a README for this repository, please write it in markdown and only share exactly the README and nothing else in your response";

//  Extract the repo information from the input on the command line 
function extractRepoInfo(githubURL) {
    try {
        const url = new URL(githubURL);
        // check that it's a github url 
        if (url.hostname === STANDARD_GITHUB_URL) {
            // remove the empty elems
            const pathParts = url.pathname.split("/").filter(Boolean);
            if (pathParts.length >= 2) {
                const user = pathParts[0];
                const repoName = pathParts[1];
                const finalUserRepoName = user + "/" + repoName;
                return finalUserRepoName;
            }
        } else {
            throw new Error("Not a Github URL");
        }
    }
    catch (error) {
        console.error(error.message);
        return null;
    }
}


//  Index the github repo URL 
async function indexRepo(repoUrl) {
    const payload = {
        remote: "github",
        repository: repoUrl
    };

    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GREPTILE_API_KEY}`,
                'X-Github-Token': GITHUB_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error indexing repository: ${data.message || response.statusText}`);
        }

        console.log('Repository successfully indexed: ', data);
        return data;
    }
    catch (error) {
        console.log("Error indexing respository:", error.message);
    }
}

// Check respository indexing process 
async function checkIndexingProcess(repoURL) {
    const initialRepoURL = "github:main:" + repoURL;
    const repositoryIdentifier = encodeURIComponent(initialRepoURL);
    const finalRepoURL = BASE_URL + "/" + repositoryIdentifier;
    console.log(finalRepoURL);
    try {
        const response = await fetch(finalRepoURL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GREPTILE_API_KEY}`,
                'X-Github-Token': GITHUB_TOKEN
            }
        });

        // Parse JSON response 
        const data = await response.json();

        // check for non-200 status code 
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch repository status: ${errorText}`)
        }

        console.log("Repository status: ", data);
        return data;
    }
    catch (error) {
        console.log("Error checking repository status: ", error.message);
    }
}

// Poll the result for the indexing process 
async function pollIndexingProcess(repoUrl, interval = 5000) {
    let statusResponse = await checkIndexingProcess(repoUrl);
    // destructure the status and sha fields
    let { status, sha } = statusResponse;
    const submitted_case = "submitted";
    const processing_case = "processing";
    const cloning_case = "cloning";
    const retryLimit = 3;
    let retryCount = 0;

    while (status !== 'completed' || !sha) {
        switch (status) {
            case submitted_case:
                console.log("Indexing job is in queue. Waiting for the process to start...");
                break;
            case cloning_case:
                console.log("Repository is being cloned. Please wait...");
                break;
            case processing_case:
                console.log("Indexing is in process. Please wait, this may take some time...");
                break;
            default:
                console.log(`Unknown status: ${status}. Retrying...`);
                retryCount++;
                if (retryCount === retryLimit) {
                    console.log("Could not index repository :(");
                    return false;
                }
        }

        // Wait an interval before trying agian 
        await new Promise(resolve => setTimeout(resolve, interval));

        // Check indexing status againn
        statusResponse = await checkIndexingProcess(repoUrl);
        status = statusResponse.status;
        sha = statusResponse.sha;
    }
    console.log("Indexing completed! Repository will now be queried!")
    return true;
}


// Function to query the repository for README
async function queryGenerateReadme(userSlashRepoName, branch = "main") {
    const payload = {
        "messages": [
            {
                "id": uuidv4(), // unique id for message
                "content": README_QUERY,
                "role": "user"
            }
        ],
        "repositories": [
            {
                "remote": "github",
                "repository": userSlashRepoName,
                "branch": branch
            }
        ],
        "sessionId": uuidv4(),
    };

    try {
        const response = await fetch(QUERY_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GREPTILE_API_KEY}`,
                'X-Github-Token': GITHUB_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error querying repository: ${data.message || response.statusText}`);
        }

        return data;
    } catch (error) {
        console.log("Error querying repository for README generation: ", error.message);
    }
}


// Main function to handle CLI input
async function main() {
    // URL passed as an argument
    // const repoUrl = process.argv[2];

    // leaving now for testing purposes 
    const repoUrl = "https://github.com/HasanatJahan/codebase-doc-generator";

    if (!repoUrl) {
        console.log("Error: Please provide a repository url");
        process.exit(1);
    }

    try {
        // Get the user/repoName
        const userSlashRepoName = extractRepoInfo(repoUrl);

        // Index the repository - commented out to test github functionality 
        const response = await indexRepo(userSlashRepoName);

        // Poll until the indexing process is complete 
        const indexingCompleted = await pollIndexingProcess(userSlashRepoName);

        // If indexing is complete, generate the README 
        const readmeData = await queryGenerateReadme(userSlashRepoName);

        const createReadmeRequest = await createBranchAndStageReadme(userSlashRepoName, "main", readmeData.message);

    }
    catch (error) {
        console.log('Error processing repository: ', error.message);
    }
}

// Call main
main();