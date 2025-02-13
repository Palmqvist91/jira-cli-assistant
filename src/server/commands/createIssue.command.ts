import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";
import { getProjectKeyHelper } from "../helper/getProjectKey.helper";

export async function createIssueCommand(projectKey: string, userInput: { summary: string, issueType: string }) {
    try {
        const key = await getProjectKeyHelper(projectKey);

        const summary = userInput.summary || await inquirer.prompt([
            { type: "input", name: "summary", message: "Enter a summary:" }
        ]).then((answers: any) => answers.summary);

        const issueType = userInput.issueType || await inquirer.prompt([
            { type: "list", name: "issueType", message: "Select issue type:", choices: ["Bug", "Task", "Story"] }
        ]).then((answers: any) => answers.issueType);

        const jiraService = new JiraService();
        const issue = await jiraService.createIssue(key, summary, issueType);
        console.log(`✅ Issue ${issue.key} has been created.`);
    } catch (error) {
        console.error("🚫 Could not create issue:", error);
    }
}