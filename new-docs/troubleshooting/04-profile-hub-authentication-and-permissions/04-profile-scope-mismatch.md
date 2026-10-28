# Profile scope mismatch error

**Applies to:** MCP Profile Hub

**Root cause**

The client requested a profile other than the one the connector URL specifies.

**Resolution**

Use the [connector URL](/docs/developers/mcp-profile-hub-url-parameters#a-connector-url-is-scoped-to-one-profile) of the profile you want. The `profile_id` in the URL determines which profile the client can use.
