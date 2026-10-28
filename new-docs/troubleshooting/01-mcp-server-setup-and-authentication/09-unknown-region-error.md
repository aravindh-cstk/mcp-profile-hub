# "Unknown region" error when the server starts

**Applies to:** Contentstack MCP Server

**Root cause**

The value of `--region` or `CONTENTSTACK_REGION` contains a misspelling. The server returns this error when it does not recognize the region value.

**Resolution**

Use a supported region code or alias, for example `EU` or `aws-eu`. Aliases ignore case and separators, so `eu` and `AWS_EU` also resolve to the EU region.

> **Additional Resource:** For more information on every code and alias, refer to the [Supported regions](/docs/developers/contentstack-mcp-server#supported-regions) section of the Contentstack MCP Server documentation.
