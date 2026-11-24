---
title: "AppleContainerSandbox" (Mastra reference) — with apple/container README for the underlying mechanism
url: https://mastra.ai/reference/workspace/apple-container-sandbox
authors: Mastra; Apple (https://github.com/apple/container, repo created 2025-05-30)
date: living documents; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
An example of agent frameworks adopting Apple's `container` tool (announced WWDC 2025) as a local agent sandbox on macOS. Apple's `container` runs Linux OCI containers "as lightweight virtual machines" on Apple silicon, targeting macOS 26+. Mastra's `AppleContainerSandbox` starts one long-lived container per workspace and runs the agent's commands in it with `container exec`. Several other small projects (agentkernel's Apple backend, vvbox, guides running the pi agent) appeared in search results but were not read.

## Key points
- apple/container: "create and run Linux containers as lightweight virtual machines on your Mac"; Swift; uses the Containerization package; requires Apple silicon; designed for macOS 26 or later (new virtualization and networking features); OCI images in and out.
- Mastra provider: Apple silicon + macOS 26 + `container system start`; default image `node:22-slim`; options for network attachment, bind-mount volumes, raw `--mount` specs, CPU, memory, env, capabilities, DNS, timeouts (default 5 min).
- Lifecycle: `start()` reuses/restarts/creates the container; refuses containers lacking Mastra ownership labels; `destroy()` deletes by default.
- Only foreground `executeCommand()` supported so far (no background processes or LSP sessions).
- The Mastra page itself does not state the VM-per-container property; that comes from Apple's README.

## Excerpts
> "`container` is a tool that you can use to create and run Linux containers as lightweight virtual machines on your Mac." — apple/container README

> "The provider starts a long-lived container and uses `container exec` for workspace commands." — Mastra reference

## Relevance to the talk
On macOS the gap between "container" and "VM" has closed: Apple's own container tool gives each container its own lightweight VM, making a hardware-virtualised per-agent sandbox locally available without Docker Desktop. Contrast with Cursor's rejection of containers on macOS (Linux binaries only — no Xcode, no macOS toolchain), which remains the trade-off.
