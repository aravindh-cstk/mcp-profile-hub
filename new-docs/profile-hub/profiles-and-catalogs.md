---
uid: ""
url: /developers/mcp-profiles-and-catalogs
seo_title: Profiles and catalogs
seo_description: How MCP Profile Hub profiles bundle tools, configuration, and scope, the system profiles Contentstack ships, and the tool catalogs a profile draws from.
---

# Profiles and catalogs

## Overview

A profile is a named bundle of Contentstack tools you connect an AI client to. Those tools come from catalogs, which are the groupings Contentstack organizes its API operations into. This page covers what a profile holds, the ready-made profiles Contentstack ships, and the catalogs a profile draws from.

A profile bundles:

- **Identity:** a name, description, and unique `profile_id` (for example, `asset_librarian`).
- **Tools:** the set of tools it exposes.
- **Configuration:** the Contentstack projects it operates on, such as the default stack.
- **Scope:** you decide whether the profile stays private to you or is shared across your organization.

## System profiles

System profiles are ready-to-use profiles available to every organization. Pick a stack, install, and use them. The **Profiles** screen splits them into two tabs.

You cannot edit a system profile beyond its configuration. To change which tools one exposes, duplicate it first, which produces an editable custom copy. See [Manage profiles](/developers/mcp-manage-profiles).

### Contentstack products

Seven profiles, one per Contentstack product.

> **Warning:** System product profiles expose their product's complete toolset, including delete and publish operations. Assign one only where you intend the user to have full control of that product.

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

Contentstack builds twenty-one profiles for one job each. Most are deliberately narrow: read-only discovery, or a single focused operation. For example:

| Profile | `profile_id` | Job |
| --- | --- | --- |
| Content Explorer | `content_explorer` | Read-only lookup of content types, entries, and assets. The safest profile for browsing a stack |
| Asset Librarian | `asset_librarian` | Organize and enrich the asset library without publishing or deleting |
| Publishing Helper | `publishing_helper` | Publish and unpublish prepared content, without editing it |
| Governance Inspector | `governance_inspector` | Read-only audit trail, version history, and publish rules for compliance review |
| Broken Reference Checker | `broken_reference_checker` | Find broken or orphaned references before they reach production |
| Campaign Go-Live | `campaign_go_live` | Update an entry, publish it, and revalidate the Launch CDN cache in one flow |

Browse the **Specialty profiles** tab in the app for the current list.

## Custom profiles

Your organization creates custom profiles from the tool browser to match your own jobs, for example a regional publishing assistant, a localization workflow profile, or a content audit profile. To build one, see [Create a profile](/developers/mcp-create-a-profile).

Duplicating a system profile is the other way to get a custom one, because a duplicate is always custom and always editable. See [System profiles](#system-profiles).

TODO(screenshot): Profiles screen. It should show the Your profiles section, the System profiles section with the Contentstack products and Specialty profiles tabs, the hover actions on a profile card, and the New Profile button.

## Where tools come from

A profile draws tools from three tiers. The tool browser shows each tier as a tab.

| Tier | Tab | What it holds |
| --- | --- | --- |
| Hosted catalogs | `Contentstack APIs` | Individual Contentstack API operations, which Contentstack groups by service |
| Your automations | `Automations` | Your Contentstack Automate automations, which the browser exposes as one tool each |
| Your agents | `AI agents` | Your Agent OS agents, which the browser exposes as one tool each |

The tool browser also groups tools by area, for example Entry Management or Content Types.

The `Automations` and `AI agents` tabs cover work you have already built in Contentstack. One call runs a whole workflow instead of the agent chaining many API operations. See [Automations and agents as tools](/developers/mcp-automations-and-agents).

The tab strip appears only when more than one tier has content. If your organization uses neither Automate nor Agent OS, the browser shows the Contentstack API tools with no tabs.

## Catalogs

The `Contentstack APIs` tier holds ten catalogs. Most map to one Contentstack service, but the Content Management API (CMA), CMA Extended, and the Content Delivery API (CDA) all cover content, split by what each access method reaches rather than by product:

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

The **Automate** catalog manages Automate itself. To call your own automations, use the `Automations` tab instead.

Catalog names appear in two forms in the product, and both are correct. The tool browser closes them up (`BrandKit`, `DeveloperHub`), while profile cards and the configuration wizard space them out (Brand Kit, Developer Hub). Search the tool browser using the closed-up form.

For the full tool list per service, see the [Tool Catalog](https://www.contentstack.com/docs/developers/contentstack-mcp-server#tool-catalog) in the Contentstack MCP Server documentation, which lists every tool in each group.

## Operation tags

While you build a profile, the browser tags each tool by operation:

| Tag | What it covers | Risk |
| --- | --- | --- |
| Read | Retrieval only | Safe for discovery profiles |
| Create | Adds new records | Additive, review before exposing |
| Update | Modifies existing records | Destructive to existing content |
| Delete | Removes records | Destructive and usually irreversible |
| Action | Triggers an operation | Varies, some are destructive |
| Publishing | Pushes content live | High impact, affects production |

## Plan-gated catalogs

If your organization's plan does not include a product, its catalog does not appear in the tool browser at all. Contentstack withholds the tab as well as the tools, because an empty tab reads as a broken product rather than one you do not have.

Saving a profile that contains tools from a catalog your plan excludes fails with:

```
This organization's plan does not include <catalogs>. Remove the tools from that catalog and save again.
```

This happens most often when you import a profile that an organization on a different plan exported. Remove the named tools and save again.

If Contentstack cannot read your plan, it serves every catalog rather than blocking you.

## Keep a profile focused

Required OAuth scopes come from your tool selection, so a wider selection asks the user to approve more access at connect time. A profile works best when it supports one well-defined job. When in doubt:

- Prefer a new focused profile over broadening an existing one.
- Expose only the tools the job needs.
- Reserve broad profiles that include destructive tools for admins who need full product control.

## Next Steps

- [Create a profile](/developers/mcp-create-a-profile): build a custom profile from the tool catalog.
- [Manage profiles](/developers/mcp-manage-profiles): duplicate, export, import, enable, and delete existing profiles.
- [Connect a client to MCP Profile Hub](/developers/mcp-connect-a-client-to-profile-hub): install a profile into Claude, Cursor, Codex, or another MCP client.
- [Automations and agents as tools](/developers/mcp-automations-and-agents): expose Automate automations and Agent OS agents as single tools.
- [MCP URL parameters](/developers/mcp-url-parameters): override stack, branch, environment, and locale per connection.
