# Requests reach the wrong data center, or return 404 or 401

**Applies to:** Contentstack MCP Server

**Root cause**

The configuration sets no region, and no OAuth session exists to supply one, so the server sends requests to the default region, `NA`. A configuration that uses only a delivery token or only a management token always lacks an OAuth session.

**Resolution**

Set `CONTENTSTACK_REGION`, or pass `--region`, with the code of your stack's data center.

> **Additional Resource:** For more information on the region codes, refer to the [Supported regions](/docs/developers/contentstack-mcp-server#supported-regions) section of the Contentstack MCP Server documentation.
