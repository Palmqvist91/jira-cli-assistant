import inquirer from 'inquirer';
import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { JiraService } from '../services/jira.service';
import { deleteIssueCommand } from '../commands/deleteIssue.command';

jest.mock('../services/jira.service');
jest.mock('inquirer');

interface DeleteConfirmation {
    confirm: boolean;
}

describe('deleteIssueCommand', () => {
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should delete an issue when confirmed', async () => {
        // Arrange
        (inquirer.prompt as unknown as Mock<() => Promise<DeleteConfirmation>>).mockResolvedValue({ confirm: true });
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.deleteIssue
            .mockResolvedValue({});

        // Act
        await deleteIssueCommand('TEST-1', {});

        // Assert
        expect(JiraService.prototype.deleteIssue).toHaveBeenCalledWith('TEST-1');
        expect(mockConsoleLog).toHaveBeenCalledWith('✅ Issue TEST-1 has been deleted.');
    });

    it('should cancel deletion when not confirmed', async () => {
        // Arrange
        (inquirer.prompt as unknown as Mock<() => Promise<DeleteConfirmation>>).mockResolvedValue({ confirm: false });

        // Act
        await deleteIssueCommand('TEST-1', {});

        // Assert
        expect(JiraService.prototype.deleteIssue).not.toHaveBeenCalled();
        expect(mockConsoleLog).toHaveBeenCalledWith('❌ Deletion cancelled.');
    });

    it('should handle errors when deleting an issue', async () => {
        // Arrange
        const mockError = new Error('Delete failed');
        (inquirer.prompt as unknown as Mock<() => Promise<DeleteConfirmation>>).mockResolvedValue({ confirm: true });
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.deleteIssue
            .mockRejectedValue(mockError);

        // Act
        await deleteIssueCommand('TEST-1', {});

        // Assert
        expect(mockConsoleError).toHaveBeenCalledWith(
            '🚫 Could not delete issue:',
            mockError
        );
    });
}); 