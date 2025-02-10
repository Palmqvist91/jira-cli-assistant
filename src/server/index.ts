import dotenv from "dotenv";
import { program } from "commander";
import { listProjectsCommand } from "./commands/listProjects.command";
import { listIssuesCommand } from "./commands/listIssues.command";
import { createIssueCommand } from "./commands/createIssue.command";
import { updateIssueCommand } from "./commands/updateIssue.command";
import { deleteIssueCommand } from "./commands/deleteIssue.command";
import { addCommentCommand } from "./commands/addComment.command";

dotenv.config();

program
    .name("jira-cli-assistant")
    .version("1.0.0")
    .description("A CLI tool for Jira");

// List projects npm run jira:projects
program
    .command("projects")
    .description("Lists all JIRA projects")
    .action(listProjectsCommand);

// List issues npm run jira:issues <projectKey>
program
    .command("list <projectKey>")
    .description("Lists open issues for a specific JIRA project")
    .action((projectKey: string) => {
        listIssuesCommand(projectKey);
    });

// Create a new issue npm run jira:create <projectKey>
program
    .command("create <projectKey>")
    .description("Creates a new issue in a specific project")
    .action((projectKey: string) => {
        createIssueCommand(projectKey);
    });

// Update an issue npm run jira:update <issueKey>
program
    .command("update <issueKey>")
    .description("Updates a specific issue")
    .action((issueKey: string) => {
        updateIssueCommand(issueKey);
    });

// Delete an issue npm run jira:delete <issueKey>
program
    .command("delete <issueKey>")
    .description("Deletes a specific issue")
    .action((issueKey: string) => {
        deleteIssueCommand(issueKey);
    });

// Add comment npm run jira:comment <issueKey>
program
    .command("comment <issueKey>")
    .description("Adds a comment to a specific issue")
    .action((issueKey: string) => {
        addCommentCommand(issueKey);
    });

program.parse(process.argv);