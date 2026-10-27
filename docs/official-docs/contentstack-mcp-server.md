---
uid: "bltc2205acbb762b7a2"
url: "/developers/contentstack-mcp-server"
seo_title: "Contentstack MCP server | Contentstack"
seo_description: "Leverage the Contentstack MCP Server for smarter workflows using natural language commands across APIs and tools like Lytics and Claude.
"
---

# Contentstack MCP Server

A complete guide for setting up, configuring, and using the Contentstack MCP Server with AI agents and tools.

## What is the Contentstack MCP Server?

### The Model Context Protocol

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard that lets AI agents (Claude, Cursor, and others) connect to external systems through a common interface. Instead of writing bespoke integration code every time you want an AI to talk to an API, you run an MCP server that exposes those APIs as structured, typed tools. The agent calls those tools and interprets the results in natural language.

### What this server does

The Contentstack MCP Server bridges your Contentstack stack and related services, the Content Management API, Content Delivery API, Analytics, Automations, Launch, BrandKit, Personalize, Developer Hub, and Lytics to any MCP compatible AI agent.

Once configured, your AI agent can:

*   Read, create, update, publish, and unpublish entries and assets in plain language
*   Inspect audit logs, version history, and workflow stages
*   Trigger deployments, check logs, and revalidate CDN caches in Launch
*   Inspect and run deterministic workflows, including HTTP-triggered automation workflow
*   Generate on-brand content via BrandKit AI using voice profiles and a knowledge vault
*   Query audience segments, user profiles, and A/B test results in Personalize and Lytics
*   Manage Marketplace apps and OAuth settings in Developer Hub
*   Pull API usage, cache hit rates, and SDK adoption metrics from Analytics

### Who it's for

*   Developers building AI-powered content workflows or automations
*   Content architects who want an agent to help audit, model, or migrate content
*   DevRel and solutions engineers demonstrating Contentstack capabilities with AI
*   AI workflow builders connecting Contentstack to agent frameworks and pipelines

## Prerequisites

Before you start, make sure you have:

*   An active [Contentstack account](https://www.contentstack.com/login/)
*   Node.js 18 or later installed locally (required to run npx)
*   A supported MCP client:
    *   [Claude Desktop](https://claude.ai/download) (macOS / Windows)
    *   [Cursor](https://cursor.sh/)
    *   [Claude Code](https://claude.ai/code) (CLI)
    *   Any other MCP client that supports stdio transport

## Authentication

Most API groups require OAuth authentication. Run this command once before using the server:

```
npx @contentstack/mcp --auth
```

This opens a browser window. You will:

*   Log in to your [Contentstack account](https://www.contentstack.com/login/)
*   Select your region (US, EU, AU, etc.)
*   Select your organisation
*   Grant the MCP server access

The resulting OAuth tokens are saved locally on your machine. They are reused automatically by the server on subsequent runs, you do not need to re-authenticate unless your tokens expire.

### Which groups require OAuth?

| Group | Authentication method |
| --- | --- |
| CMA, CMA Extended | OAuth or Management Token |
| Analytics | OAuth |
| Automations | OAuth |
| BrandKit | OAuth |
| Launch | OAuth |
| DeveloperHub | OAuth |
| Personalize | OAuth |
| CDA | Token-based (delivery token) |
| Lytics | Token-based (Lytics access token) |

CDA and Lytics do not use OAuth. They authenticate with static tokens you provide in environment variables.

## Authenticating without OAuth (Management Token)

If OAuth authentication is not required and you only need access to content management tooling, CMA and CMA Extended can be authenticated using a [management token](/docs/developers/create-tokens/create-a-management-token/). This approach is particularly well suited for headless environments and CI/CD pipelines where an interactive browser-based authentication flow is unavailable.

```
npx @contentstack/mcp --groups cma,cma-extended \
  --stack-api-key \
  --management-token \
  --region NA
```

Because there is no persisted OAuth session available to determine the target data center automatically, you must explicitly specify the region using either the \--region flag or the CONTENTSTACK\_REGION environment variable.

Management token authentication is supported only for CMA and CMA Extended. Services such as Analytics, Automations, BrandKit, Launch, DeveloperHub, and Personalize continue to require OAuth authentication. The CDA does not support OAuth or management token authentication; instead, it uses a delivery token.

| Group | OAuth | Management Token | Delivery Token |
| --- | --- | --- | --- |
| CMA | Required | Required | Not Required |
| CMA Extended | Required | Required | Not Required |
| CDA | Not Required | Not Required | Required |
| Analytics | Required | Not Required | Not Required |
| Automations | Required | Not Required | Not Required |
| BrandKit | Required | Not Required | Not Required |
| Launch | Required | Not Required | Not Required |
| DeveloperHub | Required | Not Required | Not Required |
| Personalize | Required | Not Required | Not Required |
| Personalize | Not Required | Not Required | Lytics Token |

## Regions and Data Centers

Contentstack operates across multiple data center regions. Each service uses a region-specific base URL, and the appropriate endpoints are automatically resolved based on the region you configure.

### Supported regions

| Code | Data Center | Common Aliases |
| --- | --- | --- |
| NA | AWS North America (default) | us, aws-na, aws\_na |
| EU | AWS Europe | aws-eu, aws\_eu |
| AU | AWS Australia | aws-au, aws\_au |
| AZURE\_NA | Azure North America | azure-na |
| AZURE\_EU | Azure Europe | azure-eu |
| GCP\_NA | GCP North America | gcp-na |
| GCP\_EU | GCP Europe | gcp-eu |

Region aliases are case-insensitive and separator-insensitive. For example, EU, eu, aws-eu, and AWS\_EU all resolve to the same EU region.

### How the region is chosen

Region resolution follows this order of precedence:

1.  **Explicit configuration**: A region specified using the \--region flag or the CONTENTSTACK\_REGION environment variable always takes precedence. If the provided value is not recognized, the application returns an error.
2.  **OAuth session:** When you authenticate using npx @contentstack/mcp --auth, the selected data center is stored with the OAuth session and is used automatically when no explicit region is configured.
3.  **Default region:** If neither an explicit region nor a saved OAuth session is available, the region defaults to NA.

When using a delivery-token-only (CDA) or management-token-only (CMA) configuration, no OAuth session is available to determine the target region automatically. In these scenarios, you must explicitly set the region using the CONTENTSTACK\_REGION environment variable or the \--region flag to ensure requests are routed to the correct data center.

Regional endpoint mappings are sourced from Contentstack’s official region registry, ensuring that the server remains automatically synchronized with newly added and updated data centers. The registry is available at https://artifacts.contentstack.com/regions.json.

## Installation

No installation or repository cloning is needed. The server runs on demand via npx:

```
npx @contentstack/mcp
```

The -y flag (used in MCP client configs) automatically confirms the npx prompt, so the agent can start the server without human input:

```
npx -y @contentstack/mcp
```

npx pulls the latest published version of @contentstack/mcp from npm each time it runs. This means you always get the latest tool definitions without a manual upgrade step.

## Configuration

The server is configured through environment variables or equivalent CLI arguments. Both work identically, use whichever your MCP client supports.

### Environment variables

| Variable | CLI argument | Description | Required for |
| --- | --- | --- | --- |
| CONTENTSTACK\_API\_KEY | \--stack-api-key | Your Contentstack Stack API Key | CMA, CMA Extended, CDA, DeveloperHub |
| CONTENTSTACK\_DELIVERY\_TOKEN | \--delivery-token | Delivery token for the target environment | CDA only |
| CONTENTSTACK\_MANAGEMENT\_TOKEN | \--management-token | Management token: an alternative to OAuth for CMA / CMA Extended | CMA / CMA Extended without OAuth |
| CONTENTSTACK\_REGION | \--region | center to target (see \[Regions\](#regions-and-data-centers)) | Data | Optional — defaults to NA |
| CONTENTSTACK\_BRAND\_KIT\_ID | \--brand-kit-id | Your Brand Kit ID | BrandKit only |
| CONTENTSTACK\_LAUNCH\_PROJECT\_ID | \--launch-project-id | Your Launch Project UID | Launch only |
| CONTENTSTACK\_ORGANIZATION\_UID | \--organization-uid | Your Organisation UID | Launch only |
| CONTENTSTACK\_PERSONALIZE\_PROJECT\_ID | \--personalize-project-id | Your Personalize Project ID | Personalize only |
| LYTICS\_ACCESS\_TOKEN | \--lytics-access-token | Your Lytics access token | Lytics only |
| GROUPS | \--groups | Comma-separated list of API groups to enable | Optional - defaults to cma |
| CONTENTSTACK\_ENVIRONMENT | \- | Default environment name used by enrichment | Optional |
| CONTENTSTACK\_BRANCH | \- | Default locale code used by enrichment | Optional |
| CONTENTSTACK\_LOCALE | \- | Default branch used by enrichment (defaults to main) | Optional |
| CONTENTSTACK\_MCP\_ENRICH\_TOOL | \- | Set to false to disable stack-aware tool enrichment | Optional (on by default) |

You only need to configure the environment variables required for the services you're actually using. If you're working solely with CMA, all you need is CONTENTSTACK\_API\_KEY along with a valid authentication method, either an OAuth session or a CONTENTSTACK\_MANAGEMENT\_TOKEN. If you also enable CDA, make sure to additionally provide a CONTENTSTACK\_DELIVERY\_TOKEN.

### Stack-aware tool enrichment

Starting in version 0.9.0, each tools/list response can enrich supported tool descriptions and input schemas with live metadata, helping agents select valid values instead of guessing. This feature is enabled by default; to disable it, set CONTENTSTACK\_MCP\_ENRICH\_TOOLS=false.

*   CDA tools bootstrap from the delivery token via GET /v3/content\_types, along with the configured environment, branch, and locale.
*   CMA and CMA Extended tools bootstrap from a management token or OAuth session, fetching content types, environments, locales, and branches in parallel.
*   Launch tools bootstrap from OAuth via the Launch manage REST API (GET /projects/{project\_uid}/environments); GraphQL tool mappers remain unchanged.
*   Brand Kit tools bootstrap from OAuth via two REST hosts: voice profiles from the brand-kits-api, and Knowledge Vault from the AI host.
*   Personalize tools bootstrap from OAuth via the Personalize management API, covering attributes, audiences, experiences, and events.
*   Developer Hub tools bootstrap from OAuth via the Marketplace apps REST API (GET /apps); the organization UID comes from OAuth or CONTENTSTACK\_ORGANIZATION\_UID, and the stack API key comes from CONTENTSTACK\_API\_KEY.
*   Each tool's JSON declares an "x-enrich-group" value, cda, cma, launch, brandkit, personalize, or developerhub, with CMA Extended tools using the cma enrichment profile. Rules are defined in [tools/enrich-profiles.json](https://mcp.contentstack.com/enrich-profiles/tools).

Stack context is cached for five minutes per connection. CMA enrichment is skipped when only a delivery token is available (for example, CDA-only credentials with CMA groups loaded).

See [Build your own MCP Stack-aware enrichment](https://developers.contentstack.com/guides/how-to-build-your-own-mcp-server-with-contentstack-s-tools-api) for the full extension spec.

### Where to find your credentials

*   **Stack API Key:** Contentstack Dashboard → Settings → API Credentials
*   **Delivery Token:** Contentstack Dashboard → Settings → Tokens → Delivery Tokens → create one for your target environment
*   **Management Token:** Contentstack Dashboard → Settings → Tokens → Management Tokens → create one (only if authenticating CMA without OAuth)
*   **Brand Kit ID:** BrandKit Dashboard → your brand kit's settings page
*   **Launch Project ID:** Launch Dashboard → your project's URL or settings
*   Organisation UID: Launch Dashboard → your project's URL or organisation settings
*   **Personalize Project ID:** Personalize Dashboard → your project's settings
*   **Lytics Access Token:** [Lytics account settings](https://docs.lytics.com/docs/access-tokens) → API Tokens

### Custom endpoints (dedicated infrastructure)

Customers on dedicated or private infrastructure whose hosts differ from the standard regional endpoints can override individual service base URLs. When set, an override fully replaces the region-derived base URL for that service, including any path suffix the service expects (for example, Launch's /manage). A trailing slash is trimmed automatically, and any service without an override falls back to the regional default.

| Envrionment Variable | Service |
| --- | --- |
| CONTENTSTACK\_CMA\_BASE\_URL | CMA and CMA Extended |
| CONTENTSTACK\_CDA\_BASE\_URL | CDA |
| CONTENTSTACK\_DEVELOPERHUB\_BASE\_URL | Developer Hub |
| CONTENTSTACK\_PERSONALIZE\_BASE\_URL | Personalize |
| CONTENTSTACK\_ANALYTICS\_BASE\_URL | Analytics |
| CONTENTSTACK\_AUTOMATIONS\_BASE\_URL | Automations |
| CONTENTSTACK\_LAUNCH\_BASE\_URL | Launch (include /manage) |
| CONTENTSTACK\_BRANDKIT\_AI\_BASE\_URL | BrandKit: AI host |
| CONTENTSTACK\_BRANDKIT\_API\_BASE\_URL | BrandKit: brand-kits-api host |
| CONTENTSTACK\_LYTICS\_BASE\_URL | Lytics |

```
CONTENTSTACK_CMA_BASE_URL=https://acme-cma.internal.example.com
CONTENTSTACK_CDA_BASE_URL=https://acme-cdn.internal.example.com
```

### The GROUPS variable

The GROUPS variable controls which API toolsets are exposed to the agent. Loading only what you need is good practice, it reduces the volume of tool definitions sent to the model on every turn, keeping context windows lean and responses focused.

| Group value | Tools | Purpose |
| --- | --- | --- |
| cma | 78 | Core content management: entries, assets, content types, branches, releases, publishing, variants, environments, global fields, taxonomies |
| cma-extended | 22 | Audit logs, version history, global field writes, asset folder management, workflow and publish rule inspection — load alongside cma |
| cda | 4 | Published content via CDN: fast, read-only delivery of entries and assets |
| analytics | 8 | API/CDN usage, cache performance, status codes, SDK adoption, device/URL analytics |
| automations | 9 | Agent OS projects, automation inspection, activation controls, and HTTP-triggered workflow executions |
| brandkit | 12 | AI content generation, voice profiles, knowledge vault |
| launch | 27 | Projects, environments, deployments, deploy hooks, logs, file upload, CDN cache revalidation |
| developerhub | 12 | Marketplace app lifecycle, OAuth settings, app installations |
| lytics | 10 | Audiences, user profiles, content topics, classification, fields, tables |
| personalize | 24 | Attributes, audiences, experiences, events, analytics, geolocation helpers |
| all | all of the above | Enable everything - best for exploration and prototyping |

Examples:

bashCopy

```
GROUPS=cma
GROUPS=cma,cma-extended
GROUPS=cma,cda
GROUPS=all
```

**Tip:** For everyday content operations, cma alone is sufficient. Add cma-extended only when the session requires audit trails, version inspection, or workflow context. Loading all is convenient for exploration but sends the full tool list to the model on every turn.

## MCP Client Setup

### Claude Desktop

Edit ~/Library/Application Support/Claude/claude\_desktop\_config.json on macOS, or %APPDATA%\\Claude\\claude\_desktop\_config.json on Windows.

#### Option A: Environment variables (recommended):

```
{
  "mcpServers": {
    "contentstack": {
      "command": "npx",
      "args": ["-y", "@contentstack/mcp"],
      "env": {
        "CONTENTSTACK_API_KEY": "<YOUR_STACK_API_KEY>",
        "CONTENTSTACK_DELIVERY_TOKEN": "<YOUR_DELIVERY_TOKEN>",
        "CONTENTSTACK_MANAGEMENT_TOKEN": "<YOUR_MANAGEMENT_TOKEN>"
        "CONTENTSTACK_BRAND_KIT_ID": "<YOUR_BRAND_KIT_ID>",
        "CONTENTSTACK_LAUNCH_PROJECT_ID": "<YOUR_LAUNCH_PROJECT_ID>",
        "CONTENTSTACK_ORGANIZATION_UID": "<YOUR_ORGANIZATION_UID>"
        "CONTENTSTACK_PERSONALIZE_PROJECT_ID": "<YOUR_PERSONALIZE_PROJECT_ID>",
        "LYTICS_ACCESS_TOKEN": "<YOUR_LYTICS_TOKEN>",
        "GROUPS": "cma"
      }
    }
  }
}
```

Only include the env vars relevant to the groups you are enabling. Remove keys you do not need.

#### Option B: CLI arguments (use if your client does not support env vars):

```
{
  "mcpServers": {
    "contentstack": {
      "command": "npx",
      "args": [
        "-y",
        "@contentstack/mcp",
        "--stack-api-key",
        "<YOUR_STACK_API_KEY>",
        "--delivery-token",
        "<YOUR_DELIVERY_TOKEN>",
        "--brand-kit-id",
        "<YOUR_BRAND_KIT_ID>",
        "--launch-project-id",
        "<YOUR_LAUNCH_PROJECT_ID>",
        "--organization-uid",
        "<YOUR_ORGANIZATION_UID>",
        "--lytics-access-token",
        "<YOUR_LYTICS_TOKEN>",
        "--personalize-project-id",
        "<YOUR_PERSONALIZE_PROJECT_ID>",
        "--groups",
        "cma"
      ]
    }
  }
}
```

After editing the file, restart Claude Desktop to pick up the changes.

### Cursor

Edit ~/.cursor/mcp.json (create it if it does not exist):

```
{
  "mcpServers": {
    "contentstack": {
      "command": "npx",
      "args": ["-y", "@contentstack/mcp"],
      "env": {
        "CONTENTSTACK_API_KEY": "<YOUR_STACK_API_KEY>",
        "GROUPS": "cma"
      }
    }
  }
}
```

Restart Cursor after saving.

### Claude Code (CLI)

Use the claude mcp add command to register the server:

```
claude mcp add contentstack \
  --command "npx" \
  --args "-y,@contentstack/mcp" \
  --env "CONTENTSTACK_API_KEY=<YOUR_API_KEY>,GROUPS=cma"
```

### Other MCP clients

The Contentstack MCP Server uses **stdio transport**, which is the standard for locally-run MCP servers. Any MCP client that supports stdio should work with the same configuration pattern: point the client at npx -y @contentstack/mcp and pass your credentials via environment variables or CLI arguments.

## API Groups: what to load and when

### CMA: Content Management API

Authorization: OAuth or Management Token

**Load with:** GROUPS=cma

**Requires:** Stack API Key

The core group for content operations. Covers the full lifecycle of entries and assets: create, read, update, delete, publish, unpublish, and localize. Also includes branches, branch aliases, merge jobs, releases, publishing queues, content types, global fields, taxonomies, terms, variants, and environments.

Use this group for:

*   Day-to-day content management tasks
*   Content modelling and schema inspection
*   Bulk publishing or unpublishing workflows
*   Branch management and merge operations

78 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#content-management-api-cma) for the full list.

### CMA Extended - Content Management API Extended

Authorization: OAuth or Management Token

**Load with:** GROUPS=cma,cma-extended

**Requires:** Stack API Key

Extends CMA with administrative and investigative capabilities. Load alongside cma when the session requires:

*   **Audit logs:** every create, update, delete, publish, and unpublish action is recorded.
*   **Version history:** inspect or label every version of an entry or asset.
*   **Global field writes:** create, update, and delete global fields.
*   **Asset folder management:** create, rename, and delete asset folders.
*   **Workflow inspection:** retrieve workflow definitions and publish rules.

22 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#content-management-api-extended-cma-extended) for the full list.

### CDA: Content Delivery API

Authentication: Token-based

**Load with:** GROUPS=cda

**Requires:** Stack API Key + Delivery Token

Delivers published content through Contentstack's global CDN. Read-only. Returns only content that has been published to the target environment — draft or unpublished entries are not visible.

Does not require OAuth. Authenticate by providing a delivery token scoped to your target environment.

4 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#content-delivery-api-cda) for the full list.

### Analytics

Authentication: OAuth

**Load with:** GROUPS=analytics

**Requires:** No additional tokens

Usage analytics for your Contentstack organisation: API call volumes, CDN bandwidth, cache hit/miss ratios, HTTP status code distribution, SDK version adoption, and URL-level traffic patterns.

All analytics tools are asynchronous — they return a jobId which you then pass to get\_job\_data to retrieve the results once the job completes.

8 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#analytics-api) for the full list.

### Automations

**Load with:** GROUPS=analytics

**Authentication**OAuth

**Requires:** No additional tokens

Agent OS management and deterministic workflow execution. Manage Agent OS projects, inspect automation rules, activate or deactivate configured automations, and run workflows that use an HTTP Request trigger.

Use \`list\_automations\` or \`get\_automation\` with \`show\_steps: true\` to identify HTTP-triggered workflows. Those automations expose a trigger \`id\`; pass that value to \`trigger\_automation\` with an optional JSON payload to run the workflow through MCP. This lets an agent choose when to run a workflow while Automation Hub controls exactly how the work is performed.

See the [Tool Catalog](/docs/developers/contentstack-mcp-server#automations-api) for the full list.

### BrandKit

Authentication: OAuth

**Load with:** GROUPS=brandkit

**Requires:** Brand Kit ID

AI-powered content generation grounded in your brand. BrandKit provides:

*   **Voice Profiles:** define the tone, style, formality, and complexity of generated content.
*   **Knowledge Vault:** a store of brand guidelines, reference materials, and tone-of-voice examples.
*   **Generative AI:** combines your voice profile and knowledge vault context to produce on-brand content.

12 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#brandkit-ai) for the full list.

### Launch

Authentication: OAuth

**Load with:** GROUPS=launch

**Requires:** Launch Project ID + Organisation UID

**27 tools**

Full control over Launch, Contentstack's hosting and deployment platform. Manage projects and environments, create and trigger deploy hooks, monitor deployment status and build logs, fetch server runtime logs, upload ZIP files for file-based deployments, and revalidate CDN caches after content updates.

Supports both Git-connected projects (GitHub, Bitbucket) and file-upload projects.

See the [Tool Catalog](/docs/developers/contentstack-mcp-server#launch-api) for the full list.

### Developer Hub

Authentication: OAuth

**Load with:** GROUPS=developerhub

**Requires:** Stack API Key

**12 tools**

Manage Contentstack Marketplace apps. Create, update, and delete apps, configure OAuth settings, install apps into stacks or organisations, and inspect existing installations.

Use this group when building or managing custom integrations, UI extensions, webhooks, or automation apps on the Contentstack Marketplace.

When enrichment is enabled, tool descriptions display your organization's Marketplace apps, and app\_uid parameters are populated with enums from GET/apps.

See the [Tool Catalog](/docs/developers/contentstack-mcp-server#developer-hub) for the full list.

### Lytics

Token-based

**Load with:** GROUPS=lytics

**Requires:** Lytics Access Token

Access your Lytics customer data platform. Retrieve audience segments, look up individual user profiles, explore content topics and classifications, inspect schema fields and data tables, and classify or enrich content via Lytics' AI engine.

Does not require OAuth. Authenticate with a Lytics access token.

10 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#lytics-analytics) for the full list.

### Personalize

OAuth

**Load with:** GROUPS=personalize

**Requires:** Personalize Project ID

**24 tools**

Configure and inspect Contentstack Personalize: manage custom attributes and audience segments, create and manage personalization experiences (both Segmented and A/B Test types), define events for conversion tracking, retrieve analytics summaries and time-series data for experience versions, and look up geolocation data for geographic targeting rules.

24 tools. See the [Tool Catalog](/docs/developers/contentstack-mcp-server#personalize-api) for the full list.

### Group Requirements Summary

| Group | Authentication | Additional credentials |
| --- | --- | --- |
| CMA | OAuth or Management Token | Stack API Key |
| CMA Extended | OAuth or Management Token | Stack API Key |
| CDA | Token-based | Stack API Key + Delivery Token |
| Analytics | OAuth | — |
| Automations | OAuth | — |
| BrandKit | OAuth | Brand Kit ID |
| Launch | OAuth | Launch Project ID + Organisation UID |
| DeveloperHub | OAuth | Stack API Key |
| Lytics | Token-based | Lytics Access Token |
| Personalize | OAuth | Personalize Project ID |

## Common Workflows

Once configured, you interact with Contentstack entirely through natural language. Here are examples of what agents can do with different groups enabled.

**Content management (****CMA****):**

*   "Get all entries for the article content type that were published in the last 30 days"
*   "Create a new entry in blog\_post with the title 'Getting started with MCP' and publish it to the production environment"
*   "Show me all entries that reference the asset with UID blt1234abcd"
*   "Create a branch called feature/new-homepage from main and add the hero entry to a release"
*   "What environments does this stack have, and which locales are configured?"

**Auditing and investigation (****CMA, CMA-extended****):**

*   "Show me the audit log for the last 24 hours - who changed what?"
*   "What versions exist for entry blt9abc in the product content type? Label version 4 as 'Pre-launch approved'"
*   "Which workflow stages require approval before an entry can be published?"

**Content delivery (****CDA****):**

*   "Fetch the latest published entries from the homepage\_banner content type on the production environment"
*   "What does the live version of entry blt5678efgh look like right now?"

**Deployments (****Launch****):**

*   "What's the current deployment status of the staging environment?"
*   "Fetch the build logs from the last deployment — did it fail anywhere?"
*   "Trigger the deploy hook for the production environment"
*   "Revalidate the CDN cache after I update the hero entry"

**Brand content (****Brandkit****):**

*   "Generate a product description for a new running shoe using the 'Active lifestyle' voice profile"
*   "Add the updated brand guidelines document to the Knowledge Vault"
*   "What voice profiles are available in my Brand Kit?"

**Personalization (****Personalize****):**

*   "Show me all active A/B test experiences and their current conversion rates"
*   "Create a new audience segment for users in Germany who have viewed more than 3 product pages"
*   "What's the analytics summary for experience version ver\_abc123 over the last 7 days?"

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| "Unauthorized" errors on CMA / Analytics / Launch calls | OAuth not run, or tokens expired | Run npx @contentstack/mcp --auth and complete the flow |
| CDA returns empty or 401 errors | Missing or incorrect delivery token | Check CONTENTSTACK\_DELIVERY\_TOKEN — it must be scoped to the correct environment |
| Contentstack tools not appearing in your MCP client | GROUPS value is wrong or malformed | Check for typos and spaces — use comma-separated values with no spaces, e.g. cma,cda |
| Launch tools fail with auth errors | Organisation UID not set | Add CONTENTSTACK\_ORGANIZATION\_UID to your environment — find it in the Launch dashboard URL |
| Lytics tools return 403 | Expired or incorrect access token | Regenerate your Lytics access token and update LYTICS\_ACCESS\_TOKEN |
| Analytics get\_job\_data returns "200 Job active" | Job still processing | Wait a few seconds and retry — analytics jobs are asynchronous |
| npx prompts for confirmation in the client | \-y flag missing | Ensure your args array includes "-y" as the first argument after "npx" |
| Requests hit the wrong data center, or return 404 / 401 | Region not set (no OAuth to infer it) | Set CONTENTSTACK\_REGION / --region to match your stack's data center |
| Unknown region "…" error on startup | Misspelled region value | Use a supported code or alias, see \[Regions\](#regions-and-data-centers) |
| CMA calls fail with auth errors and no OAuth session | No management token provided | Run --auth, or set CONTENTSTACK\_MANAGEMENT\_TOKEN and CONTENTSTACK\_REGION |

## Tool Catalog

Full reference for every tool exposed by each group.

### Content Management API (CMA)

| Tool | Description |
| --- | --- |
| publish\_an\_entry | Publishes a specified entry of a content type to one or more environments and locales within a branch of the stack. Optionally schedule the publish for a future time. |
| unpublish\_an\_entry | Unpublishes a specified entry from selected environments and locales within a branch, removing it from the CDN. Optionally schedule the unpublish for a future time. |
| publish\_variants\_of\_an\_entry | Publishes one or more variants of an entry to selected environments and locales within a branch. |
| create\_an\_entry | Creates a new entry in the specified Contentstack stack, targeting a defined content type and branch, with support for locale selection and structured entry data. |
| delete\_an\_entry | Deletes a specified entry from a Contentstack stack, targeting the provided content type and entry UID, with optional parameters for branch, locale, and deletion of all localized variants. |
| get\_all\_entries | Retrieves entry details for a specified content type within a Contentstack stack, supporting branch selection, pagination, versioning, locale filtering, advanced query parameters, optional draft overlay, and optional inclusion of metadata, workflow, branch, and publish details. |
| get\_single\_entry | Retrieves metadata and field values for a specified entry within a given content type, supporting branch, version, and locale selection. |
| update\_an\_entry | Updates an existing entry in the given content type, branch, and locale by replacing its field data. |
| get\_all\_content\_types | Retrieves all content types in the stack, with pagination, query filtering, and optional inclusion of the global field schema. |
| get\_a\_single\_content\_type | Retrieves the schema and configuration details of a specified content type within a stack. |
| create\_a\_content\_type | Creates a new content type in the specified Contentstack stack, supporting branch selection and optional branch metadata inclusion. |
| update\_content\_type | Updates an existing content type in the specified Contentstack stack. |
| delete\_content\_type | Deletes an existing content type and all the entries within it. |
| get\_all\_references\_of\_ct | Retrieves the content types that reference the specified content type, including direct and nested references. |
| export\_content\_type | Exports a specific content type and its schema as JSON. |
| get\_all\_taxonomies | Retrieves metadata for all taxonomies in the stack, with pagination and typeahead search by UID or name. |
| get\_a\_single\_taxonomy | Retrieves metadata and configuration details for a specified taxonomy. |
| export\_a\_taxonomy | Exports a taxonomy and all its associated terms from the specified stack. |
| get\_all\_languages | Retrieves metadata for all languages configured within a specified stack branch, supporting pagination. |
| get\_all\_assets | Retrieves metadata for all assets in the stack, with environment and folder filters, query filtering, sorting, and pagination. |
| get\_all\_branches | Retrieves metadata for all branches within a specified stack, supporting pagination. |
| create\_a\_branch | Creates a new branch in the specified Contentstack stack. |
| get\_a\_single\_branch | Retrieves metadata and configuration details for a specified branch within a Contentstack stack. |
| delete\_a\_branch | Deletes a branch in the specified Contentstack stack. |
| compare\_branches | Retrieves a list of all the differences between two branches. |
| compare\_content\_types\_between\_branches | Retrieves a list of all the differences in content types between the two specified branches. |
| compare\_global\_fields\_between\_branches | Retrieves a list of all the differences in global fields between the two specified branches. |
| compare\_specific\_ct\_between\_branches | Retrieves all the differences of the specified content type between the two specified branches. |
| compare\_specific\_gf\_between\_branches | Retrieves all the differences of the specified global field between the two specified branches. |
| get\_all\_merge\_jobs | Retrieves a list of all the recent merge jobs within a specific period. |
| merge\_branch | Merges content types and global fields from a compare branch into a base branch, with optional per-item strategy overrides. |
| get\_a\_single\_merge\_job | Retrieves detailed information for a specified merge job within a stack. |
| get\_a\_single\_branch\_alias | Retrieves metadata and configuration details for a specified branch alias within a Contentstack stack. |
| get\_all\_branch\_aliases | Retrieves metadata for all branch aliases within a specified stack, supporting pagination. |
| assign\_a\_branch\_alias | Assigns (creates or updates) a branch alias so it points to a target branch in the stack. |
| delete\_a\_branch\_alias | Permanently deletes the specified branch alias from the selected stack. |
| get\_all\_global\_fields | Retrieves metadata for all global fields configured within the specified stack. |
| get\_all\_items\_in\_a\_release | Retrieves metadata and content details for all items associated with the specified release. |
| get\_all\_releases | Retrieves metadata for all releases in the stack, with pagination and optional inclusion of total and item counts. |
| get\_all\_terms | Retrieves all term details for a specified taxonomy from the stack, supporting pagination. |
| get\_all\_terms\_across\_all\_taxonomies | Retrieves term details from all taxonomies within the stack, supporting typeahead search, pagination, and optional total count inclusion. |
| get\_all\_variants\_of\_an\_entry | Retrieves all variants (personalization variants) of a specified entry within the selected content type. |
| get\_all\_ancestors\_of\_a\_term | Retrieves the complete ancestor hierarchy for a specified term within a taxonomy, supporting pagination. |
| get\_a\_single\_asset | Retrieves metadata and properties for a specified asset within a Contentstack stack, supporting branch, environment, and version parameters. |
| get\_asset\_reference | Retrieves all entries referencing the specified asset within the selected branch, enabling asset dependency analysis. |
| get\_all\_descendants\_of\_a\_term | Retrieves all descendant terms of a specified taxonomy term, supporting pagination. |
| get\_a\_single\_release | Retrieves metadata and configuration details for a specified release within a given branch. |
| get\_single\_entry\_variant | Retrieves a specific variant of a content entry from a designated content type, branch, and locale. |
| get\_a\_single\_global\_field | Retrieves metadata and configuration details for a specified global field within a Contentstack stack. |
| get\_a\_single\_variant | Retrieves details of a single variant within a variant group. |
| get\_a\_single\_term | Retrieves detailed metadata for a specified taxonomy term. |
| get\_all\_variants\_of\_a\_content\_type | Retrieves all variant definitions (variant groups) linked to the specified content type. |
| get\_publish\_queue | Retrieves the publish queue for the branch — the log of publish, unpublish, and delete activities on entries and assets. |
| get\_references\_of\_an\_entry | Retrieves all entries that reference the specified entry via reference fields. |
| add\_items\_to\_a\_release | Programmatically adds specified content items to a designated release within a Contentstack stack branch. |
| clone\_a\_release | Creates a duplicate of an existing release in the specified branch, assigning a new name and optional description. |
| localize\_an\_entry | Localizes a specified entry within a stack by creating or updating its content for the target locale. |
| create\_a\_release | Creates a new empty release object within the specified stack branch. |
| create\_a\_taxonomy | Creates a new taxonomy object within the specified stack. |
| create\_a\_term | Creates a new term within a specified taxonomy by assigning a unique identifier, name, order, and optional parent term. |
| delete\_an\_asset | Permanently deletes the specified asset from the selected branch within the stack. |
| delete\_a\_taxonomy | Deletes the specified taxonomy and all associated terms from the stack. |
| delete\_a\_term | Deletes a specified term from a taxonomy; supports forced deletion. |
| get\_all\_environments | Fetches the list of environments in the stack, with optional total-count reporting and sorting. |
| create\_an\_environment | Creates a new environment in the stack by specifying its name and one or more locale-specific base URLs. |
| get\_an\_environment | Retrieves full details for a single environment, identified by its name. |
| update\_an\_environment | Updates an existing environment — name and/or locale-to-URL mappings. |
| delete\_an\_environment | Permanently deletes an environment, identified by its name. |
| deploy\_a\_release | Deploys a release to one or more target environments, publishing or unpublishing all of its items. Supports optional scheduling. |
| update\_a\_taxonomy | Updates the name and description fields of a specified taxonomy entity. |
| update\_a\_term | Renames a specified term within a taxonomy. Name only; use move\_a\_term to reorder or reparent. |
| move\_a\_term | Reorders or reparents a term within its taxonomy via the dedicated move endpoint (new parent\_uid or null for root, plus order among siblings). |
| delete\_items\_from\_a\_release | Programmatically removes specified content items from a designated release. |
| publish\_an\_asset | Publishes a specified asset to one or more environments and locales, with optional scheduling. |
| unpublish\_an\_asset | Unpublishes a specified asset from selected environments and locales, with optional scheduling. |
| unlocalize\_an\_entry | Unlocalizes a specified entry in a given locale, restoring it to its fallback state. |
| create\_an\_entry\_variant | Creates an entry variant for an existing base entry. |
| delete\_an\_entry\_variant | Deletes a specified entry variant from a base entry. |

### Content Management API Extended (CMA Extended)

Load alongside cma with GROUPS=cma,cma-extended.

| Tool | Description |
| --- | --- |
| get\_audit\_log | Retrieves a paginated list of audit log entries for the stack. Every create, update, delete, publish, and unpublish action is recorded. |
| get\_audit\_log\_item | Retrieves the full detail of a single audit log entry, including before and after field values, the user who made the change, and the timestamp. |
| get\_all\_versions\_of\_an\_entry | Retrieves the full version history of a specific entry. |
| set\_entry\_version\_name | Assigns a human-readable label to a specific version of an entry. Named versions are visible in the Contentstack UI. |
| delete\_entry\_version\_name | Removes the label previously assigned to a specific entry version. The version itself is not deleted. |
| create\_a\_global\_field | Creates a new global field in the stack. Changes propagate to every content type that uses it. |
| update\_a\_global\_field | Updates the schema or title of an existing global field. Changes propagate to every content type that embeds this global field. |
| delete\_a\_global\_field | Permanently deletes a global field and removes its embedded occurrence from every content type that references it. This action cannot be undone. |
| export\_global\_field | Exports a global field definition as a JSON object. |
| update\_asset\_details | Updates the metadata of an existing asset — title, description, or tags — without replacing the underlying file. |
| get\_assets\_of\_a\_specific\_folder | Retrieves assets contained in a specific folder by its UID, with optional sub-folder inclusion and publish detail filters. |
| get\_assets\_and\_subfolders\_of\_a\_parent\_folder | Retrieves both asset files and sub-folder entries within a parent folder. |
| create\_asset\_folder | Creates a new folder in the asset library, optionally nested under a parent folder. |
| update\_asset\_folder | Renames an existing asset folder. |
| delete\_asset\_folder | Permanently deletes an asset folder and all assets and sub-folders it contains. This action cannot be undone. |
| get\_all\_versions\_of\_an\_asset | Retrieves the full version history of a specific asset. |
| set\_asset\_version\_name | Assigns a human-readable label to a specific version of an asset. |
| delete\_asset\_version\_name | Removes the label previously assigned to a specific asset version. The version itself is not deleted. |
| get\_all\_workflows | Retrieves all workflows defined in the stack. |
| get\_a\_single\_workflow | Retrieves the complete definition of a single workflow, including all stages, transition rules, and role-based permissions. |
| get\_publish\_rules | Retrieves publish rules for workflows in the stack, defining which workflow stages allow or block publishing. |
| get\_publish\_queue\_activity | Retrieves a recent activity summary for the publish queue across the entire stack. |

### Content Delivery API (CDA)

| Tool | Description |
| --- | --- |
| get\_all\_assets\_cdn | Retrieves published assets from the CDN. Returns metadata including URLs, file types, dimensions, and publish status. Supports pagination, branch and locale selection, and optional image dimension inclusion. |
| get\_all\_entries\_cdn | Retrieves published entries of a content type from the CDN for fast, global delivery. Supports filtering, sorting, reference resolution, locale selection, and fallback. Maximum 100 entries per request. |
| get\_a\_single\_asset\_cdn | Retrieves a specific published asset from the CDN by its unique identifier. |
| get\_a\_single\_entry\_cdn | Retrieves a specific published entry from the CDN by its unique identifier and content type. |

### Analytics API

All analytics tools are asynchronous: they return a jobId that you pass to get\_job\_data to retrieve results.

| Tool | Description |
| --- | --- |
| get\_subscription\_usage | Retrieves a summary of Launch resource consumption within your organisation for a specified date range. Returns a jobId for get\_job\_data. |
| get\_device\_usage | Analyzes device and SDK usage patterns across your Contentstack services over a specified period. Returns a jobId for get\_job\_data. |
| get\_usage\_analytics | Retrieves API and CDN usage analytics broken down by service type. Returns a jobId for get\_job\_data. |
| get\_top\_urls | Analyzes URL-level traffic patterns across your Contentstack services. Returns a jobId for get\_job\_data. |
| get\_status\_code | Retrieves HTTP status code distribution across your services for a specified period. Returns a jobId for get\_job\_data. |
| get\_cache\_usage | Analyzes cache performance by tracking HIT and MISS rates across your services. Returns a jobId for get\_job\_data. |
| get\_sdk\_usage | Tracks SDK adoption and usage patterns across your services. Returns a jobId for get\_job\_data. |
| get\_job\_data | Retrieves the completed results for an asynchronous analytics job using its jobId. If the job is still processing, returns "200 Job active" — retry after a short delay. |

### Automations API

Agent OS project management, automation discovery, activation controls, and deterministic HTTP-triggered workflow execution. Use list\_automations or get\_automation with show\_steps: true to find automations whose step groups include http, then pass that automation trigger's id to trigger\_automation.

| Tool | Description |
| --- | --- |
| list\_automation\_projects | Lists Agent OS projects in the organization with pagination, sorting, and optional count support. |
| get\_automation\_project | Fetches a single Agent OS project by project UID. |
| get\_usage\_analytics | Retrieves API and CDN usage analytics broken down by service type. Returns a jobId for get\_job\_data. |
| create\_automation\_project | Creates an Agent OS project with title, description, and tags. |
| update\_automation\_project | Updates an Agent OS project's title, description, or tags. |
| delete\_automation\_project | Deletes an Agent OS project. This action is permanent. |
| list\_automations | Lists automations in a project. Use show\_steps: true to inspect triggers and steps, including HTTP-triggered automations. |
| get\_automation | Fetches a single automation by automation UID, optionally including trigger and step details. |
| trigger\_automation | Runs an automation configured with an HTTP request trigger by calling /run/{trigger\_id}. Pass the automation trigger's id and an optional JSON payload. |
| set\_automation\_active | Activates or deactivates automation. The automation must already have a trigger and action configured before it can be activated. |

### BrandKit AI

| Tool | Description |
| --- | --- |
| create\_an\_content\_in\_knowledge\_vault | Creates new content in the Brand Kit Knowledge Vault to provide contextual information for AI-powered content generation. |
| get\_all\_contents\_in\_knowledge\_vault | Retrieves all content entries stored in the Knowledge Vault for a specific Brand Kit. |
| get\_a\_single\_content\_in\_knowledge\_vault | Retrieves detailed information for a specific content entry in the Knowledge Vault by its unique identifier. |
| update\_a\_content\_in\_knowledge\_vault | Modifies existing content in the Knowledge Vault. |
| delete\_a\_content\_from\_knowledge\_vault | Permanently removes a content entry from the Knowledge Vault. This action is irreversible. |
| create\_a\_voice\_profile | Creates a new Voice Profile that defines tone, style, and communication characteristics for AI-generated content. |
| get\_all\_voice\_profiles | Retrieves all Voice Profiles configured for a Brand Kit. |
| get\_a\_single\_voice\_profile | Retrieves detailed configuration for a specific Voice Profile. |
| update\_a\_voice\_profile | Modifies an existing Voice Profile's characteristics. |
| delete\_a\_voice\_profile | Permanently removes a Voice Profile from the Brand Kit. This action is irreversible. |
| generative\_ai | Generates AI-powered content based on a custom prompt while maintaining brand consistency. Optionally leverages Voice Profiles and Knowledge Vault context. |
| get\_data\_chunks\_from\_knowledge\_vault | Searches the Knowledge Vault to retrieve relevant data chunks that match a query string. Semantic search over brand guidelines and reference materials. |

### Launch API

| Tool | Description |
| --- | --- |
| get\_environments | Retrieves environment configurations with build settings, deployment information, password protection, and recent commits. |
| get\_deploy\_hooks | Retrieves deploy hooks configurations with filtering capabilities using cursor-based pagination. |
| get\_latest\_live\_deployment | Retrieves the most recent live deployment for a specified environment or project, including build configuration, Git information, deployment status, and performance metrics. |
| create\_deploy\_hook | Creates a new deploy hook for an environment, enabling integration with CI/CD pipelines and external automation systems. |
| update\_deploy\_hook | Updates an existing deploy hook configuration — name and environment association. |
| delete\_deploy\_hook | Deletes an existing deploy hook, permanently disabling its webhook URL. |
| trigger\_deploy\_hook | Triggers an existing deploy hook for manual or automated re-deployments. |
| create\_deployment | Creates a new deployment for the specified environment using the latest commit from the configured Git branch. |
| revalidate\_cdn\_cache | Revalidates the CDN cache for an environment, prompting the CDN to fetch the latest content from origin. |
| get\_all\_projects | Fetches the list of all projects in your organisation with pagination support. |
| create\_a\_project | Creates a project in Launch using either a Git Provider or File Upload. |
| get\_a\_project | Fetches a specific project in Launch using the project UID. |
| update\_a\_project | Updates an existing project — name and description. |
| delete\_a\_project | Deletes an existing project and all associated environments and deployments. This action is permanent. |
| get\_all\_environments | Fetches the list of all environments in a project with pagination support. |
| create\_an\_environment | Creates a new environment in your Launch project, specifying the Git branch or uploading a ZIP file. |
| get\_an\_environment | Fetches a specific environment using the project UID and environment UID. |
| update\_an\_environment | Updates an environment — build settings, Git branch, environment variables, password protection, and feature flags. |
| delete\_an\_environment | Deletes an existing environment and all associated deployments. This action is permanent. |
| get\_signed\_upload\_url\_project | Fetches the signed URL for uploading a ZIP file when creating a project via file upload. Valid for 10 minutes. |
| get\_signed\_upload\_url\_environment | Fetches the signed URL for uploading a ZIP file when creating an environment via file upload. Valid for 10 minutes. Only available for FILEUPLOAD projects. |
| get\_signed\_upload\_url\_deployment | Retrieves the signed URL for uploading a ZIP file when creating or redeploying a deployment. Valid for 10 minutes. |
| get\_signed\_download\_url\_deployment | Returns the signed URL to download the uploaded file from the latest deployment. Valid for 15 minutes. |
| get\_all\_deployments | Fetches the list of all deployments within a specific environment, with build status, Git commit info, duration, and preview URLs. |
| get\_deployment | Retrieves a specific deployment from an environment using project UID, environment UID, and deployment UID. |
| get\_deployment\_logs | Fetches the deployment (build) logs of a specific deployment. |
| get\_server\_logs | Fetches the runtime server logs of a specific deployment. Requires startTime and endTime parameters. |

### Developer Hub

| Tool | Description |
| --- | --- |
| get\_an\_app | Retrieves detailed information for a specific Marketplace App including configuration, metadata, target type, and optionally OAuth settings. |
| get\_all\_apps | Retrieves all Marketplace Apps in your organisation with filtering, search, sorting, and pagination. |
| get\_app\_oauth | Retrieves the complete OAuth 2.0 configuration for a Marketplace App including client credentials, redirect URIs, and allowed scopes. |
| get\_oauth\_scopes | Retrieves the complete list of available OAuth scopes, optionally filtered by app type. |
| create\_an\_app | Creates a new Marketplace App in your organisation. |
| update\_app\_oauth | Updates the OAuth configuration for a Marketplace App. |
| update\_an\_app | Updates an existing Marketplace App's configuration including name, description, advanced settings, UI locations, and webhooks. |
| delete\_an\_app | Permanently deletes a Marketplace App. Fails if the app is currently installed in any stack — uninstall from all stacks first. |
| install\_an\_app | Installs a Marketplace App into a target stack or organisation. |
| update\_an\_app\_installation | Updates a specified app installation in a stack or organisation. |
| get\_app\_installations | Retrieves all installations of a specific Marketplace App, showing which stacks or organisations have it deployed. |
| uninstall\_an\_app | Uninstalls a Marketplace App from a target stack or organisation, revoking its access to APIs and data. |

### Lytics Analytics

| Tool | Description |
| --- | --- |
| classify\_content | Scrapes and analyzes a website URL to extract and classify content topics, storing results in Lytics for audience segmentation. |
| enrich\_content | Enriches content by analyzing a website URL or raw text through Lytics' AI engine. Returns inferred topics, themes, and content classifications. |
| lytics\_get\_all\_audiences | Retrieves all audience segments defined in your Lytics account, including type, validity status, and associated data tables. |
| get\_field\_information | Retrieves detailed field metadata for a specific audience segment: field definitions, data types, value distributions, and statistics. |
| lytics\_get\_a\_single\_audience | Retrieves detailed configuration and metrics for a specific audience segment by its unique identifier. |
| get\_content\_topics | Retrieves the complete taxonomy of content topics configured in your Lytics account. |
| get\_a\_user\_profile | Retrieves a comprehensive user profile from Lytics by searching for a specific identifier (email, user ID, device ID, etc.). |
| get\_accounts | Retrieves all Lytics accounts associated with your instance. |
| get\_fields | Retrieves all user schema fields configured in your Lytics account. |
| get\_tables | Retrieves schema information for all data tables in your Lytics account (typically User and Content tables). |

### Personalize API

| Tool | Description |
| --- | --- |
| create\_attribute | Creates a new custom attribute in a Personalize project, defining user characteristics for audience segmentation. |
| get\_all\_attributes | Retrieves all custom and preset attributes available in a Personalize project. |
| update\_attribute | Modifies an existing attribute's properties — name, key, or description. |
| delete\_attribute | Permanently removes an attribute from a Personalize project. |
| get\_all\_audiences | Retrieves all audience segments from a Personalize project, with optional filtering by referenced attributes. |
| delete\_audience | Permanently removes an audience segment from a Personalize project. |
| create\_experience | Creates a new personalization experience (Segmented or A/B Test) in a Personalize project, automatically generating a draft version for configuration. |
| get\_all\_experiences | Retrieves all personalization experiences from a Personalize project, with optional filtering by referenced audiences or events. |
| get\_single\_experience | Retrieves detailed information about a specific personalization experience, including its current configuration and status. |
| update\_experience | Modifies an existing experience's metadata — name and description. |
| delete\_experience | Permanently removes a personalization experience including all associated versions and configurations. |
| get\_experience\_versions | Retrieves all versions of a specific experience, sorted by creation date. |
| delete\_experience\_version | Discards a draft version of an experience. Active, paused, or archived versions cannot be deleted. |
| get\_experiences\_priority | Retrieves the priority order configuration for all experiences in a project. |
| update\_experiences\_priority | Modifies the priority order of experiences, controlling which experience displays when multiple target the same content area. |
| create\_event | Creates a new event definition for tracking user interactions and measuring experience performance. |
| get\_all\_events | Retrieves all event definitions from a Personalize project. |
| update\_event | Modifies an existing event definition — key identifier and description. |
| delete\_event | Permanently removes an event definition from a Personalize project. |
| get\_analytics\_summary | Retrieves performance analytics summary for a specific experience version, including impressions, conversions, and probability-to-be-best calculations. |
| get\_analytics\_timeseries | Retrieves hourly time-series analytics data for a specific experience version. |
| get\_countries | Retrieves country information based on ISO 3166-1 standard for geographic targeting in audience definitions. |
| get\_regions | Retrieves region information based on ISO 3166-2 standard for state-level geographic targeting. |
| get\_cities | Retrieves city information for local-level geographic targeting in Personalize audience definitions. |
