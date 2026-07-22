---
uid: "blt1216aca20d4716bd"
url: "/agent-os/mcp-client-connect-remote-tools"
seo_title: "MCP Client: Connect Remote Tools | Contentstack"
seo_description: "Learn how to connect any remote MCP server to your Agent using the MCP Client tool, covering header-based authentication, OAuth setup, tool selection, troubleshooting, and real-world use cases."
---

# MCP Client: Connect Remote Tools

A complete guide for connecting a remote MCP server to your [Agent](https://www.contentstack.com/docs/agent-os/what-is-an-agent) and letting it use that server's tools automatically.

## What is MCP Client?

The **Model Context Protocol (MCP)** is an open standard that lets AI applications talk to external "tool servers," with a growing number of services, such as Atlassian, Notion, Vercel, and Zapier, publishing an MCP server that exposes their capabilities as callable tools.

### What this tool does

The **MCP Client** is a tool you add to an **Agent OS** agent that connects it to any remote MCP server. Once connected:

*   Your agent discovers the tools the server offers.
*   The agent's AI model can call those tools directly during a conversation or run, using the live data and actions the server provides.
*   You stay in control of which tools the agent is allowed to use.

You configure one MCP Client connection and your agent gains access to all of its tools or the subset you approve.

### How this differs from the Contentstack MCP Server

It is easy to confuse this with the Contentstack MCP Server. For more information, refer to the [Contentstack MCP Server](https://www.contentstack.com/docs/agent-os/contentstack-mcp-server) documentation. They use the same protocol but in opposite directions:

*   **Contentstack MCP Server** lets _external_ AI tools (Claude Desktop, Cursor, etc.) connect into Contentstack and control it, such as creating entries, managing assets, and so on.
*   **MCP Client** lets an agent _inside_ Agent OS reach out to control other external services, such as Jira, Notion, Slack, or any other MCP-compatible provider.

### Who is it for

*   Agent builders who want their agent to take action in external tools (Jira, Notion, Slack, etc.) without writing custom integration code.
*   Automation teams connecting Agent OS workflows to existing tool ecosystems.
*   Teams standardizing on MCP as their integration layer across multiple AI products.

## Prerequisites

1.  **The MCP server URL**: HTTPS endpoint of the remote server (for example, https://mcp.example.com/mcp). Your provider's documentation lists this.
2.  **A way to authenticate with that server:** MCP servers use one of two approaches and the server's documentation tells you which:
    *   **Header-based authentication**: Pass an API key or token in a request header.
    *   **OAuth**: You sign in through the provider's consent screen and grant access.
3.  **Appropriate permissions** in your Contentstack organization for Agent OS.

**Note:** The MCP server must be reachable over the public internet using https:// (or http:// for non-production servers). Internal or private network addresses are not allowed for security reasons.

## Connect an MCP Server

Log in to your [Contentstack account](https://www.contentstack.com/login/), then follow these steps:

1.  After logging in, click the **App Switcher** icon, then select **Agent OS** from the list.![Agent\_OS\_Icon.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/amfbc07952da5c12a7/d9486ee0037fcf72f7fc2de7/Agent_OS_Icon.png?locale=en-us)
2.  Open your project, or [create](https://www.contentstack.com/docs/agent-os/managing-projects#create-a-project) a new one.
    
    **Additional Resource:** For more information, refer to the [Managing Projects](https://www.contentstack.com/docs/agent-os/managing-projects) documentation.
    
3.  From the **Agent OS Dashboard** screen, do one of the following:
    1.  To use an existing agent, select it from the **Agents** list.
    2.  To create a new one, click **\+ New Agent**, then in the **Create Agent** modal, click **Skip, I'll create manually**. Enter a suitable **Title** and **Description** for your agent, then click the **Create Agent** button.![Create\_Agent.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am632e49abd133aa43/0caf241d048f7c14cada0581/Create_Agent.png?locale=en-us)
4.  You are redirected to the **Agent Builder** page, where you can add the **Trigger**, **Tools**, and **Instructions**.

### Add the MCP Client tool to your agent

1.  On the **Agent Builder** page, in the **Tools** section, click **\+ Add** to add the **MCP** client tool to your agent. Select the **MCP** client connector from the list.  
    ![MCP\_Tool\_Selection.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am1389d1949c01952b/ba2f41771ad2a7027f9d50e0/MCP_Tool_Selection.png?locale=en-us)
2.  Click **\+ Add Account** to authenticate the external servers.
3.  In the **Authorize Account** modal, you see two options:

| Authentication method | Choose this when |
| --- | --- |
| Header-based authentication | The server expects an API key, personal access token, or other secret passed in a request header. |
| OAuth | The server uses OAuth 2.1 and you want to sign in through the provider's consent screen. |

![Authorization\_Modal.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/amf2ba2efa921b4791/fb9c1e889e601a8229e0f07d/Authorization_Modal.png?locale=en-us)

### Header-based authentication

Use this method when your MCP server authenticates with an **API key** or **token** passed in a header.

1.  Select **Header-based** authentication. Click **Proceed**.
2.  In the **Authorize** modal, enter a **Title** and your **MCP Server URL**.
3.  Click **\+ Add Headers** to add one or more headers. For each header, provide:
    *   **Header Name**: For example, Authorization or X-API-Key.
    *   **Value**: Token or Key value. For bearer tokens, the value is usually Bearer <your-token>.
4.  Click **Authorize**.  
    ![Header-based\_authentication.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/amc4a55ce93e7d3b26/67a6b4c47f8979900f3cfe60/Header-based_authentication.png?locale=en-us)

Contentstack opens a live connection to your MCP server to confirm the credentials work. If the connection succeeds, the credentials are saved securely and the connection is ready. If it fails, the system displays an error describing what went wrong. Double-check the URL and header values and try again.

**Example:** Many servers expect a header named Authorization with the value Bearer sk-abc123.Check your provider's documentation for the exact header name and token format.

### OAuth authentication

Use this method when your MCP server supports **OAuth 2.1**. OAuth lets you grant access by signing in to the provider rather than copying a long-lived token.

When you choose OAuth, you decide how the OAuth app is set up using the **Use dynamic client registration** checkbox.

#### Option A: Automatic setup (dynamic client registration on)

This is the simplest path and is selected by **default**. When selected, Contentstack automatically discovers the server's OAuth settings and registers itself as a client. You do not need to create anything in the provider's developer console.

1.  Select **OAuth** as the authentication method.
2.  Enter the **MCP Server URL**.
3.  _(Optional)_ Enter **Scopes**, a space-separated list of OAuth scopes to request. Leave this blank to use the scopes the server recommends by default.
4.  Keep **Use dynamic client registration** selected.
5.  Click **Authorize**. A sign-in window opens. Sign in to the provider and approve the requested access. Once you approve, the connection is saved and ready.

**Note:** Not every provider supports automatic registration. If you see an error stating the server does not allow automatic app registration (or you receive an HTTP 403 during registration), switch to manual setup below.

![Manage\_Permissions.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am9d1a7737fcdc3631/88b1f35b3135de3de0c2e84c/Manage_Permissions.png?locale=en-us)

#### Option B: Manual setup (dynamic client registration off)

Use this when the provider requires you to register your own OAuth application, or when automatic registration is not supported.

First, register an OAuth app with your provider:

1.  In the provider's developer console, create a new OAuth application.
2.  When asked for a redirect URL (also called a callback URL), use the redirect URL shown in the Contentstack authorization window. Copy it with the copy button next to the field and paste it into the provider's app settings.

**Note:** Note the **Client ID** and **Client Secret** the provider gives you, along with the provider's **Authorization URL** and **Access Token URL** (these are listed in the provider's OAuth documentation).

4.  Select **OAuth** as the authentication method.
5.  Enter the **MCP Server URL**.
6.  _(Optional)_ Enter **Scopes**.
7.  Clear **Use dynamic client registration**. Additional fields appear:
    *   **Authorization URL**: The provider's OAuth authorization endpoint.
    *   **Access Token URL**: The provider's OAuth token endpoint.
    *   **Client ID**: From the app you registered.
    *   **Client Secret**: The secret that pairs with the Client ID.
8.  Click **Authorize**, sign in to the provider, and approve access.

**Note:** The redirect URL shown in the authorization window must be added to your OAuth app's list of allowed redirect URLs at the provider. If it is not, the provider will reject the sign-in.

![Manage\_Permissions\_Unchecked.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am3ce9bf5aa02f8885/faa22f323bf651b0038d1a49/Manage_Permissions_Unchecked.png?locale=en-us)*   After the connection is authenticated, enter a **Title**. The **Allowed Tools** field loads the list of tools the server offers. You can:
    
    **Let AI select tools**: allow the agent to choose from all available tools based on the conversation. Best when you want maximum flexibility.**Select specific tools**: restrict the agent to only the tools you pick. Best when you want tight control over what the agent can do.Once done, click **Save**.4.  ![Save\_MCP.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am0fac361d073cd6d8/0dd326788df89946f681508b/Save_MCP.png?locale=en-us)
    
    **Tip:** Tool names from some servers appear in a technical format (for example, add\_reply\_to\_pull\_request\_comment). Contentstack automatically formats these into a readable form (for example, "Add Reply To Pull Request Comment") so they are easy to identify in the picker.
    
    ### Add trigger and instructions
    
    A tool alone does not make the agent do anything, it still needs a trigger to decide when it runs, and instructions telling it when and how to use the tool.
    
    In the **Trigger** panel, click **+** and select a trigger type. Here, we are selecting **HTTP** trigger.In the **Instructions** field, describe what the agent should do and when it should use the MCP Client tool. **For example:**You are a test agent connected to Jira via MCP. When asked about issues, use the available tools to search, view, or update Jira issues as requested. Use / inside the Instructions field to reference a specific tool directly.![Added\_Fields.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am7226a2e4b484f299/6681ef2cc45bc3a4fb73de49/Added_Fields.png?locale=en-us)
    
    ### Save and publish agent
    
    Click **Save** to lock in the **Trigger**, **Instructions**, and **MCP Client** tool together.Click **Publish** to make the agent live. A trigger does not fire on an unpublished (Draft) agent.![Publish\_Agent.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/ambde18f450e6b914a/7edc7ed6b51f37161bf24078/Publish_Agent.png?locale=en-us)
    
    ## How Your Agent Uses MCP Tools
    
    Once configured, the MCP server's tools become available to your agent automatically at run time:
    
    When the agent runs, it connects to your MCP server and retrieves the current list of tools.The tools you approved are offered to the agent's model.As the agent works through a request, it calls the appropriate tools, passes the required inputs, and uses the results to continue.
    
    You do not need to script these calls, the model decides when to use each tool based on the conversation and the tool descriptions provided by the server.
    
    **Example prompt:** With an Atlassian MCP server connected, you could ask your agent, _"Find all open Jira issues assigned to me in the Mobile project and summarize them."_ The agent calls the relevant tools to search issues and returns a summary.
    
    ## Choosing a Trigger
    
    The MCP Client tool gives your agent the _ability_ to call external tools but a trigger decides _when_ the agent runs in the first place. Pick the trigger that matches how you intend to use the agent. Following are some examples:
    
    **Note:** The trigger types listed are examples. For a complete list of trigger types and configuration details, refer to the [Triggers](https://www.contentstack.com/docs/agent-os/http-trigger) documentation.
    
    | Trigger type | Best for | Example use case |
    | --- | --- | --- |
    | HTTP | Another system or app calling the agent programmatically | An internal tool or webpage calls the agent's webhook URL whenever a user clicks "Check ticket status," passing the ticket ID in the request |
    | Scheduler | Running automatically on a fixed timer | Every Monday morning, the agent pulls all open bugs from Jira and posts a digest to Slack |
    | CS Trigger Event | Reacting to something happening elsewhere, rather than a fixed schedule or manual ask | Whenever a new Jira issue is created, the agent automatically triages it, adds labels, or notifies someone |
    
    **Note:** If your agent uses an HTTP trigger, there is no live chat window to watch responses in. Each run creates an **execution record** instead. Check the [**Executions**](https://www.contentstack.com/docs/agent-os/view-execution-log-of-agent-os) tab in the agent builder to see the agent's status and output for every run.
    
    ## Testing Your Connection (HTTP Trigger)
    
    Follow these steps:
    
    **Publish the agent.** A trigger only fires once the agent is published; a Draft agent will return a TRIGGER\_NOT\_ACTIVE error if called.**Copy the webhook URL** shown in the **HTTP** trigger configuration panel.**Send a POST request** to that URL with a JSON body containing your prompt, for example:
    
    ```
    [
      {
        "content": "Find open issues in project ABC",
        "role": "user"
      } 
    ]
    ```
    
*   **Check the response.** A successful call returns an executionId and a status of processing.
*   **Open the Executions tab** in the agent builder and select the matching execution to see the full result, including:
    *   **Execution Steps**: each MCP tool the agent called, in order
    *   **Metrics**: start time, duration, AI provider
    *   **Input**: the exact payload that was sent
    *   **Output**: the agent's final response

**Note:** A simple GET request to the webhook URL (with no body) triggers the agent with a generic default message rather than your intended prompt, use a **POST** request with a JSON body to send a specific request.  

![Execution.png](https://assets.contentstack.io/spaces/am51d76353d996c1fe/assets/am50f8286411c2b098/5640617d6e3dbcdfcb4d976b/Execution.png?locale=en-us)

## Security and Privacy

*   **Credentials are encrypted:** API keys, tokens, and OAuth secrets are encrypted at rest and are only used at run time to connect to your server. They are never exposed in the agent's configuration or log.
*   **You control tool access:** The agent can only use the tools you approved. This restriction is enforced on the server side, not just hidden in the interface.
*   **URLs are validated:** Server URLs are checked to ensure they point to legitimate public endpoints, protecting against requests to internal or private systems.
*   **OAuth follows modern standards:** OAuth connections use PKCE and bind each token to the specific server, following current OAuth 2.1 security practices.

## Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| "Invalid credentials" when authorizing a header-based connection | The token or header value is wrong, or the server rejected it. Verify the header name and value against the provider's documentation. |
| OAuth automatic registration fails (HTTP 403 / "does not allow automatic app registration") | The provider does not support dynamic client registration. Clear **Use dynamic client registration** and enter the Authorization URL, Access Token URL, Client ID, and Client Secret manually. |
| "Could not discover OAuth metadata" | The server URL is incorrect, or the server does not publish OAuth discovery information. Confirm the exact MCP endpoint URL with your provider, or use manual setup. |
| Sign-in is rejected during manual OAuth | The redirect URL in your provider's OAuth app does not match the one Contentstack uses. Copy the redirect URL from the authorization window into your provider's app settings. |
| Agent connects but a tool returns a permission error | The signed-in account or OAuth scopes do not grant access to that action. Re-authorize with the correct account, or add the required scopes in the Scopes field. |
| No tools appear in the Allowed Tools list | The connection could not reach the server or returned no tools. Recheck the URL and credentials, then reopen the tool selector. |
| A tool stops working during a very long agent run | OAuth access tokens are refreshed when the agent connects. An exceptionally long-running session may outlast the token's lifetime; start a new run to refresh access. |
| TRIGGER\_NOT\_ACTIVE error when calling an HTTP trigger URL | The agent is still in the Draft. Click **Publish**, then retry the request. |
| Agent responds with "Insufficient Information" / asks for a concrete request | The trigger fired with a generic default message instead of a real prompt (common with a plain GET request). Send a POST request with a JSON body containing a specific ask, such as {"content": "Find open issues in project ABC", "role": "user"}. |

## Frequently Asked Questions

1.  **Which MCP servers can I connect to?**
    
    Any remote MCP server that is reachable over HTTPS and supports header-based authentication or **OAuth 2.1**. This includes hosted services and self-hosted servers.
    
2.  **Do I need to add each tool manually?**
    
    No. You configure one connection per server, and the agent gains access to all the tools you allow.
    
3.  **Can I limit which tools the agent uses?**
    
    Yes. In **Allowed Tools**, select only the specific tools you want, or let the AI choose from all available tools.
    
4.  **Can I reuse a connection across multiple agents?**
    
    Yes. Saved connections appear on the [Connected Apps](https://www.contentstack.com/docs/agent-os/view-list-of-connected-apps-in-automations) page and can be attached to multiple agents.
    
5.  **What's the difference between Dynamic client registration on and off?**
    
    With Dynamic client registration on, Contentstack registers itself with the provider automatically. You only supply the server URL. With it clear, you register your own OAuth app with the provider and supply its Authorization URL, Access Token URL, Client ID, and Client Secret.
    
6.  **What's the difference between OAuth and Header-based authentication?**
    
    Header-based authentication means you manually fetch a secret (API key or token) from the provider and paste it in; the same secret is used every time. OAuth means you sign in directly to the provider and approve access; no secret is copied or handled manually, and the provider can revoke or expire access from its own side.
    
7.  **Does the MCP Client overlap with existing connectors (e.g. a Jira or Notion connector)?**
    
    Possibly, for the specific actions both expose. Pre-built connectors (like a dedicated [Jira](https://www.contentstack.com/docs/agent-os/jira) or [Notion](https://www.contentstack.com/docs/agent-os/notion) connector) are a curated, hand-built set of actions chosen by Contentstack. An MCP Client connection to that provider's own MCP server instead exposes whatever tools the provider itself has published, often a broader set, and one that updates automatically as the provider adds new tools, without waiting on a Contentstack release. Check each provider's own tool list to confirm exact overlap for your use case.
    
8.  **Can I use the MCP Client to create, update, or delete an Agent OS agent?**
    
    No. The MCP Client lets an existing agent control _other_ external tools (Jira, Notion, etc.). It does not provide a way to create or manage Agent OS agents themselves, that still requires the Agent OS UI directly.
    
9.  **Is my data sent anywhere unexpected?**
    
    No. Your agent connects directly to the [MCP server](https://www.contentstack.com/docs/agent-os/contentstack-mcp-server) you configured. Credentials stay encrypted and are used only to authenticate that connection.
