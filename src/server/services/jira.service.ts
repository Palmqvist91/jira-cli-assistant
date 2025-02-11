import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
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

    async fetchIssues(projectKey: string) {
        try {
            const response = await this.client.get(`/rest/api/3/search?jql=project=${projectKey}`);
            return response.data.issues;
        } catch (error) {
            console.error(`🚫 Could not fetch issues for project ${projectKey}:`, error);
            return [];
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
            const response = await this.client.put(`/rest/api/3/issue/${issueKey}`, {
                fields: {
                    summary,
                    description,
                    issuetype: { name: issueType },
                },
            });
            return response.data;
        } catch (error) {
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
}

export default JiraService;