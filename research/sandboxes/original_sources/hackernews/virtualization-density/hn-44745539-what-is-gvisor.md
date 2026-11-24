---
title: "What is gVisor?"
url: https://news.ycombinator.com/item?id=44745539
story_url: https://blog.yelinaung.com/posts/gvisor/
authors: HN discussion (submitted by yla92) of a blog explainer
date: 2025-07-31
accessed: 2026-11-22
kind: discussion
points: 125
comments: 61
---

## Summary
A 2025 explainer whose thread is useful mainly for production reports. Modal has run gVisor for over two years, including GPU workloads and checkpoint/restore of containers and their GPUs. gVisor's "achilles heel" is missing or inaccurate syscalls. tptacek pushes back on the idea that gVisor and KVM have separate risk profiles ("gVisor uses KVM"). Others point to TinyKVM/KVMServer and Microsoft's Hyperlight as KVM-level relatives.

## Key points
- Modal (thundergolfer): gVisor gives "a secure sandbox with GPU support that can run on VMs", and recently checkpoint/restore of containers and GPUs. The friction is syscall compatibility, but the gVisor team responds quickly to issues.
- Fly.io (tptacek): "Can you think of a vulnerability hypo where a KVM host is vulnerable, but a gVisor host isn't? gVisor uses KVM." He also asks how Modal handles GPU isolation, calling AMD-Vi KVM GPU isolation "a big challenge for us".
- gVisor's netstack is reused outside the sandbox (Tailscale maintains a fork). Commenters use it to run user-space TCP/IP on AF_XDP.
- TinyKVM/KVMServer claims per-request isolation "with an order of magnitude less overhead" than forking a process or creating a V8 isolate, by resetting guest state.
- One commenter recommends unikernels (Unikraft) for "strong isolation and high performance", and a NanoVMs employee disputes Unikraft's security.

## Excerpts
> "We've run gVisor for over 2 years at Modal, and it's been a huge unlock for us. We get a secure sandbox with GPU support that can run on VMs." — thundergolfer (Modal), https://news.ycombinator.com/item?id=44747283

> "gVisor's achilles heel is it's missing or inaccurate syscalls, but the gVisor team is first class in responding to Github issues" — thundergolfer, https://news.ycombinator.com/item?id=44747283

> "Can you think of a vulnerability hypo where a KVM host is vulnerable, but a gVisor host isn't? gVisor uses KVM." — tptacek, https://news.ycombinator.com/item?id=44748450

> "we can provide per-request isolation with an order of magnitude less overhead than alternative approaches like forking a process or even spinning up a v8 isolate." — laurencerowe (TinyKVM/KVMServer), https://news.ycombinator.com/item?id=44749968

## Relevance to the talk
gVisor is a common substrate for hosted agent/code sandboxes (Modal, Google). It works, at the cost of syscall compatibility. Use this thread for the "compatibility is the tax" point and for the GPU-isolation problem.
