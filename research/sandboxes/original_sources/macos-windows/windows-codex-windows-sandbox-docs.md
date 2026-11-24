---
title: Windows sandbox (Codex documentation)
url: https://learn.chatgpt.com/docs/windows/windows-sandbox
authors: OpenAI
date: undated living doc (redirected from https://developers.openai.com/codex/windows); content reflects MXC support added in 2026
accessed: 2026-11-22
kind: docs
---

## Summary
OpenAI's documentation for Codex's native Windows sandbox, which enforces
filesystem and network permissions on agent commands and their children
without WSL or a VM. Three implementations: `mxc` (recommended on compatible
devices; native process isolation via Microsoft Execution Containers),
`elevated` (legacy; admin setup creates dedicated low-privilege sandbox users,
filesystem ACL boundaries and firewall rules) and `unelevated` (legacy;
restricted token derived from the current user, ACL boundaries,
environment-level offline controls, weaker network isolation).

## Key points
- MXC backend: no admin setup, no extra Windows accounts, no local firewall
  rules; requires Windows 11 24H2 build 26100.9278 or 25H2 build 26200.9278+.
- With MXC, managed networking needs `allow_local_binding = true`; leftover
  child processes are stopped when the foreground command exits.
- Elevated backend: separate sandbox user accounts + firewall rules; commands
  run without admin rights.
- Unelevated backend: restricted token + ACLs; no denied-read paths; weaker
  network isolation.
- Admins can constrain allowed backends via `requirements.toml` or disable MXC
  with `windows.allow_mxc = false`.
- Repository detail (openai/codex `codex-rs/windows-sandbox-rs/src/wfp.rs`):
  the legacy elevated backend registers a persistent WFP provider "Codex
  Windows Sandbox WFP".

## Excerpts
> MXC "Uses native process isolation without administrator-approved setup, additional Windows accounts, or local firewall rules."

## Relevance to the talk
A shipping coding agent's evolution on Windows: from home-grown
restricted-token/sandbox-user/firewall tricks (the Chromium-style toolkit) to
the OS vendor's AppContainer-based process container. Shows the per-command,
no-VM model is what agents actually use on Windows.
