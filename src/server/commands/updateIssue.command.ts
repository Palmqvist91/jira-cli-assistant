import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function updateIssueCommand(issueKey: string) {
    try {
        const jiraService = new JiraService();

        const currentIssue = await jiraService.fetchSingleIssue(issueKey);
        const currentSummary = currentIssue.fields.summary;
        const currentAssignee = currentIssue.fields.assignee?.displayName || 'Unassigned';
        const statuses = await jiraService.getProjectStatuses(issueKey.split('-')[0]);
        const users = await jiraService.getAssignableUsers(issueKey);

        const { summary, status, assignee } = await inquirer.prompt([
            { type: "input", name: "summary", message: "Enter a new summary (leave blank to keep):", default: currentSummary },
            { type: "list", name: "status", message: "Select a new status (or keep existing):", choices: statuses, default: "" },
            { type: "list", name: "assignee", message: "Select an assignee (or keep existing):", choices: users, default: currentAssignee }
        ]);

        const newSummary = summary.trim() || currentSummary;
        const newAssignee = assignee || currentAssignee;

        await jiraService.updateIssue(issueKey, newSummary, status, newAssignee);
        console.log(`✅ Issue ${issueKey} has been updated.`);
    } catch (error) {
        console.error("🚫 Could not update issue:", error);
    }
}