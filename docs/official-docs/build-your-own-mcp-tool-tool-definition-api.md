---
uid: "blt730ec114592936bf"
url: "/developers/build-your-own-mcp-tool-tool-definition-api"
seo_title: "Build Your Own MCP: Tool Definitions API | Contentstack"
seo_description: "Fetch Contentstack tool definitions from public HTTPS endpoints to build your own MCP server, agent framework, or API client without vendoring the repository."
---

# Build Your Own MCP: Tool Definitions API

Contentstack publishes the same tool definitions this server uses at public, unauthenticated HTTPS endpoints. If you are building your own MCP server, agent framework, or API client, you can fetch these definitions directly and translate a tool call into a Contentstack REST/GraphQL request yourself, no need to vendor this repository.

This document covers:

*   [Tool definition endpoints](#tool-definition-endpoints)
*   [Tool definition format](#tool-definition-format)
*   [Building a Request](#building-a-request)
*   [Base URLs](#base-urls) 
*   [Authentication](#authentication)
*   [Worked examples](#worked-examples)

These endpoints serve tool metadata only: names, descriptions, input schemas, and request mappings. They contain no credentials and perform no calls against your stack. You supply your own tokens when you execute the resulting request.

## Tool Definition Endpoints

Each API group is published at https://mcp.contentstack.com/<group>/tools:

| Group | Endpoint |
| --- | --- |
| cma | https://mcp.contentstack.com/cma/tools |
| cma-extended | https://mcp.contentstack.com/cma-extended/tools |
| cda | https://mcp.contentstack.com/cda/tools |
| brandkit | https://mcp.contentstack.com/brandkit/tools |
| lytics | https://mcp.contentstack.com/lytics/tools |
| personalize | https://mcp.contentstack.com/personalize/tools |
| analytics | https://mcp.contentstack.com/analytics/tools |
| launch | https://mcp.contentstack.com/launch/tools |
| developerhub | https://mcp.contentstack.com/developerhub/tools |

Each endpoint returns a JSON object keyed by tool name. Example:

```
curl -s https://mcp.contentstack.com/cda/tools | jq 'keys'
```

## Tool Definition Format

```
{
  "<tool_name>": {
    "name": "get_all_assets_cdn",
    "description": "Human/LLM-facing description of what the tool does.",
    "group": "cda",
    "subGroup": "ai",   // optional; only some groups (e.g., brandkit) use this field
    "mapper": {
      /* how to build the HTTP request — see Building a Request */
    },
    "inputSchema": {
      /* JSON Schema for the tool's arguments */
    }
  }
}
```

*   **inputSchema** is a standard JSON Schema (type, properties, required, default, etc.). Expose it directly to your LLM or tool runner as the tool's parameters.
*   **mapper** tells you how to translate the validated arguments into an HTTP request.

### The mapper object

| Field | Type | Description |
| --- | --- | --- |
| apiUrl | string | Path appended to the group's base URL. May contain path-parameter placeholders. |
| method | GET | POST | PUT | DELETE | HTTP method. |
| type | string (optional) | "complex" (schema-shaped body) or "graphql". Absent or "object" = simple. |
| params | Record<string, string> | Maps a placeholder in apiUrl to the argument name that fills it. |
| queryParams | Record<string, string> | Maps a query string key to the argument name that provides its value. |
| headers | Record<string, string> | Maps an HTTP header name to the argument name that provides its value. |
| body | string | object | For simple tools: the argument name holding the request body. For complex tools: a sub-schema. |

GraphQL tools (type: "graphql") additionally include:

| Field | Type | Description |
| --- | --- | --- |
| query | string | The GraphQL query string. |
| variables | object | Maps each GraphQL variable to { "type": ..., "x-mapFrom": "<argName>" }. |

## Building a Request

Given a tool definition and a map of validated arguments, build the HTTP request as follows.

### 1\. Resolve the URL and Path Parameters

Start from mapper.apiUrl. For each entry in mapper.params (placeholder → argName), replace every occurrence of the placeholder in the path with encodeURIComponent(args\[argName\]). A missing required path parameter is an error.

```
apiUrl:  /v3/content_types/content_type_uid/entries
params:  { "content_type_uid": "content_type_uid" }
args:    { "content_type_uid": "blog_post" }
=>       /v3/content_types/blog_post/entries
```

### 2\. Build Query Parameters

For each entry in mapper.queryParams (queryKey → argName), if args\[argName\] is defined, add it to the query string.

*   If queryKey ends with \[\], the value is serialized as a repeated array parameter: key\[\]=a&key\[\]=b.
*   Object values are JSON-stringified.

### 3\. Build Headers

For each entry in mapper.headers (headerName → argName), if args\[argName\] is defined, set that header. Then add the authentication headers for the group (see [Authentication](#authentication)).

### 4\. Build the Body

*   **Simple** (body is a string, no type: "complex"): if args\[body\] exists, the body is exactly that value. Otherwise, the body is built by wrapping all arguments not already consumed by params or queryParams under the body key: { \[body\]: { ...leftoverArgs } }.
*   **Complex** (type: "complex", body is a schema): walk the schema; for each leaf carrying x-mapFrom, pull the value from args\[x-mapFrom\]. Arrays wrap single values into a one-element array. This reconstructs a nested payload from flat arguments.
*   **GraphQL** (type: "graphql"): POST { query, variables } to apiUrl, where each variable is filled from args\[variables\[var\]\["x-mapFrom"\]\].

### 5\. Assemble

```
<base URL for group + region>  +  <resolved apiUrl>  +  ?<query string>
```

Apply the method, headers, and body as constructed in the previous steps.

## Base URLs

The base URL is the region endpoint for the service plus an optional path suffix. Region endpoints are available at:

```
https://artifacts.contentstack.com/regions.json
```

Map each group to a field in that document as follows:

| Group | regions.json field | Path suffix |
| --- | --- | --- |
| cma, cma-extended | contentManagement | — |
| cda | contentDelivery | — |
| developerhub | developerHub | — |
| personalize | personalizeManagement | — |
| analytics | application | /analytics |
| launch | launch | /manage |
| brandkit (subGroup: brand-kits-api) | brandKit | — |
| brandkit (subGroup: ai) | genAI with trailing /brand-kits removed | — |

For example, for the NA region, cma resolves to https://api.contentstack.io and cda to https://cdn.contentstack.io.

Lytics is a third-party service and is not region-specific: https://api.lytics.io.

## Authentication

Add headers based on the group. You supply the token values — the tool definitions never include credentials.

| Group | Required headers |
| --- | --- |
| cda | api\_key: <stack api key>, access\_token: <delivery token> |
| cma, cma-extended (token auth) | api\_key: <stack api key>, authorization: <management token> |
| cma, cma-extended, developerhub, brandkit, analytics, launch, personalize (OAuth) | api\_key (where applicable) + OAuth bearer headers from your OAuth flow |
| lytics | Authorization: <lytics access token> |

Group-specific extra headers and parameters used by this server:

*   **BrandKit:** brand\_kit\_uid: <brand kit uid>
*   **Personalize:** x-project-uid: <personalize project id>
*   **Launch:** x-project-uid, x-organization-uid, plus Apollo client headers
*   **Analytics:** an orgUid query parameter derived from the OAuth organization

For OAuth-backed groups, you must run Contentstack's OAuth flow yourself and attach the resulting bearer token. cma and cma-extended can avoid OAuth entirely by using a management token as shown in the table above. See the Contentstack MCP Server user guide for details.

## Worked Examples

### Example 1: CDA: List Assets (GET, query parameters and header)

Definition:

```
{
  "name": "get_all_assets_cdn",
  "group": "cda",
  "mapper": {
    "apiUrl": "/v3/assets",
    "method": "GET",
    "queryParams": {
      "limit": "limit",
      "skip": "skip",
      "include_count": "include_count"
    },
    "headers": { "branch": "branch" }
  }
}
```

Call with args = { limit: 10, include\_count: true, branch: "main" }, region EU:

```
GET https://eu-cdn.contentstack.com/v3/assets?limit=10&include_count=true
api_key: <stack api key>
access_token: <delivery token>
branch: main
```

### Example 2: CMA: Create an Entry (POST, path parameter and body wrapper)

Definition:

```
{
  "name": "create_an_entry",
  "group": "cma",
  "mapper": {
    "apiUrl": "/v3/content_types/content_type_uid/entries",
    "method": "POST",
    "body": "entry_data",
    "params": { "content_type_uid": "content_type_uid" },
    "queryParams": { "locale": "locale" },
    "headers": { "branch": "branch" }
  }
}
```

Call with args = { content\_type\_uid: "blog\_post", locale: "en-us", entry\_data: { entry: { title: "Hello" } }, branch: "main" }, region NA, management-token auth:

```
POST https://api.contentstack.io/v3/content_types/blog_post/entries?locale=en-us
api_key: <stack api key>
authorization: <management token>
branch: main
Content-Type: application/json

{ "entry": { "title": "Hello" } }
```

Here entry\_data is named by mapper.body, so its value is used directly as the request body.

### Example 3: Launch: GraphQL (type: "graphql")

Definition:

```
{
  "name": "get_environments",
  "group": "launch",
  "mapper": {
    "type": "graphql",
    "method": "POST",
    "apiUrl": "/graphql",
    "query": "query Environment($first: Float) { Environments(first: $first) { edges { node { name uid } } } }",
    "variables": { "first": { "type": "Float", "x-mapFrom": "first" } }
  }
}
```

Call with args = { first: 10 }, region NA:

```
POST https://launch-api.contentstack.com/manage/graphql
x-project-uid: <launch project id>
x-organization-uid: <organization uid>
<OAuth bearer headers>
Content-Type: application/json

{ "query": "query Environment($first: Float) { ... }", "variables": { "first": 10 } }
```
