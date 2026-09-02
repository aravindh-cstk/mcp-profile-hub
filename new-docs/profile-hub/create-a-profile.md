---
uid: ""
url: /docs/mcp/create-a-profile
seo_title: Create a profile
seo_description: Build an MCP Profile Hub profile with the three-step wizard, tool selection, configuration, and installation, or start from a ready-made system profile.
---

# Create a profile

## Overview

You build a profile in the MCP Profile Hub app with a three-step wizard: tool selection, configuration, and installation. You can also start from a ready-made [system profile](/docs/mcp/profiles-and-catalogs#system-profiles) and only configure and install it.

To start from a system profile, open one from the **System profiles** section on the **Profiles** screen, complete **Configuration** by picking a stack, and continue to **Installation**. You do not need to select tools.

To build a custom profile, click **New Profile** and work through the three steps below.

## Prerequisites

- Access to the MCP Profile Hub Marketplace app in your Contentstack organization. See [Installing Apps](https://www.contentstack.com/docs/marketplace/installing-apps), or ask an organization owner or admin to install it.
- At least one [Contentstack stack](https://www.contentstack.com/docs/headless-cms/create-a-new-stack) for the profile to operate on.
- A clear idea of the one job the profile should support. See [Keep a profile focused](/docs/mcp/profiles-and-catalogs#keep-a-profile-focused).

## Step 1: Select tools

This step covers two things: naming the profile, and choosing its tools. The name is the only required field.

1. Give the profile a **name** (required) and an optional **description** of the job it supports.
2. Under **Tools**, click **Browse catalog**.
3. Pick a tier tab, then a catalog or project on the left, then search or filter within it.
4. Select the tools this profile should expose and click **Save selection**.
5. Click **Save & Continue**.

The browser opens on the `Contentstack APIs` tab. `Automations` and `AI agents` tabs appear when your organization has content to fill them. See [Where tools come from](/docs/mcp/profiles-and-catalogs#where-tools-come-from).

For what qualifies an automation or an agent to appear, see [Automations and agents as tools](/docs/mcp/automations-and-agents).

Contentstack derives the required Open Authorization (OAuth) scopes from your selection, so every extra tool widens the consent the profile asks for and adds another candidate the agent must choose between at call time. Keep the selection tight, and prefer a second focused profile over piling unrelated tools into one.

> **Warning:** A profile holds at most 200 tools. The browser shows no counter and no warning as you select, and Contentstack rejects the profile when you save it, not while you are picking. Split the work across two profiles well before you approach the cap.

TODO(screenshot): Browse tools panel. It should show the Contentstack APIs, Automations, and AI agents tabs, catalogs on the left such as Content Management API (CMA), Content Delivery API (CDA), and Launch, the browser grouping tools by area such as Entry Management, and operation tags like Read, Delete, or Publishing.

## Step 2: Configure

Connect the Contentstack projects the profile operates on, then click **Save & Continue**.

The wizard shows a row only when your tool selection needs it:

| Row | Required | Appears when the profile includes |
| --- | --- | --- |
| Stack | Yes | [CMA, CMA Extended, or CDA](/docs/mcp/profiles-and-catalogs#catalogs) tools |
| Launch | No | Launch tools |
| Personalize | No | Personalize tools |
| Brand Kit | No | BrandKit tools |
| Automate | No, but see below | Automate catalog tools |
| Lytics | No | Lytics tools |

If none of your tools need a connection, the step reports that it needs no project connections.

### Select a Personalize project

> **Warning:** The wizard marks the **Personalize** row optional, but Personalize tools do not work without it. Select a Personalize project whenever the profile includes Personalize tools.

Every Personalize call fails before it reaches Contentstack:

```
No Personalize project selected for this profile. Choose a Personalize project in
the MCP Profile Hub configuration, or add personalize_project_uid to the MCP endpoint URL.
```

### Connect an Automate project

Personalize is the only row that fails with a clear message. Automate, Launch, and Brand Kit fail differently: the call still goes out without the project, and Contentstack rejects it upstream with whatever that service reports.

So the **Automate** row is genuinely optional only when the agent supplies `project_uid` on each call. Connect an Automate project whenever the profile includes Automate catalog tools.

Lytics has no equivalent. Its tools take no project, and no URL parameter overrides it.

## Step 3: Install

The profile is now published with a hosted endpoint. The **Installation** step shows a ready-to-paste snippet for each supported client, plus the raw connector URL. Copy the connector URL, or copy the generated config snippet for your client, then paste it into the client you use. For client-specific steps, follow the matching section in [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub).

TODO(screenshot): Installation step, `Claude Desktop Manual` tab. It should show the six-tab strip, a copy-ready config snippet with the pinned mcp-remote version, and the raw connector URL.

## Branch, environment, and locale

The wizard has no branch, environment, or locale field. Set those on the connector URL instead:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=<PROFILE_ID>&branch=release-2&environment=production&locale=en-us
```

See [MCP URL parameters](/docs/mcp/mcp-url-parameters) for every parameter and how they combine.

When you do not set a branch, calls run against the stack's default branch. The runtime still offers the agent the list of branches that exist in your stack, so a client can name one per call.

## Edit a profile

Reopen a profile any time to change its tools or configuration. The `profile_id` and connector URL stay stable, so a connected client keeps working after you edit it.

One caveat: Contentstack does not notify a connected client that the tool list changed. The client keeps showing the list it fetched until it reconnects or you refresh it, while calls run against the current profile. A tool you removed therefore fails with `Tool not found` on a client that has not re-listed. See [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot).

If a catalog fails to load while you edit, the wizard reports the number of saved tools it could not read:

```
<N> saved tools could not be loaded
```

This happens when the tool manifests fail to load, or when a catalog key changed after the profile saved those tools. Either way Contentstack keeps the tools rather than dropping them, so they stay on the profile and keep working. Reopen the page to try loading them again.

For duplicating, exporting, importing, and deleting a profile, see [Manage profiles](/docs/mcp/manage-profiles).

## Next Steps

- [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub): paste the connector URL into Claude, Cursor, or another supported client.
- [MCP URL parameters](/docs/mcp/mcp-url-parameters): set branch, environment, and locale on the connector URL, since the wizard has no field for them.
- [Manage profiles](/docs/mcp/manage-profiles): duplicate, export, import, and delete profiles.
- [Monitor and troubleshoot](/docs/mcp/monitor-and-troubleshoot): confirm the profile's tool calls are landing.
