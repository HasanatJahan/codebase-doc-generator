# Documentation Generator

## Description
Documentation Generator is an automated tool designed to simplify the process of creating documentation for codebases. It leverages the power of GitHub and Greptile APIs to index repositories, generate README files, and streamline the documentation workflow.

### Note from Author: This documentation itself was generated using this repo!

## Features
- Automatic repository indexing
- README generation using AI-powered content creation
- GitHub integration for branch creation and file management
- Command-line interface for easy usage

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/hasanatjahan/codebase-doc-generator.git
   ```
2. Navigate to the project directory:
   ```
   cd codebase-doc-generator
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration
1. Create a `.env` file in the root directory.
2. Add the following environment variables:
   ```
   GITHUB_TOKEN=your_github_token
   GREPTILE_API_KEY=your_greptile_api_key
   ```

## Usage
Run the tool using the following command:
```
npm start <github_repository_url>
```
or
```
node index.js <github_repository_url>
```

## Dependencies
- dotenv: ^16.4.5
- node-fetch: ^3.3.2
- uuid: ^10.0.0

## Scripts
- `npm start`: Run the application

## How It Works
1. The tool extracts repository information from the provided GitHub URL.
2. It indexes the repository using the Greptile API.
3. The indexing process is monitored until completion.
4. A README is generated using AI-powered content creation.
5. A new branch is created in the GitHub repository.
6. The generated README is staged in the new branch for review.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.

## Author
Hasanat Jahan
ChatGPT was a helping hand for this tool

## Links
- [Report Bug](https://github.com/hasanatjahan/codebase-doc-generator/issues)
- [Request Feature](https://github.com/hasanatjahan/codebase-doc-generator/issues)

## Repository
- Type: git
- URL: https://github.com/HasanatJahan/codebase-doc-generator.git

## Homepage
https://github.com/HasanatJahan/codebase-doc-generator#readme