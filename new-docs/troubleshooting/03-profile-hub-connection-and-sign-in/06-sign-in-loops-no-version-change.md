# Sign-in loops with no version change

**Applies to:** MCP Profile Hub

**Root cause**

The client holds a stale cached token.

**Resolution**

Clear the client's cached MCP credentials and reconnect, with the step below for your client:

- **For `mcp-remote`:** delete the version-specific subdirectory under `~/.mcp-auth`, then retry.
- **In Claude Code:** run `/mcp` and sign in again.

> **Warning:** `~/.mcp-auth` holds cached OAuth credentials for every MCP server you connect through `mcp-remote`, not only Contentstack. If you delete the whole directory, you sign out of all of them, and each one prompts for authorization again on next use.
