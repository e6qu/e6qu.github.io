---
title: "microsandbox" (README)
url: https://github.com/superradcompany/microsandbox
authors: superradcompany (microsandbox contributors)
date: repo created 2024-10-03; README read 2026-11-22 (github.com/microsandbox/microsandbox redirects here)
accessed: 2026-11-22
kind: repo
---

## Summary
microsandbox is an embeddable, local-first microVM runtime for untrusted workloads, explicitly including AI agents. Built on libkrun, it boots a VM as a child process of the calling program (no daemon, no server), requiring KVM on Linux, Apple Silicon on macOS (libkrun uses Hypervisor.framework there — not stated in the README) and WHP on Windows, with boot times under 100 ms on an M1. It brings the hosted-sandbox feature set (per-host egress allowlists, secrets that never enter the VM) to a developer laptop.

## Key points
- "Runs untrusted workloads inside fast, local microVMs: AI agents, user code, plugins, CI jobs, dev environments, scrapers, and automation."
- Requirements: macOS on Apple Silicon; Linux with KVM; Windows with WHP enabled. Acknowledges libkrun and smoltcp.
- "Average boot times under 100 milliseconds" (footnote: guest boot on an M1).
- "Embeddable: Spawn VMs right within your code. No setup server. No long-running daemon."
- Network policy in SDK: `allowed_hosts`, `allowed_ports`.
- "Secrets That Can't Leak": a secret is bound to an env var name and an `allowed_host`; the README claims keys "never enter the VM" (substitution happens outside).
- SDKs for TypeScript, Rust, Python, Go, Ruby; CLI `msb`.

## Excerpts
> "Secrets That Can't Leak: Unexploitable secret keys that never enter the VM."

> "Embeddable: Spawn VMs right within your code. No setup server. No long-running daemon."

## Relevance to the talk
Shows microVMs becoming as easy to spawn as a container or a bubblewrap process on a laptop — the "lighter than a VM, stronger than a container" gap closing from the VM side. Its secret-binding-to-host API is the same placeholder-substitution pattern seen in srt, Docker Sandboxes, Vercel and Codex cloud.
