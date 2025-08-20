<div align = "right">
<a href="docs/readme/README.zh-cn.md">简体中文(待更新)</a>
</div>

# RMCP

[![Crates.io Version](https://img.shields.io/crates/v/rmcp)](https://crates.io/crates/rmcp)

<!-- ![Release status](https://github.com/modelcontextprotocol/rust-sdk/actions/workflows/release.yml/badge.svg) -->

<!-- [![docs.rs](todo)](todo) -->

![Coverage](https://raw.githubusercontent.com/modelcontextprotocol/rust-sdk/refs/heads/main/docs/coverage.svg)

An official Rust Model Context Protocol SDK implementation with tokio async runtime.

This repository contains the following crates:

* [rmcp](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp): The core crate providing the RMCP protocol implementation (If you want to get more information, please visit [rmcp](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp/README.md))
* [rmcp-macros](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp-macros): A procedural macro crate for generating RMCP tool implementations (If you want to get more information, please visit [rmcp-macros](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp-macros/README.md))

## Usage

### Import the crate

```toml
rmcp = { version = "0.2.0", features = ["server"] }
## or dev channel
rmcp = { git = "https://github.com/modelcontextprotocol/rust-sdk", branch = "main" }
```

### Third Dependencies

Basic dependencies:

* [tokio required](https://github.com/tokio-rs/tokio)
* [serde required](https://github.com/serde-rs/serde)

### Build a Client

<details>
<summary>Start a client</summary>

```rust, ignore
use rmcp::{ServiceExt, transport::{TokioChildProcess, ConfigureCommandExt}};
use tokio::process::Command;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = ().serve(TokioChildProcess::new(Command::new("npx").configure(|cmd| {
        cmd.arg("-y").arg("@modelcontextprotocol/server-everything");
    }))?).await?;
    Ok(())
}
```

</details>

### Build a Server

<details>
<summary>Build a transport</summary>

```rust, ignore
use tokio::io::{stdin, stdout};
let transport = (stdin(), stdout());
```

</details>

<details>
<summary>Build a service</summary>

You can easily build a service by using [`ServerHandler`](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp/src/handler/server.rs) or [`ClientHandler`](https://github.com/modelcontextprotocol/rust-sdk/tree/main/crates/rmcp/src/handler/client.rs).

```rust, ignore
let service = common::counter::Counter::new();
```

</details>

<details>
<summary>Start the server</summary>

```rust, ignore
// this call will finish the initialization process
let server = service.serve(transport).await?;
```

</details>

<details>
<summary>Interact with the server</summary>

Once the server is initialized, you can send requests or notifications:

```rust, ignore
// request
let roots = server.list_roots().await?;

// or send notification
server.notify_cancelled(...).await?;
```

</details>

<details>
<summary>Waiting for service shutdown</summary>

```rust, ignore
let quit_reason = server.waiting().await?;
// or cancel it
let quit_reason = server.cancel().await?;
```

</details>

## Examples

See [examples](https://github.com/modelcontextprotocol/rust-sdk/tree/main/examples/README.md)

## OAuth Support

See [oauth\_support](https://github.com/modelcontextprotocol/rust-sdk/tree/main/docs/OAUTH_SUPPORT.md) for details.

## Related Resources

* [MCP Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/)
* [Schema](https://github.com/modelcontextprotocol/specification/blob/main/schema/2024-11-05/schema.ts)

## Related Projects

* [rustfs-mcp](https://github.com/rustfs/rustfs/tree/main/crates/mcp) - High-performance MCP server providing S3-compatible object storage operations for AI/LLM integration
* [containerd-mcp-server](https://github.com/jokemanfire/mcp-containerd) - A containerd-based MCP server implementation

## Development

### Tips for Contributors

See [docs/CONTRIBUTE.MD](https://github.com/modelcontextprotocol/rust-sdk/tree/main/docs/CONTRIBUTE.MD) to get some tips for contributing.

### Using Dev Container

If you want to use dev container, see [docs/DEVCONTAINER.md](https://github.com/modelcontextprotocol/rust-sdk/tree/main/docs/DEVCONTAINER.md) for instructions on using Dev Container for development.
