# Saving a profile fails because the plan does not include a catalog

**Applies to:** MCP Profile Hub

The app shows the message below, where `<CATALOGS>` names the excluded catalogs:

```
This organization's plan does not include <CATALOGS>.
```

**Root cause**

The profile contains tools from a catalog that your organization's plan excludes.

**Resolution**

Remove the tools that belong to the excluded [catalog](/docs/developers/mcp-profile-hub-profiles-and-catalogs#plan-gated-catalogs), then save the profile again.
