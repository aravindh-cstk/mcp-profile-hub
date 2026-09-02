---
uid: ""
url: /developers/mcp-monitor-and-troubleshoot
seo_title: Monitor and troubleshoot
seo_description: Use the MCP Profile Hub Executions view to review tool calls, and diagnose connection, authentication, and execution failures from their error messages.
---

# Monitor and troubleshoot

## Overview

The **Executions** view records every tool call a profile runs, so you can confirm calls are landing and read the error message behind a failure. Start here when a client cannot connect, lists no tools, or a tool call fails.

## The Executions view

The app records every tool call. Open **Executions** from the Profiles screen to review them.

Each entry shows:

| Field | Holds |
| --- | --- |
| Status | `Completed`, `Running`, or `Failed` |
| Client | The MCP client that made the call, for example `claude-code 2.1.4` |
| `profile_id` and `profile_name` | The profile the call ran against |
| `tool_name` | The tool the agent called |
| `error_message` | The failure text, when the call failed |
| Duration | How long the call took |
| Timestamp | How long ago the call ran |

Expand **More metadata** on an entry to see the rest, including the input parameters the app captured on the running event.

TODO(screenshot): Executions view. It should show the search box, the status and profile filters, several execution cards with status badges and client chips, and one card the reviewer has expanded to show More metadata.

Use it to confirm a client's calls are succeeding, diagnose a failure from its error message, and review what other clients are using a shared profile for.

### Page further back through the history

The view loads 50 executions at a time, and the filters narrow only what it has already loaded. To reach older executions:

1. Clear the filters.
2. Click **Load more**.
3. Filter again.

See [Limitations](#limitations) for why this is necessary.

## Failures caused by the model, not the profile

A tool call can fail because the model passed incomplete or malformed arguments, for example omitting a required field on publish. The agent may retry, adjust the input, or read Contentstack's documentation and try again. That behaviour comes from the MCP client and the model, not from the profile or the tool. More capable models interpret tool descriptions and input schemas more accurately.

## Connection and sign-in problems

The sections below group entries by the symptom you see first, so a sign-in cause such as an incomplete Open Authorization (OAuth) flow can appear under connection problems even though it also touches authentication.

### The client shows the server but no tools

**Root Causes**

- You did not finish OAuth.
- Contentstack disabled the profile. A disabled profile advertises zero tools.

**Resolution**

1. Trigger the sign-in, for example `/mcp` in Claude Code, and complete the browser flow.
2. If sign-in already completed, Contentstack has probably disabled the profile. No control exists in the app for this, and there is no supported way to set it yourself, so raise a Contentstack support request. See [Enable and disable a profile](/developers/mcp-manage-profiles#enable-and-disable-a-profile).

### No tools appear, and the connection reports an error

**Root Cause**: A malformed project UID in the connector URL fails the whole tool listing, not only the affected product.

**Resolution**: Correct the parameter. See [MCP URL parameters](/developers/mcp-url-parameters).

### The browser never opens for sign-in, and the URL looks wrong

**Root Cause**: You mistyped the connector URL.

**Resolution**: Confirm the URL matches the one on the Installation step, including `profile_id` and `org_uid`.

### The browser never opens for sign-in, and the URL is correct

**Root Cause**: The client cannot reach the discovery endpoint.

**Resolution**

1. Confirm the machine can reach the endpoint over HTTPS, for example by opening the connector URL directly in a browser.
2. Check for a corporate proxy, VPN, firewall, or TLS-inspecting middlebox blocking the request.

### The client asks you to authorize repeatedly

**Root Cause**: Contentstack raised the pinned `mcp-remote` version, so the credential cache moved to a new directory.

**Resolution**: Sign in once more. A version change causes this and it is expected, not a fault. See [Why Contentstack pins the mcp-remote version](/developers/mcp-connect-a-client-to-profile-hub#why-contentstack-pins-the-mcp-remote-version).

### Sign-in loops with no version change

**Root Cause**: The client is holding a stale cached token.

**Resolution**: Clear the client's cached MCP credentials and reconnect. For `mcp-remote`, delete the version-specific subdirectory under `~/.mcp-auth` and retry.

> **Warning:** `~/.mcp-auth` holds cached OAuth credentials for every MCP server you have connected through `mcp-remote`, not only Contentstack. Deleting the whole directory signs you out of all of them, and each one prompts for authorization again on next use.

## Local environment

### mcp-remote fails to start, and Node.js is missing

**Root Cause**: Node.js is not installed.

**Resolution**: Install Node.js and confirm `npx -y mcp-remote` runs.

### mcp-remote fails to start, and Node.js is installed

**Root Cause**: A registry allowlist, execution policy, or proxy blocks `npx` from reaching the npm registry.

**Resolution**: Install `mcp-remote` globally from an approved registry and point the client at the installed binary instead of `npx`, or ask IT to allowlist the package.

## Authentication and permission errors

Contentstack returns these to the client as JSON-RPC error code `-32010` with the message `authorization_required`. The accompanying `reason` field says which case you hit, so read it before acting.

### authorization_required, with reason no_token or local_token_unavailable

**Root Cause**: You have not completed OAuth for this profile, or the stored token expired.

**Resolution**: Reconnect and sign in again. The error also carries an `authorization_url` you can open directly. See [Authentication and permissions](/developers/mcp-connect-a-client-to-profile-hub#authentication-and-permissions).

### authorization_required, with reason insufficient_scope

**Root Cause**: Contentstack returned 403. Either the token lacks a required OAuth scope, or your Contentstack role does not permit the operation. The message names the method and path:

```text
Permission denied for <METHOD> <PATH>. The authorized token may lack a required
OAuth scope, or your Contentstack role may not permit this operation. If scopes
were recently changed, re-authorize from the Authorization page (add the needed
scope to the curated list) and try again.
```

**Resolution**

1. Reconnect and approve the requested scopes, adding the needed scope to the curated list on the Authorization page.
2. If you already granted the scope, your role is the limit. This is least-privilege behaving as intended, so use an account with the needed role, or ask the profile owner to narrow the tools. See [About Product Roles](https://www.contentstack.com/docs/administration/about-product-roles) and [About Stack Roles](https://www.contentstack.com/docs/headless-cms/about-stack-roles).

### authorization_required, with reason contentstack_unauthorized

**Root Cause**: Contentstack rejected the token, and refreshing it did not help.

**Resolution**: Reconnect and sign in again. See [Authentication and permissions](/developers/mcp-connect-a-client-to-profile-hub#authentication-and-permissions).

### Profile scope mismatch

**Root Cause**: The client requested a profile other than the one the connector URL specifies.

**Resolution**: Use the connector URL for the profile you want. See [The URL decides which profile a client can use](/developers/mcp-url-parameters#the-url-decides-which-profile-a-client-can-use).

A profile never grants more access than your Contentstack roles already allow. If a call fails on permissions, confirm you can perform the same action in the Contentstack UI with your own account.

## Configuration errors

### No stack selected for this organization.

**Root Cause**: Neither the profile, the URL, nor the tool arguments name a stack.

**Resolution**: Select a stack in the profile's Configuration step, or pass `stack_api_key` in the connector URL.

### No Personalize project selected for this profile.

**Root Cause**: The profile includes Personalize tools but no Personalize project.

**Resolution**: Select one in the Configuration step, or add `personalize_project_uid` to the connector URL.

### Invalid "launch_project_uid" in the MCP endpoint URL

**Root Cause**: The project UID is not 1 to 64 characters of letters, digits, hyphens, or underscores.

**Resolution**: Correct the parameter. See [Validation](/developers/mcp-url-parameters#validation).

### Cannot find that stack

**Root Causes**

- The configured stack API key is wrong.
- The stack belongs to a different Contentstack region than the one your sign-in resolved.

**Resolution**

1. Confirm the configured stack API key is correct for your account.
2. Confirm you signed in to the organization that owns the stack. Contentstack derives the regional endpoints from the organization you signed in with, so a stack in another region is unreachable on that session. See [Supported regions](https://www.contentstack.com/docs/developers/contentstack-mcp-server#supported-regions) for the region codes, and [MCP URL parameters](/developers/mcp-url-parameters#sign-in-parameters) for the `cma_host` parameter.

### This organization's plan does not include `<CATALOGS>`.

**Root Cause**: The profile holds tools from a catalog your plan excludes.

**Resolution**: Remove those tools and save again. See [Plan-gated catalogs](/developers/mcp-profiles-and-catalogs#plan-gated-catalogs).

## Automation and agent errors

### uses a secure HTTP trigger, which is not supported yet

**Root Cause**: Secure HTTP Trigger is on for that automation, and Contentstack cannot detect it before the call runs.

**Resolution**: Turn Secure HTTP Trigger off in Contentstack Automate, or use a different automation.

### is not activated in Contentstack Automate, so it did not run

**Root Cause**: You left the automation as a draft, or you paused it.

**Resolution**: Activate it in Automate.

### did not respond within `<MS>`ms

**Root Cause**: The automation ran longer than the profile's timeout.

**Resolution**: Raise `timeout` on the connector URL. Contentstack caps it at 120000 ms.

### The agent was still `<STATUS>` when the tool timed out.

**Root Cause**: The agent run outlasted the timeout.

**Resolution**: Raise `timeout` on the connector URL, up to 120000 ms. If the run legitimately exceeds the cap, look up the reported execution ID in Agent OS for the result.

### An automation is missing from the tool browser

**Root Causes**

- It has no HTTP trigger as its first step.
- You have not activated it.
- You fixed it less than five minutes ago.

**Resolution**: Fix it in Automate, then wait up to five minutes before reopening the tool browser. Contentstack caches the discovered list server-side, so reopening sooner returns the same stale list.

### An agent is missing from the tool browser

**Root Causes**

- It is unpublished or inactive.
- It has no HTTP trigger.
- It uses a secure trigger, which Profile Hub does not support yet.
- You fixed it less than five minutes ago.

**Resolution**: Publish and activate it in Agent OS, add an HTTP trigger, and turn off Secure HTTP Trigger. Then wait up to five minutes before reopening the tool browser.

The full qualifying conditions are in [What qualifies](/developers/mcp-automations-and-agents#what-qualifies).

## Tool availability and selection errors

### The agent calls the wrong tool, or passes invalid arguments

**Root Cause**: The model is not reading the tool description or input schema correctly, which is more common on older or smaller models.

**Resolution**: Retry on a newer model, or give the model more context about the operation.

### Tool not found

**Root Causes**

- Someone removed the tool from the profile's Tool selection.
- The client is holding a tool list it fetched before the profile changed. Contentstack does not notify a connected client that the list changed.

**Resolution**

1. Re-list the tools in the client, by reconnecting or running the client's server-refresh command.
2. If the tool is still absent, confirm the profile's Tool selection step still lists it.

### A catalog is missing from the tool browser

**Root Cause**: Your organization's plan does not include that product, and Contentstack hides the tab as well as the tools.

**Resolution**: Ask your organization owner to confirm the plan, and contact your Contentstack account team to add the product. Until then, build the profile from the catalogs your plan includes.

### `<N>` saved tools could not be loaded

**Root Causes**

- The tool manifests failed to load while the page opened.
- A catalog key changed after the profile saved those tools.

**Resolution**: Reopen the page to try again. Contentstack keeps the tools rather than dropping them, so they stay on the profile and keep working either way.

## Still stuck

1. Open the failing call in **Executions** and read its error message and metadata.
2. Reopen the profile and check its Tool selection and Configuration steps.
3. Confirm you can perform the same action in the Contentstack UI with your own account.
4. Confirm the connector URL in your client matches the one on the Installation step.

## Limitations

The Executions view does not do two things you might expect.

- **It does not show which user made a call.** The client chip names the MCP client, not the person. For user attribution, use the organization [audit log](https://www.contentstack.com/docs/headless-cms/monitor-stack-activities-in-audit-log).
- **The filters apply to the loaded page, not the full history.** The view loads 50 executions at a time, the search box and the status and profile filters narrow only what it has already loaded, and **Load more** disappears while any filter is active. An empty filtered view therefore means "nothing in the rows loaded so far", not "nothing ever". See [Page further back through the history](#page-further-back-through-the-history).

## Next Steps

- [Manage profiles](/developers/mcp-manage-profiles): enable or disable a profile, and what an export leaves out.
- [MCP URL parameters](/developers/mcp-url-parameters): the connector URL parameters and their validation rules.
- [Profiles and catalogs](/developers/mcp-profiles-and-catalogs): which catalogs your plan includes.
- [Automations and agents as tools](/developers/mcp-automations-and-agents): the trigger requirements an automation or agent must meet.
