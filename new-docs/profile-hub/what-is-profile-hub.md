---
uid: ""
url: /developers/mcp-profile-hub-what-is-profile-hub
seo_title: What is MCP Profile Hub?
seo_description: MCP Profile Hub is a hosted Contentstack app that exposes scoped sets of Contentstack tools as profiles you connect to AI clients over HTTP.
---

# What is MCP Profile Hub?

## Overview

MCP Profile Hub is a Contentstack Marketplace app in which you create profiles: scoped [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) integrations that expose only the Contentstack tools you select. After you publish a profile, you connect it to MCP clients that support Streamable HTTP, or to stdio clients through the `mcp-remote` bridge.

## What a profile exposes

A profile exposes a subset of Contentstack tools that you select. The tool definitions include the content types, branches, environments, and locales in your stack, and your Contentstack role limits the operations the tools can run.

Because a large toolset lowers a model's accuracy in selecting the correct tool, a profile exposes only the tools you select. A large toolset also uses more of the context window and can cause smaller models to fail on common workflows.

After you connect a profile, your AI agent can run tasks such as the examples below:

- Look up entries, assets, and publish status in plain language.
- Publish or update content in the environments your role permits.
- Inspect content models and generate implementation guidance.
- Run your own Contentstack Automate automations and Agent OS agents as single tool calls.

## Profile properties

Every profile has the three properties below:

- **Scoped:** the client receives only the tools that the profile exposes.
- **Contextual:** tool definitions include the content types, locales, branches, and environments in your stack.
- **Governed:** you sign in with Open Authorization (OAuth), each operation runs with your existing Contentstack roles, and the app records each tool call in the **Executions** view.

> **Additional Resource:** For more information on the OAuth sign-in, the scopes you approve, and how Contentstack applies your roles to each tool call, refer to the [Authentication and permissions](/developers/mcp-profile-hub-connect-a-client-to-profile-hub#authentication-and-permissions) documentation.

## Who uses MCP Profile Hub

This app serves the four groups below:

- Content editors who retrieve entries or run the operations their role permits without opening the CMS.
- Developers who call Contentstack tools from an IDE or terminal.
- Operations teams that run repeatable content and campaign workflows.
- Admins who build profiles with a limited set of tools for non-technical users.

## Profile Hub compared with the MCP Server

Both MCP Profile Hub and the [Contentstack MCP Server](/developers/contentstack-mcp-server) connect AI agents to Contentstack and cover similar tasks. They differ in their installation method and in the number of tools they expose to your agent. The table below compares them.

| | Contentstack MCP Server | MCP Profile Hub |
| --- | --- | --- |
| Installation | Runs locally through `npx`. You configure it per machine with a [management or delivery token](/headless-cms/types-of-tokens) or an OAuth session | Contentstack hosts it at `mcp-profile-hub.contentstack.com`. You add the connector URL to your client. Clients that support Streamable HTTP need no local installation, and stdio-only clients need Node.js to run the `mcp-remote` bridge |
| Transport | stdio, so it works only in clients that can run a local process | Streamable HTTP, so it also works in web clients such as claude.ai and ChatGPT |
| Tool selection | Tool groups, for example `cma` and `launch`. Each group loads its full toolset | You select tools per profile. Each profile exposes only the tools you select |

The MCP Server gives a developer the full toolset on their own machine. MCP Profile Hub provides a scoped, hosted toolset that a team can share across MCP clients.

## Setup and architecture

An MCP Profile Hub setup has three components:

- **Profiles:** a profile is a set of Contentstack tools you pick in the app. After you publish it, an AI client can connect to it.
- **The hosted runtime** at `mcp-profile-hub.contentstack.com`: it loads the profile, authenticates you, applies stack context, checks permissions, and runs operations.
- **MCP clients:** an MCP-compatible app, for example Claude, Claude Code, Cursor, Codex, or ChatGPT, that connects to a profile's connector URL.

You set this up in two steps:

1. Create a profile in the app: pick tools, configure a stack, and publish. You get a connector URL.
2. Add the connector URL to your MCP client. The client opens a browser for Contentstack OAuth. You sign in and approve the requested scopes.

**The connector URL of a published profile does not change when you edit the profile.**

The Installation screen pre-fills the `profile_id` and `org_uid` values in the URL below, which you copy:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=<PROFILE_ID>&org_uid=<ORG_UID>
```

**The default connector URL contains no secrets.**

Neither value in the URL above is a secret, because Contentstack identifies you through OAuth sign-in, not through a value in the URL. The `profile_id` identifies the profile that the connection uses. Contentstack uses the `org_uid` during sign-in to identify your organization without a separate lookup, and the value has no effect on a tool call. A URL that includes the `apikey` parameter also contains your stack API key.

**Query parameters override the profile's saved configuration.**

You can set the stack, branch, or project of a shared system profile through query parameters in the connector URL, without changing the saved profile in the app.

> **Additional Resource:** For more information on the query-string parameters that set the stack, branch, environment, and project for a single connection, and the order in which Contentstack applies them, refer to the [MCP URL parameters](/developers/mcp-profile-hub-url-parameters) documentation.

### How a tool call works

When your client calls a tool, the runtime handles it in the order below:

```
MCP client --tool call--> Runtime
Runtime:
  1. Validate token
  2. Resolve stack
  3. Apply context (branch, environment, locale)
  4. Check role permissions
  5. Execute against Contentstack
  6. Log to Executions
Runtime --result--> MCP client
```

### Stack-aware tool definitions

When a client calls `tools/list`, the runtime reads your Contentstack setup and adds the values from your stack to each tool definition in the profile.

An injected list limits the values the model sends. When a tool's `branch` parameter lists the existing branches as an `enum`, the model selects a value from that list. When the parameter has no `enum`, the tool call sends the model's value without validation.

Two caps apply to the injected values: an injected list stops at 50 entries, and tool definitions cache for five minutes. [Limitations](#limitations) states both in full.

## Execution logging

MCP Profile Hub records the tool calls that each profile runs. Each entry captures the profile, the tool, the calling client, timing, the input payload, and the result. The app's **Executions** view is a searchable history of those calls, and you use it to diagnose a failed call from its error message.

![The Executions view, showing a search box, status and profile filters, and execution cards for completed, running, and failed tool calls with their profile, tool name, status, and error message.](images/executions-view.png)

## Limitations

- **Injected lists cap at 50 values.** A tool definition lists at most 50 content types, branches, environments, or locales. If your stack has more, the model can select only from the first 50 values in that list.
- **Tool definitions cache for five minutes.** A change you make in Contentstack, such as a new branch, appears in the tool definitions only after the cached definitions expire.
- **Executions identifies the client, not the person.** For user-level attribution, use the organization [audit log](/headless-cms/monitor-stack-activities-in-audit-log).

## Next Steps

- [Create a profile](/developers/mcp-profile-hub-create-a-profile): pick tools, set stack context, and publish a profile to get its connector URL.
- [Connect a client to MCP Profile Hub](/developers/mcp-profile-hub-connect-a-client-to-profile-hub): add a connector URL to your MCP client and complete OAuth.
- [Profiles and catalogs](/developers/mcp-profile-hub-profiles-and-catalogs): the catalogs that group the tools a profile can expose.
- [Monitor and troubleshoot](/developers/mcp-profile-hub-monitor-and-troubleshoot): read the Executions view and diagnose failed tool calls.
