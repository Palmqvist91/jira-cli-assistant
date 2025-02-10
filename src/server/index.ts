import express from "express";
import dotenv from "dotenv";
import { engine } from 'express-handlebars';
import { apiRouter, viewRouter } from "@server/routes/index.routes";
import path from "path";
import { program } from "commander";
import {
    listIssuesCommand,
    createIssueCommand,
    updateIssueCommand,
    deleteIssueCommand,
    addCommentCommand,
    listProjectsCommand
} from "@server/commands/index.command";

dotenv.config();

program
    .name("jira-cli-assistant")
    .version("1.0.0")
    .description("A CLI tool for Jira");

// List projects
program
    .command('projects')
    .description('Lists all JIRA projects')
    .action(listProjectsCommand);

// List issues
program
    .command('list <projectKey>')
    .description('Lists open issues for a specific JIRA project')
    .action(listIssuesCommand);

// Create a new issue
program
    .command('create <projectKey>')
    .description('Creates a new issue in a specific project')
    .action(createIssueCommand);

// Update an issue
program
    .command('update <issueKey>')
    .description('Updates a specific issue')
    .action(updateIssueCommand);

// Delete an issue
program
    .command('delete <issueKey>')
    .description('Deletes a specific issue')
    .action(deleteIssueCommand);

// Add comment
program
    .command('comment <issueKey>')
    .description('Adds a comment to a specific issue')
    .action(addCommentCommand);

program.parse(process.argv);

const port = process.env.PORT || 3000;
const app = express();

app.engine('hbs', engine({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../client/views/layouts'),
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client/views'));

app.use(express.static(path.join(__dirname, '../client/views/public')));

app.use('/', viewRouter);
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

export { app };