import chalk from "chalk";
import { JiraService } from "../services/jira.service";
import { getProjectKeyHelper } from "../helper/getProjectKey.helper";
import { formatTable } from "../config/index.config";

export async function listProjectSprintsCommand(projectKey: string) {
    try {
        const jiraService = new JiraService();
        const key = await getProjectKeyHelper(projectKey);

        console.log(`📅 Fetching sprints for project: ${key}`);
        const sprints = await jiraService.fetchProjectSprints(key);

        if (!sprints || sprints.length === 0) {
            console.log(chalk.yellow("🚫 No sprints found for this project."));
            return;
        }

        const headers = ['Index', 'Name', 'State', 'Start Date', 'End Date'];
        const columnWidths = [10, 30, 15, 20, 20];

        const formattedData = sprints.map((sprint: any) => [
            chalk.cyan(sprint.name),
            getSprintStateColor(sprint.state)(sprint.state),
            sprint.startDate ? chalk.yellow(new Date(sprint.startDate).toLocaleDateString()) : chalk.gray('N/A'),
            sprint.endDate ? chalk.yellow(new Date(sprint.endDate).toLocaleDateString()) : chalk.gray('N/A')
        ]);

        const rows = formattedData.map((row: any, rowIndex: number) => {
            const indexNum = rowIndex + 1;
            const indexCol = chalk.white(`[${indexNum.toString().padStart(1)}]`.padEnd(10));
            const formattedRow = row.map((cell: any, i: number) => {
                const cellStr = String(cell || '');
                if (i === 0) return cellStr.padEnd(40);
                if (i === 1) return cellStr.padEnd(25);
                return cellStr.padEnd(30);
            }).join('');
            return `${indexCol}${formattedRow}`;
        });

        console.log(formatTable(headers, rows, columnWidths));
    } catch (error) {
        console.error(chalk.red("🚫 Could not fetch sprints:", (error as Error).message));
    }
}

function getSprintStateColor(state: string) {
    switch (state.toLowerCase()) {
        case 'active':
            return chalk.green;
        case 'future':
            return chalk.blue;
        case 'closed':
            return chalk.gray;
        default:
            return chalk.white;
    }
} 