---
title: "Docker Sandboxes" (overview, Architecture, Security)
url: https://docs.docker.com/ai/sandboxes/
authors: Docker, Inc.
date: living docs, no dates shown; read 2026-11-22 (architecture: https://docs.docker.com/ai/sandboxes/architecture/ ; security: https://docs.docker.com/ai/sandboxes/security/)
accessed: 2026-11-22
kind: docs
---

## Summary
Docker Sandboxes (CLI `sbx`) run AI coding agents in microVMs on the developer's machine or on Docker-managed cloud infrastructure. Each sandbox is a microVM with its own private Docker Engine, the host workspace attached by filesystem passthrough, and all outbound TCP sent through a host-side proxy that enforces a deny-by-default policy and injects credentials so raw secrets never enter the VM. The security page is candid about what still crosses the boundary: live workspace edits (including git hooks and build scripts that run later on the host), shared skills, and local MCP servers which run on the host.

## Key points
- "The primary trust boundary is the microVM"; the agent has full control (incl. sudo) inside. Hypervisor per OS is not named in the pages read.
- Per-sandbox Docker daemon, image cache and packages; sandboxes share no images/layers and cannot talk to each other over the network.
- Workspace modes: **direct** (read-write passthrough, edits visible on host immediately), **clone** (read-only host mount + private clone), **mountless**.
- Network: outbound TCP deny-by-default via host proxy (HTTP/HTTPS forward proxy; other TCP forwarded transparently); some broad defaults allowed (e.g. `*.googleapis.com`; `sbx policy ls` to review); ICMP blocked; UDP blocked unless an experimental feature is enabled.
- Credentials: host proxy injects auth headers; agent sees a placeholder; "The real credential stays outside the sandbox throughout the request."
- Not protected: direct-mode edits to files that run implicitly (git hooks in `.git/` not shown by `git diff`, CI configs, `Makefile`, `package.json` scripts); read-write shared skills merge trust boundaries across sandboxes; local stdio MCP servers run on the host with host permissions.
- Pricing: CLI and local compute free (incl. commercial); cloud pay-as-you-go.

## Excerpts
> "Docker Sandboxes run AI coding agents in isolated environments on your machine or on Docker-managed cloud infrastructure." — overview

> "Each sandbox maintains its own Docker daemon state, image cache, and package installations." — Architecture

> "The real credential stays outside the sandbox throughout the request." — Architecture

## Relevance to the talk
Docker — the company that popularised containers — chose microVMs rather than containers for agents, because agents need their own Docker daemon and a stronger boundary. The "git hooks aren't in git diff" warning is a sharp example of the workspace itself being the exfil/persistence channel back to the host.
