# Launch tool calls fail with authentication errors

**Applies to:** Contentstack MCP Server

**Root cause**

The server configuration does not set `CONTENTSTACK_ORGANIZATION_UID`. The Launch group needs the organization UID in addition to OAuth.

**Resolution**

1. Copy the organization UID from your project's URL in the Launch dashboard, or from your organization settings.
2. Add it to the server configuration as `CONTENTSTACK_ORGANIZATION_UID`, or pass it with `--organization-uid`.
