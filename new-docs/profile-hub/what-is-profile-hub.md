---
uid: ""
url: /docs/mcp/what-is-profile-hub
seo_title: What is MCP Profile Hub?
seo_description: MCP Profile Hub is a hosted Contentstack app that exposes scoped sets of Contentstack tools as profiles you connect to AI clients over HTTP.
---

# What is MCP Profile Hub?

MCP Profile Hub is a Contentstack Marketplace app that lets you create profiles: small, tightly scoped [MCP](/docs/mcp/mcp-at-contentstack) integrations that expose only the Contentstack tools a specific job needs. You publish a profile once, then connect it to any MCP-compatible client.

## What it is

Exposing every Contentstack tool to an AI client works poorly. With more than 100 tools, models struggle to pick the right one, context windows grow large, and smaller models fail on common workflows. A profile exposes a selected toolset instead, shaped to your stack and bounded by your existing Contentstack roles.

Once a profile is connected, your AI agent can, for example:

- Look up entries, assets, and publish status in plain language.
- Publish or update content in approved environments.
- Inspect content models and generate implementation guidance.
- Run approved operational tasks without opening the CMS.

Every profile is:

- **Scoped:** the model sees only the tools the profile exposes, never the whole platform.
- **Contextual:** tools reflect your real content models, locales, branches, and environments.
- **Governed:** you sign in with OAuth, operations run with your existing roles, and every action is logged. See [MCP authentication](/docs/mcp/mcp-authentication).

This app serves:

- Content editors who want to look things up or run approved operations without opening the CMS.
- Developers who want Contentstack helpers in an IDE or terminal.
- Operations teams that run repeatable content and campaign workflows.
- Admins who expose narrow capabilities to non-technical users.

## How it works

MCP Profile Hub has three parts:

1. **Profiles:** the scoped tool bundles you create and publish in the app. See [Profiles and catalogs](/docs/mcp/profiles-and-catalogs).
2. **The hosted runtime** at `mcp-hub.contentstack.com`: it loads the profile, authenticates you, applies stack context, checks permissions, and runs operations.
3. **MCP clients:** any MCP-compatible app (Claude, ChatGPT, Cursor, VS Code, Claude Code, Codex, and others) that connects to a profile endpoint.

The lifecycle:

1. Create a profile in the app: pick tools, configure a stack, and publish. You get a profile URL. See [Create a profile](/docs/mcp/create-a-profile).
2. Add the profile URL to your MCP client. The client opens a browser for Contentstack OAuth. You sign in and approve the requested scopes. See [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub).
3. When the client calls a tool, the runtime validates your token, resolves the target stack, applies context, checks your permissions, runs the operation, and logs the result.

Every published profile has a stable endpoint:

```
https://mcp-hub.contentstack.com/api/mcp?profile_id=<profile_id>
```

The `profile_id` is a catalog identifier, not a secret. Identity comes entirely from OAuth, so the URL is safe to share.

## Profile Hub or the Server?

Both MCP Profile Hub and the [Contentstack MCP Server](/docs/mcp/what-is-the-mcp-server) connect AI agents to Contentstack and cover the same kinds of work. They differ in how you install them and how many tools your agent ends up with.

| | Contentstack MCP Server | MCP Profile Hub |
| --- | --- | --- |
| Installation | Runs locally via `npx`, configured per machine with credentials or an OAuth session | Hosted at `mcp-hub.contentstack.com`. Nothing to install. Add a URL to your client |
| Transport | stdio, so it works only in clients that can run a local process | Streamable HTTP, so it also works in web clients such as claude.ai and ChatGPT |
| Tool selection | Tool groups (`cma`, `launch`, and so on). Each group loads its full toolset | Selected per profile. You expose exactly the tools a job needs |

The MCP Server gives a developer the full toolset on their own machine. MCP Profile Hub gives anyone a scoped toolset from any client, shareable across a team.

## Audit logging

MCP Profile Hub logs all profile activity. Each log entry records the user, profile, client, tool, timestamp, input payload, execution result, and permission outcome. Audit history is scoped per organization and per user, so each user sees their own activity.

The app includes an **Executions** view: a searchable, filterable history of tool calls across your profiles. Each entry shows the status (running, completed, or failed), the profile and tool involved, timing, any error message, and expandable request metadata. Use it to confirm calls are succeeding, diagnose a failed call, or review how a shared profile is used across the team.

TODO(screenshot): Executions view. It should show a filterable list of tool calls with status badges, profile and tool names, timestamps, and one expanded row with request metadata or an error message.
