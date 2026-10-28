# Lytics tool calls return 403

**Applies to:** Contentstack MCP Server

**Root cause**

The Lytics access token has expired, or it holds an incorrect value. The Lytics group does not use OAuth, so the server sends only the token that `LYTICS_ACCESS_TOKEN` holds.

**Resolution**

1. Generate a new access token under **API Tokens** in your Lytics account settings.
2. Set `LYTICS_ACCESS_TOKEN` to the new token.
