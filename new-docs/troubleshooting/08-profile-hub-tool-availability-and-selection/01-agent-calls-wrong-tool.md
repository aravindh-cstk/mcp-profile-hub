# The agent calls the wrong tool, or passes invalid arguments

**Applies to:** MCP Profile Hub

A tool call fails, or runs a different operation than the one you asked for, even though the profile and the tool work.

**Root cause**

The model selects a tool that does not match the request, or builds arguments that do not match the tool's input schema, for example by omitting a required field on publish. Some MCP clients retry the call with corrected arguments. The MCP client and the model control this retry behavior, not the profile or the tool.

**Resolution**

Retry with a different model, or state the operation and its required values in your prompt.
