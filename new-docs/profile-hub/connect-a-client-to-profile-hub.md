---
uid: ""
url: /developers/mcp-connect-a-client-to-profile-hub
seo_title: Connect a client to MCP Profile Hub
seo_description: Connect Claude, Claude Code, Cursor, Codex, ChatGPT, or another MCP client that supports Streamable HTTP to an MCP Profile Hub profile over HTTP, with OAuth sign-in in the browser.
---

# Connect a client to MCP Profile Hub

## Overview

Connect an AI client to a profile by adding the profile's connector URL to the client. Each profile is a remote MCP server that the client connects to over Streamable HTTP. On first connect, you sign in to Contentstack in the browser through Open Authorization (OAuth), so the client configuration contains no API keys, management tokens, or delivery tokens.

Tool calls run against live stack data with your own Contentstack roles. Because a profile can include create, update, delete, and publish tools, check what a shared profile exposes before you connect to it.

## Use this when

- You want a scoped Contentstack toolset in an AI client, including web clients.
- You want to share the same profile across a team.

## Pick an installation tab

The profile's **Installation** step shows six tabs. Each one generates a snippet for you to copy:

| Tab | Transport | Needs Node.js | Config location | Notes |
| --- | --- | --- | --- | --- |
| **Claude Desktop** | HTTP through the claude.ai connector | No | Your claude.ai account | Your Claude plan can limit who adds connectors |
| **Claude Desktop Manual** | stdio through the `mcp-remote` bridge | Yes | `claude_desktop_config.json` | Restart required after editing |
| **Claude Code** | HTTP, native | No | CLI-managed | Add `--scope user` to make the server available in every project |
| **Codex** | HTTP, native | No | `~/.codex/config.toml` | |
| **Cursor** | HTTP, native | No | `.cursor/mcp.json` (project) or your global Cursor MCP config | Deeplink available |
| **Generic** | HTTP, native | No | Client-specific | Clients that support Streamable HTTP |

## Prerequisites

- A published profile and its connector URL. An unpublished profile returns no tools to the client even though the connection succeeds. See [Create a profile](/developers/mcp-create-a-profile).
- An MCP-compatible client. See [Pick an installation tab](#pick-an-installation-tab) for the six clients with generated snippets, or another client that supports Streamable HTTP.
- For the **Claude Desktop Manual** path or any other stdio-only client, install [Node.js](https://nodejs.org) to run the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge. Without Node.js, the `npx` command fails and the server never starts.
- A Contentstack account whose roles already allow the operations the profile exposes. You can connect without those roles, but a tool call fails at run time if your role does not permit it, because a profile never grants access beyond your existing roles. See [About Product Roles](/administration/about-product-roles) for product-level access, and [About Stack Roles](/headless-cms/about-stack-roles) for content tools.

## Connect

The first six sections below match the six installation tabs. The two Claude Desktop sections describe two ways to set up the same app, and [Generic](#generic-other-mcp-clients) covers the other clients that support Streamable HTTP, including ChatGPT.

All examples use the `asset_librarian` profile:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>
```

Replace the `profile_id` and organization UID with your own, or copy the ready-made snippet from the profile's **Installation** step. Each snippet names the server after the profile, replacing underscores with hyphens: the profile `content_explorer` becomes the server `content-explorer`.

### Claude Desktop (claude.ai connector)

The **Claude Desktop** tab adds the profile as a connector to your claude.ai account, not to the desktop application's config file. Claude on the web and the Claude desktop app both use connectors from that account. To configure the desktop application's own config file, use [Claude Desktop Manual](#claude-desktop-manual) below.

On the profile's **Installation** step, the **Claude Desktop** tab has an **Add to Claude** button. The button opens claude.ai with the connector name and URL filled in, and you confirm them to add the connector.

Your Claude plan can limit custom connectors to organization admins. On such a plan, the button has no effect for other users. For the alternatives, see [The Add to Claude button has no effect](#the-add-to-claude-button-has-no-effect).

To add the connector manually, follow the three steps below:

1. In your claude.ai settings, add a custom connector with a name, for example `Asset Librarian`, and the connector URL.
2. Complete the Contentstack OAuth sign-in in the browser.
3. Start a new conversation. The profile's tools are available in it.

### Claude Desktop Manual

Configure the Claude Desktop app through `claude_desktop_config.json` using the `mcp-remote` bridge. This setup requires Node.js.

Copy the snippet from the **Installation** step rather than typing it. The snippet contains the exact `mcp-remote` version that Contentstack currently pins. For the reason, see [Why Contentstack pins the mcp-remote version](#why-contentstack-pins-the-mcp-remote-version).

The block goes inside `mcpServers` and has the shape below, where `<PINNED_VERSION>` is the version the Installation step shows:

```json
{
  "mcpServers": {
    "asset-librarian": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@<PINNED_VERSION>",
        "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
      ]
    }
  }
}
```

**Restart after editing.** Claude Desktop reads `claude_desktop_config.json` only at launch, so until you restart it the server does not appear and Claude Desktop shows no error. Restart Claude Desktop.

**Sign in on first use.** On first use, a browser opens for Contentstack OAuth. If two browser tabs open, see [Two browser tabs open during sign-in](#two-browser-tabs-open-during-sign-in).

### Claude Code

Claude Code supports remote HTTP MCP servers natively. Add the profile with the command below:

```bash
claude mcp add --transport http asset-librarian "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

Quote the URL. Without quotes, the shell reads `?` and `&` as shell syntax rather than as part of the URL, and the command fails.

To make the server available in every project, add `--scope user`, as the command below shows:

```bash
claude mcp add --transport http --scope user asset-librarian "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

Then start sign-in from Claude Code, for example with the `/mcp` command, and complete the Contentstack sign-in in the browser.

### Codex

Add the section below to `~/.codex/config.toml`, one `[mcp_servers.<name>]` block per profile:

```toml
[mcp_servers.asset-librarian]
url = "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

On first use of a tool, Codex runs the browser OAuth flow.

### Cursor

The **Cursor** tab has an **Add to Cursor** button that opens Cursor and adds the profile as an MCP server.

To add it manually, add the server under `mcpServers` in `.cursor/mcp.json` (project level) or your global Cursor MCP config, as the snippet below shows:

```json
{
  "mcpServers": {
    "asset-librarian": {
      "url": "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
    }
  }
}
```

Reload Cursor so it reads the new configuration. On first tool use, Cursor opens a browser for Contentstack OAuth.

### Generic (other MCP clients)

MCP clients that support Streamable HTTP connect directly. Add the connector URL from the **Generic** tab to the client as a remote HTTP MCP server. On the first call, the client discovers the authorization endpoints and signs you in over OAuth. Do not add bearer tokens or API keys. A manually added Authorization header replaces the OAuth handshake, so the server rejects the call.

#### ChatGPT

ChatGPT connects to remote MCP servers as custom connectors, and your ChatGPT plan determines whether custom connectors are available. To connect a profile, follow the three steps below:

1. In ChatGPT, add a custom connector with a name and the connector URL.
2. Complete the Contentstack OAuth sign-in and approve the scopes.
3. Enable the connector in a conversation, then ask ChatGPT to perform a task that the profile's tools cover.

### Clients that support only stdio

For a client that supports only stdio, connect through the `mcp-remote` bridge with the same config shape that the [Claude Desktop Manual](#claude-desktop-manual) section shows.

## Verify

The client lists the connected server and its tools once authorization completes. Ask the agent to perform a task the profile's tools cover, for example:

> List the assets in my stack.

## Authentication and permissions

MCP Profile Hub authenticates you through standard OAuth. You do not create, share, or rotate an API key to sign in.

### How a client authenticates

1. The client connects to the profile endpoint.
2. It discovers the authorization endpoints automatically and runs OAuth 2.1 with Proof Key for Code Exchange (PKCE), registering itself through Dynamic Client Registration, so you configure no client ID and no client secret.
3. A browser opens. You sign in to Contentstack and approve the requested scopes.
4. The client receives an access token and a refresh token, caches them locally, and refreshes the access token automatically.

### Scopes come from the tool selection

Contentstack derives the OAuth scopes a profile requests from the tools it exposes. A read-only profile requests only read scopes, and a profile with a publishing tool also requests the scope needed to publish. You approve the concrete set in the browser at connect time.

When you add tools to a profile, it can therefore request more scopes. Connected users approve the new ones the next time they sign in.

### A profile never grants more than your roles allow

Every call runs with your own Contentstack roles.

- You can perform only the operations your account already allows.
- A profile narrows what is available to the agent. It never grants access your roles do not already allow.
- A call that exceeds your permissions fails.

The table below answers common questions about sign-in and permissions:

| Question | Answer |
| --- | --- |
| Do I need to create an API key? | No. Sign-in is OAuth, through the browser |
| Is the connector URL sensitive? | Not by default. The `profile_id` names a profile and is not a secret. A URL that includes the [`apikey` parameter](/developers/mcp-url-parameters) also contains your stack API key |
| Can a shared profile give someone extra access? | No. Each person connects with their own sign-in and their own roles |

## Why Contentstack pins the mcp-remote version

The generated snippets pin `mcp-remote` to a specific version instead of the latest release. Copy the version from the **Installation** step, which shows the version that Contentstack currently pins.

Because `mcp-remote` names its OAuth credential directory under `~/.mcp-auth/` after its own version, each new version reads a different directory. An unpinned `npx -y mcp-remote` command therefore reads an empty credential directory after each new `mcp-remote` release, and the client prompts you to authorize again.

When Contentstack updates the pinned version, the new version also reads an empty credential directory, so each user signs in again. After you sign in, the client reconnects.

## Troubleshooting

### The Add to Claude button has no effect

**Root Cause**: Your Claude plan restricts custom connectors to organization admins.

**Resolution**: Use the **Claude Desktop Manual** tab instead, or ask a Claude organization admin to add the connector.

### Two browser tabs open during sign-in

**Root Cause**: Claude Desktop's sign-in for servers that you add through the manual config occasionally opens two browser tabs at once.

**Resolution**: Complete the sign-in in the first tab and close the other. If the profile's tools still do not appear, restart Claude Desktop and sign in again.

### The claude mcp add command fails

**Root Cause**: An unquoted connector URL lets the shell read `?` and `&` as shell syntax instead of part of the URL.

**Resolution**: Keep the URL quoted when you run `claude mcp add`.

### The server does not appear after editing claude_desktop_config.json

**Root Cause**: Claude Desktop reads `claude_desktop_config.json` only at launch.

**Resolution**: Restart Claude Desktop.

> **Additional Resource:** For more information on failures this list does not cover, refer to the [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot) documentation. Start with the **Executions** view in the app, which shows the error message and request metadata for most failures.

## Next Steps

- [MCP URL parameters](/developers/mcp-url-parameters): configure a stack, branch, or project from the connector URL.
- [Profiles and catalogs](/developers/mcp-profiles-and-catalogs): what a profile exposes.
- [Authentication and permissions](#authentication-and-permissions): the OAuth sign-in flow, and why a profile can never grant more access than your roles allow.
- [Contentstack MCP Server](/developers/contentstack-mcp-server): the locally installed alternative, which exposes the full toolset on one machine instead of a scoped hosted profile.
