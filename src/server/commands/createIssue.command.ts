import inquirer from 'inquirer';
import { JiraService } from '@server/services/jira.service';

export async function createIssueCommand(projectKey: string) {
    const jira = new JiraService();

    const answers = await inquirer.prompt([
        { type: 'input', name: 'summary', message: 'Write a summary for the issue:' },
        { type: 'list', name: 'issueType', message: 'Choose the type of issue:', choices: ['Bug', 'Task', 'Story'] },
        { type: 'input', name: 'description', message: 'Write a description (optional):', default: '' },
    ]);

    try {
        const issue = await jira.createIssue(projectKey, answers.summary, answers.description, answers.issueType);
        console.log(`✅ Issue ${issue.key} has been created!`);
    } catch (error) {
        console.error((error as Error).message);
    }
}