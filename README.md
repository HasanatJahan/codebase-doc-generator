# Documentation Generator

An automated tool for generating comprehensive documentation for your codebases. This project leverages GitHub and Greptile APIs to automatically index repositories and generate README files, streamlining the documentation process.

## Features

- Automated repository indexing
- AI-powered README generation
- GitHub integration for branch management
- Command-line interface
- Seamless documentation workflow

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HasanatJahan/codebase-doc-generator.git
```

2. Navigate to the project directory:
```bash
cd codebase-doc-generator
```

3. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
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

followed by the GitHub repository URL you want to document.

## Dependencies

- dotenv: ^16.4.5
- node-fetch: ^3.3.2
- uuid: ^10.0.0

## How It Works

1. Extracts repository information from the provided URL
2. Indexes the repository content
3. Generates a comprehensive README using AI
4. Creates a new branch for review
5. Stages the generated README for approval

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Bug Reports and Feature Requests

If you encounter any bugs or have ideas for new features, please submit them through our [issues page](https://github.com/HasanatJahan/codebase-doc-generator/issues).

## License

This project is licensed under the ISC License.

## Author

Hasanat Jahan

---

Homepage: [codebase-doc-generator](https://github.com/HasanatJahan/codebase-doc-generator#readme)