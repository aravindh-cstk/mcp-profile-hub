# "Unauthorized" errors on CMA, Analytics, or Launch tool calls

**Applies to:** Contentstack MCP Server

Tool calls in an OAuth group, for example CMA, Analytics, or Launch, fail with an `Unauthorized` error.

**Root causes**

- You have not run the OAuth flow on this machine.
- The OAuth tokens that the server saved on this machine have expired.

**Resolution**

Run the command below, then complete the sign-in in the browser window it opens:

```
npx @contentstack/mcp --auth
```

> **Additional Resource:** For more information on which groups use OAuth, refer to the [Authentication](/docs/developers/contentstack-mcp-server#authentication) section of the Contentstack MCP Server documentation.
