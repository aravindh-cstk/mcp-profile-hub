---
uid: ""
url: /developers/mcp-create-a-profile
seo_title: Create a profile
seo_description: Build an MCP Profile Hub profile with the three-step wizard, tool selection, configuration, and installation, or start from a ready-made system profile.
---

# Create a profile

## Overview

Build a profile in the MCP Profile Hub app to give an AI client a scoped set of Contentstack tools. You choose the tools, select the Contentstack projects they run against, and copy the connector URL that you add to the client.

## Where to start

Log in to Contentstack and open **MCP Profile Hub** from the **App Switcher**. The app opens on the **Profiles** screen.

The app builds a profile through a three-step wizard: tool selection, configuration, and installation. You can start the wizard from the **Profiles** screen in two ways:

- **Custom profile:** start from [Step 1: Select tools](#step-1-select-tools).
- **System profile:** open a [ready-made profile](/developers/mcp-profiles-and-catalogs#system-profiles) from the **System profiles** section, complete **Configuration** by picking a stack, and continue to **Installation**. You do not select tools.

## Prerequisites

Decide the one job this profile should support before you start. See [Keep a profile focused](/developers/mcp-profiles-and-catalogs#keep-a-profile-focused). You also need:

- Access to the MCP Profile Hub Marketplace app in your Contentstack organization. See [Installing Apps](/marketplace/installing-apps), or ask a user whose product role permits installing Marketplace apps to install it.
- At least one [Contentstack stack](/headless-cms/create-a-new-stack) for the profile to operate on.

## Step 1: Select tools

This step covers naming the profile and choosing its tools. The name is the only required field.

1. On the **Profiles** screen, click **+ New Profile**.
2. Give the profile a **name** (required) and an optional **description** of the job it supports.
3. Under **Tools**, click **Browse catalog**.
4. Select the **Contentstack APIs**, **Automations**, or **AI agents** tab, then a catalog or project on the left, then search or filter within it.
5. Select the tools this profile should expose and click **Save selection**.
6. Click **Save & Continue**.

> **Tip:** If the profile you need already exists in another organization, import it instead of rebuilding it. [Export it as JSON](/developers/mcp-manage-profiles#export-a-profile) from that organization, then [import it here](/developers/mcp-manage-profiles#import-a-profile).

**Where the browser opens.**

The browser opens on the **Contentstack APIs** tab, which lists the Content Management API (CMA) and Content Delivery API (CDA) catalogs among others. The **Automations** and **AI agents** tabs appear when your organization has an automation or an agent that qualifies.

**Each tool you add affects sign-in and tool selection.**

Contentstack derives the required Open Authorization (OAuth) scopes from your selection. Each extra tool can add scopes to the consent screen at sign-in, and gives the model one more tool to choose from on each request. Select only the tools the job needs, and create a separate profile for unrelated tools.

> **Warning:** A profile holds **at most 200** tools. Contentstack enforces the cap when you save the profile, not while you select tools, so count your selection before you save. Split the work across two profiles before you reach the cap.


![The Browse tools panel, showing catalogs on the left such as All tools, CMA, CDA, Analytics, BrandKit, Launch, DeveloperHub, and Personalize, the Read, Create, Update, Delete, Action, and Publishing filters, tools grouped under Entry Management with an operation tag on each, and the Add 5 tools button.](images/browse-tools-panel.png)

> **Additional Resources:** For more information on what each catalog holds and where the tabs get their tools, refer to the [Profiles and catalogs](/developers/mcp-profiles-and-catalogs#catalogs) documentation. For more information on what qualifies an automation or an agent to appear, refer to the [Automations and agents as tools](/developers/mcp-automations-and-agents) documentation.

## Step 2: Configure

This step lists one connection per Contentstack product your tools use. A connection is a dropdown where you pick the project that product's tools act on. The wizard requires only **Stack**. Select a project in each connection your tools need, then click **Save & Continue**. Contentstack stores only the project ID.

The wizard shows a connection only when your tool selection needs it, as the table below shows:

| Connection | Required | Appears when the profile includes |
| --- | --- | --- |
| Stack | Yes | [CMA, CMA Extended, or CDA](/developers/mcp-profiles-and-catalogs#catalogs) tools |
| Launch | No | Launch tools |
| Personalize | No | Personalize tools |
| Brand Kit | No | BrandKit tools |
| Automate | No, but see [Skipping an optional connection](#skipping-an-optional-connection) | Automate catalog tools |
| Lytics | No | Lytics tools |

If none of your tools need a project, the step reports that it needs no connections.

### Skipping an optional connection

The **Required** column in the connection table above shows which connections the wizard requires, not which connections the tools need at run time. When you skip the Personalize connection, the runtime stops the call and returns a message that states the fix. For the other connections, the runtime sends the call, and the call either fails at Contentstack or has no effect. The table below gives the outcome per connection:

| Connection | When you select no project |
| --- | --- |
| Personalize | The call fails before it reaches Contentstack, with the `No Personalize project selected` message |
| Launch | The runtime sends the call without a project ID, and Contentstack rejects it |
| Automate | Same as Launch, unless the call includes a `project_uid` argument |
| Brand Kit | The runtime sends the call without a brand kit |
| Lytics | No Lytics tool uses the selected project, so the selection has no effect |

> **Warning:** Select a Personalize project whenever the profile includes Personalize tools.

Personalize returns the message below:

```
No Personalize project selected for this profile. Choose a Personalize project in
the MCP Profile Hub configuration, or add personalize_project_uid to the MCP endpoint URL.
```

Unlike the other connections, Lytics has no connector URL parameter. To change the Lytics project that a shared profile uses, edit the profile's configuration in the app.

## Step 3: Install

Contentstack now hosts the profile at its own endpoint. The **Installation** step shows a ready-to-paste snippet for each supported client, plus the raw connector URL. Copy the connector URL, or copy the generated config snippet for your client, then paste it into the client you use. For client-specific steps, follow the matching section in [Connect a client to MCP Profile Hub](/developers/mcp-connect-a-client-to-profile-hub).

![The Installation step for the CMS profile, showing the Claude Desktop, Claude Desktop Manual, Claude Code, Codex, Cursor, and Generic tabs, an Add to Claude button, and the raw connector URL with a Copy button.](images/installation-step.png)

The wizard has no branch, environment, or locale field. Set those values as connector URL parameters instead, as the example below shows:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=<PROFILE_ID>&branch=release-2&environment=production&locale=en-us
```

If you omit the `branch` parameter from the connector URL, the runtime runs operations against the stack's default branch. The runtime lists the stack's branches in the tool definitions, so the AI client can specify a different branch on each call.

> **Additional Resource:** For more information on every parameter and the rules for combining them, refer to the [MCP URL parameters](/developers/mcp-url-parameters) documentation.

## Edit a profile

Reopen a profile to change its name, description, tools, or connections. The `profile_id` and connector URL do not change when you edit the profile, so a connected client continues to reach the profile after you edit it.

**A connected client keeps its old tool list.**

Contentstack does not notify a client that the list changed. The client shows the list it fetched until it reconnects or you refresh it, while calls run against the current profile. A tool you removed therefore fails with `Tool not found` on a client that has not re-listed.

**A catalog can fail to load while you edit a profile.**

The wizard then reports the number of saved tools it could not read, in the message below:

```
<N> saved tools could not be loaded
```

Either the tool manifests fail to load, or a catalog key changes after you save those tools to the profile. In both cases, Contentstack keeps the tools on the profile, and the tools remain callable. Reload the page to request the manifests again.

## Next Steps

- [Connect a client to MCP Profile Hub](/developers/mcp-connect-a-client-to-profile-hub): paste the connector URL into Claude, Cursor, or another supported client.
- [MCP URL parameters](/developers/mcp-url-parameters): set branch, environment, and locale on the connector URL, since the wizard has no field for them.
- [Manage profiles](/developers/mcp-manage-profiles): duplicate, export, import, and delete profiles.
- [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot): confirm the profile's tool calls reach Contentstack.
