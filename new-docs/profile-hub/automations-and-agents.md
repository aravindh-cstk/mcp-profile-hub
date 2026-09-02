---
uid: ""
url: /docs/mcp/automations-and-agents
seo_title: Automations and agents as tools
seo_description: Expose your Contentstack Automate automations and Agent OS agents as MCP tools in a profile, including the trigger requirements each one must meet.
---

# Automations and agents as tools

## Overview

A profile can expose work you have already built in Contentstack. Your Automate automations and your Agent OS agents each become a single MCP tool, sitting alongside the Contentstack API tools.

This changes what one tool call can do. Instead of the agent chaining eight API operations to run a workflow, it calls one tool and your automation runs the steps.

## Automations compared with agents

Both appear as tools. They behave differently.

| | Automation | Agent |
| --- | --- | --- |
| How it runs | Executes the fixed steps you configured | Reasons with a language model, then acts |
| Handles a vague request | No. It needs the inputs it declares | Yes |
| Speed | Fast | Slower |
| Cost | No AI credits | Consumes AI credits on every call |
| Returns | The automation's response payload, or an acknowledgement | The agent's output |

Prefer an automation when the work is deterministic. Use an agent when the request needs interpretation.

## Add them to a profile

Automations and agents are selected in the same tool browser as everything else. Follow [Step 1: Select tools](/docs/mcp/create-a-profile#step-1-select-tools), and in the browser open the `Automations` or `AI agents` tab instead of `Contentstack APIs`.

Both tabs list entries by project rather than by catalog. They appear only when your organization has automations or agents that qualify (see [What qualifies](#what-qualifies) below). An organization using neither sees only the `Contentstack APIs` tools.

TODO(screenshot): Browse tools panel on the Automations tab. It should show the three tier tabs, the left pane listing Automate projects, and automations with their descriptions ready to select.

## What qualifies

Contentstack lists an automation or an agent only when it can call it over HTTP.

| Requirement | Automation | Agent |
| --- | --- | --- |
| HTTP trigger | Required as the first step | Required (HTTP Request Trigger) |
| Active | You activate it in Automate. Contentstack lists neither drafts nor paused automations | You activate it in Agent OS |
| Published | n/a | You publish it in Agent OS. Contentstack does not list a draft agent |
| Trigger ID | Required | n/a |
| Secure HTTP Trigger | Must be off. Contentstack cannot detect it on an automation, so a secured automation still appears and fails when called | Must be off. Contentstack detects it on an agent, so a secured agent never appears |

Meeting every row makes an automation or agent eligible, but eligibility does not guarantee it appears in the tool browser (see [Limitations](#limitations)).

If your automation does not appear, activate it in Automate. If your agent does not appear, publish and activate it in Agent OS and confirm it has an HTTP Request Trigger. Either way, wait up to five minutes before reopening the tool browser. Contentstack caches the discovered list server-side, so reopening sooner returns the same stale list.

## How they appear to the AI client

**Names.** Contentstack prefixes each tool with its type and derives the rest from the title you gave it. An automation called "Publish Weekly Digest" becomes `automate_publish_weekly_digest`. An agent becomes `agent_<AGENT_ID>`.

**Automation inputs.** Contentstack reads the automation's own references to build the tool's input schema:

- Fields read as `{{1.body.*}}` become body parameters.
- Fields read as `{{1.query.*}}` become query parameters.

The practical consequence: an automation that names its inputs clearly produces a tool the model can call correctly. An automation that reads a single unstructured payload produces a tool the model has to guess at. Name the inputs in Automate before exposing the automation.

**Agent inputs.** An agent takes one free-form `input` object. The shape is up to the agent, and omitting it runs the agent with its default instructions.

**Descriptions.** Contentstack uses the description you wrote in Automate or Agent OS. The model chooses which tool to call by reading this description, so a description written for a human reader leads the model to call the wrong tool, or skip it entirely. Write it for the model, naming what the automation does and when to call it.

**Execution.** Agent runs are asynchronous. The runtime polls until the agent finishes or the profile's timeout expires.

## Exports drop these tools

> **Warning:** An automation's trigger ID works as an unauthenticated webhook. Anyone who has the ID can run that automation without signing in, so treat a trigger ID as a secret and do not share it in tickets, chat, or source control.

Because of this, Contentstack excludes automations and agents from an exported profile. See [What an export leaves out](/docs/mcp/manage-profiles#what-an-export-leaves-out).

## Profiles created before the Automations tab existed

Profiles that added automations before Contentstack separated them into their own tab still run correctly, but the wizard cannot re-select those tools when you edit the profile. Remove and re-add the automation from the `Automations` tab.

## The Automate catalog is different

The `Contentstack APIs` tab includes a catalog named **Automate**. It manages Automate itself: listing and creating projects, inspecting automations, activating them, and triggering one by ID.

The two reach Automate through different doors, which is why one cannot stand in for the other:

| | Automate catalog | `Automations` tab |
| --- | --- | --- |
| Calls | The Automate management API, with your Open Authorization (OAuth) token | The automation's own HTTP trigger URL |
| Covers | Any automation the API exposes to your account | Only automations that meet [What qualifies](#what-qualifies) |
| Returns | The management API's response | The automation's response payload, or an acknowledgement |
| Input schema | The management API's own parameters | Built from the automation's declared inputs, so the model can fill them |

Use the **Automate** catalog to manage automations. Use the `Automations` tab to run yours, because that is the path that gives the model a real input schema and returns your automation's output.

Connect an Automate project in the profile's configuration when the profile includes Automate catalog tools. The wizard marks the row optional, and a call without a project still goes out, but Contentstack then rejects it upstream unless the agent supplies `project_uid` on the call itself.

## Troubleshooting

If a tool does not appear or a call fails, see [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot), which carries the full `## Automation and agent errors` table and the **Executions** view.

**A published automation fails when the agent calls it, with a secure-trigger error**

```
Automation "<AUTOMATION_ID>" uses a secure HTTP trigger, which is not supported yet.
Disable Secure HTTP Trigger on the automation, or pick a different automation.
```

**Root cause:** Contentstack cannot detect Secure HTTP Trigger on an automation the way it can on an agent, so a secured automation still appears in the tool browser and can be added to a profile. The call only fails once the agent runs it.

**Resolution:** Turn off Secure HTTP Trigger on the automation in Automate, or pick a different automation.

**An agent run times out before finishing**

**Root cause:** The run outlasted the profile's timeout, capped at 120000 ms.

**Resolution:** Raise `timeout` on the connector URL. See [MCP URL parameters](/docs/mcp/mcp-url-parameters), or look up the reported execution ID in Agent OS to see the result.

## Limitations

- Discovery covers up to 50 projects per organization.
- Contentstack caches the discovered list for five minutes. A newly activated automation can take that long to appear.
- Discovery runs on an eight second budget. If it does not finish, the tab shows fewer entries than exist.
- An agent run is capped at 120000 ms by the profile's timeout. See [MCP URL parameters](/docs/mcp/mcp-url-parameters) to raise it.
- A secured automation can still be added to a profile and fail when called. See [Troubleshooting](#troubleshooting).
- An exported profile carries no automations or agents. See [Exports drop these tools](#exports-drop-these-tools).

## Next Steps

- [Create a profile](/docs/mcp/create-a-profile): pick automations and agents in the tool browser's wizard step.
- [Manage profiles](/docs/mcp/manage-profiles): see what an export leaves out and how to re-add tools after an import.
- [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot): read the Executions view and the full error reference for automation and agent failures.
