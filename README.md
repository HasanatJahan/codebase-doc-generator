# Codebase Documentation Generator

An automated tool for generating comprehensive documentation for your codebase using AI-powered analysis.

## Features

- Automatic repository indexing and analysis
- AI-powered README generation
- GitHub integration for branch management
- Command-line interface for easy use
- Automated branch creation for documentation updates
- Smart documentation staging process

## Prerequisites

- Node.js
- GitHub account
- Greptile API key
- GitHub personal access token

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
GREPTILE_API_KEY=your_greptile_api_key
GITHUB_TOKEN=your_github_token
REPO_URL=optional_default_repository_url
```

## Usage

Run the tool using either:

```bash
npm start
```

or

```bash
node index.js <github-repository-url>
```

Example:
```bash
node index.js https://github.com/username/repository
```

## How It Works

1. The tool indexes your repository using Greptile's API
2. Analyzes the codebase structure and content
3. Generates a comprehensive README using AI
4. Creates a new branch with timestamp
5. Stages the generated README for review
6. Provides a direct link to edit and review the changes

## Dependencies

- dotenv
- node-fetch
- uuid

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License

## Author

Created by Hasanat Jahan

---

*Note: This tool uses Greptile's API for repository analysis and GitHub's API for version control operations. Make sure you have the necessary API keys and permissions before use.*