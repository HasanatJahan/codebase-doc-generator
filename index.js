import dotenv from 'dotenv';
dotenv.config()

// Import functions 
import createBranchAndStageReadme from './githubService.js';
import { indexRepo, pollIndexingProcess, queryGenerateReadme } from './greptileService.js';

// Constants
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

// Main function to handle CLI input
async function main() {
    // URL passed as an argument
    const repoUrl = process.env.REPO_URL || process.argv[2];

    if (!repoUrl) {
        console.log("Error: Please provide a repository url either in your .env file assigned to REPO_URL or enter here on the command line");
        process.exit(1);
    }

    try {
        // Get the user/repoName
        const userSlashRepoName = extractRepoInfo(repoUrl);

        // Index the repository 
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