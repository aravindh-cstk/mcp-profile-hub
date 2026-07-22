---
uid: ""
url: /docs/mcp/create-a-profile
seo_title: Create a profile
seo_description: Build an MCP Profile Hub profile with the three-step wizard, tool selection, configuration, and installation, or start from a ready-made system profile.
---

# Create a profile

You build a profile in the MCP Profile Hub app with a three-step wizard: tool selection, configuration, and installation. You can also start from a ready-made [system profile](/docs/mcp/profiles-and-catalogs#system-profiles) and only configure and install it.

To start from a system profile, open one from the **System profiles** section on the **Profiles** screen, complete **Configuration** by picking a stack, and continue to **Installation**. No tool selection is needed.

To build a custom profile, click **New Profile** and work through the three steps below.

## Prerequisites

- Access to the MCP Profile Hub Marketplace app in your Contentstack organization.
- At least one Contentstack stack for the profile to operate on.
- A clear idea of the one job the profile should support.

## Step 1: Select tools

1. Give the profile a **name** (required) and an optional **description** of the job it supports.
2. Under **Tools**, click **Browse catalog**.
3. Pick a catalog on the left, then search or filter within it. Tools are grouped by area and tagged by operation.
4. Select the tools this profile should expose and click **Save selection**.
5. Click **Save & Continue**.

Required OAuth scopes are derived automatically from your selection. Keep the selection tight. Prefer a second focused profile over piling unrelated tools into one.

TODO(screenshot): Browse tools panel. It should show catalogs on the left, such as CMA, CDA, and Launch, tools grouped by area such as Entry Management, and operation tags like Read, Delete, or Publishing.

## Step 2: Configure

Connect the Contentstack projects the profile operates on. At minimum, select the **Stack** (required). Click **Save & Continue**.

## Step 3: Install

The profile is now published with a hosted endpoint. The **Install** screen shows a ready-to-paste snippet for each supported client, plus the raw connector URL. Pick your client and follow the matching section in [Connect a client to MCP Profile Hub](/docs/mcp/connect-a-client-to-profile-hub).

TODO(screenshot): Installation step. It should show the client tabs, a copy-ready config snippet, the raw connector URL, and the Add to Claude button.

## Edit a profile

Reopen a profile any time to change its tools or configuration. The `profile_id` and connector URL stay stable, so connected clients keep working after you edit it.
