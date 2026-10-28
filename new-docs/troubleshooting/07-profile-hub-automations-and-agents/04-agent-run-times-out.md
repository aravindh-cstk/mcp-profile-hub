# An agent run times out before it finishes

**Applies to:** MCP Profile Hub

The error message reads as below, where `<STATUS>` is the state of the run:

```
The agent was still <STATUS> when the tool timed out.
```

**Root cause**

The agent run exceeded the profile's timeout, which Contentstack caps at 120000 ms.

**Resolution**

Raise `timeout` on the [connector URL](/docs/developers/mcp-profile-hub-url-parameters), up to 120000 ms. If the run needs more than 120000 ms, look up the reported execution ID in Agent OS to see the result.
