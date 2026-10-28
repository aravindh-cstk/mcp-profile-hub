# Profile import fails because the plan does not include a catalog

**Applies to:** MCP Profile Hub

The app shows the heading `Couldn't import profile`, then the message below:

```
This organization's plan does not include launch. Remove the tools from that catalog and save again.
```

**Root cause**

The file contains tools from a catalog that your organization's plan excludes.

**Resolution**

Remove those tools from the file, or import it into an organization whose plan includes the catalog. The [Profiles and catalogs](/docs/developers/mcp-profile-hub-profiles-and-catalogs#plan-gated-catalogs) documentation lists the plan-gated catalogs.
