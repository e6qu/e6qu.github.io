---
title: "The Apple Sandbox"
url: https://media.blackhat.com/bh-dc-11/Blazakis/BlackHat_DC_2011_Blazakis_Apple%20Sandbox-Slides.pdf
authors: Dionysus Blazakis (Independent Security Evaluators)
date: Paper dated 2011-01-11; presented at Black Hat DC 2011 on 2011-01-19 (paper mirror https://www.exploit-db.com/papers/16031, posted 2011-01-23)
accessed: 2026-11-22
kind: paper
---

## Summary
This is the first public reverse-engineering of the Mac OS X sandbox, code-named "Seatbelt". It traces
the full path:
- **Userspace:** policy is written in SBPL, a Scheme-embedded DSL interpreted by a TinyScheme fork inside
  `libsandbox.dylib`, then compiled to a binary format.
- **Kernel:** the compiled profile is handed to `Sandbox.kext`, which is a policy module for the
  TrustedBSD MAC framework and uses `AppleMatch.kext` for regex matching.

The paper documents the undocumented syscalls and the profile binary format.

## Key points
- Seatbelt is a TrustedBSD MAC policy module. It adds per-process policy that userspace can configure,
  on top of MAC's syscall hooks.
- Components: `libSystem` (`sandbox_init`), `libsandbox` (TinyScheme 1.38-based SBPL compiler),
  `Sandbox.kext`, `AppleMatch.kext` (regex engine), and `sandboxd` (logging).
- There is no Scheme interpreter in the kernel. Profiles are compiled in userspace to a decision tree of
  operations, filters and regexes.
- The author found the public API thin and undocumented. Apple's own daemon profiles (for example
  `mdworker.sb`) were the best reference.
- Code and tools: github.com/dionthegod/XNUSandbox.

## Excerpts
> "The Sandbox framework, previously codenamed 'Seatbelt', provides fine-grained access control via Scheme policy definitions." — §1

> "The Sandbox is implemented as a policy module for the TrustedBSD mandatory access control (MAC) framework." — §1

> "a Scheme interpreter is not embedded in the kernel" — §4

## Relevance to the talk
This is the canonical primary source for what Seatbelt is mechanically. It explains why SBPL feels
like Lisp and why the mechanism is per-process access control on a shared kernel rather than a
namespace or container. Use it to anchor the history (TrustedBSD, then Leopard, then the App Sandbox)
and to explain why it has always been underdocumented.
