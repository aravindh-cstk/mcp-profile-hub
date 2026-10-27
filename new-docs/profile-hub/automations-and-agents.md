---
uid: ""
url: /developers/mcp-automations-and-agents
seo_title: Automations and agents as tools
seo_description: Expose your Contentstack Automate automations and Agent OS agents as MCP tools in a profile, including the trigger requirements each one must meet.
---

# Automations and agents as tools

## Overview

A profile can expose the automations and agents you have already built in Contentstack. Each Automate automation and each [Agent OS](/agent-os/mcp-client-connect-remote-tools) agent appears as a single MCP tool alongside the Contentstack API tools. One tool call then runs the automation or agent, which performs the workflow steps, instead of the AI client calling each API operation in sequence.

## Automations compared with agents

Both appear to the client as tools. The table below sets out where they differ:

| | Automation | Agent |
| --- | --- | --- |
| How it runs | Executes the fixed steps you configured | Uses a language model to interpret the input, then runs actions |
| Input | Requires the inputs it declares | Accepts one free-form `input` object |
| Speed | Returns as soon as the steps finish | Adds model inference time to every call |
| Cost | No AI credits | Consumes AI credits on every call |
| Returns | The automation's response payload, or an acknowledgement | The agent's output |

Prefer an automation when the work is deterministic. Use an agent when the request needs interpretation.

## Add them to a profile

You select automations and agents in the same tool browser as the Contentstack API tools. Follow [Step 1: Select tools](/developers/mcp-create-a-profile#step-1-select-tools), and in the browser open the **Automations** or **AI agents** tab instead of **Contentstack APIs**.

Both tabs list entries by project rather than by catalog. They appear only when your organization has automations or agents that qualify, as described in [What qualifies](#what-qualifies). In an organization using neither, only the **Contentstack APIs** tools appear.

## What qualifies

Contentstack lists an automation or an agent only when it can call it over HTTP. The table below lists what each one needs:

| Requirement | Automation | Agent |
| --- | --- | --- |
| HTTP trigger | Required as the first step | Required (HTTP Request Trigger) |
| Active | You activate it in Automate. Contentstack lists neither drafts nor paused automations | You activate it in Agent OS |
| Published | n/a | You publish it in Agent OS. Contentstack does not list a draft agent |
| Trigger ID | Required | n/a |
| Secure HTTP Trigger | Must be off. Contentstack cannot detect it on an automation, so a secured automation still appears and fails when the agent calls it | Must be off. Contentstack detects it on an agent, so a secured agent never appears |

An automation or agent that meets every row in the table above is eligible, but eligibility does not guarantee it appears in the tool browser (see [Limitations](#limitations)).

If your automation does not appear, activate it in Automate. If your agent does not appear, publish and activate it in Agent OS and confirm it has an HTTP Request Trigger. After each of these fixes, wait up to five minutes before reopening the tool browser. Contentstack caches the discovered list server-side, so if you reopen the tool browser sooner, it shows the same stale list.

## How they appear to the AI client

### Tool names

Contentstack prefixes each tool name with its type and derives the rest of the name from the title you gave it. For example, the automation "Publish Weekly Digest" becomes `automate_publish_weekly_digest`. An agent becomes `agent_<AGENT_ID>`.

### Automation inputs

Contentstack builds the tool's input schema from the automation's own references. The two mappings below give the parameter kind each field becomes:

- Fields that the automation reads as `{{1.body.*}}` become body parameters.
- Fields that the automation reads as `{{1.query.*}}` become query parameters.

When an automation names its inputs, the tool's input schema lists each input as a parameter. An automation that reads a single unstructured payload produces a tool whose `inputSchema` declares no properties. Name the inputs in Automate before you expose the automation.

### Agent inputs

An agent takes one free-form `input` object. The agent's configuration defines the structure of this object. If you omit the object, the agent runs with its default instructions.

### Tool descriptions

Contentstack uses the description you wrote in Automate or Agent OS. The model uses this description to select a tool. Write the description for the model, and state what the automation or agent does and when to call it.

### Agent execution

Agent runs are asynchronous. The runtime polls until the agent finishes or the profile's timeout expires.

## Exports drop these tools

> **Warning:** An automation's HTTP trigger URL is unauthenticated. Anyone who has the trigger ID can run that automation without signing in, so treat a trigger ID as a secret and do not share it in tickets, chat, or source control.

Because of this, Contentstack excludes automations and agents from an [exported profile](/developers/mcp-manage-profiles#what-an-export-leaves-out). You re-add them manually after an import.

## Profiles created before the Automations tab existed

Profiles that added automations before Contentstack separated them into their own tab still run those automations, but the wizard cannot re-select those tools when you edit the profile. To edit such a profile, remove the automation and add it again from the **Automations** tab.

## The Automate catalog is different

The **Contentstack APIs** tab includes a catalog named **Automate**. Its tools manage Automate itself, including listing and creating projects, inspecting automations, activating them, and triggering one by ID.

The Automate catalog and the **Automations** tab call different Automate endpoints with different credentials, so one cannot replace the other. The table below compares the two:

| | Automate catalog | **Automations** tab |
| --- | --- | --- |
| Calls | The Automate management API, with your Open Authorization (OAuth) token | The automation's own HTTP trigger URL |
| Covers | Any automation the API exposes to your account | Only automations that meet [What qualifies](#what-qualifies) |
| Returns | The management API's response | The automation's response payload, or an acknowledgement |
| Input schema | The management API's own parameters | Contentstack builds it from the automation's declared inputs |

**When to use each.**

Use the **Automations** tab whenever the automation qualifies, and the **Automate** catalog only when you need to manage Automate itself.

**Automate catalog tools need a project.**

Select one in the [profile's configuration](/developers/mcp-create-a-profile#skipping-an-optional-connection), or have the agent supply `project_uid` on each call.

## Troubleshooting

If a tool does not appear or a call fails, see [Automation and agent errors](/developers/mcp-monitor-and-troubleshoot#automation-and-agent-errors) for the full error list, and the **Executions** view on the same page.

**A published automation fails when the agent calls it, with a secure-trigger error**

```
Automation "<AUTOMATION_ID>" uses a secure HTTP trigger, which is not supported yet.
Disable Secure HTTP Trigger on the automation, or pick a different automation.
```

**Root Cause**: Contentstack cannot detect Secure HTTP Trigger on automations as it does on agents. As a result, secured automations remain visible in the tool browser, and you can add them to a profile. However, the call fails when the agent attempts to run the automation.

**Resolution**: Turn off Secure HTTP Trigger on the automation in Automate, or pick a different automation.

**An agent run times out before finishing**

**Root Cause**: The run exceeded the profile's timeout, which Contentstack caps at 120000 ms.

**Resolution**: Raise `timeout` on the [connector URL](/developers/mcp-url-parameters) up to 120000 ms, or look up the reported execution ID in Agent OS to see the result.

## Limitations

- Discovery covers up to 50 projects per organization.
- Contentstack caches the discovered list for five minutes. A newly activated automation can take that long to appear.
- Discovery stops after **eight seconds**. If it does not finish, the tab lists fewer entries than exist.
- The profile's timeout caps an agent run at 120000 ms. The [connector URL](/developers/mcp-url-parameters) accepts a `timeout` value up to that maximum.
- You can still add a secured automation to a profile, and it fails when the agent calls it. See [Troubleshooting](#troubleshooting).
- An exported profile contains no automations or agents. See [Exports drop these tools](#exports-drop-these-tools).

## Next Steps

- [Create a profile](/developers/mcp-create-a-profile): pick automations and agents in the tool browser's wizard step.
- [Manage profiles](/developers/mcp-manage-profiles): see what an export leaves out and the steps to re-add tools after an import.
- [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot): read the Executions view and the full error reference for automation and agent failures.
