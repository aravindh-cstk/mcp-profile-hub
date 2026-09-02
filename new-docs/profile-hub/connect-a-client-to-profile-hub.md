---
uid: ""
url: /developers/mcp-connect-a-client-to-profile-hub
seo_title: Connect a client to MCP Profile Hub
seo_description: Connect Claude, Claude Code, Cursor, Codex, ChatGPT, or any MCP client to an MCP Profile Hub profile over HTTP, with OAuth sign-in in the browser.
---

# Connect a client to MCP Profile Hub

## Overview

Every profile is a remote MCP server you connect to over Streamable HTTP, and Open Authorization (OAuth) handles sign-in in the browser on first connect. No keys, management tokens, or delivery tokens go into client config. Tool calls then run against live stack data with your own Contentstack roles, so check what a shared profile exposes before connecting to it, because a profile can include create, update, delete, and publish tools.

## Use this when

- You want a scoped Contentstack toolset in an AI client, including web clients.
- You want to share the same profile across a team.

## Pick an installation tab

The profile's **Installation** step offers six tabs. Each one generates a snippet for you to copy.

| Tab | Transport | Needs Node.js | Config location | Notes |
| --- | --- | --- | --- | --- |
| `Claude Desktop` | HTTP through the claude.ai connector | No | Added in the browser on claude.ai | Admin-only on Enterprise and Team plans |
| `Claude Desktop Manual` | stdio through the `mcp-remote` bridge | Yes | `claude_desktop_config.json` | Restart required after editing |
| `Claude Code` | HTTP, native | No | CLI-managed | Add `--scope user` to make the server available in every project |
| `Codex` | HTTP, native | No | `~/.codex/config.toml` | No notes |
| `Cursor` | HTTP, native | No | `.cursor/mcp.json` (project) or your global Cursor MCP config | Deeplink available |
| `Generic` | HTTP, native | No | Client-specific | Any client that speaks Streamable HTTP |

## Prerequisites

- A published profile and its connector URL. An unpublished profile returns no tools to the client even though the connection succeeds. See [Create a profile](/developers/mcp-create-a-profile).
- An MCP-compatible client. See [Pick an installation tab](#pick-an-installation-tab) for the six clients with generated snippets, or any client that speaks Streamable HTTP.
- For the **Claude Desktop Manual** path or any other stdio-only client, install Node.js to run the `mcp-remote` bridge. Without Node.js, the `npx` command fails and the server never starts.
- A Contentstack account whose roles already allow the operations the profile exposes. Connecting succeeds regardless, but a tool call fails at run time if your role does not permit it, because a profile never grants access beyond your existing roles. See [About Product Roles](https://www.contentstack.com/docs/administration/about-product-roles) for organization-level access, and [About Stack Roles](https://www.contentstack.com/docs/headless-cms/about-stack-roles) for content tools.

## Connect

The six sections below are not six separate clients. The two Claude Desktop sections are two ways to set up the same app, and [Generic](#generic-any-mcp-client) covers every client without a named section, including ChatGPT.

All examples use the `asset_librarian` profile:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>
```

Swap in your own `profile_id` and organization UID, or copy the ready-made snippet from the profile's **Installation** step. Each snippet names the server after the profile, replacing underscores with hyphens: the profile `content_explorer` becomes the server `content-explorer`.

### Claude Desktop (claude.ai connector)

Despite the tab name, this path configures Claude on the **claude.ai website**, not the desktop application. Use it when you want the profile available in Claude on the web and in the desktop app through your claude.ai account. To configure the desktop application's own config file, use [Claude Desktop Manual](#claude-desktop-manual) below.

On the profile's **Installation** step, the **Claude Desktop** tab has an **Add to Claude** button. Click it to open the claude.ai **Add custom connector** dialog with the name and URL already filled in. Review them, then click **Add**.

Claude Enterprise and Team plans restrict custom connectors to organization admins, so this button does not work for most seats. Use the **Claude Desktop Manual** tab instead, or ask an admin to add the connector for your organization.

To add it manually on claude.ai:

1. Open **Settings > Connectors > Add custom connector**.
2. Set a name, for example `Asset Librarian`.
3. Paste the connector URL and click **Add**.
4. Complete the browser OAuth sign-in when claude.ai prompts you.
5. Confirm the connector appears in **Settings > Connectors**. Its tools become available in a new conversation. If it does not appear, confirm your plan allows custom connectors, as described above.

### Claude Desktop Manual

Configure the Claude Desktop app through `claude_desktop_config.json` using the `mcp-remote` bridge, which proxies the remote server over stdio and handles OAuth. This requires Node.js.

Copy the snippet from the **Installation** step rather than typing it out. It carries the exact `mcp-remote` version Contentstack currently pins, and pinning that version is deliberate. See [Why Contentstack pins the mcp-remote version](#why-contentstack-pins-the-mcp-remote-version).

The block goes inside `mcpServers` and has this shape, where `<PINNED_VERSION>` is the version the Installation step shows:

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

Claude Desktop reads `claude_desktop_config.json` only at launch, so until you restart it the server does not appear and no error is shown. Restart Claude Desktop.

On first use, a browser opens for Contentstack OAuth. When you add a server this way, Claude Desktop's sign-in occasionally opens two browser tabs at once. Complete the sign-in in the first tab and close the other. If the profile's tools still do not appear, restart Claude Desktop and sign in again.

### Claude Code

Claude Code supports remote HTTP MCP servers natively:

```bash
claude mcp add --transport http asset-librarian "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

Quote the URL. Without quotes, the shell reads `?` and `&` as shell syntax rather than as part of the URL, and the command fails.

To make the server available in every project, add `--scope user`:

```bash
claude mcp add --transport http --scope user asset-librarian "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

Then run `/mcp` inside Claude Code, pick the server, and complete the browser sign-in.

### Codex

Add this section to `~/.codex/config.toml`, one `[mcp_servers.<name>]` block per profile:

```toml
[mcp_servers.asset-librarian]
url = "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
```

On first use of a tool, Codex runs the browser OAuth flow.

### Cursor

The **Cursor** tab has an **Add to Cursor** button that opens Cursor and adds the profile as an MCP server. Cursor asks you to confirm before it installs.

To add it manually, add the server under `mcpServers` in `.cursor/mcp.json` (project level) or your global Cursor MCP config:

```json
{
  "mcpServers": {
    "asset-librarian": {
      "url": "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=asset_librarian&org_uid=<ORG_UID>"
    }
  }
}
```

Open **Cursor Settings > MCP** or reload. On first tool use, Cursor opens a browser for Contentstack OAuth.

### Generic (any MCP client)

Any MCP-compatible client can connect. Point it at the connector URL from the **Generic** tab as a remote HTTP MCP server. It discovers the auth endpoints and authorizes over OAuth on the first call. A manually added Authorization header pre-empts the OAuth handshake and the server rejects the call, so do not add bearer tokens or API keys.

#### ChatGPT

ChatGPT connects to remote MCP servers as custom connectors. The exact menu names depend on your plan, so check OpenAI's current connector documentation.

1. In ChatGPT, open **Settings > Connectors**.
2. Choose **Add custom connector**, give it a name, and paste the connector URL.
3. Save, then complete the Contentstack OAuth sign-in and approve the scopes.

Enable the connector in a conversation, then ask ChatGPT to do something the profile supports.

### Clients that support only stdio

For any client that supports only stdio, bridge with [mcp-remote](https://www.npmjs.com/package/mcp-remote) using the same config shape the [Claude Desktop Manual](#claude-desktop-manual) section shows.

## Verify

Most clients list the connected server and its tools once auth completes. Ask the agent to do something the profile supports, for example:

> List the assets in my stack.

## Authentication and permissions

MCP Profile Hub uses standard OAuth. There are no API keys to paste, share, or rotate.

### How a client authenticates

1. The client connects to the profile endpoint.
2. It discovers the authorization endpoints automatically and runs OAuth 2.1 with Proof Key for Code Exchange (PKCE), registering itself through Dynamic Client Registration. You configure no client ID and no client secret.
3. A browser opens. You sign in to Contentstack and approve the requested scopes.
4. The client receives a short-lived token, caches it locally, and refreshes it as needed.

### Scopes come from the tool selection

Contentstack derives the OAuth scopes a profile requests from the tools it exposes. A read-only profile requests only read scopes, and adding a publishing tool pulls in the scope needed to publish. You approve the concrete set in the browser at connect time.

Adding tools to a profile can therefore widen its scopes. Connected users approve the new ones the next time they sign in.

### A profile never grants more than your roles allow

Every call runs with your own Contentstack roles.

- You can perform only the operations your account already allows.
- A profile narrows what is available to the agent. It never widens what you can reach.
- A call that exceeds your permissions fails. The profile is a gate, never an escalation path.

See [About Product Roles](https://www.contentstack.com/docs/administration/about-product-roles) for organization-level access, and [About Stack Roles](https://www.contentstack.com/docs/headless-cms/about-stack-roles) for content tools.

| Question | Answer |
| --- | --- |
| Do I need to create an API key? | No. Sign-in is OAuth, through the browser |
| Is the connector URL sensitive? | No. The `profile_id` names a profile and is not a secret |
| Can a shared profile give someone extra access? | No. Each person connects with their own sign-in and their own roles |

## Why Contentstack pins the mcp-remote version

The generated snippets pin `mcp-remote` to an exact version rather than always taking the newest one. Take the version from the **Installation** step, which always shows the current one.

`mcp-remote` names its OAuth credential directory after its own version, under `~/.mcp-auth/`. An unpinned `npx -y mcp-remote` moves to an empty credential store every time a new version publishes, and the client asks you to authorize again for no visible reason.

Contentstack raises the pinned version from time to time. When that happens, every user signs in once more, because the new version reads a different credential directory. That single re-authorization is expected and needs no action beyond completing it.

## Troubleshooting

### The Add to Claude button does nothing

**Root Cause**: Claude Enterprise and Team plans restrict custom connectors to organization admins.

**Resolution**: Use the **Claude Desktop Manual** tab instead, or ask an admin to add the connector for your organization.

### Two browser tabs open during sign-in

**Root Cause**: Claude Desktop's sign-in for servers added through the manual config occasionally opens two browser tabs at once.

**Resolution**: Complete the sign-in in the first tab and close the other. If the profile's tools still do not appear, restart Claude Desktop and sign in again.

### The claude mcp add command fails

**Root Cause**: An unquoted connector URL lets the shell read `?` and `&` as shell syntax instead of part of the URL.

**Resolution**: Keep the URL quoted when you run `claude mcp add`.

### The server does not appear after editing claude_desktop_config.json

**Root Cause**: Claude Desktop reads `claude_desktop_config.json` only at launch.

**Resolution**: Restart Claude Desktop.

If tools do not appear or a call fails for another reason, see [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot). Start with the **Executions** view in the app, which shows a clear error message and request metadata for most failures.

## Next Steps

- [MCP URL parameters](/developers/mcp-url-parameters): configure a stack, branch, or project from the connector URL.
- [Profiles and catalogs](/developers/mcp-profiles-and-catalogs): what a profile exposes.
- [Authentication and permissions](#authentication-and-permissions): how OAuth sign-in works, and why a profile can never grant more access than your roles allow.
- [Contentstack MCP Server](https://www.contentstack.com/docs/developers/contentstack-mcp-server): the locally installed alternative, for when you want the full toolset on one machine instead of a scoped hosted profile.
