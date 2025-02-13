import inquirer from 'inquirer';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { JiraService } from '../services/jira.service';
import { createIssueCommand } from '../commands/createIssue.command';
import { getProjectKeyHelper } from '../helper/getProjectKey.helper';

interface UserInput {
    summary: string;
    issueType: string;
}

jest.mock('../services/jira.service');
jest.mock('inquirer');
jest.mock('../helper/getProjectKey.helper');

describe('createIssueCommand', () => {
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an issue successfully with valid project key', async () => {
        // Arrange
        const mockUserInput: UserInput = {
            summary: 'Test Issue',
            issueType: 'Task'
        };

        const mockCreatedIssue = {
            key: 'TEST-1'
        };

        (getProjectKeyHelper as jest.Mock).mockResolvedValue('TEST' as never);
        (inquirer.prompt as unknown as Mock<() => Promise<UserInput>>).mockResolvedValue(mockUserInput);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.createIssue
            .mockResolvedValue(mockCreatedIssue);

        // Act
        await createIssueCommand('TEST', { summary: 'Test Issue', issueType: 'Task' });

        // Assert
        expect(getProjectKeyHelper).toHaveBeenCalledWith('TEST');
        expect(JiraService.prototype.createIssue).toHaveBeenCalledWith(
            'TEST',
            mockUserInput.summary,
            mockUserInput.issueType
        );
        expect(mockConsoleLog).toHaveBeenCalledWith(
            `✅ Issue ${mockCreatedIssue.key} has been created.`
        );
    });

    it('should handle invalid project key and use selected project from prompt', async () => {
        // Arrange
        const mockUserInput: UserInput = {
            summary: 'Test Issue',
            issueType: 'Task'
        };

        const mockCreatedIssue = {
            key: 'VALID-1'
        };

        // Mock getProjectKey to simulate user selecting a valid project
        (getProjectKeyHelper as jest.Mock).mockResolvedValue('VALID' as never);
        (inquirer.prompt as unknown as Mock<() => Promise<UserInput>>).mockResolvedValue(mockUserInput);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.createIssue
            .mockResolvedValue(mockCreatedIssue);

        // Act
        await createIssueCommand('INVALID', { summary: 'Test Issue', issueType: 'Task' });

        // Assert
        expect(getProjectKeyHelper).toHaveBeenCalledWith('INVALID');
        expect(JiraService.prototype.createIssue).toHaveBeenCalledWith(
            'VALID', // Should use the project key returned from getProjectKey
            mockUserInput.summary,
            mockUserInput.issueType
        );
        expect(mockConsoleLog).toHaveBeenCalledWith(
            `✅ Issue ${mockCreatedIssue.key} has been created.`
        );
    });

    it('should handle errors when creating an issue', async () => {
        // Arrange
        const mockError = new Error('Failed to create issue');
        const mockUserInput: UserInput = {
            summary: 'Test Issue',
            issueType: 'Task'
        };

        (getProjectKeyHelper as jest.Mock).mockResolvedValue('TEST' as never);
        (inquirer.prompt as unknown as Mock<() => Promise<UserInput>>).mockResolvedValue(mockUserInput);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.createIssue
            .mockRejectedValue(mockError);

        // Act
        await createIssueCommand('TEST', { summary: 'Test Issue', issueType: 'Task' });

        // Assert
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not create issue:',
            mockError
        );
    });

    it('should handle errors from getProjectKey', async () => {
        // Arrange
        const mockError = new Error('Invalid project key');
        (getProjectKeyHelper as jest.Mock).mockRejectedValue(mockError as never);

        // Act
        await createIssueCommand('INVALID', { summary: 'Test Issue', issueType: 'Task' });

        // Assert
        expect(getProjectKeyHelper).toHaveBeenCalledWith('INVALID');
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not create issue:',
            mockError
        );
    });
}); 