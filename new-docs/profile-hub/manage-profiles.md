---
uid: ""
url: /developers/mcp-profile-hub-manage-profiles
seo_title: Manage profiles
seo_description: Duplicate, export, and import MCP Profile Hub profiles as JSON, edit an existing profile, and understand what carries over in each case.
---

# Manage profiles

## Overview

Duplicate a profile to copy it within the same organization, or export it as JSON and import it to move it to a different organization. You can also edit or delete a profile. Duplicate, export, and import each copy a different part of the profile, and the sections below list what changes in each case.

## Prerequisites

- An existing profile to duplicate, export, edit, or delete. See [Create a profile](/developers/mcp-profile-hub-create-a-profile).
- A product role that permits you to create and delete profiles. See [About Product Roles](/administration/about-product-roles).

## Where the controls are

Hover a profile card on the **Profiles** screen to reveal its icons, in order:

| Icon | Tooltip | Available on | Scope |
| --- | --- | --- | --- |
| Edit | **Edit** | Custom and system profiles | All fields on custom profiles, configuration only on system profiles |
| Duplicate | **Duplicate** | Custom and system profiles | Full profile |
| Export | **Export JSON** | Custom and system profiles | Full profile |
| Delete | **Delete** | Custom profiles only | Full profile |

The card has no icon for the `enabled` flag, and the app does not provide a control for it. See [Enable and disable a profile](#enable-and-disable-a-profile).

Click the chevron beside **New Profile** to open its menu, which contains **Import from JSON**.

## Duplicate a profile

When you duplicate a profile, Contentstack copies it into a new custom profile you own.

1. Hover the profile card and click the "Duplicate" icon.
2. The wizard opens on **Tool selection**, and it pre-fills every field from the source profile.
3. Change the name, adjust the tools, then save.

**The copy takes its name from the source.**

Contentstack names it `<source name> copy`, so **Content Explorer** becomes `Content Explorer copy`.

**Contentstack creates the copy when you save.**

Contentstack creates the profile on save, not when the wizard opens. If you duplicate the same profile twice without renaming the first copy, the second save fails, because Contentstack derives the same `profile_id` for both copies. Rename the copy before you save.

**What the copy includes:**

- Every tool, including per-tool parameters and any tool you disabled.
- The description, unchanged.
- The configuration, including the stack and any project selections.
- Automation and agent tools, because the copy stays in the same organization.

**What changes:**

- The copy gets a new `profile_id` that Contentstack derives from its new name. `CMS copy` becomes `cms_copy`.
- The copy is a custom profile, never a system profile.

## Export a profile

Hover the profile card and click the "Export JSON" icon. The browser downloads the file and names it after the profile, so `Content Explorer` exports as `content-explorer.json`.

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

An export contains no credentials and no stack binding.

- **No configuration.** The file contains no stack API key, no project UIDs, no branch, environment, or locale. The user who imports the file selects each of those values.
- **No automation or agent tools.** An automation's HTTP trigger URL is unauthenticated, so anyone who received a file that contained its trigger ID could run that automation. Contentstack drops these tools from the export and reports the number it dropped in the message below:

  ```
  Exported without 2 automation or agent tools
  ```

  Every other tool is in the file. Re-add the automation and agent tools after you import the file.

## Import a profile

1. Click the chevron beside **New Profile**.
2. Click **Import from JSON**.
3. Pick a file that MCP Profile Hub exported.

On success, the app opens the new profile on the **Configuration** step, because the file contains no stack binding. Select a stack and continue. When you import a custom profile, Contentstack keeps its name unchanged.

When you import an export of a system profile, Contentstack appends ` (imported)` to the name. For example, Contentstack imports `CMS` as `CMS (imported)` and derives the `profile_id` `cms_imported`.

To protect system profiles, Contentstack creates every import as a custom profile and derives its `profile_id` from the name. It rejects any import whose derived `profile_id` matches a system profile, so no import can replace a system profile for the other users in your organization.

Only a system-profile export receives the ` (imported)` rename, which Contentstack detects from a marker that it writes into the export. Contentstack does not rename a custom profile named `CMS`, or a file that someone edited manually. For that import, Contentstack derives `cms`, and the import fails with the system-profile error that [System profile name](#system-profile-name) describes.

## Edit a profile

1. Hover the profile card and click the "Edit" icon.
2. The wizard opens on **Tool selection**, and it pre-fills every field from the saved profile.
3. Change the profile's name, description, tools, or connections. 

The `profile_id` and connector URL do not change when you edit the profile, so connected clients continue to reach the profile after you edit it.

When you add tools, the profile can request more Open Authorization (OAuth) scopes. Connected users approve the new scopes the next time they sign in.

## Enable and disable a profile

A profile has an `enabled` flag. When Contentstack disables a profile, the change takes effect immediately. A disabled profile returns an empty tool list, and calls against it fail.

> **Warning:** The app does not provide a control for this flag. Contact [Contentstack support](mailto:support@contentstack.com) to re-enable a disabled profile.

## Delete a profile

**Warning:** When you delete a profile, every client that uses its URL loses access immediately, including the clients of other users. Check the [Executions](/developers/mcp-profile-hub-monitor-and-troubleshoot) view for recent activity before you delete a shared profile.

To delete a profile, follow the two steps below:

1. Hover the profile card and click the "Delete" icon. 
2. Confirm the action in the **Delete profile** popup. 

You can delete custom profiles only, not system profiles. 

## Limitations

- A profile can hold **at most 200** tools.
- An organization member can hold **at most 50** profiles.
- An organization can hold **at most 500** profiles in total.
- The app does not provide a control for the `enabled` flag. See [Enable and disable a profile](#enable-and-disable-a-profile).

These caps apply whether you create, duplicate, or import a profile.

## Troubleshooting

For every import failure below, the app shows the heading `Couldn't import profile` and then the message in that entry.

### File too large

```
That file is too large to be a profile export.
```

**Root Cause**: The file exceeds 1 MiB.

**Resolution**: Confirm you picked a profile export, not another JSON file.

### Invalid JSON

```
That file isn't valid JSON.
```

**Root Cause**: The file does not parse.

**Resolution**: Re-export the profile rather than editing the file manually.

### Not a profile export

```
That JSON isn't an exported profile. Pick a file exported from MCP Profile Hub.
```

**Root Cause**: The file is JSON, but not a profile export.

**Resolution**: Export the profile from the source organization.

### Newer export format

```
That file was exported by a newer version of MCP Profile Hub (format v2). Update, then import it.
```

**Root Cause**: The file uses a newer export format.

**Resolution**: Contentstack hosts and updates MCP Profile Hub centrally, so you cannot apply the update that the message requests. Re-export the profile from a source organization on your version, or import the file after Contentstack updates MCP Profile Hub for your organization.

### Too many tools

```
That profile has more than 200 tools, which is the maximum a profile can hold.
```

**Root Cause**: The export exceeds the tool limit.

**Resolution**: Split the profile in the source organization, then export each part.

### Missing or malformed field

```
That profile is missing or malformed at "profile.name".
```

**Root Cause**: A required field is absent or the wrong type.

**Resolution**: Re-export rather than editing the file.

### System profile name

```
"CMS" is a system profile. Choose a different name.
```

**Root Cause**: The file is not a system-profile export, so Contentstack does not rename it, and the `profile_id` that Contentstack derives from the name matches a system profile.

**Resolution**: Rename the profile in the file, or re-export it from the source organization.

### Profile ID already exists

```
A profile with this profile_id already exists
```

**Root Cause**: You already have a profile of that name.

**Resolution**: Rename the profile before importing.

### Your profile limit reached

```
Profile limit of 50 reached; delete an existing profile first
```

**Root Cause**: You already have the maximum number of profiles.

**Resolution**: Delete a profile you no longer use.

### Organization limit reached

```
Organization profile limit of 500 reached; ask an administrator to remove unused profiles
```

**Root Cause**: Your organization already has the maximum number of profiles.

**Resolution**: Ask an admin to remove unused profiles.

### Plan excludes a catalog

```
This organization's plan does not include launch. Remove the tools from that catalog and save again.
```

**Root Cause**: The file contains tools your plan excludes. See [Profiles and catalogs](/developers/mcp-profile-hub-profiles-and-catalogs#plan-gated-catalogs).

**Resolution**: Remove those tools, or import into an organization on a plan that includes them.

## Next Steps

- [Connect a client to Profile Hub](/developers/mcp-profile-hub-connect-a-client-to-profile-hub): the install snippet for each client, useful after you duplicate or import a profile.
- [Monitor and troubleshoot](/developers/mcp-profile-hub-monitor-and-troubleshoot): the Executions view and the full error reference.
- [Automations and agents as tools](/developers/mcp-profile-hub-automations-and-agents): the steps to re-add the automation tools an export drops.
