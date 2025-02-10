import dotenv from "dotenv";
import { program } from "commander";
import inquirer from "inquirer";
import JiraService from "./services/jira.service";

dotenv.config();

const jiraService = new JiraService();

async function getProjectKey(projectKey?: string): Promise<string> {
    if (projectKey) {
        return projectKey;
    }

    console.log("❓ No projectKey provided. Fetching all projects...");

    const projects = await jiraService.fetchProjects();
    if (!projects.length) {
        console.error("🚫 No projects found.");
        process.exit(1);
    }

    const { selectedProject } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedProject",
            message: "Select a project:",
            choices: projects.map((project: any) => ({
                name: `${project.key} - ${project.name}`,
                value: project.key,
            })),
        },
    ]);

    return selectedProject;
}

program
    .name("jira-cli-assistant")
    .version("1.0.0")
    .description("A CLI tool for Jira");

// List projects
program
    .command("projects")
    .description("Lists all JIRA projects")
    .action(async () => {
        try {
            const projects = await jiraService.fetchProjects();
            if (projects.length === 0) {
                console.log("🚫 No projects found.");
                return;
            }

            console.log("📋 Project list:");
            projects.forEach((project: any) => {
                console.log(`- ${project.key}: ${project.name}`);
            });
        } catch (error) {
            console.error("🚫 Could not fetch projects:", error);
        }
    });

// List issues
program
    .command("list [projectKey]")
    .description("Lists open issues for a specific JIRA project")
    .action(async (projectKey?: string) => {
        try {
            const key = await getProjectKey(projectKey);
            console.log(`📂 Fetching issues for project: ${key}`);
            const issues = await jiraService.fetchIssues(key);
            if (issues.length === 0) {
                console.log("✅ No open issues found.");
                return;
            }

            issues.forEach((issue: any) => {
                console.log(`- [${issue.key}] ${issue.fields.summary} - (${issue.fields.status.name})`);
            });
        } catch (error) {
            console.error("🚫 Could not fetch issues:", error);
        }
    });

// Create a new issue
program
    .command("create <projectKey>")
    .description("Creates a new issue in a specific project")
    .action(async (projectKey: string) => {
        try {
            const { summary, description, issueType } = await inquirer.prompt([
                { type: "input", name: "summary", message: "Enter a summary:" },
                { type: "input", name: "description", message: "Enter a description (optional):", default: "" },
                { type: "list", name: "issueType", message: "Select issue type:", choices: ["Bug", "Task", "Story"] }
            ]);

            const issue = await jiraService.createIssue(projectKey, summary, description, issueType);
            console.log(`✅ Issue ${issue.key} has been created.`);
        } catch (error) {
            console.error("🚫 Could not create issue:", error);
        }
    });

// Update an issue
program
    .command("update <issueKey>")
    .description("Updates a specific issue")
    .action(async (issueKey: string) => {
        try {
            const { summary, description, issueType } = await inquirer.prompt([
                { type: "input", name: "summary", message: "Enter a new summary (leave blank to keep):", default: "" },
                { type: "input", name: "description", message: "Enter a new description (leave blank to keep):", default: "" },
                { type: "list", name: "issueType", message: "Select a new issue type (or keep existing):", choices: ["Bug", "Task", "Story"], default: "" }
            ]);

            await jiraService.updateIssue(issueKey, summary, description, issueType);
            console.log(`✅ Issue ${issueKey} has been updated.`);
        } catch (error) {
            console.error("🚫 Could not update issue:", error);
        }
    });

// Delete an issue
program
    .command("delete <issueKey>")
    .description("Deletes a specific issue")
    .action(async (issueKey: string) => {
        try {
            const { confirm } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "confirm",
                    message: `Are you sure you want to delete issue ${issueKey}?`,
                    default: false,
                },
            ]);

            if (!confirm) {
                console.log("❌ Deletion cancelled.");
                return;
            }

            await jiraService.deleteIssue(issueKey);
            console.log(`✅ Issue ${issueKey} has been deleted.`);
        } catch (error) {
            console.error("🚫 Could not delete issue:", error);
        }
    });

// Add comment
program
    .command("comment <issueKey>")
    .description("Adds a comment to a specific issue")
    .action(async (issueKey: string) => {
        try {
            const { comment } = await inquirer.prompt([
                { type: "input", name: "comment", message: "Enter your comment:" },
            ]);

            await jiraService.addComment(issueKey, comment);
            console.log(`💬 Comment has been added to issue ${issueKey}.`);
        } catch (error) {
            console.error("🚫 Could not add comment:", error);
        }
    });

program.parse(process.argv);
