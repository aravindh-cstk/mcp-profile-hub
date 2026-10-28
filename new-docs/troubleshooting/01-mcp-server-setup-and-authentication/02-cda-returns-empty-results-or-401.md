# CDA tool calls return empty results or 401 errors

**Applies to:** Contentstack MCP Server

**Root causes**

- `CONTENTSTACK_DELIVERY_TOKEN` is missing or incorrect.
- The delivery token belongs to a different environment than the one you query.

**Resolution**

1. Check the value of `CONTENTSTACK_DELIVERY_TOKEN` in the server configuration.
2. Confirm that the delivery token belongs to the environment you query. If it does not, create a delivery token for that environment and set it as `CONTENTSTACK_DELIVERY_TOKEN`.

> **Additional Resource:** For more information on where each credential comes from, refer to the [Where to find your credentials](/docs/developers/contentstack-mcp-server#where-to-find-your-credentials) section of the Contentstack MCP Server documentation.
