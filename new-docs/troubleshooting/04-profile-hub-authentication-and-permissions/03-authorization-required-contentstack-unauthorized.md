# authorization_required error with reason contentstack_unauthorized

**Applies to:** MCP Profile Hub

The client receives JSON-RPC error code `-32010` with the message `authorization_required`, and the `reason` field holds `contentstack_unauthorized`.

**Root cause**

Contentstack rejected the token, and the token refresh also failed.

**Resolution**

Reconnect and [sign in again](/docs/developers/mcp-profile-hub-connect-a-client-to-profile-hub#authentication-and-permissions).
