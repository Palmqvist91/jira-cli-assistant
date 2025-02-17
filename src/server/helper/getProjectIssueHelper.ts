import { JiraService } from "@server/services/jira.service";

export async function getProjectIssueHelper(jiraService: JiraService, issueKey: string) {
    if (!issueKey.includes('-')) {
        console.error('🚫 Invalid issue key format. Expected format: PROJECT-123');
        return null;
    }

    const upperIssueKey = issueKey.toUpperCase();
    try {
        const issue = await jiraService.fetchSingleIssue(upperIssueKey);
        if (!issue) {
            console.error(`🚫 Issue ${upperIssueKey} not found.`);
            return null;
        }
        return { issue };
    } catch (error) {
        console.error(`🚫 Could not fetch issue ${upperIssueKey}:`, error);
        return null;
    }
}