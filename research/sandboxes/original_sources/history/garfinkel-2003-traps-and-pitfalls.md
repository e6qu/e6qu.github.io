---
title: "Traps and Pitfalls: Practical Problems in System Call Interposition Based Security Tools"
url: https://www.ndss-symposium.org/ndss2003/traps-and-pitfalls-practical-problems-system-call-interposition-based-security-tools/
authors: Tal Garfinkel (Stanford University)
date: 2003-02 (Network and Distributed System Security Symposium, NDSS 2003, San Diego, 6–7 Feb. 2003)
accessed: 2026-11-22
kind: paper
---

Full text read from the NDSS-hosted PDF
<https://www.ndss-symposium.org/wp-content/uploads/2017/09/Traps-and-Pitfalls-Practical-Problems-in-System-Call-Interposition-Based-Security-Tools-Tal-Garfinkel.pdf>.
Exact conference days are from NDSS listings, not the PDF.

## Summary
A post-mortem from several design iterations of Janus (by then a Linux
loadable kernel module, `mod_janus`, plus a user-level policy engine).
Garfinkel catalogues the ways a syscall-interposition sandbox gets
circumvented: incorrectly replicating OS state and semantics, overlooking
indirect paths to resources, race conditions between the monitor's check and
the kernel's use, incorrectly subsetting a complex API, and side effects of
denying calls. It is the canonical citation for why "just filter syscalls in
user space" is harder than it looks.

## Key points
- Pitfall classes: incorrectly mirroring OS state (e.g. fd tracking through
  dup2/fcntl); incorrectly mirroring OS code (path resolution); indirect
  paths (e.g. reaching files via Unix sockets, /proc, core dumps);
  race conditions; incorrectly subsetting the interface; side effects of
  denial.
- Race conditions = TOCTTOU between Janus's check and the kernel's action:
  symbolic link races, relative path races (cwd or directory moved),
  argument races (another thread rewrites the path in memory after the
  check), file-descriptor races.
- `ptrace` judged inadequate for security (per Wagner); Solaris `/proc` better
  but still imperfect.
- Trend noted: first-generation pure user-level sandboxes (Janus prototype,
  MapBox, Consh) → second generation "hybrid" (Janus, Systrace) using a small
  kernel component (<2K lines of C for mod_janus).
- Multi-threaded applications: no user-level interposition tool known to
  handle them securely.

## Excerpts
> "This approach brings with it a host of pitfalls for the unwary implementer
> that if overlooked can allow his tool to be easily circumvented." (Abstract)

> "Be aware of race conditions that can occur between the OS and monitor."
> (Sec. 5.5, Lessons for the Implementer)

> "The security of system call interposition-based tools often rely on a
> complex set of assumptions that rarely make it beyond the mind of the
> implementer." (Sec. 5.5)

## Relevance to the talk
The turning point that pushed sandboxing *into* the kernel: seccomp-BPF
deliberately does not dereference pointer arguments, Landlock and LSMs check
at the kernel's point of use, and gVisor re-implements the kernel rather than
mirroring it. Any agent sandbox that wraps a process with a user-level
policy checker inherits these exact pitfalls.
