#!/usr/bin/env node
import path from "path";
import dotenv from "dotenv";
import { program } from "commander";
import { setupConfig } from "./config/index.config";
import { welcomText, helpText } from "./commands/text.command";
import { allProjectsCommand } from "./commands/allProjects.command";
import { createIssueCommand } from "./commands/createIssue.command";
import { updateIssueCommand } from "./commands/updateIssue.command";
import { deleteIssueCommand } from "./commands/deleteIssue.command";
import { listProjectIssuesCommand } from "./commands/listProjectIssues.command";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

program
  .name("jira-cli-assistant")
  .version("1.0.0")
  .description("A CLI tool for Jira created by PrHiGo 🔥. Use this tool to manage your Jira projects and issues directly from the command line 💻.");

// Welcome message if no command is provided
program
  .description("Welcome to Jira CLI Assistant! 🚀")
  .action(async () => {
    await welcomText();
  });

// Set up your JIRA configuration
program
  .command("config")
  .description("Set up your JIRA configuration")
  .option("--reset", "Reset the configuration")
  .action(async (options: any) => {
    await setupConfig(options);
  });

// Projects commands
const projectsCommand = program
  .command("projects")
  .alias("project")
  .description("Manage JIRA projects");

projectsCommand
  .command("list")
  .description("List all JIRA projects")
  .action(async () => {
    await allProjectsCommand();
  });

// Issues commands
const issuesCommand = program
  .command("issues")
  .alias("issue")
  .description("Manage JIRA issues");

issuesCommand
  .command("list")
  .argument("[projectKey]", "Project key to list issues from")
  .option("-s, --status <status>", "Filter issues by status")
  .option("-a, --assignee <assignee>", "Filter issues by assignee")
  .action(async (projectKey: string, options: any) => {
    await listProjectIssuesCommand(projectKey, options);
  });

issuesCommand
  .command("create")
  .argument("<projectKey>", "Project key to create issue in")
  .option("-m, --summary <summary>", "Set the summary of the issue")
  .option("-t, --issueType <issueType>", "Set the issue type")
  .action(async (projectKey: string, options: any) => {
    await createIssueCommand(projectKey, options);
  });

issuesCommand
  .command("update")
  .argument("<issueKey>", "Issue key to update")
  .option("-s, --status <status>", "Set the status of the issue")
  .option("-a, --assignee <assignee>", "Set the assignee of the issue")
  .option("-m, --summary <summary>", "Set the summary of the issue")
  .action(async (issueKey: string, options: any) => {
    await updateIssueCommand(issueKey, options);
  });

issuesCommand
  .command("delete")
  .argument("<issueKey>", "Issue key to delete")
  .option("--force", "Force delete without confirmation")
  .action(async (issueKey: string, options: any) => {
    await deleteIssueCommand(issueKey, options);
  });

// Add additional help text
program
  .command("help")
  .description("Display additional help text")
  .action(async () => {
    await helpText();
  });

program.parse(process.argv);
