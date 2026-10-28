# The client asks you to authorize repeatedly

**Applies to:** MCP Profile Hub, clients that run the `mcp-remote` bridge

**Root cause**

Contentstack raised the pinned `mcp-remote` version, and the new version stores credentials in a new, empty directory.

**Resolution**

Sign in again. A [version change](/docs/developers/mcp-profile-hub-connect-a-client-to-profile-hub#why-contentstack-pins-the-mcp-remote-version) triggers this prompt and does not indicate a fault.
