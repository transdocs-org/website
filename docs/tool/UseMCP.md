<div class="oranda-hide">

# 🦑 use-mcp 🦑

</div>

[![GitHub last commit](https://img.shields.io/github/last-commit/modelcontextprotocol/use-mcp?logo=github\&style=flat\&label=​)](https://github.com/modelcontextprotocol/use-mcp)  [![npm](https://img.shields.io/npm/v/use-mcp?label=​\&logo=npm)](https://www.npmjs.com/package/use-mcp) ![GitHub License](https://img.shields.io/github/license/modelcontextprotocol/use-mcp)

A lightweight React hook for connecting to [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) servers. Simplifies authentication and tool calling for AI systems implementing the MCP standard.

Try it out: [Chat Demo](https://chat.use-mcp.dev) | [MCP Inspector](https://inspector.use-mcp.dev) | [Cloudflare Workers AI Playground](https://playground.ai.cloudflare.com/)

## Installation

```bash
npm install use-mcp
# or
pnpm add use-mcp
# or
yarn add use-mcp
```

## Development

To run the development environment with all examples and servers:

```bash
pnpm dev
```

This starts:

* **Inspector**: <http://localhost:5001> - MCP server debugging tool
* **Chat UI**: <http://localhost:5002> - Example chat interface
* **Hono MCP Server**: <http://localhost:5101> - Example MCP server
* **CF Agents MCP Server**: <http://localhost:5102> - Cloudflare Workers AI MCP server

### Testing

Integration tests are located in the `test/` directory and run headlessly by default:

```bash
cd test && pnpm test              # Run tests headlessly (default)
cd test && pnpm test:headed       # Run tests with visible browser
cd test && pnpm test:watch        # Run tests in watch mode
cd test && pnpm test:ui           # Run tests with interactive UI
```

## Features

* 🔄 Automatic connection management with reconnection and retries
* 🔐 OAuth authentication flow handling with popup and fallback support
* 📦 Simple React hook interface for MCP integration
* 🧰 Full support for MCP tools, resources, and prompts
* 📄 Access server resources and read their contents
* 💬 Use server-provided prompt templates
* 🧰 TypeScript types for editor assistance and type checking
* 📝 Comprehensive logging for debugging
* 🌐 Works with both HTTP and SSE (Server-Sent Events) transports

## Quick Start

```tsx
import { useMcp } from 'use-mcp/react'

function MyAIComponent() {
  const {
    state,          // Connection state: 'discovering' | 'pending_auth' | 'authenticating' | 'connecting' | 'loading' | 'ready' | 'failed'
    tools,          // Available tools from MCP server
    resources,      // Available resources from MCP server
    prompts,        // Available prompts from MCP server
    error,          // Error message if connection failed
    callTool,       // Function to call tools on the MCP server
    readResource,   // Function to read resource contents
    getPrompt,      // Function to get prompt messages
    retry,          // Retry connection manually
    authenticate,   // Manually trigger authentication
    clearStorage,   // Clear stored tokens and credentials
  } = useMcp({
    url: 'https://your-mcp-server.com',
    clientName: 'My App',
    autoReconnect: true,
  })

  // Handle different states
  if (state === 'failed') {
    return (
      <div>
        <p>Connection failed: {error}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={authenticate}>Authenticate Manually</button>
      </div>
    )
  }

  if (state !== 'ready') {
    return <div>Connecting to AI service...</div>
  }

  // Use available tools
  const handleSearch = async () => {
    try {
      const result = await callTool('search', { query: 'example search' })
      console.log('Search results:', result)
    } catch (err) {
      console.error('Tool call failed:', err)
    }
  }

  return (
    <div>
      <h2>Available Tools: {tools.length}</h2>
      <ul>
        {tools.map(tool => (
          <li key={tool.name}>{tool.name}</li>
        ))}
      </ul>
      <button onClick={handleSearch}>Search</button>
      
      {/* Example: Display and read resources */}
      {resources.length > 0 && (
        <div>
          <h3>Resources: {resources.length}</h3>
          <button onClick={async () => {
            const content = await readResource(resources[0].uri)
            console.log('Resource content:', content)
          }}>
            Read First Resource
          </button>
        </div>
      )}
      
      {/* Example: Use prompts */}
      {prompts.length > 0 && (
        <div>
          <h3>Prompts: {prompts.length}</h3>
          <button onClick={async () => {
            const result = await getPrompt(prompts[0].name)
            console.log('Prompt messages:', result.messages)
          }}>
            Get First Prompt
          </button>
        </div>
      )}
    </div>
  )
}
```

## Setting Up OAuth Callback

To handle the OAuth authentication flow, you need to set up a callback endpoint in your app.

### With React Router

```tsx
// App.tsx with React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { onMcpAuthorization } from 'use-mcp'

function OAuthCallback() {
  useEffect(() => {
    onMcpAuthorization()
  }, [])

  return (
    <div>
      <h1>Authenticating...</h1>
      <p>This window should close automatically.</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/" element={<YourMainComponent />} />
      </Routes>
    </Router>
  )
}
```

### With Next.js Pages Router

```tsx
// pages/oauth/callback.tsx
import { useEffect } from 'react'
import { onMcpAuthorization } from 'use-mcp'

export default function OAuthCallbackPage() {
  useEffect(() => {
    onMcpAuthorization()
  }, [])

  return (
    <div>
      <h1>Authenticating...</h1>
      <p>This window should close automatically.</p>
    </div>
  )
}
```

## API Reference

### `useMcp` Hook

```ts
function useMcp(options: UseMcpOptions): UseMcpResult
```

#### Options

| Option             | Type                                                              | Description                                                                                                        |
| ------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `url`              | `string`                                                          | **Required**. URL of your MCP server                                                                               |
| `clientName`       | `string`                                                          | Name of your client for OAuth registration                                                                         |
| `clientUri`        | `string`                                                          | URI of your client for OAuth registration                                                                          |
| `callbackUrl`      | `string`                                                          | Custom callback URL for OAuth redirect (defaults to `/oauth/callback` on the current origin)                       |
| `storageKeyPrefix` | `string`                                                          | Storage key prefix for OAuth data in localStorage (defaults to "mcp:auth")                                         |
| `clientConfig`     | `object`                                                          | Custom configuration for the MCP client identity                                                                   |
| `debug`            | `boolean`                                                         | Whether to enable verbose debug logging                                                                            |
| `autoRetry`        | `boolean \| number`                                               | Auto retry connection if initial connection fails, with delay in ms                                                |
| `autoReconnect`    | `boolean \| number`                                               | Auto reconnect if an established connection is lost, with delay in ms (default: 3000)                              |
| `transportType`    | `'auto' \| 'http' \| 'sse'`                                       | Transport type preference: 'auto' (HTTP with SSE fallback), 'http' (HTTP only), 'sse' (SSE only) (default: 'auto') |
| `preventAutoAuth`  | `boolean`                                                         | Prevent automatic authentication popup on initial connection (default: false)                                      |
| `onPopupWindow`    | `(url: string, features: string, window: Window \| null) => void` | Callback invoked just after the authentication popup window is opened                                              |

#### Return Value

| Property            | Type                                                                                      | Description                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `state`             | `string`                                                                                  | Current connection state: 'discovering', 'pending\_auth', 'authenticating', 'connecting', 'loading', 'ready', 'failed' |
| `tools`             | `Tool[]`                                                                                  | Available tools from the MCP server                                                                                    |
| `resources`         | `Resource[]`                                                                              | Available resources from the MCP server                                                                                |
| `resourceTemplates` | `ResourceTemplate[]`                                                                      | Available resource templates from the MCP server                                                                       |
| `prompts`           | `Prompt[]`                                                                                | Available prompts from the MCP server                                                                                  |
| `error`             | `string \| undefined`                                                                     | Error message if connection failed                                                                                     |
| `authUrl`           | `string \| undefined`                                                                     | Manual authentication URL if popup is blocked                                                                          |
| `log`               | `{ level: 'debug' \| 'info' \| 'warn' \| 'error'; message: string; timestamp: number }[]` | Array of log messages                                                                                                  |
| `callTool`          | `(name: string, args?: Record<string, unknown>) => Promise<any>`                          | Function to call a tool on the MCP server                                                                              |
| `listResources`     | `() => Promise<void>`                                                                     | Refresh the list of available resources                                                                                |
| `readResource`      | `(uri: string) => Promise<{ contents: Array<...> }>`                                      | Read the contents of a specific resource                                                                               |
| `listPrompts`       | `() => Promise<void>`                                                                     | Refresh the list of available prompts                                                                                  |
| `getPrompt`         | `(name: string, args?: Record<string, string>) => Promise<{ messages: Array<...> }>`      | Get a specific prompt with optional arguments                                                                          |
| `retry`             | `() => void`                                                                              | Manually attempt to reconnect                                                                                          |
| `disconnect`        | `() => void`                                                                              | Disconnect from the MCP server                                                                                         |
| `authenticate`      | `() => void`                                                                              | Manually trigger authentication                                                                                        |
| `clearStorage`      | `() => void`                                                                              | Clear all stored authentication data                                                                                   |

## License

MIT
