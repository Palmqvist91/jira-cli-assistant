import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function updateIssueCommand(issueKey: string, options: any) {
    try {
        const jiraService = new JiraService();

        const currentIssue = await jiraService.fetchSingleIssue(issueKey);
        const currentSummary = currentIssue.fields.summary;
        const currentAssignee = currentIssue.fields.assignee?.accountId || 'Unassigned';
        const statuses = await jiraService.getProjectStatuses(issueKey.split('-')[0]);
        const users = await jiraService.getAssignableUsers(issueKey);

        // Map users to a format suitable for inquirer
        const userChoices = users.map((user: any) => ({
            name: user.name,
            value: user.value // This should be accountId
        }));

        // Use provided options or fallback to current values
        const summary = options.summary || currentSummary;
        const status = options.status || currentIssue.fields.status.name;
        const assignee = options.assignee || currentAssignee;

        // If no flags are provided, prompt the user
        if (!options.summary && !options.status && !options.assignee) {
            const statusPrompt = await inquirer.prompt([
                { type: "list", name: "status", message: "Select a new status (or keep existing):", choices: statuses, default: status }
            ]);
            const assigneePrompt = await inquirer.prompt([
                { type: "list", name: "assignee", message: "Select an assignee (or keep existing):", choices: userChoices, default: currentAssignee }
            ]);

            await jiraService.updateIssue(issueKey, summary, statusPrompt.status, assigneePrompt.assignee);
        } else {
            // If assignee is provided as a name, find the corresponding accountId
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