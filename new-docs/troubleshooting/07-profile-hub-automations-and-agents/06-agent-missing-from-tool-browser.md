# An agent is missing from the tool browser

**Applies to:** MCP Profile Hub

**Root causes**

- The agent is unpublished or inactive.
- The agent has no HTTP trigger.
- The agent uses a secure trigger, which Profile Hub does not support yet.
- You fixed the agent less than five minutes ago.

**Resolution**

1. In Agent OS, publish and activate the agent, add an HTTP trigger, and turn off Secure HTTP Trigger.
2. Wait up to five minutes before you reopen the tool browser.
