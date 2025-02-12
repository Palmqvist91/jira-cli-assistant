import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function createIssueCommand(projectKey: string, options: any) {
    try {
        const summary = options.summary || await inquirer.prompt([
            { type: "input", name: "summary", message: "Enter a summary:" }
        ]).then((answers: any) => answers.summary);

        const issueType = options.issueType || await inquirer.prompt([
            { type: "list", name: "issueType", message: "Select issue type:", choices: ["Bug", "Task", "Story"] }
        ]).then((answers: any) => answers.issueType);

        const jiraService = new JiraService();
        const issue = await jiraService.createIssue(projectKey, summary, issueType);
        console.log(`✅ Issue ${issue.key} has been created.`);
    } catch (error) {
        console.error("🚫 Could not create issue:", error);
    }
}