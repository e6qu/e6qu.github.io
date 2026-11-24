---
title: "Noah: Bash on Ubuntu on macOS"
url: https://news.ycombinator.com/item?id=18765184
story_url: https://github.com/linux-noah/noah
points: 159
comments: 48
authors: submitted by prabirshrestha; Noah (linux-noah project); HN commenters incl. saagarjha, justincormack, geofft
date: 2018-12-26
accessed: 2026-11-22
kind: discussion
---

## Summary
Noah runs unmodified Linux ELF binaries on macOS by using Hypervisor.framework only to trap system calls and
translating them to Darwin calls (no guest kernel), a "WSL1 for macOS". The thread asks whether this could
replace Docker for Mac's VM, notes missing bind mounts and ptrace, and sketches an in-kernel alternative
(Linux personalities / Solaris branded zones).

## Key points
- Hypervisor used only for memory mapping and syscall trapping, not to run a kernel.
- Could reduce memory vs a VM, but macOS lacks bind mounts, so container filesystem semantics are hard.
- `ptrace` unsupported, limiting debuggers.
- Alternative idea: tag processes as Linux/Darwin and dispatch syscalls in a kernel module (blocked by SIP).
- The project went dormant; it is the closest HN-visible ancestor of fwe's hypervisor backend.

## Excerpts
> "This project does use a hypervisor, but apparently only to set up memory mapping and trap the syscalls for translation."
— 0xcde4c3db, https://news.ycombinator.com/item?id=18767308

> "I wonder if this could be used to get Docker running on a Mac without painful file system performance (a la Docker for Mac, running Linux in a VM)."
— jbergknoff, https://news.ycombinator.com/item?id=18766772

> "The Mac is odd though in not having bind mounts so it is not going to be easy to fix the filesystem performance using this. Would use less memory though potentially."
— justincormack, https://news.ycombinator.com/item?id=18768540

> "Unfortunately ptrace isn't supported, or I'd ditch the VM entirely"
— saagarjha, https://news.ycombinator.com/item?id=18767030

> "I've been wondering if something like this could be done, but using actual syscalls - tagging processes as Linux or Darwin and dispatching syscalls differently, as with Linux personalities or (AIUI) Solaris branded zones"
— geofft, https://news.ycombinator.com/item?id=18767025

## Relevance to the talk
Direct prior art for fwe (Linux ABI on macOS via Hypervisor.framework without a guest kernel) and for the "less
memory than a VM" argument; also names the hard parts (bind mounts, ptrace).
