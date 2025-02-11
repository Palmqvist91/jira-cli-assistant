import { jest } from '@jest/globals';
import { allProjectsCommand } from '../commands/allProjects.command';
import { JiraService } from '../services/jira.service';
import chalk from 'chalk';

// Mock the entire JiraService
jest.mock('../services/jira.service');

// Mock console.log and console.error
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

describe('allProjectsCommand', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should display projects when they exist', async () => {
        // Arrange
        const mockProjects = [
            {
                key: 'TEST',
                name: 'Test Project',
                lead: { displayName: 'John Doe' }
            }
        ];

        // Mock implementation of fetchAllProjects
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchAllProjects
            .mockResolvedValue(mockProjects);

        // Act
        await allProjectsCommand();

        // Assert
        expect(mockConsoleLog).toHaveBeenCalled();
        expect(mockConsoleError).not.toHaveBeenCalled();
    });

    it('should handle empty projects list', async () => {
        // Arrange
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchAllProjects
            .mockResolvedValue([]);

        // Act
        await allProjectsCommand();

        // Assert
        expect(mockConsoleLog).toHaveBeenCalledWith(chalk.red('🚫 No projects found.'));
    });

    it('should handle errors', async () => {
        // Arrange
        const error = new Error('API Error');
        (JiraService as jest.MockedClass<typeof JiraService>).prototype.fetchAllProjects
            .mockRejectedValue(error);

        // Act
        await allProjectsCommand();

        // Assert
        expect(mockConsoleError).toHaveBeenCalledWith(
            chalk.red('🚫 Could not fetch projects:', error.message)
        );
    });
}); 