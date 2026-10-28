# authorization_required error with reason insufficient_scope

**Applies to:** MCP Profile Hub

The client receives JSON-RPC error code `-32010` with the message `authorization_required`, and the `reason` field holds `insufficient_scope`. The message below names the method and path that failed:

```
Permission denied for <METHOD> <PATH>. The authorized token may lack a required
OAuth scope, or your Contentstack role may not permit this operation. If scopes
were recently changed, re-authorize from the Authorization page (add the needed
scope to the curated list) and try again.
```

**Root causes**

Contentstack returned `403` for one of the two reasons below:

- The token lacks a required OAuth scope.
- Your Contentstack role does not permit the operation. A profile never grants more access than your roles allow.

**Resolution**

1. Reconnect and approve the requested scopes, after you add the needed scope to the curated list on the **Authorization** page.
2. If you already granted the scope, sign in to Contentstack as the same user and try the same action in the UI. If the action also fails in the UI, your role does not permit it. Use an account with the required role, or ask the profile owner to remove the tool from the profile.

> **Additional Resource:** For more information on what each role permits, refer to the [About Product Roles](/docs/administration/about-product-roles) and [About Stack Roles](/docs/headless-cms/about-stack-roles) documentation.
