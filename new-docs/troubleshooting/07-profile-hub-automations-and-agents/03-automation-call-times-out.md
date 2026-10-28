# An automation call times out

**Applies to:** MCP Profile Hub

The error message contains `did not respond within <MS>ms`.

**Root cause**

The automation ran longer than the profile's timeout.

**Resolution**

Raise `timeout` on the [connector URL](/docs/developers/mcp-profile-hub-url-parameters). Contentstack caps it at 120000 ms.
