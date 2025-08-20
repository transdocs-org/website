# MCP Kotlin SDK

[![Kotlin Multiplatform](https://img.shields.io/badge/Kotlin-Multiplatform-blueviolet?logo=kotlin)](https://kotlinlang.org/docs/multiplatform.html)
[![Platforms](https://img.shields.io/badge/Platforms-JVM%20%7C%20Wasm%2FJS%20%7C%20Native%20\(iOS%2FiOS%20Simulator\)-blue)](https://kotlinlang.org/docs/multiplatform.html)
[![Maven Central](https://img.shields.io/maven-central/v/io.modelcontextprotocol/kotlin-sdk.svg?label=Maven%20Central)](https://search.maven.org/search?q=g:io.modelcontextprotocol%20a:kotlin-sdk)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/LICENSE)

Kotlin Multiplatform implementation of the [Model Context Protocol](https://modelcontextprotocol.io) (MCP),
providing both client and server capabilities for integrating with LLM surfaces across various platforms.

## Overview

The Model Context Protocol allows applications to provide context for LLMs in a standardized way,
separating the concerns of providing context from the actual LLM interaction.
This SDK implements the MCP specification for Kotlin,
enabling you to build applications that can communicate using MCP on the JVM, WebAssembly and iOS.

* Build MCP clients that can connect to any MCP server
* Create MCP servers that expose resources, prompts and tools
* Use standard transports like stdio, SSE, and WebSocket
* Handle all MCP protocol messages and lifecycle events

## Samples

* [kotlin-mcp-server](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/samples/kotlin-mcp-server): demonstrates a multiplatform (JVM, Wasm) MCP server setup with various features and transports.
* [weather-stdio-server](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/samples/weather-stdio-server): shows how to build a Kotlin MCP server providing weather forecast and alerts using STDIO transport.
* [kotlin-mcp-client](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/samples/kotlin-mcp-client): demonstrates building an interactive Kotlin MCP client that connects to an MCP server via STDIO and integrates with Anthropic’s API.

## Installation

Add the new repository to your build file:

```kotlin
repositories {
    mavenCentral()
}
```

Add the dependency:

```kotlin
dependencies {
    // Use the badge above for the latest version
    implementation("io.modelcontextprotocol:kotlin-sdk:$mcpVersion")
}
```

## Quick Start

### Creating a Client

```kotlin
import io.modelcontextprotocol.kotlin.sdk.client.Client
import io.modelcontextprotocol.kotlin.sdk.client.StdioClientTransport
import io.modelcontextprotocol.kotlin.sdk.Implementation

val client = Client(
    clientInfo = Implementation(
        name = "example-client",
        version = "1.0.0"
    )
)

val transport = StdioClientTransport(
    inputStream = processInputStream,
    outputStream = processOutputStream
)

// Connect to server
client.connect(transport)

// List available resources
val resources = client.listResources()

// Read a specific resource
val resourceContent = client.readResource(
    ReadResourceRequest(uri = "file:///example.txt")
)
```

### Creating a Server

```kotlin
import io.modelcontextprotocol.kotlin.sdk.server.Server
import io.modelcontextprotocol.kotlin.sdk.server.ServerOptions
import io.modelcontextprotocol.kotlin.sdk.server.StdioServerTransport
import io.modelcontextprotocol.kotlin.sdk.ServerCapabilities

val server = Server(
    serverInfo = Implementation(
        name = "example-server",
        version = "1.0.0"
    ),
    options = ServerOptions(
        capabilities = ServerCapabilities(
            resources = ServerCapabilities.Resources(
                subscribe = true,
                listChanged = true
            )
        )
    )
)

// Add a resource
server.addResource(
    uri = "file:///example.txt",
    name = "Example Resource",
    description = "An example text file",
    mimeType = "text/plain"
) { request ->
    ReadResourceResult(
        contents = listOf(
            TextResourceContents(
                text = "This is the content of the example resource.",
                uri = request.uri,
                mimeType = "text/plain"
            )
        )
    )
}

// Start server with stdio transport
val transport = StdioServerTransport()
server.connect(transport)
```

### Using SSE Transport

Directly in Ktor's `Application`:

```kotlin
import io.ktor.server.application.*
import io.modelcontextprotocol.kotlin.sdk.server.mcp

fun Application.module() {
    mcp {
        Server(
            serverInfo = Implementation(
                name = "example-sse-server",
                version = "1.0.0"
            ),
            options = ServerOptions(
                capabilities = ServerCapabilities(
                    prompts = ServerCapabilities.Prompts(listChanged = null),
                    resources = ServerCapabilities.Resources(subscribe = null, listChanged = null)
                )
            )
        )
    }
}
```

Inside a custom Ktor's `Route`:

```kotlin
import io.ktor.server.application.*
import io.ktor.server.sse.SSE
import io.modelcontextprotocol.kotlin.sdk.server.mcp

fun Application.module() {
    install(SSE)

    routing {
        route("myRoute") {
            mcp {
                Server(
                    serverInfo = Implementation(
                        name = "example-sse-server",
                        version = "1.0.0"
                    ),
                    options = ServerOptions(
                        capabilities = ServerCapabilities(
                            prompts = ServerCapabilities.Prompts(listChanged = null),
                            resources = ServerCapabilities.Resources(subscribe = null, listChanged = null)
                        )
                    )
                )
            }
        }
    }
}
```

## Contributing

Please see the [contribution guide](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/CONTRIBUTING.md) and the [Code of conduct](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the MIT License—see the [LICENSE](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/LICENSE) file for details.
