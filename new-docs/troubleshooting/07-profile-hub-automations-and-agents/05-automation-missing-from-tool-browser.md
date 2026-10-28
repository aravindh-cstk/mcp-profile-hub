# An automation is missing from the tool browser

**Applies to:** MCP Profile Hub

**Root causes**

- The automation's first step is not an HTTP trigger.
- The automation is not active.
- You fixed the automation less than five minutes ago.

**Resolution**

Fix the automation in Automate, then wait up to five minutes before you reopen the tool browser. Contentstack caches the discovered list on the server for five minutes, so if you reopen the tool browser sooner, it shows the same list.
