import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function updateIssueCommand(issueKey: string) {
    try {
        const { summary, description, issueType } = await inquirer.prompt([
            { type: "input", name: "summary", message: "Enter a new summary (leave blank to keep):", default: "" },
            { type: "input", name: "description", message: "Enter a new description (leave blank to keep):", default: "" },
            { type: "list", name: "issueType", message: "Select a new issue type (or keep existing):", choices: ["Bug", "Task", "Story"], default: "" }
        ]);

        const jiraService = new JiraService();
        await jiraService.updateIssue(issueKey, summary, description, issueType);
        console.log(`✅ Issue ${issueKey} has been updated.`);
    } catch (error) {
        console.error("🚫 Could not update issue:", error);
    }
}