import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";
import { getProjectIssueHelper } from "../helper/getProjectIssueHelper";

export async function deleteIssueCommand(issueKey: string, options: any) {
    try {
        const jiraService = new JiraService();
        const result = await getProjectIssueHelper(jiraService, issueKey);
        if (!result) {
            return;
        }

        if (!options.force) {
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
        }

        await jiraService.deleteIssue(issueKey);
        console.log(`✅ Issue ${issueKey} has been deleted.`);
    } catch (error) {
        console.error("🚫 Could not delete issue:", error);
    }
}

