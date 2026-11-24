---
title: "Capsicum: practical capabilities for UNIX"
url: https://www.usenix.org/conference/usenixsecurity10/capsicum-practical-capabilities-unix
authors: Robert N. M. Watson, Jonathan Anderson (University of Cambridge); Ben Laurie, Kris Kennaway (Google UK Ltd.)
date: 2010-08 (19th USENIX Security Symposium, Washington, DC)
accessed: 2026-11-22
kind: paper
---

## Summary
Capsicum adds a hybrid object-capability model to UNIX: `cap_enter()` puts a process into *capability
mode*, where all global namespaces (filesystem paths, PIDs, sockets by address…) vanish and the process can
only act through file descriptors it already holds, each carrying a rights mask. Rather than replacing
UNIX, it extends it so existing programs can be compartmentalised incrementally. The paper ports tcpdump,
gzip and Chromium, and compares Chromium's six platform sandboxes.

## Key points
- PDF: https://www.usenix.org/legacy/events/sec10/tech/full_papers/Watson.pdf
- Capability mode is a credential flag set by `cap_enter`, inherited by descendants, cannot be cleared.
- Paths are only usable relative to held directory descriptors (`openat` family), constrained against `..` escapes.
- tcpdump sandboxed with a two-line change (Figure 6); Chromium with ~100 lines.
- Figure 12 — lines of code for Chromium's sandboxes: Windows ACLs/SIDs 22,350; Linux chroot (setuid helper) 605;
  Mac OS X Seatbelt 560; Linux SELinux 200; Linux seccomp + userspace syscall wrapper 11,301; FreeBSD Capsicum 100.
- Shipped in FreeBSD 9.0 (capsicum(4) HISTORY: "Capsicum first appeared in FreeBSD 9.0"); FreeBSD 9.0 released January 2012.

## Excerpts
> "Capsicum is a lightweight operating system capability and sandbox framework planned for inclusion in FreeBSD 9." — Abstract

> "Capabilities are unforgeable tokens of authority, and have long been the province of research operating systems such as PSOS and EROS." — §1

> "Chromium can have OS-supported sandboxing in just 100 lines." — §1

## Qualifications from Hacker News
An OpenBSD developer says on HN (2026) that the Capsicum port of Chromium was never committed to FreeBSD ports, so the paper's 100-line figure describes a research port, not shipped software (<https://news.ycombinator.com/item?id=47314165>). Unverified.

## Relevance to the talk
The principled alternative to "filter the syscalls": remove ambient authority entirely and pass
capabilities. Figure 12's 11,301 vs 100 lines is a strong slide on why primitives' ergonomics matter.
Same philosophy as WASI's capability-based design (see virtualization/).
