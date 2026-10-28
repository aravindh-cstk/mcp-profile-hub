# npx asks for confirmation when the MCP client starts the server

**Applies to:** Contentstack MCP Server

**Root cause**

The `args` array in the client configuration does not include the `-y` flag, so `npx` waits for you to confirm the package installation.

**Resolution**

Add `"-y"` as the first argument after `npx`, as in the configuration below:

```
"command": "npx",
"args": ["-y", "@contentstack/mcp"]
```
