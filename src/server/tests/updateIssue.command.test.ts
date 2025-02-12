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

    it('should update an issue successfully', async () => {
        // Arrange
        const mockCurrentIssue = {
            fields: {
                summary: 'Old Summary',
                assignee: { displayName: 'Old Assignee' }
            }
        };

        const mockUserInput: UpdateUserInput = {
            summary: 'New Summary',
            status: 'In Progress',
            assignee: 'New Assignee'
        };

        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchSingleIssue
            .mockResolvedValue(mockCurrentIssue);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getProjectStatuses
            .mockResolvedValue(['To Do', 'In Progress', 'Done']);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.getAssignableUsers
            .mockResolvedValue([{ name: 'New Assignee', value: 'new-assignee-id' }]);
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.updateIssue
            .mockResolvedValue({ message: 'Success' });
        (inquirer.prompt as unknown as Mock<() => Promise<UpdateUserInput>>).mockResolvedValue(mockUserInput);

        // Act
        await updateIssueCommand('TEST-1', { summary: 'New Summary', status: 'In Progress', assignee: 'New Assignee' });

        // Assert
        expect(JiraService.prototype.updateIssue).toHaveBeenCalledWith(
            'TEST-1',
            'New Summary',
            'In Progress',
            'new-assignee-id'
        );
        expect(mockConsoleLog).toHaveBeenCalledWith('✅ Issue TEST-1 has been updated.');
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
            '🚫 Could not update issue:',
            mockError
        );
    });
}); 