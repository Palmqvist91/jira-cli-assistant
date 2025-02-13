#!/usr/bin/env node
import path from "path";
import dotenv from "dotenv";
import { Command } from 'commander';
import chalk from 'chalk';
import { setupConfig } from "./config/index.config";
import { welcomText, helpText } from "./commands/text.command";
import { allProjectsCommand } from "./commands/allProjects.command";
import { createIssueCommand } from "./commands/createIssue.command";
import { updateIssueCommand } from "./commands/updateIssue.command";
import { deleteIssueCommand } from "./commands/deleteIssue.command";
import { listProjectIssuesCommand } from "./commands/listProjectIssues.command";
import { listProjectSprintsCommand } from "./commands/listProjectSprints.command";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const program = new Command();

program
  .name('jira')
  .description('JIRA CLI Assistant')
  .version('1.0.0')
  .showHelpAfterError(`${chalk.yellow('(add --help for additional information)')}`)
  .configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => chalk.cyan(cmd.name()),
    commandUsage: (cmd) => chalk.yellow(cmd.usage()),
    argumentDescription: (arg) => chalk.green(arg),
    optionDescription: (opt) => chalk.green(opt),
    subcommandDescription: (cmd) => chalk.blue(cmd.description()),
  })
  .helpCommand(true)
  .on('command:*', () => {
    console.error(chalk.red('\n❌ Invalid command'));
    console.log(chalk.yellow('\n📚 Available commands:'));
    helpText();
    process.exit(1);
  });

if (process.argv.length <= 2) {
  console.log(chalk.yellow('❓ No command specified.'));
  console.log(chalk.yellow('\nAvailable commands:'));
  helpText();
  process.exit(1);
}

program
  .description("Welcome to Jira CLI Assistant! 🚀")
  .action(async () => {
    await welcomText();
  });

program
  .command("config")
  .description("Set up your JIRA configuration")
  .option("--reset", "Reset the configuration")
  .action(async (options: any) => {
    await setupConfig(options);
  });

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

projectsCommand
  .command("sprints")
  .alias("sprint")
  .argument("[projectKey]", "Project key to list sprints from")
  .description("List all sprints for a project")
  .action(async (projectKey: string) => {
    await listProjectSprintsCommand(projectKey);
  });

const issuesCommand = program
  .command("issues")
  .alias("issue")
  .description("Manage JIRA issues");

issuesCommand
  .command("list")
  .argument("[projectKey]", "Project key to list issues from")
  .option("-s, --status <status>", "Filter issues by status")
  .option("-a, --assignee <assignee>", "Filter issues by assignee")
  .option("--sprint [sprint]", "Filter issues by sprint (name or ID). If no value is provided, you will be prompted to select a sprint")
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

program
  .command("help")
  .description("Display additional help text")
  .action(async () => {
    await helpText();
  });

program.parse(process.argv);
