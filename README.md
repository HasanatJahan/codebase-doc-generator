# Documentation Generator

An automated tool for generating comprehensive documentation from your codebase.

## Description
Documentation Generator is an automated tool that leverages AI to simplify the creation of documentation for codebases. It indexes repositories and generates README files automatically, enhancing the documentation workflow through GitHub integration.

## Features
- Automated repository indexing
- AI-powered README generation
- GitHub integration for branch management
- Command-line interface
- Automatic documentation updates

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HasanatJahan/codebase-doc-generator.git
```

2. Navigate to project directory:
```bash
cd codebase-doc-generator
```

3. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:
```
GITHUB_TOKEN=your_github_token
GREPTILE_API_KEY=your_greptile_api_key
```

## Usage

Run the tool using either:
```bash
npm start
```
or
```bash
node index.js
```

## Dependencies
- dotenv: ^16.4.5
- node-fetch: ^3.3.2
- uuid: ^10.0.0

## How It Works
1. Extracts repository information
2. Indexes the codebase
3. Generates a comprehensive README
4. Creates a new branch for review
5. Stages the README for approval

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.

## Author
Hasanat Jahan

## Issues and Feature Requests
- Issues: [GitHub Issues](https://github.com/HasanatJahan/codebase-doc-generator/issues)
- Homepage: [GitHub Repository](https://github.com/HasanatJahan/codebase-doc-generator#readme)