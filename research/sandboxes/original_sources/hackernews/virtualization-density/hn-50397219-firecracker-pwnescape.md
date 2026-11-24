---
title: "Firecracker VM Escape: PwnEscape Part 2"
url: https://news.ycombinator.com/item?id=50397219
story_url: https://pwn.ai/blog/firecracker-escape
authors: HN discussion (submitted by SerCe) of PwnAI's write-up (Paulos Yibelo)
date: 2026-11-06
accessed: 2026-11-22
kind: discussion
points: 290
comments: 145
---

## Summary
A write-up of exploiting the "PwnEscape" host-kernel bug from inside a Firecracker guest. tptacek calls it "the first general-purpose Firecracker escape that doesn't depend on nested virtualization in recent memory". The bug is in the host's virtio-net checksum-offload path, so it is a KVM/host-kernel bug reachable through Firecracker's device model, not a Rust VMM bug. The PoC ran without the jailer. Much of the thread debates how much the jailer, a seccomp sandbox, still buys. The thread also covers formally verified microhypervisors (NOVA, seL4/L4) vs "drastic attack surface reduction", and hardware vs software isolation.

## Key points
- Mechanism (tptacek): virtio-net passes checksum-offload metadata from guest to host. A missing sanity check lets the guest tell the host to overwrite the IPv4 header-length field instead of the checksum, mid-processing, so "the kernel code is forced to work with two different ideas of how long the IPv4 header is".
- Exposure: "Pretty much everyone seems to have been exposed with PwnEscape, because everyone using Firecracker is also using virtio-net." More than one cloud provider "panic-bounced their fleet". The bug was found by Paulos Yibelo, formerly on AWS security for 4 years.
- Jailer: "The jailer is just a seccomp sandbox." If the exploit gets code execution in the Firecracker process, a second LPE is needed. If it gets code execution in the host kernel, the jailer is irrelevant.
- Responsibility: "KVM is a dependency for Firecracker, just like brotli is a dependency for Node" (tptacek, against "it's a KVM bug, not Firecracker").
- Formal verification: some commenters argue for NOVA/seL4-style microhypervisors. tptacek: "the real win is just drastic attack surface reduction", and seL4's verified configuration "doesn't actually do much".
- KVM escapes "have been extremely rare to date, because KVM is itself a relatively simple piece of code, but everything's up for grabs now". Elsewhere in the thread he notes that AI "lets us be more ambitious with verification".
- Defence in depth from others: running microVMs inside a jailed illumos zone (nwilkens).

## Excerpts
> "Because Linux networking people are obsessed with checksum performance, virtio-net plumbs checksum offload metadata through the host/guest driver interface. Guests can thus deliver the host packets along with instructions on what to checksum." — tptacek, https://news.ycombinator.com/item?id=50398342

> "It's a drastically worse place than you would have been last year, when there wasn't a known plausible way to get even that far. This is a really good bug and nobody should downplay it." — tptacek, https://news.ycombinator.com/item?id=50400855

> "The jailer is just a seccomp sandbox. It's not a novel defense system." — tptacek, https://news.ycombinator.com/item?id=50405985

> "They've been extremely rare to date, because KVM is itself a relatively simple piece of code, but everything's up for grabs now." — tptacek, https://news.ycombinator.com/item?id=50407022

> "I am more convinced by the day that the Nova Microhypervisor approach is correct." — lrvick, https://news.ycombinator.com/item?id=50397540

> "Right now, we put a huge amount of stock in "hardware isolation". If that starts falling to agents to any substantial degree, I wonder whether we might end up leaning more on patchable software isolation" — clhodapp, https://news.ycombinator.com/item?id=50398382

## Relevance to the talk
The current counter-example to "microVMs are safe". The weak point was a shared host device path (virtio-net offload), not the VMM. Even with a minimal VMM, the host kernel's paravirtual device code is attack surface. Good for a "defence in depth still matters" slide. Pairs with `../../virtualization/firecracker-specification.md` (jailer).
