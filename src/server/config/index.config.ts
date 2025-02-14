import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";
import axios from "axios";

const configFilePath = path.join(os.homedir(), ".jira-cli-config.json");

export async function setupConfig(options: any) {
    try {
        if (!options.reset && !options.switch) {
            if (fs.existsSync(configFilePath)) {
                const realPath = fs.realpathSync(configFilePath);
                const activeProfile = path.basename(realPath, '.json');
                console.log(chalk.blue(`Active configuration profile: ${chalk.cyan(activeProfile)}`));
                console.log(chalk.yellow(`Tip: Use 'jira config --switch' to switch between profiles.\n`));
            }

            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        { name: 'Create new configuration', value: 'create' },
                        { name: 'Switch configuration', value: 'switch' },
                        { name: 'Delete configuration', value: 'delete' },
                        { name: 'Cancel', value: 'cancel' }
                    ]
                }
            ]);

            if (action === 'cancel') {
                return;
            } else if (action === 'switch') {
                options.switch = true;
                return await setupConfig(options);
            } else if (action === 'delete') {
                options.reset = true;
                return await setupConfig(options);
            } else if (action === 'create') {
                return;
            }
        }

        if (options.reset) {
            const configDir = path.join(os.homedir(), '.jira-cli');

            if (!fs.existsSync(configDir)) {
                console.log(chalk.red("❌ No configuration profiles found."));
                return;
            }

            const profiles = fs.readdirSync(configDir)
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));

            if (profiles.length === 0) {
                console.log(chalk.red("❌ No configuration profiles found."));
                return;
            }

            const { selectedProfile } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedProfile',
                    message: 'Select a configuration profile to delete:',
                    choices: profiles
                }
            ]);

            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: chalk.red(`Are you sure you want to delete profile '${selectedProfile}'?`),
                    default: false
                }
            ]);

            if (!confirm) {
                console.log(chalk.yellow("⚠️ Deletion cancelled."));
                return;
            }

            const configPath = path.join(configDir, `${selectedProfile}.json`);
            fs.unlinkSync(configPath);

            if (fs.existsSync(configFilePath)) {
                const realPath = fs.realpathSync(configFilePath);
                if (realPath === configPath) {
                    fs.unlinkSync(configFilePath);
                }
            }

            console.log(chalk.green(`✅ Configuration profile '${selectedProfile}' deleted successfully.`));
            return;
        }

        if (options.switch === true) {
            const configDir = path.join(os.homedir(), '.jira-cli');

            if (!fs.existsSync(configDir)) {
                console.log(chalk.red("❌ No configuration profiles found."));
                console.log(chalk.red("Release note (1.0.9): Reset config with --reset and create a new profile with --config to enable switching between profiles."));
                return;
            }

            const profiles = fs.readdirSync(configDir)
                .filter(file => file.endsWith('.json'))
                .map(file => file.replace('.json', ''));

            if (profiles.length === 0) {
                console.log(chalk.red("❌ No configuration profiles found."));
                return;
            }

            const { selectedProfile } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'selectedProfile',
                    message: 'Select a configuration profile:',
                    choices: profiles
                }
            ]);

            fs.unlinkSync(configFilePath);
            fs.symlinkSync(path.join(configDir, `${selectedProfile}.json`), configFilePath);
            console.log(chalk.green(`✅ Switched to configuration profile: ${selectedProfile}`));
            return;
        } else if (options.switch) {
            const configDir = path.join(os.homedir(), '.jira-cli');
            const configPath = path.join(configDir, `${options.switch}.json`);

            if (!fs.existsSync(configPath)) {
                console.log(chalk.red(`❌ Configuration profile '${options.switch}' not found.`));
                return;
            }

            fs.unlinkSync(configFilePath);
            fs.symlinkSync(configPath, configFilePath);
            console.log(chalk.green(`✅ Switched to configuration profile: ${options.switch}`));
            return;
        }

        console.log("🔧 Running setupConfig...");
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "profileName",
                message: "Enter a name for this configuration profile (default: default):",
                default: "default"
            },
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
            const configDir = path.join(os.homedir(), '.jira-cli');
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }

            const configPath = path.join(configDir, `${answers.profileName}.json`);
            fs.writeFileSync(configPath, JSON.stringify(answers, null, 2));

            if (fs.existsSync(configFilePath)) {
                fs.unlinkSync(configFilePath);
            }
            fs.symlinkSync(configPath, configFilePath);

            console.log(chalk.green(`✅ Configuration saved as profile: ${answers.profileName}`));
            console.log(chalk.blue(`ℹ️  This is now your active configuration.`));
            console.log(chalk.yellow(`💡 Tip: Use 'jira config --switch' to switch between profiles.`));
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