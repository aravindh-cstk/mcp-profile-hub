# Profile import fails because the JSON is not an exported profile

**Applies to:** MCP Profile Hub

The app shows the heading `Couldn't import profile`, then the message below:

```
That JSON isn't an exported profile. Pick a file exported from MCP Profile Hub.
```

**Root cause**

The file holds valid JSON, but MCP Profile Hub did not export it.

**Resolution**

Export the profile from the source organization, then import that file.
