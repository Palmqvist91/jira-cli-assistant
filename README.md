# Jira CLI Assistant

Jira CLI Assistant is a command-line tool for interacting with the Jira API. It is built with TypeScript and offers a simple and efficient way to manage Jira projects and issues directly from the terminal.

## Features

- List all Jira projects
- List open issues for a specific project
- Create new issues in a project
- Update existing issues
- Delete issues

## Installation

To install and run the Jira CLI Assistant, follow these steps:

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd jira-cli-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Install the CLI tool globally:
   ```bash
   npm install -g .
   ```

## Environment Variables

To run Jira CLI Assistant, you need to configure the following environment variables using the `jira config` command.

The required inputs is:
Enter your JIRA URL (e.g., https://yourcompany.atlassian.net)
Enter your JIRA email
Enter your JIRA API token

### Getting a JIRA API Token

1. Log in to your Jira account.
2. Click on your profile icon in the bottom left corner and select **Account settings**.
3. Navigate to **Security** on the left sidebar.
4. Scroll down to the **API token** section and click on **Create and manage API tokens**.
5. Click on **Create API token**.
6. Enter a label for your token and click **Create**.
7. Copy the generated token and use it in `jira config`

## Usage

After installation, you can use the following commands:

- **Configure Jira**:
  ```bash
  jira config
  ```

- **List all projects**:
  ```bash
  jira projects
  ```

- **List issues for a project**:
  ```bash
  jira list <projectKey>
  ```

- **Create a new issue**:
  ```bash
  jira create <projectKey>
  ```

- **Update an issue**:
  ```bash
  jira update <issueKey>
  ```

- **Delete an issue**:
  ```bash
  jira delete <issueKey>
  ```

## Project Structure

- **src/**: The source code of the app
- **src/server/**: Backend logic
- **src/client/**: Frontend views (if applicable)

## Contribute

If you want to contribute to the project, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Make your changes and commit (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Submit a pull request

## License

This project is licensed under the MIT License.

Enjoy coding! 🎉