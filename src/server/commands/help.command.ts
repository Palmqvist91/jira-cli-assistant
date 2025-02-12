export async function helpCommand() {
    console.log(`
    Usage:
    $ jira <command> [options]

    Commands:
    project                      List all JIRA projects
    list <projectKey>            List open issues for a specific JIRA project
        -s, --status <status>      List issues by status
        -a, --assignee <assignee>  List issues by assignee
    create <projectKey>          Create a new issue in a specific project
        -m, --summary <summary>    Set the summary of the issue
        -t, --issueType <issueType> Set the issue type of the issue
    update <issueKey>            Update a specific issue
        -s, --status <status>      Set the status of the issue
        -a, --assignee <assignee>  Set the assignee of the issue
        -m, --summary <summary>    Set the summary of the issue
    delete <issueKey>            Delete a specific issue
        --force                    Force delete the issue without confirmation
    config                       Set up your JIRA configuration

    Examples:
    $ jira project
    $ jira list <projectKey> --status "In Progress"
    $ jira create <projectKey> --summary "New Feature" --issueType "Story"
    $ jira update <issueKey> --status "Done"
    $ jira delete <issueKey> --force

    For more information on a specific command, run:
    $ jira <command> --help
    `);
}