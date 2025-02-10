import { JiraService } from '@server/services/jira.service';

export async function listProjectsCommand() {
    const jira = new JiraService();

    try {
        const projects = await jira.fetchProjects();
        console.log(`Found ${projects.length} projects:\n`);

        projects.forEach((project: { key: string; name: string }) => {
            console.log(`- ${project.key}: ${project.name}`);
        });
    } catch (error) {
        console.error((error as Error).message);
    }
}