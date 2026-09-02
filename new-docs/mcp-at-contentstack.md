---
uid: ""
url: /docs/mcp/mcp-at-contentstack
seo_title: MCP at Contentstack
seo_description: Compare the Contentstack MCP products and choose the right one, the hosted MCP Profile Hub, the local MCP Server, building your own with the Tool Definitions API, or the Agent OS MCP Client.
---

# MCP at Contentstack

## Overview

Contentstack offers four ways to connect AI agents to your content through the Model Context Protocol (MCP). Each suits a different situation, from a hosted toolset any client can reach to tool definitions you build against yourself. Compare them below and pick the one that matches how you work.

## What is MCP

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard that lets AI agents (Claude, ChatGPT, Cursor, and others) connect to external systems through a common interface. An MCP server exposes APIs as structured, typed tools. The agent calls those tools and interprets the results in natural language.

Contentstack provides four MCP products. Three let an AI client control Contentstack. One lets a Contentstack Agent OS agent control other services.

## Choose an MCP product

| Product | What it is | Where it runs | Transport | Authentication | Best when |
| --- | --- | --- | --- | --- | --- |
| MCP Profile Hub | Hosted, scoped tool bundles (profiles) you connect clients to | `mcp-profile-hub.contentstack.com` | Streamable HTTP | Open Authorization (OAuth) in the browser | You want a focused toolset from any client, including web clients, shared across a team |
| MCP Server | A local server that exposes the full Contentstack toolset | Your machine, via `npx` | stdio | OAuth, or a management or delivery token | You are a developer who wants the full toolset on your own machine |
| Build your own MCP | Public tool-definition endpoints you call from your own code | Your own code | Your choice | You supply the tokens | You are building your own MCP server, agent framework, or API client |
| Agent OS MCP Client | A connector that lets an Agent OS agent call a remote MCP server | Inside Agent OS | HTTP to the remote server | Set per remote server | You want an Agent OS agent to act in a third-party service such as Jira or Notion |

## Contentstack MCP Profile Hub

Hosted profiles that expose a scoped set of Contentstack tools over HTTP. Nothing to install. Connect any MCP client, including web clients, and share a profile across your team. Start with [What is MCP Profile Hub](/docs/mcp/what-is-profile-hub).

## Contentstack MCP Server

A local server you run with `npx @contentstack/mcp`. It gives a single machine the full Contentstack toolset, loaded by group. Start with [What is the Contentstack MCP Server](/docs/mcp/what-is-the-mcp-server).

## Build your own MCP

Contentstack publishes its tool definitions at public HTTPS endpoints. Use them to build your own MCP server, agent framework, or API client. Start with [When to build your own MCP](/docs/mcp/when-to-build-your-own-mcp).

## Agent OS MCP Client

The MCP Client is an Agent OS tool that connects an agent to a remote third-party MCP server, so the agent can act in services such as Jira, Notion, or Slack. This is the opposite direction from the products above. See [MCP Client: Connect Remote Tools](/docs/agent-os/mcp-client-connect-remote-tools).

## Next Steps

- [MCP authentication](/docs/mcp/mcp-authentication): OAuth, management tokens, delivery tokens, and per-service headers.
- [MCP regions and base URLs](/docs/mcp/mcp-regions-and-base-urls): region codes and endpoint resolution.
- Tool catalog: the tools in each Contentstack service. Start with [Content Management API tools](/docs/mcp/cma-tools).
