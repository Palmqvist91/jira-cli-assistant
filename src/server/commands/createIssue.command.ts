import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function createIssueCommand(projectKey: string) {
    try {
        const { summary, description, issueType } = await inquirer.prompt([
            { type: "input", name: "summary", message: "Enter a summary:" },
            { type: "input", name: "description", message: "Enter a description (optional):", default: "" },
            { type: "list", name: "issueType", message: "Select issue type:", choices: ["Bug", "Task", "Story"] }
        ]);

        const jiraService = new JiraService();
        const issue = await jiraService.createIssue(projectKey, summary, description, issueType);
        console.log(`✅ Issue ${issue.key} has been created.`);
    } catch (error) {
        console.error("🚫 Could not create issue:", error);
    }
}