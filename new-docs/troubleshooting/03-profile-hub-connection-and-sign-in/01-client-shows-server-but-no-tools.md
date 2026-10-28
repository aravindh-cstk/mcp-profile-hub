# The client shows the server but no tools

**Applies to:** MCP Profile Hub

**Root causes**

- You did not finish the Open Authorization (OAuth) sign-in.
- Contentstack disabled the profile. A disabled profile returns an empty tool list.

**Resolution**

1. Start the sign-in again from your client, for example with `/mcp` in Claude Code, and complete the browser flow.
2. If the sign-in completes and the client still lists no tools, Contentstack [disabled the profile](/docs/developers/mcp-profile-hub-manage-profiles#enable-and-disable-a-profile). The app provides no control for this setting, so contact [Contentstack support](mailto:support@contentstack.com).
