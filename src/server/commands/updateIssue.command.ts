import inquirer from 'inquirer';
import { JiraService } from '@server/services/jira.service';

export async function updateIssueCommand(issueKey: string) {
    const jira = new JiraService();

    const answers = await inquirer.prompt([
        { type: 'input', name: 'summary', message: 'Update summary (press Enter to keep current):', default: '' },
        { type: 'input', name: 'description', message: 'Update description (press Enter to keep current):', default: '' },
    ]);

    const updatedFields: { summary?: string; description?: string } = {};

    if (answers.summary) {
        updatedFields.summary = answers.summary;
    }

    if (answers.description) {
        updatedFields.description = answers.description;
    }
    try {
        await jira.updateIssue(issueKey, updatedFields.summary || '', updatedFields.description || '', 'Bug');
        console.log(`✅ Issue ${issueKey} has been updated!`);
    } catch (error) {
        console.error((error as Error).message);
    }
}
