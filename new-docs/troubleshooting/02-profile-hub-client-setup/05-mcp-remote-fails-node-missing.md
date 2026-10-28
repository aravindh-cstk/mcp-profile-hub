# mcp-remote fails to start, and Node.js is missing

**Applies to:** MCP Profile Hub, clients that run the `mcp-remote` bridge

**Root cause**

The machine has no Node.js installation, so `npx` cannot run `mcp-remote`.

**Resolution**

Install Node.js, then confirm that `npx -y mcp-remote` runs.
