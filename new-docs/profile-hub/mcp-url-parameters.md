---
uid: ""
url: /developers/mcp-url-parameters
seo_title: MCP URL parameters
seo_description: Configure an MCP Profile Hub profile from its connector URL, including the stack, branch, environment, and project parameters, and their precedence.
---

# MCP URL parameters

## Overview

An AI client stores one connector URL and posts to it for every call, so the query string on that URL acts as per-connection configuration.

This lets you point a shared system profile at your own stack, branch, or project without opening the app and saving anything:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>&branch=release-2
```

Two people can connect to the same system profile and work against different stacks, each using their own URL.

## Configuration parameters

Every parameter is optional. When you omit one, Contentstack uses the profile's saved configuration.

Content Management API (CMA) and Content Delivery API (CDA) are two of the catalogs a profile can include. See [Profiles and catalogs](/developers/mcp-profiles-and-catalogs#catalogs).

| Parameter | Required | Aliases | Sets | Constraint | If invalid |
| --- | --- | --- | --- | --- | --- |
| `stack_api_key` | No | `apikey`, `api_key`, `stack_uid` | The stack that CMA, CMA Extended, and CDA tools run against | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `launch_project_uid` | No | `project_uid` | The Launch project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `personalize_project_uid` | No | | The Personalize project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `brandkit_project_uid` | No | `brandkit_id` | The Brand Kit | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `automation_project_uid` | No | | The Automate project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `branch` | No | | The branch CMA and CDA calls run against | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `environment` | No | | The default environment Contentstack offers the agent | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `locale` | No | | The default locale Contentstack offers the agent | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `timeout` | No | | The per-call timeout in milliseconds. Defaults to 60000 ms | Must be a positive number. Contentstack silently caps a larger value at 120000 ms rather than rejecting it | Dropped, Contentstack uses the profile's saved value |

When a parameter has aliases, Contentstack reads them in the order this table lists and uses the first one present.

For example, this URL sets a stack, a branch, an environment, a locale, and a timeout in one connector URL:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>&branch=release-2&environment=production&locale=en-us&timeout=60000
```

## Precedence

Several places can set the same value. The highest one wins:

1. **Tool arguments on a single call.** An agent can pass `stack_api_key` on one tool call.
2. **The connector URL query string.**
3. **Your saved selection for a system profile.**
4. **The profile's stored configuration.**

Setting a parameter in the URL overrides the saved profile for that connection only. It does not change the profile, and anyone else who connects to the same profile with their own URL is unaffected.

## Validation

The two kinds of parameter fail differently, so check the right one when a connection misbehaves. The Constraint and If invalid columns in the parameter table above give the specifics for each parameter.

**Project UIDs fail loudly.** A malformed `launch_project_uid`, `personalize_project_uid`, `brandkit_project_uid`, or `automation_project_uid` fails the whole connection:

```
Invalid "launch_project_uid" in the MCP endpoint URL: expected 1-64 characters
of letters, digits, hyphen or underscore
```

Your client then lists no tools at all, not only the affected product. Contentstack fails rather than falling back to the saved project, because running against a different project than the URL named would be worse than not running.

**Everything else fails quietly.** Contentstack drops a bad `stack_api_key`, `branch`, `environment`, `locale`, or `timeout` value and uses the profile's saved value instead.

Contentstack ignores any parameter this page does not list.

**Lytics has no parameter.** You cannot point a shared Lytics profile at a different Lytics account from the URL. Contentstack accepts a parameter only when something consumes it, and no Lytics tool takes a project argument or header, so a `lytics_project_uid` in the URL would look like configuration and do nothing. Change the profile's configuration in the app instead.

## Use a system profile without saving a configuration

You can connect to a system profile without opening the app at all. Give the profile ID and the stack:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>
```

For a profile that works at the organization level rather than on a stack, give the project instead:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=launch&project_uid=<LAUNCH_PROJECT_UID>
```

Registering the first one with Claude Code:

```bash
claude mcp add --transport http cms \
  "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>"
```

This skips saving a configuration, not signing in. You still complete Contentstack Open Authorization (OAuth) sign-in on first connect, and every call runs with your own roles.

## Override the stack on a single call

Stack-scoped tools accept an optional `stack_api_key` argument, so an agent can run one call against a different stack without changing the connector URL. Contentstack describes the argument to the model like this:

```text
Optional. API key of the stack to run this call against, overriding the stack
configured for the profile. Omit to use the configured stack.
```

Omitting it uses the configured stack.

Contentstack advertises this argument only on tools that target a stack: CMA, CMA Extended, and CDA. Tools that work at the organization level do not offer it, because a stack means nothing to them. That covers Launch, Personalize, Lytics, Analytics, Developer Hub, Brand Kit, and the Automate catalog, along with your own automations and agents.

This grants no extra access. The call still runs on your OAuth token, and Contentstack rejects a stack your account cannot reach.

## The URL decides which profile a client can use

Connecting to `?profile_id=X` binds that connection to profile X. A client cannot ask for a different profile over that connection, and Contentstack refuses the attempt:

```
Profile scope mismatch (requested profile_id <REQUESTED>, this connection is
scoped to <SCOPED>).
```

To use another profile, connect to a URL that scopes the connection to that profile.

One exception: a scoped connection can still list the profiles in your organization, including names, descriptions, and tool counts. It cannot read their configuration or run their tools.

## Sign-in parameters

Three more parameters appear on connector URLs. They affect OAuth sign-in and discovery rather than tool calls.

| Parameter | Effect | Notes |
| --- | --- | --- |
| `org_uid` | Identifies your organization during OAuth sign-in. The Installation step pre-fills it | A hint only, and it lets Contentstack skip looking your organization up. It has **no effect on a tool call**, so changing it after you sign in does nothing |
| `cma_host` | Names the Contentstack API host during sign-in | Sets which regional Contentstack endpoints the sign-in uses. Leave it as the Installation step supplies it unless you know your organization sits on a non-standard host |
| `user_uid` | Contentstack carries this value through discovery | You never need to set this manually. The Installation step supplies it when it applies |

Because Contentstack resolves your organization from the session you signed in with, a "wrong organization" problem is a sign-in problem. Reconnect and sign in to the organization you want rather than editing `org_uid`.

## Next Steps

- [Create a profile](/developers/mcp-create-a-profile): the wizard, and which connections it asks for.
- [Connect a client to MCP Profile Hub](/developers/mcp-connect-a-client-to-profile-hub): install snippets per client.
- [Monitor and troubleshoot](/developers/mcp-monitor-and-troubleshoot): what a failed connection reports.
