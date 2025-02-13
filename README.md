# Jira CLI Assistant

Jira CLI Assistant is a command-line tool for interacting with the Jira API. It is built with TypeScript and offers a simple and efficient way to manage Jira projects and issues directly from the terminal.

## Features

- List all Jira projects
- List issues for a specific project with filtering options
- Create new issues in a project
- Update existing issues
- Delete issues

## Installation

To install Jira CLI Assistant globally, run:

```bash
npm install -g jira-cli-assistant
```

## Environment Variables

To run Jira CLI Assistant, you need to configure the following environment variables using the `jira config` command.

The required inputs are:
- Enter your JIRA URL (e.g., https://yourcompany.atlassian.net)
- Enter your JIRA email
- Enter your JIRA API token

### Getting a JIRA API Token

1. Log in to your Jira account.
2. Click on your profile icon in the bottom left corner and select **Account settings**.
3. Navigate to **Security** on the left sidebar.
4. Scroll down to the **API token** section and click on **Create and manage API tokens**.
5. Click on **Create API token**.
6. Enter a label for your token and click **Create**.
7. Copy the generated token and use it in `jira config`

## Usage

After installation, you can use the following commands:<br>
(for more info and useful flags use `jira help`)

- **Configure Jira**:
  ```bash
  jira config
  ```

- **List all projects**:
  ```bash
  jira project list
  ```

- **List issues for a project**:
  ```bash
  jira issue list <projectKey>

  # Optional filters:
  jira issue list PROJECT-KEY --status "In Progress"
  jira issue list PROJECT-KEY --assignee "John Doe"
  ```

- **Create a new issue**:
  ```bash
  jira issue create <projectKey>

  # With options:
  jira issue create PROJECT-KEY --summary "New Feature" --issueType "Story"
  ```

- **Update an issue**:
  ```bash
  jira issue update <issueKey>

  # With options:
  jira issue update ISSUE-123 --status "Done" --assignee "John Doe"
  ```

- **Delete an issue**:
  ```bash
  jira issue delete <issueKey>
  
  # Force delete without confirmation:
  jira issue delete ISSUE-123 --force
  ```

## Available Commands

```bash
jira <resource> <command> [options]

Resources and Commands:
project
  list                          List all JIRA projects
  sprint <projectKey>           List all sprints for a project

issue
  list <projectKey>             List issues in a project
    -s, --status <status>       Filter issues by status
    -a, --assignee <assignee>   Filter issues by assignee
    --sprint <sprint>           Filter issues by sprint name or ID
  create <projectKey>           Create a new issue
    -m, --summary <summary>     Set the summary
    -t, --issueType <type>      Set the issue type
  update <issueKey>             Update an issue
    -s, --status <status>       Set the status
    -a, --assignee <assignee>   Set the assignee
    -m, --summary <summary>     Update the summary
  delete <issueKey>             Delete an issue
    --force                     Force delete without confirmation
```

## License

This project is licensed under the MIT License.

Enjoy coding! 🎉