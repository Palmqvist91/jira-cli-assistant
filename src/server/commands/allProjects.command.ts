import chalk from "chalk";
import { formatTable } from "../config/index.config";
import { JiraService } from "../services/jira.service";

export async function allProjectsCommand() {
    try {
        const jiraService = new JiraService();
        const projects = await jiraService.fetchAllProjects();
        if (projects.length === 0) {
            console.log(chalk.red("🚫 No projects found."));
            return;
        }

        projects.sort((a: any, b: any) => a.key.localeCompare(b.key));

        const headers = ['Index', 'Key', 'Name', 'Lead'];
        const columnWidths = [
            10,
            15,
            35,
            10
        ];

        const formattedData = projects.map((project: any) => [
            chalk.cyan(project.key),
            project.name || '',
            project.lead?.displayName || 'N/A'
        ]);

        const rows = formattedData.map((row: any, rowIndex: number) => {
            const indexNum = rowIndex + 1;
            const indexCol = chalk.white(`[${indexNum.toString().padStart(1)}]`.padEnd(10));
            const formattedRow = row.map((cell: any, i: number) => {
                const cellStr = String(cell || '');
                if (i === 0) {
                    return cellStr.padEnd(25);
                } else if (i === 1) {
                    return cellStr.padEnd(35);
                } else {
                    return cellStr;
                }
            }).join('');
            return `${indexCol}${formattedRow}`;
        });

        console.log(formatTable(headers, rows, columnWidths));
    } catch (error) {
        console.error(chalk.red("🚫 Could not fetch projects:", (error as Error).message));
    }
}