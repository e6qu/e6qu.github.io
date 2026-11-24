---
title: "Wassette: A security-oriented runtime that runs WebAssembly Components via MCP" (repo + docs; launch post "Introducing Wassette: WebAssembly-based tools for AI agents")
url: https://github.com/microsoft/wassette
authors: Microsoft (Azure Core Upstream); launch post by Yosh Wuyts
date: repo created 2025-07-15; launch post 2025-08-06 (https://opensource.microsoft.com/blog/2025/08/06/introducing-wassette-webassembly-based-tools-for-ai-agents/); latest release v0.8.1, 2026-10-19; MCP threat-model doc dated 2025-10-22
accessed: 2026-11-22
kind: repo
---

## Summary
Wassette is a Rust MCP server that loads WebAssembly *components* (from OCI registries, files or URLs) into Wasmtime and exposes each exported WIT function as an MCP tool. Each component starts with no access to files, network or environment variables; a per-component policy (YAML) grants specific paths (read / read-write), hosts and env vars, enforced through Wasmtime's WASI implementation. It is the clearest 2025–26 example of "component-model capabilities as the sandbox for agent tools", as opposed to running MCP servers as native processes. Still labelled "Early Development … not production ready".

## Key points
- Mapping: component exports → MCP tools (one component, many tools); WIT types → JSON Schema. Prompts/resources not supported. Tool namespace is flat and global across components.
- Deny-by-default policy: `storage` (URI paths with `read`/`write`; write-only rejected "because the WASI filesystem cannot represent them without also allowing reads"), `network` (individual hosts), `environment` (named variables).
- Built-in MCP tools include `load-component`, `grant-storage-permission`, `grant-network-permission`, `grant-environment-variable-permission`, revoke/reset. These management tools are themselves exposed to the agent; per the launch post, the user approves loads and grants via the MCP client's confirmation dialogs (so the human approval step lives in the client, not in Wasm).
- Threat model doc (2025-10-22) is explicit that Wassette "cannot prevent prompt injection attacks"; it limits damage by treating the agent as untrusted and enforcing per-component policy at the runtime. Claims components "cannot spawn processes" and cannot reach the network stack directly — all I/O goes through WASI.
- Host-side surface acknowledged: HTTP transport exposes the management plane on a local port; DNS-rebinding defended by a `Host` header allowlist; "Wassette still performs no authentication or authorization of its own on the HTTP transport".
- Launch post claims: "secure sandboxing on par with modern browser engines"; "a fine-grained, deny-by-default permission system".
- Status: v0.8.1 (2026-10-19), ~977 stars, MIT.

## Excerpts
> "Wassette is built on the Wasmtime security sandbox, providing browser-grade isolation of tools." (README)

> "Wassette cannot prevent prompt injection attacks at the AI agent level, as this is a fundamental challenge in current LLM architectures." (docs/design/mcp-threat-model.md)

> "Components loaded in Wasmtime can't access system resources without explicit access permissions." (launch post)

## Relevance to the talk
Sub-type "component-model capability tools": the sandbox boundary is per *tool*, not per agent, and the policy is expressed in terms the component's WIT imports make visible. Contrasts with typical MCP servers launched by `npx`/`uvx` with the user's full ambient authority (see agent-sandboxing/postmark-mcp-malicious-package.md). Limits: only code compiled to components (no arbitrary binaries, no subprocesses), and the security of grants still depends on (a) the human approving them and (b) the WASI host implementation — where most 2026 Wasmtime advisories landed (wasmtime-security-advisories.md).
