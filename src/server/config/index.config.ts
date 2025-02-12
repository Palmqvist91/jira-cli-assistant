import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

const configFilePath = path.join(os.homedir(), ".jira-cli-config.json");

export async function setupConfig() {
    try {
        console.log("🔧 Running setupConfig...");
        const answers = await inquirer.prompt([
            { type: "input", name: "jiraUrl", message: "Enter your JIRA URL (e.g., https://yourcompany.atlassian.net):" },
            { type: "input", name: "jiraEmail", message: "Enter your JIRA email:" },
            { type: "password", name: "jiraToken", message: "Enter your JIRA API token:" }
        ]);

        fs.writeFileSync(configFilePath, JSON.stringify(answers, null, 2));
        console.log(`✅ Configuration saved to ${configFilePath}`);
    }
    catch (error) {
        console.error("🚫 An error occurred while setting up your configuration.");
    }
}

export function getConfig() {
    if (!fs.existsSync(configFilePath)) {
        console.error("🚫 No configuration found. Please run `jira-cli config` to set up your environment.");
        process.exit(1);
    }
    return JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
}

export function formatTable(headers: string[], rows: string[], columnWidths: number[]) {
    const headerLine = headers.map((header, i) =>
        chalk.blue(header.padEnd(columnWidths[i]))
    ).join('');

    return `\n${headerLine}\n${rows.join('\n')}`;
}