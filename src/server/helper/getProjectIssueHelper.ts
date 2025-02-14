import { JiraService } from "@server/services/jira.service";

export async function getProjectIssueHelper(jiraService: JiraService, issueKey: string) {
    if (!issueKey.includes('-')) {
        console.error('🚫 Invalid issue key format. Expected format: PROJECT-123');
        return null;
    }

    let currentIssue = await jiraService.fetchSingleIssue(issueKey);
    if (!currentIssue) {
        console.error(`🚫 Issue "${issueKey}" does not exist.`);
        return null;
    }

    return {
        issue: currentIssue,
        key: issueKey
    };
}