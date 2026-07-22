---
uid: ""
url: /docs/mcp/connect-a-client-to-profile-hub
seo_title: Connect a client to MCP Profile Hub
seo_description: Connect Claude, Claude Code, Cursor, Codex, ChatGPT, or any MCP client to an MCP Profile Hub profile over HTTP, with OAuth sign-in in the browser.
---

# Connect a client to MCP Profile Hub

Every profile is a remote MCP server you connect to over Streamable HTTP. OAuth handles sign-in in the browser on first connect. No keys, management tokens, or delivery tokens go into client config. For the sign-in flow, see [MCP authentication](/docs/mcp/mcp-authentication).

All examples use the `asset_librarian` profile. Swap in your own `profile_id`, or copy the ready-made snippet from the profile's **Installation** step.

```
https://mcp-hub.contentstack.com/api/mcp?profile_id=asset_librarian
```

## Use this when

- You want a scoped Contentstack toolset in an AI client, including web clients.
- You want to share the same profile across a team.
- For the full product comparison, see [MCP at Contentstack](/docs/mcp/mcp-at-contentstack).

## Prerequisites

- A published profile and its connector URL. See [Create a profile](/docs/mcp/create-a-profile).
- An MCP-compatible client.
- For clients that support only stdio, Node.js installed to run the `mcp-remote` bridge.

## Connect

### Claude Desktop

The recommended path is a custom connector. On the profile's **Installation** step, the **Claude Desktop** tab has an **Add to Claude** button that opens the claude.ai **Add custom connector** dialog pre-filled. Review and click **Add**.

To add it by hand:

1. Open **Settings > Connectors > Add custom connector** on claude.ai.
2. Set a name, for example `Asset Librarian`.
3. Paste the connector URL and click **Add**.
4. Complete the browser OAuth sign-in when prompted.

You can also configure the Claude Desktop app through `claude_desktop_config.json` using the `mcp-remote` bridge, which proxies the remote server over stdio and handles OAuth. This requires Node.js.

```json
{
  "mcpServers": {
    "asset-librarian": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp-hub.contentstack.com/api/mcp?profile_id=asset_librarian"
      ]
    }
  }
}
```

Restart Claude Desktop. On first use, a browser opens for Contentstack OAuth. Approve the scopes and the profile's tools appear.

### Claude Code

Claude Code supports remote HTTP MCP servers natively:

```bash
claude mcp add --transport http asset-librarian "https://mcp-hub.contentstack.com/api/mcp?profile_id=asset_librarian"
```

Keep the URL quoted so the shell does not interpret `?` and `&`. To make the server available in every project, add `--scope user`. Then run `/mcp` inside Claude Code, pick the server, and complete the browser sign-in.

### Cursor

Add the server under `mcpServers` in `.cursor/mcp.json` (project level) or your global Cursor MCP config:

```json
{
  "mcpServers": {
    "asset-librarian": {
      "type": "http",
      "url": "https://mcp-hub.contentstack.com/api/mcp?profile_id=asset_librarian"
    }
  }
}
```

Open **Cursor Settings > MCP** or reload. On first tool use, Cursor opens a browser for Contentstack OAuth.

### ChatGPT and Codex

For the OpenAI Codex CLI, add this block to `~/.codex/config.toml`, one `[mcp_servers.<name>]` block per profile:

```toml
[mcp_servers.asset-librarian]
url = "https://mcp-hub.contentstack.com/api/mcp?profile_id=asset_librarian"
```

On first use of a tool, Codex runs the browser OAuth flow.

ChatGPT connects to remote MCP servers as custom connectors. The exact menu names depend on your plan, so check OpenAI's current connector documentation.

1. In ChatGPT, open **Settings > Connectors**.
2. Choose **Add custom connector**, give it a name, and paste the connector URL.
3. Save, then complete the Contentstack OAuth sign-in and approve the scopes.

Enable the connector in a conversation, then ask ChatGPT to do something the profile supports.

### Other MCP clients

Any MCP-compatible client can connect. Point it at the profile URL as a remote HTTP MCP server. Auth endpoints are discovered automatically. Do not add bearer tokens or API keys.

For clients that support only stdio, bridge with [mcp-remote](https://www.npmjs.com/package/mcp-remote) (requires Node.js), using the same config shape shown for Claude Desktop.

## Verify

Most clients list the connected server and its tools once auth completes. Ask the agent to do something the profile supports, for example:

> List the assets in my stack.

If tools do not appear or the call fails, see Troubleshooting below.

## Reference

- [MCP authentication](/docs/mcp/mcp-authentication): the OAuth sign-in flow and token handling.
- [Profiles and catalogs](/docs/mcp/profiles-and-catalogs): what a profile exposes.
- [Create a profile](/docs/mcp/create-a-profile): build or edit a profile.

## Troubleshooting

Start with the **Executions** view in the MCP Profile Hub app. Most execution failures show a clear error message and request metadata there.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Client shows the server but no tools | OAuth not completed | Trigger the sign-in (for example, `/mcp` in Claude Code) and finish the browser flow |
| Browser never opens for sign-in | Client cannot reach the auth discovery endpoint | Confirm the URL is exactly `https://mcp-hub.contentstack.com/api/mcp?profile_id=<id>` |
| `mcp-remote` fails to start | Node.js missing, or `npx` blocked | Install Node.js and ensure `npx -y mcp-remote` can run |
| Auth loops or repeated sign-in | Stale cached token | Clear the client's cached MCP credentials and reconnect. For `mcp-remote`, remove its local auth cache at `~/.mcp-auth` and retry |
| Permission denied on a tool | Your Contentstack role cannot perform the operation | Use an account with the needed role, or a profile scoped to what you can do |
| No stack selected | The profile has no stack configured and none was passed | Configure a stack in the profile's **Configuration** step, or pass the stack in the tool arguments |

For authentication errors and more execution details, see [MCP authentication](/docs/mcp/mcp-authentication) and the Executions log.
