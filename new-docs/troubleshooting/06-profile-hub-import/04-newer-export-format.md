# Profile import fails because a newer version of MCP Profile Hub exported the file

**Applies to:** MCP Profile Hub

The app shows the heading `Couldn't import profile`, then the message below:

```
That file was exported by a newer version of MCP Profile Hub (format v2). Update, then import it.
```

**Root cause**

The file uses a newer export format than your organization's version of MCP Profile Hub reads.

**Resolution**

Contentstack hosts and updates MCP Profile Hub centrally, so you cannot apply the update that the message requests. Export the profile again from a source organization on your version, or import the file after Contentstack updates MCP Profile Hub for your organization.
