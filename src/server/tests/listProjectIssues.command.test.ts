import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { JiraService } from '../services/jira.service';
import { getProjectKeyHelper } from '../helper/getProjectKey.helper';
import { listProjectIssuesCommand } from '../commands/listProjectIssues.command';

// Mock the entire JiraService
jest.mock('../services/jira.service');
jest.mock('../helper/getProjectKey.helper');

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

type GetProjectKeyType = (projectKey?: string) => Promise<string>;

describe('listProjectIssuesCommand', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should display issues when they exist', async () => {
        // Arrange
        const mockIssues = [
            {
                key: 'TEST-1',
                fields: {
                    summary: 'Test Issue 1',
                    status: { name: 'Open' },
                    assignee: { displayName: 'John Doe' }
                }
            }
        ];

        (getProjectKeyHelper as Mock<GetProjectKeyType>).mockResolvedValue('TEST');
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchProjectIssues
            .mockResolvedValue(mockIssues);

        // Act
        await listProjectIssuesCommand('TEST', {});

        // Assert
        expect(mockConsoleLog).toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle empty issues list', async () => {
        // Arrange
        (getProjectKeyHelper as Mock<GetProjectKeyType>).mockResolvedValue('TEST');
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchProjectIssues
            .mockResolvedValue([]);

        // Act
        await listProjectIssuesCommand('TEST', {});

        // Assert
        expect(mockConsoleLog).toHaveBeenCalledWith('✅ No open issues found.');
    });

    it('should handle errors', async () => {
        // Arrange
        const error = new Error('API Error');
        (getProjectKeyHelper as Mock<GetProjectKeyType>).mockResolvedValue('TEST');
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchProjectIssues
            .mockRejectedValue(error);

        // Act
        await listProjectIssuesCommand('TEST', {});

        // Assert
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not fetch issues:',
            error
        );
    });
}); 