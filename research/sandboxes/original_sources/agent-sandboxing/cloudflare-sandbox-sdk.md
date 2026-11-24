---
title: "Sandboxes on Cloudflare" (Sandbox SDK)
url: https://developers.cloudflare.com/sandbox/
authors: Cloudflare
date: living document; page metadata dateModified 2026-09-30; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Cloudflare's Sandbox SDK lets a Worker run untrusted or generated code in one of two environments: Containers (a Linux image you supply, started and coordinated by a Durable Object, each instance a microVM) or Dynamic Workers (V8-isolate Workers created at runtime for JS, Python or Wasm). It explicitly targets coding agents (Claude Code, Codex, Devin "in a per-task sandbox") and keeps credentials in the controlling Worker rather than in the sandbox.

## Key points
- Requires Workers Paid plan; reached only through a Worker.
- Containers: "Each instance is a microVM with its own kernel and network, so no other workload shares it"; a Durable Object provides "identity and coordination for an attached container". The DO scheduling policy used is "in public beta".
- Dynamic Workers: isolated from the parent Worker and each other; reach the application only through what is passed in — i.e. capability-style.
- Features: exec with streaming, long-running processes, terminal; files and R2 mounts; preview URLs; code-interpreter guide; network and credential control from the Worker.
- Limits are on separate Container-limits / pricing pages (not read).

## Excerpts
> "A sandbox is an isolated place to run code."

> "The code cannot directly read the memory or data of your application."

> "Each instance is a microVM with its own kernel and network, so no other workload shares it."

## Relevance to the talk
Shows the two hosted extremes side by side in one product — microVM containers for full Linux agents vs V8 isolates for lightweight code — and the capability-passing model (the sandbox only gets what the Worker hands it) as a way to keep secrets outside.
