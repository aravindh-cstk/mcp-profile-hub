---
uid: ""
url: /developers/mcp-profile-hub-monitor-tool-calls
seo_title: Monitor tool calls
seo_description: Review the tool calls a Contentstack MCP Profile Hub profile runs in the Executions view, with the status, client, duration, and error message of each call.
---

# Monitor tool calls

## Overview

Review the tool calls a profile runs, and confirm that they reach Contentstack. The **Executions** view records each tool call with its status, client, and error message, so you can find the exact error message of a failed call.

## The Executions view

Open **Executions** from the Profiles screen. Each entry shows:

| Field | Holds |
| --- | --- |
| Status | **Completed**, **Running**, or **Failed** |
| Client | The MCP client that made the call, for example `claude-code 2.1.4` |
| `profile_id` and `profile_name` | The profile the call ran against |
| `tool_name` | The tool the agent called |
| `error_message` | The failure text, when the call failed |
| Duration | How long the call took |
| Timestamp | How long ago the call ran |

Expand **More metadata** on an entry to see the rest, including the input parameters the app captured on the running event.

![The Executions view, showing a search box, status and profile filters, and execution cards for completed, running, and failed tool calls with their profile, tool name, status, and error message.](images/executions-view.png)

### Page further back through the history

The view loads 50 executions at a time, and the filters narrow only what it has already loaded. To reach older executions, follow the three steps below:

1. Clear the filters.
2. Click **Load more**.
3. Filter again.

> **Additional Resource:** For more information on why the filters and **Load more** behave this way, refer to the [Limitations](#limitations) section.

## Troubleshooting

> **Additional Resource:** For more information on the error messages a profile can return and the fix for each one, refer to the [Contentstack MCP Troubleshooting Guides](/contentstack-mcp-troubleshooting/faqs) documentation.

## Further Support

1. Open the failing call in **Executions** and read its error message and metadata.
2. Reopen the profile and check its Tool selection and Configuration steps.
3. Sign in to Contentstack as the same user and confirm the UI permits the same action.
4. Confirm the connector URL in your client matches the one on the Installation step.

## Limitations

The Executions view has the following limitations:

- **No user attribution:** The client chip identifies the MCP client, not the person who made the call. To identify users, check the organization [audit log](/headless-cms/monitor-stack-activities-in-audit-log).
- **Filters search only loaded executions:** The view loads 50 executions at a time, so the following limits apply:
  - The search box and the status and profile filters apply only to loaded executions.
  - **Load more** is unavailable while a filter is active.
  - An empty filtered view does not mean that no matching executions exist in the full history.

  To check older executions, clear all filters and click **Load more** to [page further back through the history](#page-further-back-through-the-history).

## Next Steps

- [Manage profiles](/developers/mcp-profile-hub-manage-profiles): enable or disable a profile, and what an export leaves out.
- [MCP URL parameters](/developers/mcp-profile-hub-url-parameters): the connector URL parameters and their validation rules.
- [Profiles and catalogs](/developers/mcp-profile-hub-profiles-and-catalogs): which catalogs your plan includes.
- [Automations and agents as tools](/developers/mcp-profile-hub-automations-and-agents): the trigger requirements an automation or agent must meet.
