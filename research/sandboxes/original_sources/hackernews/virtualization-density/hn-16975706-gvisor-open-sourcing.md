---
title: "Open-sourcing gVisor, a sandboxed container runtime"
url: https://news.ycombinator.com/item?id=16975706
story_url: https://cloudplatform.googleblog.com/2018/05/Open-sourcing-gVisor-a-sandboxed-container-runtime.html
authors: HN discussion (submitted by rbanffy) of Google's gVisor announcement
date: 2018-05-02
accessed: 2026-11-22
kind: discussion
points: 448
comments: 114
---

## Summary
The launch thread for gVisor, with several gVisor engineers answering (amscanne, prattmic, hugelgupf). Skeptics asked why not just use seccomp/pledge, or a full VM like Kata. The team's answer was defence in layers. The Sentry, a user-space kernel written in Go, handles the application's syscalls. The Sentry is itself confined by a much narrower seccomp policy, and file access goes through a separate Gofer process that does not trust the Sentry. ptrace is only the default platform, and a KVM platform already existed.

## Key points
- Two layers (prattmic): the app talks to the gVisor kernel, and the gVisor kernel sits in a seccomp sandbox. "open" and its relatives are not allowed at all on the host side, because files go through the Gofer.
- Platforms: ptrace by default so it "works out of the box everywhere"; a KVM platform where "the Sentry acts as guest kernel and host VMM simultaneously". (Systrap became the default in 2023.)
- gVisor vs Kata (jsolson, Google): gVisor's resource footprint is "typically lower, often much lower than Kata". Syscall-heavy workloads vary more in performance under gVisor, because Kata needn't take exits.
- Why not just seccomp? (geofft): seccomp-BPF cannot follow pointers, so it cannot express rules like "you may open /etc/localtime but nothing else in /etc".
- Custom filesystems can be plugged in as Gofers speaking an extended 9P2000.L.
- Comparisons people reached for: User-Mode Linux, rump kernels, FreeBSD jails, Intel Clear Containers.

## Excerpts
> "While seccomp allows users to limit the attack surface on the kernel, the application is still directly interacting with it and any single bug in an allowed system call will allow compromise. One of the design principles of gVisor is that no single bug should allow compromise of the host system/user data." — prattmic (gVisor), https://news.ycombinator.com/item?id=16976392

> "Nothing wrong with a full VM, but I don't think it's a panacea (and you probably shouldn't guarantee security)." — amscanne (gVisor), https://news.ycombinator.com/item?id=16976478

> "There is a generic platform interface, and the repository also includes a KVM-based platform (wherein the Sentry acts as guest kernel and host VMM simultaneously) described in the README." — amscanne, https://news.ycombinator.com/item?id=16977811

> "The big one is resource footprint -- gVisor will typically be lower, often much lower than Kata." — jsolson (Google), https://news.ycombinator.com/item?id=16979344

> "We've reached a stage where we probably need better vocabulary for describing these tradeoffs :)" — jsolson, https://news.ycombinator.com/item?id=16979344

> "seccomp-bpf doesn't let you follow pointers, so you can't even implement most pledge() restrictions in it." — geofft, https://news.ycombinator.com/item?id=16976573

## Relevance to the talk
This thread sets out the "application kernel" option between a container and a microVM. The defence-in-layers argument ("no single bug") is the same one later used for agent sandboxes that put gVisor inside a VM. Pairs with `../../virtualization/gvisor-announcement-2018.md`.
