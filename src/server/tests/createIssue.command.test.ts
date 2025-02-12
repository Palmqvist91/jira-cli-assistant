import { createIssueCommand } from '../commands/createIssue.command';
import { JiraService } from '../services/jira.service';
import inquirer from 'inquirer';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';

interface UserInput {
    summary: string;
    issueType: string;
}

jest.mock('../services/jira.service');
jest.mock('inquirer');

describe('createIssueCommand', () => {
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an issue successfully', async () => {
        // Arrange
        const mockUserInput: UserInput = {
            summary: 'Test Issue',
            issueType: 'Task'
        };

        const mockCreatedIssue = {
            key: 'TEST-1'
        };

        (inquirer.prompt as unknown as Mock<() => Promise<UserInput>>).mockResolvedValue(mockUserInput);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.createIssue
            .mockResolvedValue(mockCreatedIssue);

        // Act
        await createIssueCommand('TEST', { summary: 'Test Issue', issueType: 'Task' });

        // Assert
        expect(JiraService.prototype.createIssue).toHaveBeenCalledWith(
            'TEST',
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
}); 