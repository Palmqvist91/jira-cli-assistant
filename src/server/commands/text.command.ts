export async function helpText() {
    console.log(`
            Welcome to Jira CLI Assistant! 🚀
                                
                      by PrHiGo

    Here are some example commands you can run:
    - jira projects list           List all projects
    - jira issues list <projectKey> List issues in a project
    - jira issues create <projectKey> Create a new issue
    - jira issues update <issueKey> Update an issue
    - jira issues delete <issueKey> Delete an issue


    Usage:
    $ jira <resource> <command> [options]

    Resources and Commands:
    projects
      list                       List all JIRA projects

    issues
      list <projectKey>          List issues in a project
        -s, --status <status>    Filter issues by status
        -a, --assignee <assignee> Filter issues by assignee
      create <projectKey>        Create a new issue
        -m, --summary <summary>  Set the summary
        -t, --issueType <type>  Set the issue type
      update <issueKey>          Update an issue
        -s, --status <status>    Set the status
        -a, --assignee <assignee> Set the assignee
        -m, --summary <summary>  Update the summary
      delete <issueKey>          Delete an issue
        --force                  Force delete without confirmation

    config                       Set up your JIRA configuration

    Examples:
    $ jira projects list
    $ jira issues list PROJECT-KEY --status "In Progress"
    $ jira issues create PROJECT-KEY --summary "New Feature" --issueType "Story"
    $ jira issues update ISSUE-123 --status "Done"
    $ jira issues delete ISSUE-123 --force

    For more information on a specific command, run:
    $ jira <resource> <command> --help
    `);
}

export async function welcomText() {
    console.log(`
        Welcome to Jira CLI Assistant! 🚀
  
                  by PrHiGo

  Here are some example commands you can run:
  - jira project               List all projects
  - jira list <projectKey>     List open issues for a project
  - jira create <projectKey>   Create a new issue
  - jira update <issueKey>     Update an existing issue
  - jira delete <issueKey>     Delete an issue

      For more information, run: jira help
`);
}