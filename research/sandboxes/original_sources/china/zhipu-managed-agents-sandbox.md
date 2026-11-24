---
title: 预装沙箱环境 / 配置运行环境 / 概述 — Z Managed Agents (智谱开放平台 docs)
url: https://docs.bigmodel.cn/cn/managed-agents/sandbox-reference.md
authors: Zhipu AI (Z.ai / 智谱)
date: undated; protocol headers zai-version 2026-05-26 and zai-beta managed-agents-2026-09-22
accessed: 2026-11-22
kind: docs
---

## Summary
Zhipu's open platform has "Z Managed Agents", a hosted agent runtime built on four objects (Agent, Environment, Session, Events). Each session gets a cloud sandbox (Ubuntu 24.04, x86_64) with bash and file tools. Network egress is set per Environment: "unrestricted" (the default) or "limited" with an `allowed_hosts` list, and in both cases only ports 80 and 443 are allowed, enforced by a platform gateway. The docs do not name the isolation technology (container, gVisor or microVM). The API shape (agents / environments / sessions / events, `always_allow` / `always_ask` policies, a dated toolset name) closely mirrors Anthropic's Claude Managed Agents, but the docs do not say so.

## Key points
- Isolation unit: not named. The security boundary is described as "沙箱隔离与网络策略" (sandbox isolation plus network policy). The agent runs as root inside the sandbox. The phrase "而非容器内非 root 用户" (rather than a non-root user inside the container) suggests a container, but the docs never say which runtime (runc, gVisor, Kata or microVM). Credentials in the Vault cannot be read from the sandbox; files and memory are platform mounts.
- Per-session?: yes. Overview: "每个会话配备云沙箱，bash 与文件读写开箱即用，会话结束即释放" (each session gets a cloud sandbox, released when the session ends). The Environment config is frozen into a snapshot when the session is created.
- Network egress (配置运行环境 page, https://docs.bigmodel.cn/cn/managed-agents/cloud-environment.md): `unrestricted` is the default and can reach public hosts, but ports are still limited to 80/443. `limited` allows only `allowed_hosts` (max 256 entries, hostnames or `*.example.com`). Package managers (`allow_package_managers`) and remote MCP servers (`allow_mcp_servers`) need separate opt-in, both default false. `web_search` and `web_fetch` run on the platform, not in the sandbox.
- Packages: apt, cargo, gem, go, npm and pip, up to 200 per manager. Custom registries and private-source credentials are rejected with HTTP 400.
- Persistence: `/mnt/session/outputs` persists across turns and can be downloaded. `/workspace`, `/tmp` and runtime installs do not persist unless the session is created with `x-checkpoint: true` (system-disk snapshot).
- Preinstalled image: Python 3.11 (plus 3.10/3.12/3.13), Node 22, Bun, Go 1.24, Rust, OpenJDK 21, PostgreSQL 16 and Redis 7 (installed, not started), Playwright with Chromium and Xvfb, LibreOffice and TeX Live. Docker CLI is installed but there is no Docker daemon in the sandbox.
- Permissions (工具权限 page): `always_allow` and `always_ask`. The default for the built-in toolset `agent_toolset_20260601` and for MCP tools is `always_allow`. The docs suggest `always_ask` for tools that change sandbox state (bash, write, edit).
- Interrupts: commands that do not finish within a grace period (about 3 s) after an interrupt are force-killed (FAQ).
- Limits: CPU, memory, disk and timeouts are not published.
- Pricing (overview): pay-as-you-go via the API at model token rates (glm-5.3 family). Sandbox and runtime are free until 2026-10-31, with billing "to be announced". Coding Plan quota cannot be used. The free period has passed as of the access date; I found no published sandbox price.

## Excerpts
> "出站网络受 Environment 网络策略控制（unrestricted / limited + allowed_hosts），并统一限制为 HTTP/HTTPS 端口 80/443；由平台侧网关强制执行。" — English: "Outbound network is governed by the Environment network policy (unrestricted / limited + allowed_hosts) and uniformly limited to HTTP/HTTPS ports 80/443, enforced by a platform-side gateway." (预装沙箱环境)

> "root。安全边界是沙箱隔离与网络策略，而非容器内非 root 用户" — English: "root. The security boundary is sandbox isolation and network policy, not a non-root user inside the container." (预装沙箱环境, "Agent 运行用户" row)

> "仅 CLI，沙箱内不运行 Docker daemon" — English: "CLI only; no Docker daemon runs inside the sandbox." (预装沙箱环境)

> "只允许访问 allowed_hosts 列出的主机；包管理器与 MCP 出网需单独放行。" — English: "Only hosts in allowed_hosts are reachable; package-manager and MCP egress must be allowed separately." (配置运行环境)

> "每个会话配备云沙箱，bash 与文件读写开箱即用，会话结束即释放" — English: "Each session has a cloud sandbox with bash and file I/O ready to use, released when the session ends." (概述)

## Relevance to the talk
The clearest sign that Chinese labs are copying the hosted agent runtime pattern almost one-to-one, with per-session sandbox, egress allowlist, vault-held credentials and permission policies. Note the defaults: unrestricted egress and `always_allow` tools. The docs are open about the controls but say nothing about what the isolation is made of.
