---
uid: ""
url: /developers/mcp-profile-hub-url-parameters
seo_title: MCP URL parameters
seo_description: Configure an MCP Profile Hub profile from its connector URL, including the stack, branch, environment, and project parameters, and their precedence.
---

# MCP URL parameters

## Overview

Configure a profile for each connector connection by adding query parameters to its URL. With these parameters, you set the stack, branch, or project that a shared system profile uses, without opening the app or saving configuration changes.

System profiles do not require the app (see [Skip the app](#skip-the-app)). For example, the following URL configures the `cms` system profile to use a specific stack and branch:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>&branch=release-2
```

Each AI client sends the query parameters in its configured connector URL with every request. Multiple users can therefore connect to the same system profile and work with different stacks, branches, or projects through their own URLs.

When more than one place sets the same value, Contentstack resolves it in a defined [precedence order](#precedence).

## Configuration parameters

Every parameter is optional. When you omit one, Contentstack uses the profile's saved configuration. Content Management API (CMA) and Content Delivery API (CDA) are two of the [catalogs](/developers/mcp-profile-hub-profiles-and-catalogs#catalogs) a profile can include. The table below lists every configuration parameter.

| Parameter | Aliases | Sets | Constraint | If invalid |
| --- | --- | --- | --- | --- |
| `stack_api_key` | `apikey`, `api_key`, `stack_uid` | The stack that CMA, CMA Extended, and CDA tools run against | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `launch_project_uid` | `project_uid` | The Launch project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `personalize_project_uid` | | The Personalize project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `brandkit_project_uid` | `brandkit_id` | The Brand Kit | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `automation_project_uid` | | The Automate project | 1-64 characters: letters, digits, hyphens, or underscores | Fails the whole connection |
| `branch` | | The branch CMA and CDA calls run against | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `environment` | | The default environment Contentstack offers the agent | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `locale` | | The default locale Contentstack offers the agent | Trimmed and capped at 256 characters | Dropped, Contentstack uses the profile's saved value |
| `timeout` | | The per-call timeout in milliseconds. Defaults to 60000 ms | Must be a positive number. Contentstack caps a larger value at 120000 ms and accepts the call | Dropped, Contentstack uses the profile's saved value |

When a parameter has aliases, Contentstack reads them in the order the table above lists and uses the first one present. For example, the URL below sets a stack, a branch, an environment, a locale, and a timeout in one connector URL:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>&branch=release-2&environment=production&locale=en-us&timeout=60000
```

## Precedence

The following places can set the same value. The list below runs from highest precedence to lowest, and Contentstack uses the first entry that sets the value:

1. **Tool arguments on a single call.** An agent can pass `stack_api_key` on one tool call.
2. **The connector URL query string.**
3. **Your saved selection for a system profile.**
4. **The profile's stored configuration.**

A parameter you set in the URL overrides the saved profile for that connection only. It does not change the profile, and anyone else who connects to the same profile with their own URL is unaffected.

## Validation

Contentstack handles an invalid parameter in one of the two ways below. For a single parameter, read the Constraint and If invalid columns of the [configuration parameter table](#configuration-parameters).

**An invalid project UID fails the connection.** 

A malformed `launch_project_uid`, `personalize_project_uid`, `brandkit_project_uid`, or `automation_project_uid` fails the whole connection with the message below:

```
Invalid "launch_project_uid" in the MCP endpoint URL: expected 1-64 characters
of letters, digits, hyphen or underscore
```

Your client then lists no tools, not only the tools of the affected product. Contentstack does not use the saved project in this case, so no call runs against a project that the URL does not specify.

**Other invalid parameters return no error.** 

Contentstack discards an invalid `stack_api_key`, `branch`, `environment`, `locale`, or `timeout` value and uses the profile's saved value instead. Contentstack also discards any parameter that the Configuration parameters and Sign-in parameters tables do not list.

**Lytics has no parameter.** 

No Lytics tool accepts a project argument or header, so the connector URL has no Lytics parameter. To use a different Lytics account with a shared Lytics profile, edit the profile's configuration in the app.

## Skip the app

You do not need the MCP Profile Hub Marketplace app to use a system profile. The connector URL specifies the profile and its stack or project. You still need the app to create, duplicate, import, or edit a custom profile.

**Stack-based profiles.** The URL below connects to the CMS system profile and sets it to use your stack:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>
```

**Organization-level profiles.** For a profile that operates at the organization level rather than on a stack, specify the project instead. The URL below connects to the Launch system profile:

```
https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=launch&project_uid=<LAUNCH_PROJECT_UID>
```

**Register the URL with a client.** The command below registers the CMS URL with Claude Code:

```bash
claude mcp add --transport http cms \
  "https://mcp-profile-hub.contentstack.com/api/mcp?profile_id=cms&apikey=<STACK_API_KEY>"
```

**Profile IDs.** For the `profile_id` of every system profile, see [System profiles](/developers/mcp-profile-hub-profiles-and-catalogs#system-profiles).

**Sign-in still applies.** When you configure a system profile from the connector URL, you still complete Contentstack Open Authorization (OAuth) sign-in on first connect. Every call runs with your own roles and permissions.

## Override the stack on a single call

A connector URL sets one stack for every call on that connection. Stack-scoped tools also accept an optional `stack_api_key` argument, which runs a single call against a different stack. Contentstack describes the argument to the model with the following text:

```text
Optional. API key of the stack to run this call against, overriding the stack
configured for the profile. Omit to use the configured stack.
```

Because the argument is optional, a call that omits `stack_api_key` runs against the configured stack. Only tools that target a stack accept the argument: CMA, CMA Extended, and CDA. The following tools operate at the organization level and do not accept the argument: Launch, Personalize, Lytics, Analytics, Developer Hub, Brand Kit, the Automate catalog, and your own automations and agents.

A stack override grants no additional access. The call still runs with your OAuth token, and Contentstack rejects a stack that your account cannot access.

## A connector URL is scoped to one profile

When you connect to `?profile_id=X`, Contentstack binds that connection to profile X. When a client requests a different profile over that connection, Contentstack rejects the request with the error below:

```
Profile scope mismatch (requested profile_id <REQUESTED>, this connection is
scoped to <SCOPED>).
```

To use another profile, connect to a URL that scopes the connection to that profile.

A scoped connection still lists the profiles in your organization, including names, descriptions, and tool counts. It cannot read their configuration or run their tools.

## Sign-in parameters

Three more parameters appear on connector URLs. They affect OAuth sign-in and discovery rather than tool calls, and the table below gives each one:

| Parameter | Effect | Notes |
| --- | --- | --- |
| `org_uid` | Identifies your organization during OAuth sign-in. The Installation step pre-fills it | Contentstack uses it in place of an organization lookup during sign-in. Contentstack reads it only during sign-in, **not on a tool call** |
| `cma_host` | Names the Contentstack API host during sign-in | Sets which regional Contentstack endpoints the sign-in uses. Leave it as the Installation step supplies it unless your organization runs on a non-standard host |
| `user_uid` | Contentstack passes this value through discovery | The Installation step supplies this value when it applies, so you do not set it manually |

Because Contentstack identifies your organization from the session you signed in with, you change the organization through sign-in. To use a different organization, reconnect and sign in to that organization rather than editing `org_uid`.

## Next Steps

- [Create a profile](/developers/mcp-profile-hub-create-a-profile): the wizard, and which connections it requests.
- [Connect a client to MCP Profile Hub](/developers/mcp-profile-hub-connect-a-client-to-profile-hub): install snippets per client.
- [Contentstack MCP Troubleshooting Guides](/contentstack-mcp-troubleshooting/faqs#profile-hub-connection-and-sign-in): the causes of a failed connection, and the fix for each.
