import dotenv from 'dotenv';
import axios, { AxiosInstance } from 'axios';
import { getConfig } from '../config/index.config';

dotenv.config();

const ENVIRONMENT = process.env.ENVIRONMENT;

export class JiraService {
    private client: AxiosInstance;

    constructor(skipConfigCheck: boolean = false) {
        if (!skipConfigCheck) {
            const config = getConfig();
            if (!config && process.env.ENVIRONMENT !== 'development') {
                throw new Error('No configuration found. Please run `jira-cli config` to set up your environment.');
            }

            this.client = axios.create({
                baseURL: ENVIRONMENT === 'development' ? process.env.JIRA_URL : config?.jiraUrl,
                auth: {
                    username: ENVIRONMENT === 'development' ? process.env.JIRA_EMAIL : config?.jiraEmail,
                    password: ENVIRONMENT === 'development' ? process.env.JIRA_API_TOKEN : config?.jiraToken,
                },
            });
        }
    }

    async fetchAllProjects() {
        try {
            const response = await this.client.get('/rest/api/3/project');
            return response.data;
        } catch (error) {
            console.error("🚫 Could not fetch projects:", error);
            return [];
        }
    }

    async fetchProjectIssues(projectKey: string) {
        try {
            const response = await this.client.get(`/rest/api/3/search?jql=project=${projectKey}`);
            return response.data.issues;
        } catch (error) {
            console.error(`🚫 Could not fetch issues for project ${projectKey}:`, error);
            return [];
        }
    }

    async fetchSingleIssue(issueKey: string) {
        try {
            const response = await this.client.get(`/rest/api/3/issue/${issueKey}`);
            return response.data;
        } catch (error) {
            console.error(`🚫 Could not fetch issue ${issueKey}:`, error);
            return null;
        }
    }

    async createIssue(projectKey: string, summary: string, description: string, issueType: string) {
        try {
            const response = await this.client.post('/rest/api/3/issue', {
                fields: {
                    project: { key: projectKey },
                    summary,
                    description,
                    issuetype: { name: issueType },
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(`Could not create issue: ${(error as Error).message}`);
        }
    }

    async updateIssue(issueKey: string, summary: string, status: string, assignee: string) {
        try {
            const payload = {
                fields: {
                    summary,
                    assignee: { id: assignee }
                },
            };

            await this.client.put(`/rest/api/3/issue/${issueKey}`, payload);

            const transitionsResponse = await this.client.get(`/rest/api/3/issue/${issueKey}/transitions`);
            const transitions = transitionsResponse.data.transitions;
            const transition = transitions.find((t: any) => t.to.name === status);

            if (!transition) {
                throw new Error(`Status '${status}' is not a valid transition for this issue.`);
            }

            await this.client.post(`/rest/api/3/issue/${issueKey}/transitions`, {
                transition: { id: transition.id }
            });

            return { message: `Issue ${issueKey} updated successfully.` };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("🚫 Could not update issue:", error.response.data);
            } else {
                console.error("🚫 Could not update issue:", error);
            }
            throw new Error(`Could not update issue: ${(error as Error).message}`);
        }
    }

    async deleteIssue(issueKey: string) {
        try {
            const response = await this.client.delete(`/rest/api/3/issue/${issueKey}`);
            return response.data;
        } catch (error) {
            throw new Error(`Could not delete issue: ${(error as Error).message}`);
        }
    }

    async addComment(issueKey: string, comment: string) {
        try {
            const response = await this.client.post(`/rest/api/3/issue/${issueKey}/comment`, {
                body: comment,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Could not add comment: ${(error as Error).message}`);
        }
    }

    async getProjectStatuses(projectKey: string): Promise<string[]> {
        try {
            const response = await this.client.get<{ statuses: { name: string }[] }[]>(`/rest/api/3/project/${projectKey}/statuses`, {
                headers: { 'Accept': 'application/json' }
            });
            const statuses = response.data
                .flatMap(issueType => issueType.statuses.map(status => status.name));

            return [...new Set(statuses)];
        } catch (error) {
            console.error("🚫 Could not fetch project statuses:", error);
            throw error;
        }
    }

    async getAssignableUsers(issueKey: string) {
        try {
            const response = await this.client.get(`/rest/api/3/user/assignable/search`, {
                params: { issueKey }
            });
            return response.data.map((user: any) => ({
                name: user.displayName,
                value: user.accountId
            }));
        } catch (error) {
            console.error("🚫 Could not fetch assignable users:", error);
            return [];
        }
    }
}

export default JiraService;