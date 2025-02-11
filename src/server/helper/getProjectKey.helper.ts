import JiraService from "../services/jira.service";
import inquirer from "inquirer";

export async function getProjectKey(projectKey?: string): Promise<string> {
    const jiraService = new JiraService();

    if (projectKey) {
        return projectKey;
    }

    console.log("❓ No projectKey provided. Fetching all projects...");

    const projects = await jiraService.fetchProjects();
    if (!projects.length) {
        console.error("🚫 No projects found.");
        process.exit(1);
    }

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