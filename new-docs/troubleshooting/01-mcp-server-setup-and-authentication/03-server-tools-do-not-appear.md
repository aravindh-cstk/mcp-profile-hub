# Contentstack MCP Server tools do not appear in your MCP client

**Applies to:** Contentstack MCP Server

**Root cause**

The `GROUPS` value contains a typo or a space, so the server does not recognize the groups it names.

**Resolution**

Set `GROUPS` to a comma-separated list of group values with no spaces, as in the example below:

```
GROUPS=cma,cda
```

> **Additional Resource:** For more information on the accepted group values, refer to the [GROUPS variable](/docs/developers/contentstack-mcp-server#the-groups-variable) section of the Contentstack MCP Server documentation.
