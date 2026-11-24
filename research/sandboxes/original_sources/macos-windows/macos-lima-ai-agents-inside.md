---
title: "AI agents inside Lima"
url: https://lima-vm.io/docs/config/ai/inside/
authors: Lima maintainers
date: page last modified 2026-09-19
accessed: 2026-11-22
kind: docs
---

## Summary
Short Lima docs page recommending running coding agents (Antigravity, Claude Code, Codex) inside a Lima
VM so they cannot touch host files directly. Details and examples are on linked pages; this page gives
no threat model or mount guidance itself.

## Key points
- Stated purpose: keep agents from reading, writing or executing host files.
- The parent page (https://lima-vm.io/docs/config/ai/, modified 2026-10-05) names two scenarios: agent
  inside the VM, or agent outside using Lima's MCP tools.

## Excerpts
> "prevent agents from directly reading, writing, or executing the host files" — AI agents inside Lima

## Relevance to the talk
Shows the default 2025–26 answer on macOS: "put the agent in a Linux VM". The isolation is real, but Lima's
default template (`templates/_default/mounts.yaml`) mounts the host home directory `~`, read-only by
default (`writable` defaults to false). Agents can therefore still read host secrets unless the mounts
are narrowed.
