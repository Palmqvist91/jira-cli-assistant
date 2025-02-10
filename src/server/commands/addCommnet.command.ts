import inquirer from 'inquirer';
import { JiraService } from '@server/services/jira.service';

export async function addCommentCommand(issueKey: string) {
    const jira = new JiraService();

    const answer = await inquirer.prompt([
        { type: 'input', name: 'comment', message: 'Write your comment:' },
    ]);

    try {
        await jira.addComment(issueKey, answer.comment);
        console.log(`💬 Comment added to ${issueKey}!`);
    } catch (error) {
        console.error((error as Error).message);
    }
}