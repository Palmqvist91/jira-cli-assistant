import inquirer from "inquirer";
import chalk from "chalk";
import { JiraService } from "../services/jira.service";
import { getProjectKeyHelper } from "../helper/getProjectKey.helper";

export async function listProjectIssuesCommand(projectKey: string, options: any) {
    try {
        const jiraService = new JiraService();

        const key = await getProjectKeyHelper(projectKey);

        if (options.sprint === true) {
            const sprints = await jiraService.fetchProjectSprints(key);

            if (!sprints || sprints.length === 0) {
                console.log(chalk.yellow("⚠️ No sprints found for this project."));
                return;
            }

            const { selectedSprint } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedSprint',
                    message: 'Select a sprint:',
                    choices: sprints.map((sprint: any) => ({
                        name: `${sprint.name} (${sprint.state})`,
                        value: sprint.id
                    }))
                }
            ]);

            options.sprint = selectedSprint;
        }

        let sprintId = options.sprint;

        if (options.sprint && isNaN(options.sprint)) {
            const sprints = await jiraService.fetchProjectSprints(key);
            const sprint = sprints.find((s: any) =>
                s.name.toLowerCase() === options.sprint.toLowerCase()
            );
            if (sprint) {
                sprintId = sprint.id;
            } else {
                console.log(chalk.yellow(`⚠️ Sprint "${options.sprint}" not found.`));
                return;
            }
        }

        console.log(`📂 Fetching issues for project: ${key} ${options.status ? 'with status: ' + options.status : ''} ${options.assignee ? 'for assignee: ' + options.assignee : ''} ${sprintId ? 'in sprint: ' + options.sprint : ''}`);

        let issues = await jiraService.fetchProjectIssues(key, { sprintId });
        if (!issues || issues.length === 0) {
            console.log("✅ No open issues found.");
            return;
        }

        if (options.status) {
            issues = issues.filter((issue: any) => issue.fields.status.name === options.status);
        }

        if (options.assignee) {
            issues = issues.filter((issue: any) => issue.fields.assignee?.displayName === options.assignee);
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
        const columnWidths = [10, 25, 40, 15, 20];

        const formattedData = issues.map((issue: any) => [
            chalk.cyan(issue.key),
            issue.fields.summary.substring(0, 40) + (issue.fields.summary.length > 40 ? '...' : ''),
            getStatusColor(issue.fields.status.name)(issue.fields.status.name),
            issue.fields.assignee?.displayName || chalk.gray('Unassigned')
        ]);

        const rows = formattedData.map((row: any, rowIndex: number) => {
            const indexNum = rowIndex + 1;
            const indexCol = chalk.white(`[${indexNum.toString().padStart(1)}]`.padEnd(10));
            const formattedRow = row.map((cell: any, i: number) => {
                const cellStr = String(cell || '');
                if (i === 0) {
                    return cellStr.padEnd(25);
                } else if (i === 1) {
                    return cellStr.padEnd(50);
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

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case 'done':
            return chalk.green;
        case 'in progress':
            return chalk.yellow;
        case 'to do':
            return chalk.white;
        case 'blocked':
            return chalk.red;
        default:
            return chalk.white;
    }
}