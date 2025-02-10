import { JiraService } from '@server/services/jira.service';

export async function listIssuesCommand(projectKey: string) {
    const jira = new JiraService();
    try {
        const issues = await jira.fetchIssues(projectKey);
        console.log(`Found ${issues.length} issues in project ${projectKey}:\n`);
        issues.forEach((issue: any) => {
            console.log(`- [${issue.key}] ${issue.fields.summary} (Status: ${issue.fields.status.name})`);
        });
    } catch (error) {
        console.error((error as Error).message);
    }
}