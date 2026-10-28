# Profile import fails because the profile has more than 200 tools

**Applies to:** MCP Profile Hub

The app shows the heading `Couldn't import profile`, then the message below:

```
That profile has more than 200 tools, which is the maximum a profile can hold.
```

**Root cause**

The export exceeds the limit of 200 tools per profile.

**Resolution**

Split the profile in the source organization, then export each part.
