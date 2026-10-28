# CMA tool calls fail with authentication errors when no OAuth session exists

**Applies to:** Contentstack MCP Server

**Root cause**

The server has no OAuth session, and the configuration provides no management token.

**Resolution**

Use one of the two options below:

- Run `npx @contentstack/mcp --auth` and complete the sign-in, so the server has an OAuth session.
- Set `CONTENTSTACK_MANAGEMENT_TOKEN` and `CONTENTSTACK_REGION`. A management token authenticates only the CMA and CMA Extended groups, and the region tells the server which data center to call.

> **Additional Resource:** For more information on the management token option, refer to the [Authenticating without OAuth](/docs/developers/contentstack-mcp-server#authenticating-without-oauth-management-token) section of the Contentstack MCP Server documentation.
