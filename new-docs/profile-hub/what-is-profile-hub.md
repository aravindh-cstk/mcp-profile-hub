---
uid: ""
url: /docs/mcp/what-is-profile-hub
seo_title: What is MCP Profile Hub?
seo_description: MCP Profile Hub is a hosted Contentstack app that exposes scoped sets of Contentstack tools as profiles you connect to AI clients over HTTP.
---

# What is MCP Profile Hub?

## Overview

MCP Profile Hub is a Contentstack Marketplace app that lets you create profiles: small, tightly scoped [MCP](/docs/mcp/mcp-at-contentstack) integrations that expose only the Contentstack tools a specific job needs. You publish a profile once, then connect it to any MCP-compatible client.

## What a profile exposes

Exposing every Contentstack tool to an AI client works poorly. With more than 100 tools, models struggle to pick the right one, context windows grow large, and smaller models fail on common workflows. A profile exposes a selected toolset instead: your stack shapes it, and your existing Contentstack roles bound it.

Once you connect a profile, your AI agent can, for example:

- Look up entries, assets, and publish status in plain language.
- Publish or update content in approved environments.
- Inspect content models and generate implementation guidance.
- Run your own Contentstack Automate automations and Agent OS agents as single tool calls.

## Profile guarantees

Every profile is:

- **Scoped:** the model sees only the tools the profile exposes, never the whole platform.
- **Contextual:** tools reflect your real content models, locales, branches, and environments.
- **Governed:** you sign in with Open Authorization (OAuth), operations run with your existing roles, and the app logs every action. See [MCP authentication](/docs/mcp/mcp-authentication).

## Who uses MCP Profile Hub

This app serves:

- Content editors who want to look things up or run approved operations without opening the CMS.
- Developers who want Contentstack helpers in an IDE or terminal.
- Operations teams that run repeatable content and campaign workflows.
- Admins who expose narrow capabilities to non-technical users.

## Profile Hub compared with the MCP Server

Both MCP Profile Hub and the [Contentstack MCP Server](/docs/mcp/what-is-the-mcp-server) connect AI agents to Contentstack and cover the same kinds of work. They differ in how you install them and in the number of tools your agent ends up with.

| | Contentstack MCP Server | MCP Profile Hub |
| --- | --- | --- |
| Installation | Runs locally through `npx`. You configure it per machine with credentials or an OAuth session | Contentstack hosts it at `mcp-profile-hub.contentstack.com`. Nothing to install. Add a URL to your client |
| Transport | stdio, so it works only in clients that can run a local process | Streamable HTTP, so it also works in web clients such as claude.ai and ChatGPT |
| Tool selection | Tool groups (`cma`, `launch`, and so on). Each group loads its full toolset | You select tools per profile. Each profile exposes exactly the tools a job needs |

The MCP Server gives a developer the full toolset on their own machine. MCP Profile Hub gives anyone a scoped toolset from any client, shareable across a team.

## How it works

An MCP Profile Hub setup involves three pieces:

1. **Profiles:** the scoped tool bundles you create and publish in the app. See [Profiles and catalogs](/docs/mcp/profiles-and-catalogs).
2. **The hosted runtime** at `mcp-profile-hub.contentstack.com`: it loads the profile, authenticates you, applies stack context, checks permissions, and runs operations.
3. **MCP clients:** any MCP-compatible app (Claude, Claude Code, Cursor, Codex, ChatGPT, and others) that connects to a profile's connector URL.

The lifecycle:

1. Create a profile in the app: pick tools, configure a stack, and publish. You get a connector URL. See [Create a profile](/docs/mcp/create-a-profile).
2. Add the connector URL to your MCP client. The client opens a browser for Contentstack OAuth. You sign in and approve the requested scopes. See [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub).
3. When the client calls a tool, the runtime validates your token, resolves the target stack, applies context, checks your permissions, runs the operation, and logs the result.

The runtime pipeline behind step 3:

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

Every published profile has a stable endpoint:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=<PROFILE_ID>&org_uid=<ORG_UID>
```

The profile URL is safe to share, because identity comes entirely from OAuth rather than from anything in the URL. Neither value in it is a secret. The `profile_id` names which profile the connection uses. The `org_uid` is a sign-in hint that helps the OAuth flow find your organization on first connect, and it has no effect on a tool call, because Contentstack resolves your organization from the session you signed in with. The Installation screen pre-fills both in the URL you copy.

You can point a shared system profile at your own stack, branch, or project without saving anything in the app. Configure it entirely from that URL instead. See [MCP URL parameters](/docs/mcp/mcp-url-parameters).

### Tools adapt to your stack

Tools are not raw API endpoints. When a client lists the tools a profile exposes, the runtime reads your Contentstack setup and writes the real values into each tool definition: the stack's content types, branches, environments, and locales, plus the Launch, Personalize, Brand Kit, and Developer Hub resources you configured the profile to use.

This matters because it changes what the model does. A tool whose `branch` parameter carries the list of branches that exist picks a valid one. A tool without that list guesses.

Two caps apply to this behaviour. See [Limitations](#limitations).

## Execution logging

MCP Profile Hub records every tool call. Each entry captures the profile, the tool, the calling client, timing, the input payload, and the result, among other metadata.

The app's **Executions** view is a searchable history of those calls.

TODO(screenshot): Executions view. It should show a filterable list of tool calls with status badges, the client chip, profile and tool names, timestamps, and one expanded row showing request metadata or an error message.

The Executions view is also where you diagnose a failed call from its error message. See [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot) for how to read one.

## Limitations

- **Injected lists cap at 50 values.** If your stack has more than 50 content types, branches, environments, or locales, the model sees only the first 50 of that list and cannot select the rest by name.
- **Tool definitions cache for five minutes.** A change you make in Contentstack, such as a new branch, stays invisible to the model until the cached definitions expire.
- **Executions names the client, not the person.** For user-level attribution, use the organization [audit log](https://www.contentstack.com/docs/headless-cms/monitor-stack-activities-in-audit-log).

## Next Steps

- [Create a profile](/docs/mcp/create-a-profile): pick tools, set stack context, and publish a profile to get its connector URL.
- [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub): add a connector URL to your MCP client and complete OAuth.
- [Profiles and catalogs](/docs/mcp/profiles-and-catalogs): how catalogs group the tools a profile can expose.
- [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot): read the Executions view and diagnose failed tool calls.
