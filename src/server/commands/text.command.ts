import chalk from "chalk";

export async function helpText() {
  console.log(`
                    ${chalk.bold('Welcome to Jira CLI Assistant!')} 🚀
                                        
                              by PrHiGo

    Here are some example commands you can run:

    - ('jira status')                          ${chalk.dim('Check JIRA profile status')}
    - ('jira list projects')                   ${chalk.dim('List all projects')}
    - ('jira list sprints')} ${chalk.cyan('<projectKey>')}      ${chalk.dim('List all sprints for a project')}
    - ('jira list issues')} ${chalk.cyan('<projectKey>')}       ${chalk.dim('List issues in a project')}
    - ('jira create issue')} ${chalk.cyan('<projectKey>')}      ${chalk.dim('Create a new issue')}
    - ('jira update issue')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Update an issue')}
    - ('jira delete issue')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Delete an issue')}


    Usage:
    $ jira <verb> <resource> [options]

    Set up your JIRA configuration:
    $ jira config
    
    Switch between profiles:
    $ jira config --switch <profileName>
    $ jira config --reset

    Check JIRA profile status:
    $ jira status

    Resources and Commands:
    list
      projects                      ${chalk.dim('List all JIRA projects')}
      sprints ${chalk.cyan('<projectKey>')}          ${chalk.dim('List all sprints for a project')}
      issues ${chalk.cyan('<projectKey>')}           ${chalk.dim('List issues in a project')}
        -s, --status ${chalk.cyan('<status>')}       ${chalk.dim('Filter issues by status')}
        -a, --assignee ${chalk.cyan('<assignee>')}   ${chalk.dim('Filter issues by assignee')}
        --sprint ${chalk.cyan('<sprint>')}           ${chalk.dim('Filter issues by sprint name or ID')}

    create
      issue ${chalk.cyan('<projectKey>')}            ${chalk.dim('Create a new issue')}  
        -m, --summary ${chalk.cyan('<summary>')}     ${chalk.dim('Set the summary')}
        -t, --issueType ${chalk.cyan('<type>')}      ${chalk.dim('Set the issue type')}

    update
      issue ${chalk.cyan('<issueKey>')}              ${chalk.dim('Update an issue')}
        -s, --status ${chalk.cyan('<status>')}       ${chalk.dim('Set the status')}
        -a, --assignee ${chalk.cyan('<assignee>')}   ${chalk.dim('Set the assignee')}
        -m, --summary ${chalk.cyan('<summary>')}     ${chalk.dim('Update the summary')}

    delete
      issue ${chalk.cyan('<issueKey>')}              ${chalk.dim('Delete an issue')}
        --force                     ${chalk.dim('Force delete without confirmation')}

    config                          ${chalk.dim('Set up your JIRA configuration')}

    Examples:
    $ jira list projects
    $ jira list issues ${chalk.cyan('<projectKey>')} --status ${chalk.cyan('<status>')}
    $ jira create issue ${chalk.cyan('<projectKey>')} --summary ${chalk.cyan('<summary>')} --issueType ${chalk.cyan('<type>')}
    $ jira update issue ${chalk.cyan('<issueKey>')} --status ${chalk.cyan('<status>')}
    $ jira delete issue ${chalk.cyan('<issueKey>')} --force

    For more information on a specific command, run:
    $ jira <verb> <resource> --help
    `);
}

export async function welcomText() {
  console.log(`
                ${chalk.bold('Welcome to Jira CLI Assistant!')} 🚀
        
                         by PrHiGo

  ${chalk.yellow('Here are some example commands you can run:')}

  - ('jira status')                          ${chalk.dim('Check JIRA profile status')}
  - ('jira list projects')                   ${chalk.dim('List all projects')}
  - ('jira list sprints')} ${chalk.cyan('<projectKey>')}   ${chalk.dim('List all sprints for a project')}
  - ('jira list issues')} ${chalk.cyan('<projectKey>')}        ${chalk.dim('List open issues for a project')}
  - ('jira create issue')} ${chalk.cyan('<projectKey>')}      ${chalk.dim('Create a new issue')}
  - ('jira update issue')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Update an existing issue')}
  - ('jira delete issue')} ${chalk.cyan('<issueKey>')}        ${chalk.dim('Delete an issue')}

            ${chalk.yellow('For more information, run: jira help')}
`);
}