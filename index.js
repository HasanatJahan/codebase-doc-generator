// #!/usr/bin/env node

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { response } from 'express';
// TODO: to be removed added the dotenv - to be removed later  
// const dotenv = require("dotenv");
dotenv.config()

// Allow user input for API key and Github token through environment variables or cli arguments 
const GREPTILE_API_KEY = process.env.GREPTILE_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BASE_URL = "https://api.greptile.com/v2/repositories";
const STANDARD_GITHUB_URL = "github.com";

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

        // check for non-200 status code 
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch repository status: ${errorText}`)
        }

        // Parse JSON response 
        const data = await response.json();
        console.log("Repository status: ", data);
        return data;
    }
    catch (error) {
        console.log("Error checking repository status: ", error.message);
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
        const response = await indexRepo(userSlashRepoName);

        if (response) {
            const indexingProcessStatus = checkIndexingProcess(userSlashRepoName);
            console.log(indexingProcessStatus);
        }
    }
    catch (error) {
        console.log('Error processing repository: ', error.message);
    }
}

// Call main
main();