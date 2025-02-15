import chalk from "chalk";
import { getConfig } from "../config/index.config";
export async function checkStatusCommand() {
    const config = getConfig();
    if (!config) {
        console.error("🚫 No configuration found. Please run `jira config` to set up your environment.");
        return;
    }

    console.log(`Active profile: ${chalk.cyan(config.profileName)} ✅`);
}