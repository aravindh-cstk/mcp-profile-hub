# "Tool not found" error

**Applies to:** MCP Profile Hub

**Root causes**

- Someone removed the tool from the profile's **Tool selection** step.
- The client still holds a tool list that it fetched before the profile changed. Contentstack does not notify a connected client that the list changed.

**Resolution**

1. List the tools again in the client, by reconnecting or by running the client's server-refresh command.
2. If the tool is still absent, confirm that the profile's **Tool selection** step still lists it.
