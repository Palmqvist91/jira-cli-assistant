export async function helpText() {
    console.log(`
                Welcome to Jira CLI Assistant! 🚀
                                    
                         by PrHiGo

    Here are some example commands you can run:
    - jira project list                 List all projects
    - jira project sprints <projectKey> List all sprints for a project
    - jira issue list <projectKey>      List issues in a project
    - jira issue create <projectKey>    Create a new issue
    - jira issue update <issueKey>      Update an issue
    - jira issue delete <issueKey>      Delete an issue


    Usage:
    $ jira <resource> <command> [options]

    Resources and Commands:
    project
      list                          List all JIRA projects
      sprint <projectKey>           List all sprints for a project

    issue
      list <projectKey>             List issues in a project
        -s, --status <status>       Filter issues by status
        -a, --assignee <assignee>   Filter issues by assignee
        --sprint <sprint>           Filter issues by sprint name or ID
      create <projectKey>           Create a new issue
        -m, --summary <summary>     Set the summary
        -t, --issueType <type>      Set the issue type
      update <issueKey>             Update an issue
        -s, --status <status>       Set the status
        -a, --assignee <assignee>   Set the assignee
        -m, --summary <summary>     Update the summary
      delete <issueKey>             Delete an issue
        --force                     Force delete without confirmation

    config                          Set up your JIRA configuration

    Examples:
    $ jira projects list
    $ jira issue list PROJECT-KEY --status "In Progress"
    $ jira issue create PROJECT-KEY --summary "New Feature" --issueType "Story"
    $ jira issue update ISSUE-123 --status "Done"
    $ jira issue delete ISSUE-123 --force

    For more information on a specific command, run:
    $ jira <resource> <command> --help
    `);
}

export async function welcomText() {
    console.log(`
                Welcome to Jira CLI Assistant! 🚀
        
                         by PrHiGo

  Here are some example commands you can run:
  - jira project list                   List all projects
  - jira project sprints <projectKey>   List all sprints for a project
  - jira issue list <projectKey>        List open issues for a project
  - jira issue create <projectKey>      Create a new issue
  - jira issue update <issueKey>        Update an existing issue
  - jira issue delete <issueKey>        Delete an issue

            For more information, run: jira help
`);
}