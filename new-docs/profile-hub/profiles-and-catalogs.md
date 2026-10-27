---
uid: ""
url: /developers/mcp-profiles-and-catalogs
seo_title: Profiles and catalogs
seo_description: MCP Profile Hub profiles bundle tools, configuration, and scope. Read about the system profiles Contentstack ships and the tool catalogs a profile draws from.
---

# Profiles and catalogs

## Overview

Control which Contentstack tools an AI client can call by connecting it to a profile. A profile is a named set of Contentstack tools, and those tools come from catalogs, which group Contentstack's API operations. Use a system profile that Contentstack provides, or build a custom profile from the tools in one or more catalogs.

A profile bundles the four parts below:

- **Identity:** a name, description, and unique `profile_id` (for example, `asset_librarian`).
- **Tools:** the set of tools it exposes.
- **Configuration:** the Contentstack projects it operates on, such as the default stack.
- **Scope:** you decide whether the profile is private to you or available to your whole organization.

## System profiles

Contentstack provides system profiles that require no tool selection. To use a system profile, select a stack and complete the **Installation** step. The **Profiles** screen splits them into two tabs.

You cannot edit a system profile beyond its configuration. To change which tools one exposes, duplicate it first, which produces an editable custom copy.

### Contentstack products

The table below lists seven profiles, one per Contentstack product.

> **Warning:** System product profiles expose their product's complete toolset, including delete and publish operations. Assign a product profile only to users who need the product's complete toolset.

| Profile | `profile_id` | Tools | Covers |
| --- | --- | --- | --- |
| CMS | `cms` | 78 | Content, schema, assets, taxonomy, branches, releases, environments, localization, publishing |
| Launch | `launch` | 27 | Projects, environments, deployments, deploy hooks, cache revalidation, logs |
| Personalize | `personalize` | 24 | Attributes, audiences, experiences, events, geo targeting, experience analytics |
| BrandKit | `brandkit` | 12 | Knowledge vault content, voice profiles, brand-consistent generation |
| DeveloperHub | `developerhub` | 12 | Marketplace apps, Open Authorization (OAuth) configuration, app installations |
| Lytics | `lytics` | 10 | Audience discovery, user profiles, schema inspection, content classification |
| Analytics | `analytics` | 8 | Subscription usage, API and content delivery network (CDN) usage, top URLs, status codes, cache performance |

Tool counts come from the seeded profile definitions. The app shows the current count for each profile.

### Specialty profiles

Contentstack provides 21 specialty profiles. Each one covers one job, such as read-only discovery or a single workflow. The table below lists six of them:

| Profile | `profile_id` | Job |
| --- | --- | --- |
| Content Explorer | `content_explorer` | Read-only lookup of content types, entries, and assets |
| Asset Librarian | `asset_librarian` | Organize and enrich the asset library without publishing or deleting |
| Publishing Helper | `publishing_helper` | Publish and unpublish prepared content, without editing it |
| Governance Inspector | `governance_inspector` | Read-only audit trail, version history, and publish rules for compliance review |
| Broken Reference Checker | `broken_reference_checker` | Find broken or orphaned references before they reach production |
| Campaign Go-Live | `campaign_go_live` | Update an entry, publish it, and revalidate the Launch CDN cache in one flow |

Browse the **Specialty profiles** tab in the app for the current list.

## Custom profiles

Your organization creates custom profiles from the tool browser to match your own jobs, for example a regional publishing assistant, a localization workflow profile, or a content audit profile.

When you duplicate a system profile, the duplicate is also a custom profile, which you can edit. See [System profiles](#system-profiles).

![The Profiles screen, showing the Your profiles section with its New Profile tile, the System profiles section listing CMS, BrandKit, Lytics, Personalize, Analytics, Launch, DeveloperHub, and Content Explorer cards tagged System, and the Executions, Disconnect, and New Profile controls.](images/profiles-screen.png)

## Where tools come from

A profile draws tools from three tiers. The tool browser shows each tier as a tab. The table below describes each tier.

| Tier | Tab | What it holds |
| --- | --- | --- |
| Hosted catalogs | **Contentstack APIs** | Individual Contentstack API operations, which Contentstack groups by service |
| Your automations | **Automations** | Your Contentstack Automate automations, which the browser exposes as one tool each |
| Your agents | **AI agents** | Your Agent OS agents, which the browser exposes as one tool each |

**Tools group by area within a tab.**

Each tab sorts its tools into areas, for example Entry Management or Content Types.

**Two tabs cover work you have already built.**

The **Automations** and **AI agents** tabs expose your existing automations and agents as tools, so a single tool call runs the complete workflow.

**The tool browser shows tabs only when more than one tier contains tools.**

If your organization uses neither Automate nor Agent OS, only one tier has content and the browser shows the Contentstack API tools with no tabs.

## Catalogs

The **Contentstack APIs** tier contains ten catalogs. Most map to one Contentstack service. The [Content Management API (CMA)](/developers/mcp-cma-tools), CMA Extended, and the [Content Delivery API (CDA)](/developers/mcp-cda-tools) all cover content and differ by the API operations each one includes. The table below lists the ten catalogs:

| Catalog | Availability | Covers |
| --- | --- | --- |
| CMA | Always | Entries, assets, content types, branches, workflows, releases, environments, publishing |
| CMA Extended | Always | Audit logs, workflows, publish rules, entry and asset version history, asset folder management, global field writes |
| CDA | Always | Read-only published content |
| Analytics | Plan-dependent | Content and API usage analytics |
| Automate | Plan-dependent | Automate management: list and create projects, inspect automations, activate them, trigger them by ID |
| BrandKit | Plan-dependent | On-brand content generation, voice profiles, knowledge vault |
| Launch | Plan-dependent | Deployments, environments, CDN cache revalidation, logs |
| DeveloperHub | Plan-dependent | Marketplace apps, OAuth, and app-integration management |
| Lytics | Plan-dependent | Audience segments, user profiles, and behavioral intelligence |
| Personalize | Plan-dependent | Experiences, experiments, and personalization data |

The **Automate** catalog contains tools that manage Automate itself. To call your own automations, use the **Automations** tab instead.

The product uses two forms of some catalog names. The tool browser shows them as one word (**BrandKit**, **DeveloperHub**), while profile cards and the configuration wizard show them as two (**Brand Kit**, **Developer Hub**). Search the tool browser using the one-word form.

> **Additional Resource:** For more information on every tool in each group, refer to the [Tool Catalog](/developers/contentstack-mcp-server#tool-catalog) documentation.

## Operation tags

While you build a profile, the browser tags each tool by operation, using the tags in the table below:

| Tag | What it covers | Risk |
| --- | --- | --- |
| Read | Retrieval only | Safe for discovery profiles |
| Create | Adds new records | Additive, review before exposing |
| Update | Modifies existing records | Destructive to existing content |
| Delete | Removes records | Destructive and usually irreversible |
| Action | Triggers an operation | Varies, some are destructive |
| Publishing | Pushes content live | High impact, affects production |

## Plan-gated catalogs

**The browser does not display what your plan excludes.**

If your organization's plan does not include a product, its catalog does not appear in the tool browser. Contentstack withholds the tab as well as the tools, so the browser lists only the catalogs your plan covers.

**A save fails when the profile contains an excluded tool.**

The browser does not display an excluded tool, but a profile can contain one when you import a profile that an organization on a different plan exported. When you save that profile, the save fails with the message below:

```
This organization's plan does not include <catalogs>. Remove the tools from that catalog and save again.
```

## Keep a profile focused

Contentstack derives the required OAuth scopes from your tool selection, so a wider selection requires the user to approve more access when connecting. Scope each profile to one job by following the three rules below:

- Prefer a new focused profile over broadening an existing one.
- Expose only the tools the job needs.
- Reserve broad profiles that include destructive tools for admins who need full product control.

## Next Steps

- [Create a profile](/developers/mcp-create-a-profile): build a custom profile from the tool catalog.
- [Manage profiles](/developers/mcp-manage-profiles): duplicate, export, import, enable, and delete existing profiles.
- [Connect a client to MCP Profile Hub](/developers/mcp-connect-a-client-to-profile-hub): install a profile into Claude, Cursor, Codex, or another MCP client.
- [Automations and agents as tools](/developers/mcp-automations-and-agents): expose Automate automations and Agent OS agents as single tools.
- [MCP URL parameters](/developers/mcp-url-parameters): override stack, branch, environment, and locale per connection.
