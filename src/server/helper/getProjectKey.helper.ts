import inquirer from "inquirer";
import { JiraService } from "../services/jira.service";

export async function getProjectKeyHelper(projectKey?: string): Promise<string> {
    const jiraService = new JiraService();
    const projects = await jiraService.fetchAllProjects();

    if (!projects.length) {
        console.error("🚫 No projects found.");
        process.exit(1);
    }

    if (projectKey) {
        const upperProjectKey = projectKey.toUpperCase();
        const projectExists = projects.some((project: any) => project.key === upperProjectKey);

        if (!projectExists) {
            console.error(`🚫 Project KEY "${upperProjectKey}" does not exist.`);
            console.log("Please select from available projects:");
            return promptForProject(projects);
        }
        return upperProjectKey;
    } else {
        console.log("❓ No project KEY provided. Please select a project:");
        return promptForProject(projects);
    }
}

async function promptForProject(projects: any[]): Promise<string> {
    const { selectedProject } = await inquirer.prompt([
        {
            type: "list",
            name: "selectedProject",
            message: "Select a project:",
            choices: projects.map((project: any) => ({
                name: `${project.key} - ${project.name}`,
                value: project.key,
            })),
        },
    ]);

    return selectedProject;
}