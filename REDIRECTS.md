# Redirects and URL changes for the MCP Profile Hub split

What has to happen in the CMS when `mcp-hub-doc.md` is removed and the eight
MCP Profile Hub pages go live.

## The short version

**No documentation page anywhere links to the page being removed.** I searched both
`docs/official-docs/` and the full live export at `~/Desktop/DocOps/cs-docs`. The three
retained MCP docs never mention Profile Hub, and neither does anything else. So there are no
doc-to-doc redirects to rewrite.

**The product does link to it, in three places, and two of them cannot be fixed with a
redirect.** That is the real work, and it belongs to engineering rather than to docs.

---

## 1. The removed page

| Old URL | Redirect to |
| --- | --- |
| `/developers/mcp-profile-hub` | `/developers/mcp-what-is-profile-hub` |

This URL is live and indexed, so it needs a permanent redirect rather than a deletion.

## 2. The product's own links, which need an engineering change

All three live in one constant, `lib/ui/docs-urls.ts:9` in
`contentstack/contentstack-mcp-profile-manager`:

```js
const DOCS_BASE_URL = 'https://www.contentstack.com/docs/developers/mcp-profile-hub'
```

| Where it appears | Current target | New target |
| --- | --- | --- |
| `profileHub`, the docs landing link | `/developers/mcp-profile-hub` | `/developers/mcp-what-is-profile-hub` |
| `connectYourAiClient`, on the Installation step's sibling cards | `…/mcp-profile-hub#connect-your-ai-client` | `/developers/mcp-connect-a-client-to-profile-hub` |
| `hubVsServer` | `…/mcp-profile-hub#mcp-profile-hub-vs-the-contentstack-mcp-server` | `/developers/mcp-what-is-profile-hub#profile-hub-compared-with-the-mcp-server` |

**The two anchor links are the problem.** A redirect on `/developers/mcp-profile-hub` carries
the path but not the fragment, so both would land the reader at the top of the wrong page.
They have to be changed in the app.

The file's own docstring records that this exact class of bug has already happened once
(DX-10310, where the docs base was written out longhand in three files and only two were
updated). Worth pointing whoever picks this up at that comment.

## 3. Pages moving from /agent-os/ to /developers/

The frontmatter in `docs/official-docs/` had drifted from what is actually live. Corrected:

| Doc | Was in our copy | Now |
| --- | --- | --- |
| Contentstack MCP Server | `/agent-os/contentstack-mcp-server` | `/developers/contentstack-mcp-server` |
| Build Your Own MCP | `/agent-os/build-your-own-mcp-tool-tool-definition-api` | `/developers/build-your-own-mcp-tool-tool-definition-api` |
| MCP Client: Connect Remote Tools | `/agent-os/mcp-client-connect-remote-tools` | unchanged, stays under Agent OS |

Both new values match the live export, so this corrects stale frontmatter rather than moving
a live page.

I also updated the links that pointed at the old paths: 10 self-referencing Tool Catalog
anchors inside the MCP Server doc, and 2 references from the MCP Client doc.

### One judgment call worth your review

You asked for `/developers/mcp-{slug}`. I did **not** rename these two to
`/developers/mcp-contentstack-mcp-server` and
`/developers/mcp-build-your-own-mcp-tool-tool-definition-api`.

Both are already under `/developers/`, both already carry "mcp" in the slug, and both are
live and indexed at their current addresses. Renaming would break working URLs and read
awkwardly, for no gain in findability. Tell me if you want the literal prefix anyway.

## 4. The eight new pages

| Page | URL |
| --- | --- |
| What is MCP Profile Hub | `/developers/mcp-what-is-profile-hub` |
| Profiles and catalogs | `/developers/mcp-profiles-and-catalogs` |
| Create a profile | `/developers/mcp-create-a-profile` |
| Connect a client to MCP Profile Hub | `/developers/mcp-connect-a-client-to-profile-hub` |
| Manage profiles | `/developers/mcp-manage-profiles` |
| Monitor and troubleshoot | `/developers/mcp-monitor-and-troubleshoot` |
| MCP URL parameters | `/developers/mcp-url-parameters` |
| Automations and agents as tools | `/developers/mcp-automations-and-agents` |

Suggested left-navigation order is the order above, which runs from concept through setup to
reference and troubleshooting.
