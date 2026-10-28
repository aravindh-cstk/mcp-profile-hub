# Profile import fails because the name matches a system profile

**Applies to:** MCP Profile Hub

The app shows the heading `Couldn't import profile`, then the message below:

```
"CMS" is a system profile. Choose a different name.
```

**Root cause**

Contentstack derives the `profile_id` from the profile name, and that ID matches a system profile. Contentstack renames only system-profile exports, and this file is not one.

**Resolution**

Rename the profile in the file, or export it again from the source organization.
