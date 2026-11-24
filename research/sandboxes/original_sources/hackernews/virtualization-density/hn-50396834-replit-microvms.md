---
title: "Replit rebuilt its sandbox engine with microVMs"
url: https://news.ycombinator.com/item?id=50396834
story_url: https://frontier.replit.com/sandbox-engine-microvms-part-1/
authors: HN discussion (submitted by gaplong) of Replit's engineering post
date: 2026-11-06
accessed: 2026-11-22
kind: discussion
points: 99
comments: 40
---

## Summary
Replit described moving its agent and code sandboxes from containers to KVM microVMs with tinyconfig-based guest kernels. It was posted the same day as the PwnEscape write-up. tptacek gave the shortest summary of the industry's direction: neoclouds used Docker for workload isolation, "those have never been safe", and Replit has "worked out how to scale actual KVM isolation". He says gVisor and Firecracker/Cloud Hypervisor are "comparable" in practitioners' eyes. The real line is shared kernel vs guest kernel, not "hardware vs software".

## Key points
- Guest kernel from `tinyconfig`, leaving out Bluetooth, wireless, USB and display drivers (quoted from the post: "Your coding agent definitely doesn't need a Nintendo Switch controller").
- tptacek on gVisor vs microVMs: "comparable". "You generally do Firecracker if you can get away with it, because it's simpler and faster, but to do it well you generally need bare-metal hosts."
- Framing: "I think "hardware" vs. "software" is the wrong way to frame this. The big difference is between shared-kernel multitenant and guest kernels." gVisor is "like an 80% solution; a partially emulated guest kernel".
- Hardware virtualization "has held up for almost 2 decades now".
- Nesting: Firecracker doesn't strictly need bare metal, but "you take a security hit for nesting".
- Buyer's test: ask a provider whether your workload might share a kernel with untrusted tenants. If yes, disqualify it.
- schainks reads it as reinventing Erlang/OTP supervision with the isolation boundary pushed down to ring -1.

## Excerpts
> "I think "hardware" vs. "software" is the wrong way to frame this. The big difference is between shared-kernel multitenant and guest kernels." — tptacek, https://news.ycombinator.com/item?id=50398546

> "I think the verdict is in on shared-kernel vs. not: don't share kernels between tenants." — tptacek, https://news.ycombinator.com/item?id=50398546

> "The hardware isolation itself --- AMD-V, VT-X, &c --- has held up for almost 2 decades now." — tptacek, https://news.ycombinator.com/item?id=50398546

> "The simple story is: like most neocloud providers, they were using Docker and/or Linux containers as a workload isolation primitive, those have never been safe, and they've now worked out how to scale actual KVM isolation to their users." — tptacek, https://news.ycombinator.com/item?id=50400777

> "Our guest kernel starts from tinyconfig, not a standard distribution configuration." — peter_d_sherman quoting the post, https://news.ycombinator.com/item?id=50421724

## Relevance to the talk
The most recent and most explicit statement of the consensus: for multi-tenant agent sandboxes, don't share kernels. The "shared kernel vs guest kernel" split is a better axis for the talk than "hardware vs software".
