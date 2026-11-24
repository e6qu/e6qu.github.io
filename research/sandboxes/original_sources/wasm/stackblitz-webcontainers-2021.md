---
title: "Introducing WebContainers: Run Node.js natively in your browser" (+ webcontainers.io browser-support and troubleshooting guides)
url: https://blog.stackblitz.com/posts/introducing-webcontainers/
authors: Eric Simons (StackBlitz)
date: 2021-05-20; guides read 2026-11-22 (browser-support page "Last update: October 2026")
accessed: 2026-11-22
kind: blog
---

## Summary
StackBlitz's WebContainers are "a WebAssembly-based operating system" that runs Node.js (V8 from the browser, plus a Wasm/JS kernel layer, virtual filesystem and a virtual TCP stack mapped onto Service Workers) entirely inside a browser tab. Bolt.new runs agent-generated projects in a WebContainer, so the isolation boundary for its agent's shell commands is the browser's own sandbox. Limits: only JS and Wasm run — no native addons, no other language runtimes unless compiled to Wasm — and full support requires Chromium's cross-origin isolation.

## Key points
- "All code execution happens inside the browser's security sandbox, not on remote VMs or local binaries." (2021)
- Claims (vendor, 2021): boot "in milliseconds"; builds "up to 20% faster", package installs ">= 5x faster than yarn/npm".
- Networking: "a virtualized TCP network stack that's mapped to your browser's ServiceWorker API".
- Browser support (2026): fully supported in Chrome/Chromium browsers; Firefox alpha/beta (page inconsistent); Safari beta from 16.4 TP; needs cross-origin isolation for SharedArrayBuffer and a newer, more permissive isolation mode only Chromium implements.
- Troubleshooting (2026): "Currently, WebContainers can only execute languages that are natively supported on the Web"; native addons disabled via `--no-addons` ("It is not possible to run native addons"); browser can run out of memory with several projects open.
- Bolt.new usage and its Safari fallback to server-hosted previews: see agent-sandboxing/agent-browser-app-builders.md.

## Excerpts
> "All code execution happens inside the browser's security sandbox, not on remote VMs or local binaries." (2021 post)

> "Currently, WebContainers can only execute languages that are natively supported on the Web." (troubleshooting guide)

## Relevance to the talk
Sub-type "browser as sandbox": zero server cost per session, and the boundary is Chrome's renderer sandbox + site isolation (virtualization/site-isolation-usenix2019.md), which is battle-tested against hostile code. The cost is a narrow workload: Node-only, no native binaries, no real sockets (proxied), and the user's browser holds the secrets the agent can see. Strong for prompt-to-app builders, unsuitable for general coding agents.
