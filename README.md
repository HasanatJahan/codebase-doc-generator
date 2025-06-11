# Documentation Generator

An automated tool that generates comprehensive documentation for your codebase using AI. This tool indexes your GitHub repository and creates intelligent README documentation, streamlining the documentation process for developers.

## Features

- 🤖 Automated repository indexing
- 📝 AI-powered README generation
- 🔄 GitHub integration with branch management
- 💻 Simple command-line interface
- 🔑 Secure API integration

## Prerequisites

- Node.js installed on your system
- GitHub account
- API keys for required services

## Installation

```bash
# Clone the repository
git clone https://github.com/HasanatJahan/codebase-doc-generator.git

# Navigate to the project directory
cd codebase-doc-generator

# Install dependencies
npm install
```

## Configuration

1. Create a `.env` file in the project root
2. Add the following environment variables:
```
REPO_URL=your_repository_url (optional)
GITHUB_TOKEN=your_github_token
GREPTILE_API_KEY=your_greptile_api_key
```

## Usage

You can run the tool in two ways:

```bash
# Using npm
npm start <repository-url>

# Using node directly
node index.js <repository-url>
```

If you've configured the REPO_URL in your .env file, you can run the tool without arguments:
```bash
npm start
```

## How It Works

1. Indexes your repository using Greptile API
2. Analyzes the codebase structure
3. Generates a comprehensive README using AI
4. Creates a new branch in your repository
5. Stages the generated README for review

## Dependencies

- dotenv: Environment variable management
- node-fetch: HTTP requests handling
- uuid: Unique identifier generation

## Scripts

- `npm start`: Runs the documentation generator

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for any bugs or feature requests.

## Author

Hasanat Jahan

## License

This project is licensed under the ISC License.

## Links

- [Report Bug](https://github.com/HasanatJahan/codebase-doc-generator/issues)
- [Request Feature](https://github.com/HasanatJahan/codebase-doc-generator/issues)
- [Homepage](https://github.com/HasanatJahan/codebase-doc-generator#readme)