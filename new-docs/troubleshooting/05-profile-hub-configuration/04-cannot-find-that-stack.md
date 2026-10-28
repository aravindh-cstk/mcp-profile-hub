# "Cannot find that stack" error

**Applies to:** MCP Profile Hub

**Root causes**

- The configured stack API key is wrong.
- The stack belongs to a different Contentstack region than the one your sign-in resolved.

**Resolution**

1. Confirm that the configured stack API key is correct for your account.
2. Confirm that you signed in to the organization that owns the stack. Contentstack derives the regional endpoints from the organization you sign in with, so it cannot reach a stack in another region during that session. The [region codes](/docs/developers/contentstack-mcp-server#supported-regions) name each region, and the `cma_host` [sign-in parameter](/docs/developers/mcp-profile-hub-url-parameters#sign-in-parameters) sets the region that the connector URL uses.
