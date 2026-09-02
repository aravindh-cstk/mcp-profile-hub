---
uid: ""
url: /developers/mcp-manage-profiles
seo_title: Manage profiles
seo_description: Duplicate, export, and import MCP Profile Hub profiles as JSON, edit an existing profile, and understand what carries over in each case.
---

# Manage profiles

## Overview

Beyond creating a profile, you can duplicate one, export it as JSON, and import it into another organization. Duplicating keeps a profile in the same organization, while exporting and importing move it to a different one. This page covers each task and what carries over.

## Prerequisites

- An existing profile to duplicate, export, edit, or delete. See [Create a profile](/developers/mcp-create-a-profile).
- The organization role that permits creating and deleting profiles.

## Where the controls are

Hover a profile card on the **Profiles** screen to reveal its actions, in order:

| Action | Tooltip | Available on | Scope |
| --- | --- | --- | --- |
| Edit | `Edit` | Custom and system profiles | All fields on custom profiles, configuration only on system profiles |
| Duplicate | `Duplicate` | Custom and system profiles | Full profile |
| Export | `Export JSON` | Custom and system profiles | Full profile |
| Delete | `Delete` | Custom profiles only | Full profile |
| Enable/disable | none | API only, no card control | Full profile |

Click the chevron beside **New Profile** to open its menu, which holds **Import from JSON**.

TODO(screenshot): Profiles screen showing a hovered profile card. It should show the Edit, Duplicate, Export JSON, and Delete icons on the card, and the New Profile split button with the Import from JSON menu item open. Because hovering the card and opening the New Profile menu are two separate pointer states, force the card hover state in devtools while the Import from JSON menu is open, or capture two shots: one of the card hover actions, one of the open split-button menu.

## Duplicate a profile

Duplicating copies a profile into a new custom profile you own.

1. Hover the profile card and click **Duplicate**.
2. The wizard opens on **Tool selection**, and it pre-fills every field from the source profile.
3. Change the name, adjust the tools, then save.

Contentstack names the copy `<source name> copy`. `Content Explorer` becomes `Content Explorer copy`.

Contentstack writes nothing until you save, so clicking Duplicate and leaving does not create a profile.

Duplicating the same profile twice without renaming the first copy fails, because both copies derive the same `profile_id`. Rename the copy before saving.

**What carries over:**

- Every tool, including per-tool parameters and any tool you disabled.
- The description, unchanged.
- The configuration, including the stack and any project selections.
- Automation and agent tools, because the copy stays in the same organization.

**What changes:**

- The copy gets a new `profile_id` that Contentstack derives from its new name. `CMS copy` becomes `cms_copy`.
- The copy is a custom profile, never a system profile.

### Duplicate a system profile to edit it

You cannot change which tools a system profile exposes. Duplicating one produces an editable custom copy, which is the usual reason to duplicate.

The copy opens on **Tool selection** rather than jumping to configuration, and its name, description, and tool list all become editable.

## Export a profile

Hover the profile card and click **Export JSON**. The browser downloads the file and names it after the profile, so `Content Explorer` exports as `content-explorer.json`.

The file describes the profile and its tools. Every value below is illustrative except `<ORG_UID>`, which is a placeholder for your organization ID:

```json
{
  "kind": "contentstack.mcp-profile",
  "version": 1,
  "exported_at": "2026-08-31T09:14:22.031Z",
  "exported_from": {
    "org_uid": "<ORG_UID>",
    "profile_id": "content_explorer",
    "is_system": true
  },
  "profile": {
    "name": "Content Explorer",
    "description": "Read-only lookup of content types, entries, and assets.",
    "enabled": true,
    "tools": [
      {
        "tool_name": "get_all_content_types",
        "description": "Retrieves all content types in the stack.",
        "catalog_key": "cma",
        "tool_id": "get_all_content_types",
        "enabled": true
      }
    ]
  }
}
```

### What an export leaves out

An export carries no credentials and no stack binding.

- **No configuration.** The file holds no stack API key, no project UIDs, no branch, environment, or locale. Whoever imports it selects their own.
- **No automation or agent tools.** An automation's trigger ID works as an unauthenticated webhook, so sharing it in a file would share the ability to run that automation. See [Automations and agents as tools](/developers/mcp-automations-and-agents) for what these tools are. Contentstack drops these tools from the export and reports the number it dropped:

  ```
  Exported without 2 automation or agent tools
  ```

  Every other tool is in the file. Re-add the automations manually after importing.

## Import a profile

1. Click the chevron beside **New Profile**.
2. Click **Import from JSON**.
3. Pick a file that MCP Profile Hub exported.

On success, the app opens the new profile on the **Configuration** step, because the file carries no stack binding. Select a stack and continue. Importing a custom profile keeps its name unchanged.

### An import never becomes a system profile

Importing an export of a system profile appends ` (imported)` to the name. `CMS` imports as `CMS (imported)`, which derives `cms_imported` and so collides with nothing.

An imported profile cannot take over a system profile's identity, or shadow it for the rest of your organization. Contentstack enforces this by deriving the `profile_id` from the name, always creating the import as a custom profile, and rejecting any import whose derived ID matches a system profile.

The rename applies only when the file is a genuine system-profile export, which Contentstack detects from a marker the export writes. A custom profile that happens to be named `CMS`, or a hand-edited file, gets no rename, derives `cms`, and fails with the system-profile error in the table below.

## Import errors

Every failure appears under the heading `Couldn't import profile`.

| Message | Cause | Fix |
| --- | --- | --- |
| `That file is too large to be a profile export.` | The file exceeds 1 MiB | Confirm you picked a profile export, not another JSON file |
| `That file isn't valid JSON.` | The file does not parse | Re-export the profile rather than editing the file manually |
| `That JSON isn't an exported profile. Pick a file exported from MCP Profile Hub.` | The file is JSON, but not a profile export | Export the profile from the source organization |
| `That file was exported by a newer version of MCP Profile Hub (format v2). Update, then import it.` | The file uses a newer export format | Wait. Contentstack hosts MCP Profile Hub centrally, so you cannot update it yourself. The message asking you to is misleading. Re-export from a source organization on your version, or wait for the rollout |
| `That profile has more than 200 tools, which is the maximum a profile can hold.` | The export exceeds the tool limit | Split the profile in the source organization, then export each part |
| `That profile is missing or malformed at "profile.name".` | A required field is absent or the wrong type | Re-export rather than editing the file |
| `"CMS" is a system profile. Choose a different name.` | The file is not a system-profile export, so nothing renames it, and the name derives an ID a system profile already holds | Rename the profile in the file, or re-export it from the source organization |
| `A profile with this profile_id already exists` | You already have a profile of that name | Rename the profile before importing |
| `Profile limit of 50 reached; delete an existing profile first` | You hold the maximum number of profiles | Delete a profile you no longer use |
| `Organization profile limit of 500 reached; ask an administrator to remove unused profiles` | Your organization holds the maximum | Ask an admin to remove unused profiles |
| `This organization's plan does not include launch. Remove the tools from that catalog and save again.` | The file contains tools your plan excludes, see [Profiles and catalogs](/developers/mcp-profiles-and-catalogs#plan-gated-catalogs) | Remove those tools, or import into an organization on a plan that includes them |

## Edit a profile

Hover the profile card and click **Edit** to reopen a profile any time and change its tools or configuration. Editing reopens the same three-step wizard described in [Create a profile](/developers/mcp-create-a-profile). The `profile_id` and connector URL stay stable, so connected clients keep working after you edit it.

Adding tools can widen the Open Authorization (OAuth) scopes the profile requests. Connected users approve the new scopes the next time they sign in.

## Enable and disable a profile

A profile carries an `enabled` flag. Disabling it takes effect immediately for every connected client: a disabled profile advertises zero tools to any connected client, and calls against it fail rather than running.

> **Warning:** The app has no control for this flag, and there is no supported way for you to set it. Treat a disabled profile as something only Contentstack can re-enable, and raise a support request rather than looking for a toggle.

The flag lives on `POST` and `PUT /api/profiles`, but that endpoint is internal to the app. It authenticates with a short-lived token the dashboard mints for its own use and never displays, not with a management token, a delivery token, or an API key.

If a client connects successfully but lists no tools, a disabled profile is one possible cause. See [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot).

## Delete a profile

**Warning:** Deleting a profile immediately breaks every client anyone has connected to its URL, not only your own. Check the [Executions](/developers/mcp-monitor-and-troubleshoot) view for recent activity before deleting a shared profile.

Hover the profile card and click **Delete**. System profiles have no Delete action, because every organization keeps them.

## Limitations

- A profile can hold at most 200 tools.
- An organization member can hold at most 50 profiles.
- An organization can hold at most 500 profiles in total.
- The `enabled` flag has no control in the app, and no supported way to set it. See [Enable and disable a profile](#enable-and-disable-a-profile).

These caps apply whether you create, duplicate, or import a profile.

## Next Steps

- [Connect a client to Profile Hub](/developers/mcp-connect-a-client-to-profile-hub): the install snippet for each client, useful after you duplicate or import a profile.
- [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot): the Executions view and the full error reference.
- [Automations and agents as tools](/developers/mcp-automations-and-agents): how to re-add the automation tools an export drops.
