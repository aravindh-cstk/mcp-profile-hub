# The claude mcp add command fails

**Applies to:** MCP Profile Hub, Claude Code tab

**Root cause**

The connector URL has no quotes around it, so the shell reads `?` and `&` as shell syntax instead of as part of the URL.

**Resolution**

Keep the connector URL in quotes when you run `claude mcp add`.
