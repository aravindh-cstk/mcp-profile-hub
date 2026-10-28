# An automation call fails with a secure HTTP trigger error

**Applies to:** MCP Profile Hub

The error message starts with the text below:

```
Automation "<AUTOMATION_ID>" uses a secure HTTP trigger, which is not supported yet.
Disable Secure HTTP Trigger on the automation, or pick a different automation.
```

**Root cause**

Secure HTTP Trigger is on for that automation. Contentstack cannot detect Secure HTTP Trigger on automations as it does on agents, so a secured automation stays visible in the tool browser, and you can add it to a profile. The call then fails when the agent runs the automation.

**Resolution**

Turn off Secure HTTP Trigger on the automation in Contentstack Automate, or pick a different automation.
