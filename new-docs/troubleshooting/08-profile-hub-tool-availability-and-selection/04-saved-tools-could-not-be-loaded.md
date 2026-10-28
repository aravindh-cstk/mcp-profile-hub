# "Saved tools could not be loaded" message on a profile

**Applies to:** MCP Profile Hub

The profile shows the message below, where `<N>` is the number of affected tools:

```
<N> saved tools could not be loaded
```

**Root causes**

- The tool manifests failed to load while the page opened.
- A catalog key changed after the profile saved those tools.

**Resolution**

Reload the page to request the manifests again. Contentstack keeps the tools on the profile, and the tools stay callable.
