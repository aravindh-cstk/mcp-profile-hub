# mcp-remote fails to start, and Node.js is present

**Applies to:** MCP Profile Hub, clients that run the `mcp-remote` bridge

**Root cause**

A registry allowlist, an execution policy, or a proxy blocks `npx` from reaching the npm registry.

**Resolution**

Use one of the two options below:

- Install `mcp-remote` globally from an approved registry, and configure the client to run the installed binary instead of `npx`.
- Ask your IT team to allowlist the `mcp-remote` package.
