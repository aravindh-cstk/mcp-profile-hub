---
uid: ""
url: /developers/mcp-at-contentstack
seo_title: MCP at Contentstack
seo_description: Compare the Contentstack MCP products and choose the right one, the hosted MCP Profile Hub, the local MCP Server, building your own with the Tool Definitions API, or the Agent OS MCP Client.
---

# MCP at Contentstack

## Overview

Contentstack offers four ways to connect AI agents to your content through the Model Context Protocol (MCP). The four products range from a hosted toolset that MCP clients connect to over HTTP to tool definitions that you call from your own code. The [product comparison table](#choose-an-mcp-product) compares the four products and states when to use each one.

## What is MCP

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard that lets AI agents, for example Claude, ChatGPT, and Cursor, connect to external systems through a common interface. An MCP server exposes APIs as structured, typed tools. The AI client calls those tools and presents the results in natural language.

Contentstack provides four MCP products. Three let an AI client call Contentstack APIs. The fourth lets a Contentstack Agent OS agent call tools in third-party services.

## Choose an MCP product

| Product | What it is | Where it runs | Transport | Authentication | Best when |
| --- | --- | --- | --- | --- | --- |
| MCP Profile Hub | Hosted, scoped tool bundles (profiles) you connect clients to | `mcp-profile-hub.contentstack.com` | Streamable HTTP | Open Authorization (OAuth) in the browser | You want a focused toolset that a team shares across MCP clients, including web clients |
| MCP Server | A local server that exposes the full Contentstack toolset | Your machine, via `npx` | stdio | OAuth, or a management or delivery token | You are a developer who wants the full toolset on your own machine |
| Build your own MCP | Public tool-definition endpoints you call from your own code | Your own code | The transport your code implements | You supply a management or delivery token | You build your own MCP server, agent framework, or API client |
| Agent OS MCP Client | A connector that lets an Agent OS agent call a remote MCP server | Inside Agent OS | HTTP to the remote server | You configure it per remote server | You want an Agent OS agent to call tools in a third-party service such as Jira or Notion |

## Contentstack MCP Profile Hub

MCP Profile Hub hosts profiles that expose a scoped set of Contentstack tools over Streamable HTTP. Clients that support Streamable HTTP, including web clients, connect with no local installation. Clients that support only stdio need Node.js to run the `mcp-remote` bridge. You can share a profile with your team. Start with [What is MCP Profile Hub](/developers/mcp-profile-hub-what-is-profile-hub).

## Contentstack MCP Server

The MCP Server is a local server that you run with `npx @contentstack/mcp`. It exposes the full Contentstack toolset on one machine and loads the tools by tool group. Start with [What is the Contentstack MCP Server](/developers/mcp-what-is-the-mcp-server).

## Build your own MCP

Contentstack publishes its tool definitions at public HTTPS endpoints. Use them to build your own MCP server, agent framework, or API client. Start with [When to build your own MCP](/developers/mcp-when-to-build-your-own-mcp).

## Agent OS MCP Client

The MCP Client is an Agent OS tool that connects an agent to a remote third-party MCP server. The agent can then call tools in services such as Jira, Notion, or Slack. The other three products let an AI client call Contentstack, while the MCP Client lets an Agent OS agent call external MCP servers. See [MCP Client: Connect Remote Tools](/agent-os/mcp-client-connect-remote-tools).

## Next Steps

- [MCP authentication](/developers/mcp-authentication): OAuth, management tokens, delivery tokens, and per-service headers.
- [MCP regions and base URLs](/developers/mcp-regions-and-base-urls): region codes and endpoint resolution.
- Tool catalog: the tools in each Contentstack service. Start with [Content Management API tools](/developers/mcp-cma-tools).
