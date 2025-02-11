import chalk from "chalk";
import { JiraService } from "../services/jira.service";
import { getProjectKey } from "../helper/getProjectKey.helper";

export async function listProjectIssuesCommand(projectKey: string) {
    try {
        const jiraService = new JiraService();
        const key = await getProjectKey(projectKey);
        console.log(`📂 Fetching issues for project: ${key}`);
        const issues = await jiraService.fetchProjectIssues(key);
        if (issues.length === 0) {
            console.log("✅ No open issues found.");
            return;
        }

        issues.sort((a: any, b: any) => {
            const statusA = a.fields.status.name;
            const statusB = b.fields.status.name;

            if (statusA === 'Done' && statusB !== 'Done') return 1;
            if (statusA !== 'Done' && statusB === 'Done') return -1;

            const statusCompare = statusA.localeCompare(statusB);
            if (statusCompare === 0) {
                return a.key.localeCompare(b.key);
            }
            return statusCompare;
        });

        const headers = ['Index', 'Key', 'Summary', 'Status', 'Assignee'];
        const columnWidths = [10, 15, 45, 25, 20];

        const formattedData = issues.map((issue: any) => [
            issue.key,
            issue.fields.summary.substring(0, 40),
            issue.fields.status.name,
            issue.fields.assignee?.displayName || 'Unassigned'
        ]);

        const rows = formattedData.map((row: any, rowIndex: number) => {
            const indexNum = rowIndex + 1;
            const indexCol = chalk.white(`[${indexNum.toString().padStart(1)}]`.padEnd(10));
            const formattedRow = row.map((cell: any, i: number) => {
                const cellStr = String(cell || '');
                if (i === 0) {
                    return cellStr.padEnd(15);
                } else if (i === 1) {
                    return cellStr.padEnd(45);
                } else if (i === 2) {
                    return cellStr.padEnd(25);
                } else {
                    return cellStr;
                }
            }).join('');
            return `${indexCol}${formattedRow}`;
        });

        const headerLine = headers.map((header, i) =>
            chalk.blue(header.padEnd(columnWidths[i]))
        ).join('');

        console.log(`\n${headerLine}\n${rows.join('\n')}`);
    } catch (error) {
        console.error("🚫 Could not fetch issues:", error);
    }
}