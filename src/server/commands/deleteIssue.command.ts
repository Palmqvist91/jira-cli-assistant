import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function deleteIssueCommand(issueKey: string) {
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

        const jiraService = new JiraService();
        await jiraService.deleteIssue(issueKey);
        console.log(`✅ Issue ${issueKey} has been deleted.`);
    } catch (error) {
        console.error("🚫 Could not delete issue:", error);
    }
}

