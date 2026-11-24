---
title: "Cloud environment setup" (Claude Managed Agents)
url: https://platform.claude.com/docs/en/managed-agents/environments
authors: Anthropic
date: living document, beta header `managed-agents-2026-04-01`; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Claude Managed Agents is Anthropic's hosted agent harness; each session runs its tools in "its own isolated sandbox (a fresh Linux container)" configured by a reusable *environment*, or alternatively in a self-hosted sandbox on the customer's infrastructure. The environment page is mostly about egress: a `limited` mode with host allowlists and opt-in package-manager/MCP host sets, versus `unrestricted`. Its warning text is one of the clearest vendor statements of why host-based allowlists are insufficient against prompt injection.

## Key points
- Each session gets its own sandbox even when sessions share an environment; no shared filesystem state; environments are not versioned.
- `packages` field pre-installs apt/cargo/gem/go/npm/pip packages; requires `allow_package_managers: true` under limited networking.
- Networking `limited`: only `allowed_hosts` (bare hostnames or `*.example.com`; no scheme/port/path); `allow_mcp_servers`; `allow_package_managers` adds an Anthropic-maintained list (github.com, api.github.com, raw.githubusercontent.com, registry.npmjs.org, pypi.org, crates.io, proxy.golang.org, Maven/Gradle, rubygems, packagist, Ubuntu archives, Docker Hub, ghcr.io…). Blocked port 80/443 requests get a 403 naming the host. `allowed_hosts` also constrains the server-side `web_fetch`/`web_search` tools.
- **API default is `unrestricted`** if `networking` is omitted, whereas the Console form defaults to Limited with nothing allowed.
- `unrestricted`: everything except a "general safety blocklist"; default bash permission policy is `always_allow`, so nothing pauses requests.
- Self-hosted sandboxes keep tool execution, files and network egress in the customer's infrastructure while Anthropic runs the agent loop.

## Excerpts
> "Network access is granted by host, not by operation. The sandbox can send any request to an allowed host, including uploads such as `git push` and package publishing, with any credential the command supplies." — Package manager hosts warning

> "If the agent processes untrusted input (repository files, fetched web content, or third-party tool output), a successful prompt injection could use an allowed host to copy files out of the sandbox."

> "Model behavior is not a security control" — Risks of unrestricted networking

## Relevance to the talk
Crisp articulation of the egress problem for agents: allowlisting github.com or npm to make the agent useful also allowlists `git push` and `npm publish` as exfiltration channels. "Model behavior is not a security control" is a good slide title for the closing section.
