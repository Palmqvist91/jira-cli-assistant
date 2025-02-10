import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class JiraService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.JIRA_URL,
            auth: {
                username: process.env.JIRA_EMAIL as string,
                password: process.env.JIRA_API_TOKEN as string,
            },
        });
    }

    async fetchProjects() {
        try {
            const response = await this.client.get('/rest/api/3/project');
            return response.data;
        } catch (error) {
            throw new Error(`Could not fetch projects: ${(error as Error).message}`);
        }
    }

    async fetchIssues(projectKey: string) {
        try {
            const response = await this.client.get(`/rest/api/3/search?jql=project=${projectKey}`);
            return response.data.issues;
        } catch (error) {
            throw new Error(`Could not fetch issues: ${(error as Error).message}`);
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

    async updateIssue(issueKey: string, summary: string, description: string, issueType: string) {
        try {
            await this.client.put(`/rest/api/3/issue/${issueKey}`, {
                fields: {
                    summary,
                    description,
                    issuetype: { name: issueType },
                },
            });
        } catch (error) {
            throw new Error(`Could not update issue: ${(error as Error).message}`);
        }
    }

    async deleteIssue(issueKey: string) {
        try {
            await this.client.delete(`/rest/api/3/issue/${issueKey}`);
        } catch (error) {
            throw new Error(`Could not delete issue: ${(error as Error).message}`);
        }
    }

    async addComment(issueKey: string, comment: string) {
        try {
            await this.client.post(`/rest/api/3/issue/${issueKey}/comment`, {
                body: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [{ type: 'text', text: comment }],
                        },
                    ],
                },
            });
        } catch (error) {
            throw new Error(`Could not add comment: ${(error as Error).message}`);
        }
    }
}

export default new JiraService();