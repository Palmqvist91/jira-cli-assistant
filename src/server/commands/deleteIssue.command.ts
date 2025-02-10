import inquirer from 'inquirer';
import { JiraService } from '@server/services/jira.service';

export async function deleteIssueCommand(issueKey: string) {
    const jira = new JiraService();

    const confirmation = await inquirer.prompt([
        { type: 'confirm', name: 'confirmDelete', message: `Are you sure you want to delete issue ${issueKey}?`, default: false },
    ]);

    if (!confirmation.confirmDelete) {
        console.log('❌ Deletion cancelled.');
        return;
    }

    try {
        const result = await jira.deleteIssue(issueKey);
        console.log(result);
    } catch (error) {
        console.error((error as Error).message);
    }
}