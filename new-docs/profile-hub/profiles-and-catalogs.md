---
uid: ""
url: /docs/mcp/profiles-and-catalogs
seo_title: Profiles and catalogs
seo_description: How MCP Profile Hub profiles bundle tools, configuration, and scope, and the Contentstack service catalogs the tools are drawn from.
---

# Profiles and catalogs

A profile bundles:

- **Identity:** a name, description, and unique `profile_id` (for example, `asset_librarian`).
- **Tools:** the set of catalog tools it exposes.
- **Configuration:** the Contentstack projects it operates on, such as the default stack.
- **Scope:** private to you, or shared across your organization.

## System profiles

System profiles are ready-to-use profiles available to every organization, such as Asset Librarian, Content Explorer, Content Modeler, Campaign Go-Live, and Broken Reference Checker. Pick a stack, install, and use them. Most are deliberately narrow: read-only discovery or a single focused operation.

Product-level profiles (for example, a full-CMS profile) are the exception. They expose an entire product catalog, including destructive tools, so use them only when you intend full product control.

## Custom profiles

Your organization creates custom profiles from the tool catalog to match your own jobs, for example a regional publishing assistant, a localization workflow profile, or a content audit profile. To build one, see [Create a profile](/docs/mcp/create-a-profile).

TODO(screenshot): Profiles screen. It should show the System profiles section with ready-made profiles such as Asset Librarian and Content Explorer, plus the organization's custom profiles and the New Profile button.

## Catalogs

A profile's tools are drawn from catalogs, one per Contentstack service:

| Catalog | Covers |
| --- | --- |
| CMA | Content Management API: entries, assets, content types, branches, workflows, releases, environments, publishing |
| CDA | Content Delivery API: read-only published content |
| Analytics | Content and API usage analytics |
| Brand Kit | On-brand content generation |
| Launch | Deployments, environments, CDN cache revalidation, logs |
| Developer Hub | Marketplace apps, OAuth, and app-integration management |
| Audience Intelligence | Audience segments, user profiles, and behavioral intelligence (Lytics) |
| Personalize | Experiences, experiments, and personalization data |

More catalogs will be added over time.

While you build a profile, tools are grouped by area (for example, Entry Management or Content Types) and tagged by operation: **Read**, **Create**, **Update**, **Delete**, **Action**, and **Publishing**. Read tools are safe for discovery profiles. Delete and some Action tools are destructive and should appear only in profiles whose job requires them. For the full tool list per service, see the [tool catalog](/docs/mcp/cma-tools).

Tools are not raw API endpoints. When a client connects, the runtime adapts each tool to your Contentstack setup, so the tool reflects what you can actually do rather than a generic API surface.

## Keep a profile focused

A profile works best when it supports one well-defined job. When in doubt:

- Prefer a new focused profile over broadening an existing one.
- Expose only the tools the job needs.
- Reserve broad profiles that include destructive tools for admins who need full product control.
