---
title: "Docker Sandboxes – Disposable, isolated sandboxes for AI agents"
url: https://news.ycombinator.com/item?id=49239751
story_url: https://www.docker.com/products/docker-sandboxes/
points: 694
comments: 396
authors: HN thread (submitted by etoxin); product page by Docker
date: 2026-08-10
accessed: 2026-11-22
kind: discussion
---

## Summary
This is the main HN thread on Docker Sandboxes (`sbx`). The product gives each agent session a microVM containing the user's dev environment, with network controls and credential injection. A Docker engineer corrected commenters: it is "not containers". Each session is a microVM with its own kernel on the platform hypervisor (Hypervisor.framework, WHP, KVM), running a new VMM written by Docker rather than Firecracker. The rest of the thread splits between people who want an open, login-free tool (Apple `container`, smolvm, microsandbox, sandboxy, Incus) and debate about what microVMs actually buy, including the per-VM memory cost.

## Key points
- Architecture as stated by Docker staff: microVM per session, own kernel, native hypervisor on each OS, in-house VMM.
- Objections: sign-up required for a local tool, proprietary, risk of a rug-pull. Alternatives named: Apple `container`, smolvm (network filtering plus secret placeholders), microsandbox, Incus, a QEMU/KVM VM per project with nftables blocking host and LAN.
- Density: a full Ubuntu VM costs at least 512 MB idle, so 10 sandboxes cost about 5 GB. One commenter uses one VM with Incus LXC containers inside at about 50 MB each.
- Several commenters said vendors should have shipped isolation as a prerequisite from the start.

## Excerpts
> "One correction: this isn't containers. Each session is a microVM with its own kernel on the platform's native hypervisor: Hypervisor.framework, WHP, KVM. We wrote a new VMM (not Firecracker) to make it more effective across platforms." — srini-docker ([49245030](https://news.ycombinator.com/item?id=49245030))

> "If any AI company was doing serious engineering isolated containers would have been a prerequisite to using their tools." — reddozen ([49240077](https://news.ycombinator.com/item?id=49240077))

> "Anyone serious about security will want to bring their own sandbox anyway, not trust these, often proprietary, agents. I've never run an agent outside a sandbox." — globular-toast ([49240562](https://news.ycombinator.com/item?id=49240562))

> "An Ubuntu Server VM, like the ones started by Incus, use at least 512 MB of RAM per instance. If you spawn 10 sandbox VMs, you already pay 5 GB RAM just to sit there idle." — dist-epoch ([49241170](https://news.ycombinator.com/item?id=49241170))

> "There is no reason to require a login for creating local mini sandboxes." — dannyw ([49240358](https://news.ycombinator.com/item?id=49240358))

> "Network control and secret injection together with a microVM setup is as good as it gets right now, although I believe that we need more fine-grained tools down the road." — jachris ([49240947](https://news.ycombinator.com/item?id=49240947))

## Relevance to the talk
A container company shipping VMs for agents is the cleanest sign of where the industry settled: hardware virtualisation, an egress proxy and credential injection. The memory arithmetic in the thread leads into the density section.
