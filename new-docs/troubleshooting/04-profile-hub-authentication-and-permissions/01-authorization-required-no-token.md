# authorization_required error with reason no_token or local_token_unavailable

**Applies to:** MCP Profile Hub

The client receives JSON-RPC error code `-32010` with the message `authorization_required`, and the `reason` field holds `no_token` or `local_token_unavailable`.

**Root cause**

You have not completed the OAuth sign-in for this profile, or the stored token expired.

**Resolution**

Reconnect and [sign in again](/docs/developers/mcp-profile-hub-connect-a-client-to-profile-hub#authentication-and-permissions). The error also includes an `authorization_url` that you can open directly.
