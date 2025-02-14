import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";
import { getProjectIssueHelper } from "../helper/getProjectIssueHelper";

export async function updateIssueCommand(issueKey: string, options: any) {
    try {
        const jiraService = new JiraService();
        const result = await getProjectIssueHelper(jiraService, issueKey);
        if (!result) {
            return;
        }

        const currentIssue = result.issue;
        const currentSummary = currentIssue.fields.summary;
        const currentAssignee = currentIssue.fields.assignee?.accountId || 'Unassigned';
        const statuses = await jiraService.getProjectStatuses(issueKey.split('-')[0]);
        const users = await jiraService.getAssignableUsers(issueKey);

        const userChoices = users.map((user: any) => ({
            name: user.name,
            value: user.value
        }));

        const summary = options.summary || currentSummary;
        const status = options.status || currentIssue.fields.status.name;
        const assignee = options.assignee || currentAssignee;

        if (!options.summary && !options.status && !options.assignee) {
            const summaryPrompt = await inquirer.prompt([
                { type: "input", name: "summary", message: "Enter a new summary (or keep existing):", default: currentSummary }
            ]);

            const statusPrompt = await inquirer.prompt([
                { type: "list", name: "status", message: "Select a new status (or keep existing):", choices: statuses, default: status }
            ]);
            const assigneePrompt = await inquirer.prompt([
                { type: "list", name: "assignee", message: "Select an assignee (or keep existing):", choices: userChoices, default: currentAssignee }
            ]);

            await jiraService.updateIssue(issueKey, summaryPrompt.summary, statusPrompt.status, assigneePrompt.assignee);
        } else {
            const assigneeId = options.assignee ? users.find((user: any) => user.name === options.assignee)?.value : assignee;
            if (!assigneeId) {
                throw new Error(`Assignee "${options.assignee}" not found.`);
            }
            await jiraService.updateIssue(issueKey, summary, status, assigneeId);
        }

        console.log(`✅ Issue ${issueKey} has been updated.`);
    } catch (error) {
        console.error("🚫 Could not update issue:", error);
    }
}