#!/usr/bin/env node

import path from "path";
import dotenv from "dotenv";
import { program } from "commander";
import { setupConfig } from "./config/index.config";
import { allProjectsCommand } from "./commands/allProjects.command";
import { createIssueCommand } from "./commands/createIssue.command";
import { updateIssueCommand } from "./commands/updateIssue.command";
import { deleteIssueCommand } from "./commands/deleteIssue.command";
import { listProjectIssuesCommand } from "./commands/listProjectIssues.command";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

program
    .name("jira-cli-assistant")
    .version("1.0.0")
    .description("A CLI tool for Jira created by DevbyT");

// Welcome message if no command is provided
program
    .action(() => {
        console.log(`
            Welcome to Jira CLI Assistant! 🚀
            
                        by PrHiGo

            Here are some example commands you can run:
            - jira project              List all projects
            - jira list <projectKey>     List open issues for a project
            - jira create <projectKey>   Create a new issue
            - jira update <issueKey>     Update an existing issue
            - jira delete <issueKey>     Delete an issue

            For more information, run:
            jira --help
        `);
    });

// Set up your JIRA configuration
program
    .command("config")
    .description("Set up your JIRA configuration")
    .action(async () => {
        await setupConfig();
        console.log("Configuration setup complete.");
    });

// List projects
program
    .command("project")
    .description("Lists all JIRA projects")
    .action(async () => {
        await allProjectsCommand();
    });

// List issues
program
    .command("list [projectKey]")
    .description("Lists open issues for a specific JIRA project")
    .action(async (projectKey: string) => {
        await listProjectIssuesCommand(projectKey);
    });

// Create a new issue
program
    .command("create <projectKey>")
    .description("Creates a new issue in a specific project")
    .action(async (projectKey: string) => {
        await createIssueCommand(projectKey);
    });

// Update an issue with flags
program
    .command("update <issueKey>")
    .description("Updates a specific issue")
    .option("-s, --status <status>", "Set the status of the issue")
    .option("-a, --assignee <assignee>", "Set the assignee of the issue")
    .option("-m, --summary <summary>", "Set the summary of the issue")
    .action(async (issueKey: string, options: any) => {
        await updateIssueCommand(issueKey, options);
    });

// Delete an issue
program
    .command("delete <issueKey>")
    .description("Deletes a specific issue")
    .action(async (issueKey: string) => {
        await deleteIssueCommand(issueKey);
    });

program.parse(process.argv);
