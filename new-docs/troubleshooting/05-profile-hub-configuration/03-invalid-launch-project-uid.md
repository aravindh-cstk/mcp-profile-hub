# Invalid "launch_project_uid" in the MCP endpoint URL

**Applies to:** MCP Profile Hub

**Root cause**

The project UID in the connector URL is not 1 to 64 characters of letters, digits, hyphens, or underscores.

**Resolution**

Correct the [parameter](/docs/developers/mcp-profile-hub-url-parameters#validation) in the connector URL so that it matches that format.
