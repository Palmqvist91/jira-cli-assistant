import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";
import axios from "axios";

const configFilePath = path.join(os.homedir(), ".jira-cli-config.json");

export async function setupConfig(this: any, options: any) {
    try {
        if (options.reset) {
            fs.unlinkSync(configFilePath);
            console.log("🔧 Configuration reset successfully.");
            return;
        }

        console.log("🔧 Running setupConfig...");
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "jiraUrl",
                message: "Enter your JIRA URL (e.g., https://yourcompany.atlassian.net):",
                validate: (input: string) => {
                    try {
                        new URL(input);
                        return true;
                    } catch {
                        return 'Please enter a valid URL';
                    }
                }
            },
            {
                type: "input",
                name: "jiraEmail",
                message: "Enter your JIRA email:",
                validate: (input: string) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(input) ? true : 'Please enter a valid email address';
                }
            },
            {
                type: "password",
                name: "jiraToken",
                message: "Enter your JIRA API token:",
                validate: (input: string) => {
                    return input.length >= 24 ? true : 'API token should be at least 24 characters long';
                }
            }
        ]);

        const jiraService = new JiraService(true);
        jiraService['client'] = axios.create({
            baseURL: answers.jiraUrl,
            auth: {
                username: answers.jiraEmail,
                password: answers.jiraToken,
            },
        });

        try {
            await jiraService['client'].get('/rest/api/3/myself');
            fs.writeFileSync(configFilePath, JSON.stringify(answers, null, 2));
            console.log(chalk.green("✅ Configuration saved successfully."));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.error(chalk.red("🚫 Authentication failed: Invalid email or API token."));
                } else if (error.response?.status === 404) {
                    console.error(chalk.red("🚫 Could not connect to JIRA: Invalid URL."));
                } else {
                    console.error(chalk.red(`🚫 JIRA API error: ${error.response?.statusText || error.message}`));
                }
            } else {
                console.error(chalk.red("🚫 An unexpected error occurred:", (error as Error).message));
            }
            process.exit(1);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(chalk.red(`🚫 Configuration error: ${error.message}`));
        } else {
            console.error(chalk.red("🚫 An unexpected error occurred during configuration."));
        }
        process.exit(1);
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