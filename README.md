# Jira CLI Assistant

Jira CLI Assistant is a command-line tool for interacting with the Jira API. It is built with TypeScript and offers a simple and efficient way to manage Jira projects and issues directly from the terminal.

## Release notes (1.0.15)

- Added `jira status` command to check JIRA profile status.
- Refactor CLI command syntax to use verb first. e.g. `jira list projects` instead of `jira projects list`.

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
2. Click on your profile icon in the upper right corner and select **Account settings**.
3. Navigate to **Security**.
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
  jira list projects
  ```

- **List issues for a project**:
  ```bash
  jira list issues <projectKey>

  # Optional filters:
  jira list issues PROJECT-KEY --status "In Progress"
  jira list issues PROJECT-KEY --assignee "John Doe"
  ```

- **Create a new issue**:
  ```bash
  jira create issue <projectKey>

  # With options:
  jira create issue PROJECT-KEY --summary "New Feature" --issueType "Story"
  ```

- **Update an issue**:
  ```bash
  jira update issue <issueKey>

  # With options:
  jira update issue ISSUE-123 --status "Done" --assignee "John Doe"
  ```

- **Delete an issue**:
  ```bash
  jira delete issue <issueKey>
  
  # Force delete without confirmation:
  jira delete issue ISSUE-123 --force
  ```

## Available Commands

```bash
jira <verb> <resource> [options]

# Switch between profiles:
jira config --switch <profileName>

# Reset config:
jira config --reset

# Check JIRA profile status:
jira status

Resources and Commands:
list
  projects                          List all JIRA projects
  sprints <projectKey>             List all sprints for a project
  issues <projectKey>              List issues in a project
    -s, --status <status>         Filter issues by status
    -a, --assignee <assignee>     Filter issues by assignee
    --sprint <sprint>             Filter issues by sprint name or ID

create
  issue <projectKey>               Create a new issue
    -m, --summary <summary>       Set the summary
    -t, --issueType <type>        Set the issue type

update
  issue <issueKey>                Update an issue
    -s, --status <status>         Set the status
    -a, --assignee <assignee>     Set the assignee
    -m, --summary <summary>       Update the summary

delete
  issue <issueKey>                Delete an issue
    --force                       Force delete without confirmation
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Enjoy coding! 🎉