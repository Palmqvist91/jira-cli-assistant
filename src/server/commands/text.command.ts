import chalk from "chalk";

export async function helpText() {
  console.log(`
                ${chalk.bold('Welcome to Jira CLI Assistant!')} 🚀
                                    
                         by PrHiGo

    ${chalk.yellow('Here are some example commands you can run:')}
    - ('jira project list')                    ${chalk.dim('List all projects')}
    - ('jira project sprints')} ${chalk.cyan('<projectKey>')}   ${chalk.dim('List all sprints for a project')}
    - ('jira issue list')} ${chalk.cyan('<projectKey>')}        ${chalk.dim('List issues in a project')}
    - ('jira issue create')} ${chalk.cyan('<projectKey>')}      ${chalk.dim('Create a new issue')}
    - ('jira issue update')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Update an issue')}
    - ('jira issue delete')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Delete an issue')}


    Usage:
    $ jira <resource> <command> [options]

    Resources and Commands:
    project
      list                          ${chalk.dim('List all JIRA projects')}
      sprint ${chalk.cyan('<projectKey>')}           ${chalk.dim('List all sprints for a project')}

    issue
      list ${chalk.cyan('<projectKey>')}             ${chalk.dim('List issues in a project')}
        -s, --status ${chalk.cyan('<status>')}       ${chalk.dim('Filter issues by status')}
        -a, --assignee ${chalk.cyan('<assignee>')}   ${chalk.dim('Filter issues by assignee')}
        --sprint ${chalk.cyan('<sprint>')}           ${chalk.dim('Filter issues by sprint name or ID')}
      create ${chalk.cyan('<projectKey>')}           ${chalk.dim('Create a new issue')}  
        -m, --summary ${chalk.cyan('<summary>')}     ${chalk.dim('Set the summary')}
        -t, --issueType ${chalk.cyan('<type>')}      ${chalk.dim('Set the issue type')}
      update ${chalk.cyan('<issueKey>')}             ${chalk.dim('Update an issue')}
        -s, --status ${chalk.cyan('<status>')}       ${chalk.dim('Set the status')}
        -a, --assignee ${chalk.cyan('<assignee>')}   ${chalk.dim('Set the assignee')}
        -m, --summary ${chalk.cyan('<summary>')}     ${chalk.dim('Update the summary')}
      delete ${chalk.cyan('<issueKey>')}             ${chalk.dim('Delete an issue')}
        --force                     ${chalk.dim('Force delete without confirmation')}

    config                          ${chalk.dim('Set up your JIRA configuration')}

    Examples:
    $ jira projects list
    $ jira issue list ${chalk.cyan('<projectKey>')} --status ${chalk.cyan('<status>')}
    $ jira issue create ${chalk.cyan('<projectKey>')} --summary ${chalk.cyan('<summary>')} --issueType ${chalk.cyan('<type>')}
    $ jira issue update ${chalk.cyan('<issueKey>')} --status ${chalk.cyan('<status>')}
    $ jira issue delete ${chalk.cyan('<issueKey>')} --force

    For more information on a specific command, run:
    $ jira <resource> <command> --help
    `);
}

export async function welcomText() {
  console.log(`
                ${chalk.bold('Welcome to Jira CLI Assistant!')} 🚀
        
                         by PrHiGo

  ${chalk.yellow('Here are some example commands you can run:')}
  - ('jira project list')}                   ${chalk.dim('List all projects')}
  - ('jira project sprints')} ${chalk.cyan('<projectKey>')}   ${chalk.dim('List all sprints for a project')}
  - ('jira issue list')} ${chalk.cyan('<projectKey>')}        ${chalk.dim('List open issues for a project')}
  - ('jira issue create')} ${chalk.cyan('<projectKey>')}      ${chalk.dim('Create a new issue')}
  - ('jira issue update')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Update an existing issue')}
  - ('jira issue delete')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Delete an issue')}

            ${chalk.yellow('For more information, run: jira help')}
`);
}