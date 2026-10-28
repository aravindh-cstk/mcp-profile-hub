# The browser never opens for sign-in, and the URL is correct

**Applies to:** MCP Profile Hub

**Root cause**

The client cannot reach the discovery endpoint.

**Resolution**

1. Confirm that the machine reaches the endpoint over HTTPS, for example by opening the connector URL in a browser.
2. Check for a corporate proxy, VPN, firewall, or TLS-inspecting middlebox that blocks the request.
