import inquirer from 'inquirer';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { JiraService } from '../services/jira.service';
import { updateIssueCommand } from '../commands/updateIssue.command';

jest.mock('../services/jira.service');
jest.mock('inquirer');

interface UpdateUserInput {
    summary: string;
    status: string;
    assignee: string;
}

describe('updateIssueCommand', () => {
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update an issue with provided options', async () => {
        // Arrange
        const mockCurrentIssue = {
            fields: {
                summary: 'Old Summary',
                status: { name: 'To Do' },
                assignee: { accountId: 'old-assignee-id' }
            }
        };

        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockResolvedValue(mockCurrentIssue);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getProjectStatuses
            .mockResolvedValue(['To Do', 'In Progress', 'Done']);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getAssignableUsers
            .mockResolvedValue([{ name: 'New Assignee', value: 'new-assignee-id' }]);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.updateIssue
            .mockResolvedValue({ message: 'Success' });

        // Act
        await updateIssueCommand('TEST-1', {
            summary: 'New Summary',
            status: 'In Progress',
            assignee: 'New Assignee'
        });

        // Assert
        expect(JiraService.prototype.updateIssue).toHaveBeenCalledWith(
            'TEST-1',
            'New Summary',
            'In Progress',
            'new-assignee-id'
        );
        expect(mockConsoleLog).toHaveBeenCalledWith('✅ Issue TEST-1 has been updated.');
    });

    it('should handle interactive update when no options provided', async () => {
        // Arrange
        const mockCurrentIssue = {
            fields: {
                summary: 'Old Summary',
                status: { name: 'To Do' },
                assignee: { accountId: 'old-assignee-id' }
            }
        };

        const mockUserInput = {
            summary: 'Interactive Summary',
            status: 'In Progress',
            assignee: 'new-assignee-id'
        };

        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockResolvedValue(mockCurrentIssue);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getProjectStatuses
            .mockResolvedValue(['To Do', 'In Progress', 'Done']);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getAssignableUsers
            .mockResolvedValue([{ name: 'New Assignee', value: 'new-assignee-id' }]);
        (inquirer.prompt as unknown as Mock<() => Promise<UpdateUserInput>>)
            .mockResolvedValueOnce({ summary: mockUserInput.summary } as UpdateUserInput)
            .mockResolvedValueOnce({ status: mockUserInput.status } as UpdateUserInput)
            .mockResolvedValueOnce({ assignee: mockUserInput.assignee } as UpdateUserInput);

        // Act
        await updateIssueCommand('TEST-1', {});

        // Assert
        expect(JiraService.prototype.updateIssue).toHaveBeenCalledWith(
            'TEST-1',
            mockUserInput.summary,
            mockUserInput.status,
            mockUserInput.assignee
        );
    });

    it('should handle invalid issue key', async () => {
        // Arrange
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockResolvedValue(null);

        // Act
        await updateIssueCommand('INVALID-1', {});

        // Assert
        expect(JiraService.prototype.updateIssue).not.toHaveBeenCalled();
    });

    it('should handle errors when updating an issue', async () => {
        // Arrange
        const mockError = new Error('Update failed');
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockRejectedValue(mockError);

        // Act
        await updateIssueCommand('TEST-1', {});

        // Assert
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not fetch issue TEST-1:',
            mockError
        );
    });

    it('should handle invalid assignee', async () => {
        // Arrange
        const mockCurrentIssue = {
            fields: {
                summary: 'Old Summary',
                status: { name: 'To Do' },
                assignee: { accountId: 'old-assignee-id' }
            }
        };

        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockResolvedValue(mockCurrentIssue);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getProjectStatuses
            .mockResolvedValue(['To Do', 'In Progress', 'Done']);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getAssignableUsers
            .mockResolvedValue([{ name: 'Other Assignee', value: 'other-assignee-id' }]);

        // Act
        await updateIssueCommand('TEST-1', {
            summary: 'New Summary',
            status: 'In Progress',
            assignee: 'Invalid Assignee'
        });

        // Assert
        expect(JiraService.prototype.updateIssue).not.toHaveBeenCalled();
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not update issue:',
            expect.any(Error)
        );
    });
}); 