---
title: "Unfashionably secure: why we use isolated VMs"
url: https://news.ycombinator.com/item?id=41070870
story_url: https://blog.thinkst.com/2024/07/unfashionably-secure-why-we-use-isolated-vms.html
authors: HN discussion (submitted by mh_) of Thinkst's blog post
date: 2024-07-25
accessed: 2026-11-22
kind: discussion
points: 305
comments: 243
---

## Summary
Thinkst (Canary) explained why it gives each customer a separate VM rather than a shared container platform. The top comment (159 replies) celebrated VMs over the "Docker industrial complex" and hoped FreeBSD jails and Solaris zones were "pretty much as secure as a VM". tptacek corrected that firmly. Jails and zones share a kernel, most kernel LPEs are jail escapes, and syscall filtering can't catch LPEs in innocuous syscalls. He also explained why hardware-virtualised containers aren't everywhere: you need hosts that allow KVM, which on AWS means bare-metal instances. Early Docker engineers turned up in the replies to argue about Docker's origins.

## Key points
- Jails/Zones vs VMs: "materially less secure", because co-tenants share "a single kernel (not just the tiny slice of the kernel KVM manages)" (tptacek).
- Syscall filtering limits: LPEs "occur in innocuous system calls, too", so you cannot seccomp them away.
- Availability: running KVM-isolated containers needs "a platform that will allow KVM", which is "a small, expensive, tenuously available subset of AWS".
- History: "The cool kids have been combining containers and hardware virtualization for something like 10 years now (back to QEMU-Lite and kvmtool)".
- Modern gVisor uses KVM rather than ptrace (tptacek). Its default platform has since become systrap, see `../../virtualization/gvisor-platforms-docs.md`.
- Docker origin side-thread: compsciphd claims a 2010 USENIX ATC paper anticipated Docker. bombela (an early dotCloud engineer) says he named and prototyped Docker in Python 2 in 2012.

## Excerpts
> "Personally FreeBSD Jails / Solaris Zones are the thing I like to dream are pretty much as secure as a VM and a perfect fit for a sane dev and ops workflow" — PedroBatista, https://news.ycombinator.com/item?id=41071150

> "Jails/Zones are not pretty much as secure as a VM. They're materially less secure: they leave cotenant workloads sharing a single kernel (not just the tiny slice of the kernel KVM manages)." — tptacek, https://news.ycombinator.com/item?id=41072806

> "Most kernel LPEs are probably "Jail" escapes, and it's not feasible to filter them out with system call sandboxing, because LPEs occur in innocuous system calls, too." — tptacek, https://news.ycombinator.com/item?id=41072806

> "That's a small, expensive, tenuously available subset of AWS, which is by far the dominant compute platform." — tptacek, https://news.ycombinator.com/item?id=41072822

> "The cool kids have been combining containers and hardware virtualization for something like 10 years now (back to QEMU-Lite and kvmtool)." — tptacek, https://news.ycombinator.com/item?id=41072781

## Relevance to the talk
The clearest statement of "shared kernel = shared fate" from a security practitioner. It also explains the practical obstacle, nested virtualization or bare metal, that pushes hosted agent sandboxes to specialised providers. Note: AWS added nested virtualization support in Feb 2026 (https://news.ycombinator.com/item?id=46997133).
