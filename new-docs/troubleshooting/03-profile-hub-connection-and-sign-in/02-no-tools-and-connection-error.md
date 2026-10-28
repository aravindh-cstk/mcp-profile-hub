# No tools appear, and the connection reports an error

**Applies to:** MCP Profile Hub

**Root cause**

The connector URL contains a malformed project UID. A malformed project UID fails the whole tool listing, not only the tools of the affected product.

**Resolution**

Correct the project UID in the connector URL. The [MCP URL parameters](/docs/developers/mcp-profile-hub-url-parameters#validation) documentation gives the accepted format for each parameter.
