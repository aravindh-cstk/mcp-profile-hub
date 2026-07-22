# How to build your own MCP server with Contentstack's tools API

- **Authors:** Tim Benniks
- **Published:** 2026-06-17T08:47:01.164Z
- **Updated:** 2026-06-18T06:15:30.830Z
- **Tags:** mcp, api, ai, automation, security
- **Chapters:** 5
- **Source:** [https://developers.contentstack.com/guides/how-to-build-your-own-mcp-server-with-contentstack-s-tools-api](https://developers.contentstack.com/guides/how-to-build-your-own-mcp-server-with-contentstack-s-tools-api)

---

## Table of Contents

1. [Understand Contentstack tool definitions](#understand-contentstack-tool-definitions)
2. [Build the MCP server](#build-the-mcp-server)
3. [Execute Contentstack tool calls](#execute-contentstack-tool-calls)
4. [Add authentication and OAuth](#add-authentication-and-oauth)
5. [Configure, test, and prepare for production](#configure-test-and-prepare-for-production)

Contentstack provides an [official MCP server](https://www.contentstack.com/docs/agent-os/contentstack-mcp-server) that lets AI agents interact with Contentstack products through structured tools. For many use cases, the official server is the fastest way to get started.

However, there are situations where you may want to build your own MCP server instead.

You might want to:

- expose only a small set of Contentstack tools


- add custom approval flows before write operations


- connect Contentstack tools with your own internal APIs


- add logging, monitoring, or compliance checks


- manage authentication in your own infrastructure


- build a specialized MCP server for one stack, organization, or workflow



This guide shows you how to build a custom MCP server that uses Contentstack tool definitions.

The idea is simple:

- Fetch Contentstack tool definitions from public endpoints.


- Register those definitions as MCP tools.


- Let an MCP client call those tools.


- Convert each tool call into a Contentstack API request.


- Return the Contentstack API response to the MCP client.



The full flow looks like this:

```
MCP client
  -> calls a Contentstack tool
  -> your MCP server validates the tool arguments
  -> your MCP server reads the Contentstack tool mapper
  -> your MCP server builds a Contentstack REST or GraphQL request
  -> Contentstack returns a response
  -> your MCP server returns the result to the MCP client
```

By the end of this guide, you will have a working custom MCP server that can expose Contentstack tools to an AI client.

## Prerequisites

Before you start, make sure you have:

- Node.js 18 or later


- a Contentstack account


- access to a Contentstack stack


- a stack API key, if your tools need stack-level access


- a delivery token, if you want to use Content Delivery API tools


- a management token or OAuth access, if you want to use Content Management API tools


- an MCP-compatible client, such as Claude Desktop, Cursor, Claude Code, or another agent runtime



For OAuth-based workflows, you also need a Developer Hub app with OAuth configured.

Use OAuth when your MCP server should let users authorize access through Contentstack instead of relying on static tokens. You can create and configure the OAuth app in Developer Hub, where you define redirect URLs and the scopes your server needs.



---

## Understand Contentstack tool definitions

Contentstack publishes tool definitions at public HTTPS endpoints. These endpoints return metadata only. They do not execute API requests and they do not include credentials.

Each endpoint returns a JSON object keyed by tool name.

The available tool definition endpoints are:

```
https://mcp.contentstack.com/cma/tools
https://mcp.contentstack.com/cma-extended/tools
https://mcp.contentstack.com/cda/tools
https://mcp.contentstack.com/brandkit/tools
https://mcp.contentstack.com/lytics/tools
https://mcp.contentstack.com/personalize/tools
https://mcp.contentstack.com/analytics/tools
https://mcp.contentstack.com/launch/tools
https://mcp.contentstack.com/developerhub/tools
https://mcp.contentstack.com/automations/tools
```

Each group maps to a different area of Contentstack.

Group

Use it for

cda

Reading published content through the Content Delivery API

cma

Creating, updating, publishing, or managing stack content

cma-extended

Extended CMA operations, such as audits, workflows, versions, or advanced stack operations

developerhub

Developer Hub APIs

brandkit

BrandKit tools

personalize

Personalize management tools

analytics

Analytics tools

launch

Launch project tools

lytics

Lytics tools

Start with the smallest set of tools you need. For example, if your agent only needs to read published content, start with cda. If it needs to create or update entries, add cma.

A Contentstack tool definition looks like this:

```
{
  "get_all_assets_cdn": {
    "name": "get_all_assets_cdn",
    "description": "Get all assets from the Content Delivery API.",
    "group": "cda",
    "mapper": {
      "apiUrl": "/v3/assets",
      "method": "GET",
      "queryParams": {
        "limit": "limit",
        "skip": "skip",
        "include_count": "include_count"
      },
      "headers": {
        "branch": "branch"
      }
    },
    "inputSchema": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number"
        },
        "skip": {
          "type": "number"
        },
        "include_count": {
          "type": "boolean"
        },
        "branch": {
          "type": "string"
        }
      }
    }
  }
}
```

There are two important parts:

## inputSchema

The inputSchema describes the arguments the tool accepts. You can expose this schema to your MCP server so the client knows how to call the tool.

For example, a tool might accept:

```
{
  "limit": 10,
  "include_count": true,
  "branch": "main"
}
```

### mapper

The mapper tells your server how to turn those arguments into an API request.

A mapper can define:

Field

Purpose

apiUrl

The Contentstack API path

method

The HTTP method, such as GET, POST, PUT, or DELETE

params

Path parameters

queryParams

Query string parameters

headers

Headers mapped from tool arguments

body

The request body mapping

type

Special request type, such as complex or graphql

query

GraphQL query string

variables

GraphQL variable mapping

Your MCP server does not need to hardcode every Contentstack API. Instead, it can read the mapper and build the correct request dynamically.



---

## Build the MCP server

In this chapter, you will create a Node.js MCP server, fetch Contentstack tool definitions, and register them as MCP tools.

Start by creating a project:

```
mkdir contentstack-custom-mcp
cd contentstack-custom-mcp
npm init -y
```

Install dependencies:

```
npm install @modelcontextprotocol/sdk zod
npm install -D typescript tsx @types/node
```

Create a TypeScript config:

`npx tsc --init`Add a development script to package.json:

```
{
  "scripts": {
    "dev": "tsx src/server.ts"
  }
}
```

Create the source directory:

`mkdir src`Create src/server.ts:

```
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "contentstack-custom-mcp",
  version: "1.0.0"
});

server.tool(
  "ping",
  "Check that the custom Contentstack MCP server is running.",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: "Contentstack MCP server is running."
        }
      ]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

Run the server:

`npm run dev`You now have a minimal MCP server with one test tool.

Next, add support for fetching Contentstack tool definitions.

Create src/contentstack-tools.ts:

```
export type ContentstackToolDefinition = {
  name: string;
  description?: string;
  group: string;
  subGroup?: string;
  inputSchema: Record<string, unknown>;
  mapper: {
    apiUrl: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    type?: "complex" | "graphql" | "object" | string;
    params?: Record<string, string>;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
    body?: string | Record<string, unknown>;
    query?: string;
    variables?: Record<string, { type?: string; "x-mapFrom"?: string }>;
  };
};

export async function fetchToolDefinitions(group: string) {
  const response = await fetch(`https://mcp.contentstack.com/${group}/tools`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Contentstack tools for group "${group}": ${response.status}`
    );
  }

  return (await response.json()) as Record<string, ContentstackToolDefinition>;
}
```

Update src/server.ts to load Contentstack tools:

```
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fetchToolDefinitions } from "./contentstack-tools.js";
import { executeContentstackTool } from "./execute-contentstack-tool.js";

const server = new McpServer({
  name: "contentstack-custom-mcp",
  version: "1.0.0"
});

const groups = ["cda"];

const definitions = Object.assign(
  {},
  ...(await Promise.all(groups.map(fetchToolDefinitions)))
);
```

You can expose all tools in a group, but it is safer to allowlist only the tools you need.

For example:

```
const allowedToolNames = new Set([
  "get_all_assets_cdn"
]);

const allowedDefinitions = Object.fromEntries(
  Object.entries(definitions).filter(([toolName]) =>
    allowedToolNames.has(toolName)
  )
);
```

Then register each allowlisted Contentstack tool with your MCP server:

```
for (const [toolName, definition] of Object.entries(allowedDefinitions)) {
  server.tool(
    toolName,
    definition.description ?? `Contentstack tool: ${toolName}`,
    definition.inputSchema as any,
    async (args: Record<string, unknown>) => {
      const result = await executeContentstackTool(definition, args);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);
```

At this point, your MCP server can fetch tool definitions and register them as MCP tools. The next step is to implement executeContentstackTool.



---

## Execute Contentstack tool calls

A Contentstack tool call becomes an API request through the tool mapper.

This chapter covers the request-building logic:

- resolve the API path


- add query parameters


- add mapped headers


- build REST or GraphQL bodies


- resolve the correct regional base URL


- execute the request



Create src/execute-contentstack-tool.ts:

```
import type { ContentstackToolDefinition } from "./contentstack-tools.js";
import { getAuthHeaders } from "./auth.js";
import { getBaseUrl } from "./regions.js";

export async function executeContentstackTool(
  definition: ContentstackToolDefinition,
  args: Record<string, unknown>
) {
  const region = process.env.CONTENTSTACK_REGION ?? "NA";

  const baseUrl = await getBaseUrl(
    definition.group,
    region,
    definition.subGroup
  );

  const path = resolvePath(
    definition.mapper.apiUrl,
    definition.mapper.params,
    args
  );

  const query = buildQueryString(definition.mapper.queryParams, args);

  const mappedHeaders = buildMappedHeaders(definition.mapper.headers, args);
  const authHeaders = getAuthHeaders(definition.group);

  const headers: Record<string, string> = {
    ...authHeaders,
    ...mappedHeaders,
    "content-type": "application/json"
  };

  let body: unknown;

  if (definition.mapper.type === "graphql") {
    body = buildGraphQLBody(definition, args);
  } else if (definition.mapper.type === "complex") {
    body = buildComplexBody(definition.mapper.body, args);
  } else if (typeof definition.mapper.body === "string") {
    body = buildSimpleBody(definition.mapper.body, args);
  }

  const response = await fetch(`${baseUrl}${path}${query}`, {
    method: definition.mapper.method,
    headers,
    body:
      definition.mapper.method === "GET" || body === undefined
        ? undefined
        : JSON.stringify(body)
  });

  const responseText = await response.text();

  let data: unknown;

  try {
    data = JSON.parse(responseText);
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    throw new Error(
      `Contentstack API request failed: ${response.status} ${response.statusText}\n${responseText}`
    );
  }

  return data;
}
```

Now add the helper functions.

## Resolve path parameters

Some API URLs include placeholders.

Example mapper:

```
{
  "apiUrl": "/v3/content_types/content_type_uid/entries",
  "params": {
    "content_type_uid": "content_type_uid"
  }
}
```

Example tool arguments:

```
{
  "content_type_uid": "blog_post"
}
```

Resolved path:

`/v3/content_types/blog_post/entries`Implementation:

```
function resolvePath(
  apiUrl: string,
  params: Record<string, string> | undefined,
  args: Record<string, unknown>
) {
  let path = apiUrl;

  for (const [placeholder, argName] of Object.entries(params ?? {})) {
    const value = args[argName];

    if (value === undefined || value === null) {
      throw new Error(`Missing required path parameter: ${argName}`);
    }

    path = path.replaceAll(placeholder, encodeURIComponent(String(value)));
  }

  return path;
}
```

## Build query parameters

Some mapper fields become query parameters.

Example mapper:

```
{
  "queryParams": {
    "limit": "limit",
    "skip": "skip",
    "include_count": "include_count"
  }
}
```

Implementation:

```
function buildQueryString(
  queryParams: Record<string, string> | undefined,
  args: Record<string, unknown>
) {
  const searchParams = new URLSearchParams();

  for (const [queryKey, argName] of Object.entries(queryParams ?? {})) {
    const value = args[argName];

    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(queryKey, String(item));
      }
    } else if (typeof value === "object") {
      searchParams.set(queryKey, JSON.stringify(value));
    } else {
      searchParams.set(queryKey, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
```

## Build mapped headers

Some arguments become headers. A common example is branch.

Example mapper:

```
{
  "headers": {
    "branch": "branch"
  }
}
```

Implementation:

```
function buildMappedHeaders(
  headers: Record<string, string> | undefined,
  args: Record<string, unknown>
) {
  const result: Record<string, string> = {};

  for (const [headerName, argName] of Object.entries(headers ?? {})) {
    const value = args[argName];

    if (value !== undefined && value !== null) {
      result[headerName] = String(value);
    }
  }

  return result;
}
```

## Build simple request bodies

For simple REST tools, the mapper can define a string body key.

Example mapper:

```
{
  "body": "entry_data"
}
```

Example arguments:

```
{
  "entry_data": {
    "entry": {
      "title": "Hello from MCP"
    }
  }
}
```

Request body:

```
{
  "entry": {
    "title": "Hello from MCP"
  }
}
```

Implementation:

```
function buildSimpleBody(
  bodyKey: string | undefined,
  args: Record<string, unknown>
) {
  if (!bodyKey) {
    return undefined;
  }

  return args[bodyKey];
}
```

## Build complex request bodies

Some tools reconstruct nested request bodies from flat arguments. These tools use type: "complex" and x-mapFrom.

Implementation:

```
function buildComplexBody(schema: any, args: Record<string, unknown>): unknown {
  if (!schema || typeof schema !== "object") {
    return undefined;
  }

  if (schema["x-mapFrom"]) {
    return args[schema["x-mapFrom"]];
  }

  if (schema.type === "object" || schema.properties) {
    const result: Record<string, unknown> = {};

    for (const [key, childSchema] of Object.entries(schema.properties ?? {})) {
      const value = buildComplexBody(childSchema, args);

      if (value !== undefined) {
        result[key] = value;
      }
    }

    return result;
  }

  if (schema.type === "array" && schema.items) {
    const value = buildComplexBody(schema.items, args);

    if (value === undefined) {
      return undefined;
    }

    return Array.isArray(value) ? value : [value];
  }

  return undefined;
}
```

## Resolve regional base URLs

Contentstack APIs are regional. Your server should resolve the correct base URL for the selected region.

Create src/regions.ts:

```
type RegionKey = string;

export async function getBaseUrl(
  group: string,
  region: RegionKey,
  subGroup?: string
) {
  if (group === "lytics") {
    return "https://api.lytics.io";
  }

  const response = await fetch("https://artifacts.contentstack.com/regions.json");

  if (!response.ok) {
    throw new Error("Failed to fetch Contentstack regions");
  }

  const regions = await response.json();
  const regionConfig = regions[region];

  if (!regionConfig) {
    throw new Error(`Unknown Contentstack region: ${region}`);
  }

  if (group === "cma" || group === "cma-extended") {
    return regionConfig.contentManagement;
  }

  if (group === "cda") {
    return regionConfig.contentDelivery;
  }

  if (group === "developerhub") {
    return regionConfig.developerHub;
  }

  if (group === "personalize") {
    return regionConfig.personalizeManagement;
  }

  if (group === "analytics") {
    return `${regionConfig.application}/analytics`;
  }

  if (group === "launch") {
    return `${regionConfig.launch}/manage`;
  }

  if (group === "brandkit" && subGroup === "brand-kits-api") {
    return regionConfig.brandKit;
  }

  if (group === "brandkit" && subGroup === "ai") {
    return regionConfig.genAI.replace(/\/brand-kits$/, "");
  }

  throw new Error(`Unsupported Contentstack tool group: ${group}`);
}
```

Common group mappings are:

Tool group

Region field

Extra path suffix

cma

contentManagement

none

cma-extended

contentManagement

none

cda

contentDelivery

none

developerhub

developerHub

none

personalize

personalizeManagement

none

analytics

application

/analytics

launch

launch

/manage




---

## Add authentication and OAuth

Tool definitions do not include credentials. Your MCP server must add authentication when it executes the API request.

For local development, use environment variables:

```
CONTENTSTACK_REGION=NA
CONTENTSTACK_API_KEY=your_stack_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
CONTENTSTACK_OAUTH_ACCESS_TOKEN=your_oauth_access_token
```

Create src/auth.ts:

```
export function getAuthHeaders(group: string) {
  const apiKey = process.env.CONTENTSTACK_API_KEY;
  const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
  const managementToken = process.env.CONTENTSTACK_MANAGEMENT_TOKEN;
  const oauthAccessToken = process.env.CONTENTSTACK_OAUTH_ACCESS_TOKEN;

  if (group === "cda") {
    if (!apiKey || !deliveryToken) {
      throw new Error(
        "CDA tools require CONTENTSTACK_API_KEY and CONTENTSTACK_DELIVERY_TOKEN"
      );
    }

    return {
      api_key: apiKey,
      access_token: deliveryToken
    };
  }

  if ((group === "cma" || group === "cma-extended") && managementToken) {
    if (!apiKey) {
      throw new Error("CMA tools require CONTENTSTACK_API_KEY");
    }

    return {
      api_key: apiKey,
      authorization: managementToken
    };
  }

  if (oauthAccessToken) {
    return {
      ...(apiKey ? { api_key: apiKey } : {}),
      authorization: `Bearer ${oauthAccessToken}`
    };
  }

  throw new Error(`No authentication configured for group "${group}"`);
}
```

## CDA authentication

For Content Delivery API tools, send:

```
api_key: <stack api key>
access_token: <delivery token>
```

Use this for read-only access to published content.

## CMA authentication with a management token

For Content Management API tools, you can use a management token.

Send:

```
api_key: <stack api key>
authorization: <management token>
```

This is useful for stack-scoped server-to-server workflows.

## OAuth authentication with Developer Hub

Use OAuth when users should authorize your MCP server through Contentstack instead of sharing static tokens.

> See [https://www.contentstack.com/docs/developer-hub/contentstack-oauth](https://www.contentstack.com/docs/developer-hub/contentstack-oauth) for more info.
> 
> 


OAuth is a good choice when:

- you are building a reusable integration


- multiple users or organizations need to authorize access


- users should be able to install or revoke the integration


- you need scoped permissions


- you are working with Developer Hub, Launch, Analytics, BrandKit, or Personalize tools


- actions should happen on behalf of a user



To use OAuth, create an app in Developer Hub and configure OAuth for that app.

At a high level:

- Open Developer Hub.


- Create or select your app.


- Open the OAuth configuration.


- Add one or more redirect URLs.


- Choose the scopes your MCP server needs.


- Save the app configuration.


- Implement the OAuth authorization flow in your MCP server.


- Store the access token and refresh token securely.


- Attach the bearer token when executing OAuth-backed Contentstack tools.



Your MCP server should request the smallest useful set of scopes. For example, do not request broad write permissions if the server only needs to read entries or inspect configuration.

For OAuth-backed requests, your auth helper should attach the bearer token:

`authorization: Bearer <oauth access token>`Depending on the tool group, you may also need stack, organization, project, or product-specific headers.

Examples:

Product area

Common additional context

CMA

Stack API key, where applicable

Analytics

Organization context

Launch

Project UID and organization UID

Personalize

Project UID

BrandKit

Brand kit UID

A production OAuth implementation should also handle token refresh, token expiration, revoked access, and secure token storage.



---

## Configure, test, and prepare for production

Once your custom MCP server can register and execute tools, configure it in your MCP client.

For a local stdio server, your client configuration may look like this:

```
{
  "mcpServers": {
    "contentstack-custom": {
      "command": "npm",
      "args": ["run", "dev"],
      "env": {
        "CONTENTSTACK_REGION": "NA",
        "CONTENTSTACK_API_KEY": "your_stack_api_key",
        "CONTENTSTACK_DELIVERY_TOKEN": "your_delivery_token"
      }
    }
  }
}
```

For a compiled production-style server:

```
{
  "mcpServers": {
    "contentstack-custom": {
      "command": "node",
      "args": ["dist/server.js"],
      "env": {
        "CONTENTSTACK_REGION": "NA",
        "CONTENTSTACK_API_KEY": "your_stack_api_key"
      }
    }
  }
}
```

Do not commit real tokens to your repository or shared MCP configuration files.

## Test with a read-only tool first

Start with a read-only CDA tool, such as listing assets.

Ask your MCP client:

`List the first 10 assets in my Contentstack stack.`Then check:

- Did the MCP client discover the tool?


- Did the tool receive the expected arguments?


- Did your server resolve the correct region?


- Did your server attach the correct authentication headers?


- Did your server call the correct Contentstack API URL?


- Did your server return useful JSON or a readable result?



Once read-only tools work, test one write-capable tool in a development stack.

For example, if you expose a CMA entry creation tool, a tool call like this:

```
{
  "content_type_uid": "blog_post",
  "locale": "en-us",
  "branch": "main",
  "entry_data": {
    "entry": {
      "title": "Hello from MCP"
    }
  }
}
```

Should produce a request like this:

```
POST https://api.contentstack.io/v3/content_types/blog_post/entries?locale=en-us
api_key: <stack api key>
authorization: <management token>
branch: main
content-type: application/json

{
  "entry": {
    "title": "Hello from MCP"
  }
}
```

## Add guardrails for write tools

AI agents can call tools quickly. Before exposing create, update, publish, unpublish, or delete tools, add guardrails.

Recommended guardrails:

- allowlist tools instead of exposing every tool by default


- separate read-only and write-capable server configurations


- require approval before write operations


- log every tool call with arguments, target stack, region, and result status


- block destructive operations in production


- restrict production writes to specific users or workflows


- redact tokens and secrets from logs


- return clear errors when credentials or required arguments are missing



A simple helper can flag write methods:

```
const writeMethods = new Set(["POST", "PUT", "DELETE"]);

function requiresApproval(definition: ContentstackToolDefinition) {
  return writeMethods.has(definition.mapper.method);
}
```

Some MCP clients already show tool approval prompts, but your server can still add its own policy layer.

## Troubleshooting

#### The tool does not appear in the MCP client

Check that the MCP server starts without errors. Make sure your tool registration code runs before the server connects to the transport.

#### The API request goes to the wrong host

Check CONTENTSTACK_REGION and your regional base URL resolver. Contentstack APIs are regional, so the same tool may call different hosts depending on the organization region.

#### CDA tools return authentication errors

Check that you are sending both:

```
api_key
access_token
```

The access token should be a delivery token for the target stack and environment.

#### CMA tools return authentication errors

Check that you are sending:

```
api_key
authorization
```

For management-token authentication, authorization should be the management token.

For OAuth, check that your bearer token is valid and has the required scopes.

#### OAuth works locally but fails for another organization

Check region handling, organization context, and OAuth scopes. Make sure requests are sent to the correct regional endpoint for the authorized organization.

#### Write tools work in development but not production

Check stack permissions, branch permissions, workflow rules, publish rules, and token scopes. Also check whether your server blocks production write operations by policy.

## Production checklist

Before using your custom Contentstack MCP server in production, confirm that you have:

- selected only the tool groups you need


- allowlisted specific tools


- separated read-only and write-capable workflows


- implemented OAuth if users should authorize access through Developer Hub


- stored tokens securely


- implemented token refresh for OAuth


- resolved Contentstack regional endpoints correctly


- added structured logging


- redacted secrets from logs


- added approval gates for write operations


- tested against a development stack


- documented which tools are available and why



## Next steps

After the basic server works, you can extend it with:

- per-user OAuth sessions


- organization and stack selection


- branch-aware tools


- environment-aware read and publish workflows


- custom prompts for common content operations


- audit logging for all tool calls


- approval queues for publishing or deleting content


- internal tools that combine Contentstack with your own systems



A custom MCP server gives you the same basic building blocks as the official Contentstack MCP server, but with your own policies, workflows, and infrastructure around it.



---

## Frequently asked questions

### When should I build a custom MCP server instead of using Contentstack’s official server?

Use a custom server when you need a smaller tool surface, custom approval flows, internal API integrations, added compliance controls, or custom auth handling.

### How does the custom MCP server map MCP tool calls to Contentstack APIs?

It fetches Contentstack tool definitions, registers them as MCP tools, validates arguments, then builds and executes the corresponding Contentstack REST or GraphQL request.

### What do I need to run this guide’s MCP server implementation?

You need Node.js 18+, a Contentstack account with stack access, and an MCP-compatible client such as Claude Desktop, Cursor, or Claude Code.

### Which Contentstack credentials are required for different tool types?

Delivery API tools typically require a delivery token. Management API tools require a management token or OAuth access; some tools may also require a stack API key.

### When should I use OAuth instead of static tokens?

Use OAuth when users should authorize access through Contentstack rather than relying on shared static tokens; you’ll need a Developer Hub app with redirect URLs and scopes configured.
