---
title: "The Security Implications Of Google Native Client"
url: https://news.ycombinator.com/item?id=610511
story_url: http://www.matasano.com/log/1674/the-security-implications-of-google-native-client/
authors: HN discussion (submitted by ilitirit) of a Matasano Security blog post (tptacek's firm)
date: 2009-05-15
accessed: 2026-11-22
kind: discussion
points: 110
comments: 23
---

## Summary
A 2009 thread on Matasano's review of Google Native Client, with Thomas Ptacek explaining how NaCl works. NaCl is "a sandbox implemented with a verifier". Code is compiled with a special toolchain. Instructions such as INT, SYSCALL and far calls are banned. Programs reach the outside world only through trampolines into a trusted runtime loaded in the first 64 KB. He compares that trusted runtime to the JVM applet sandbox, and says it is where researchers will look first.

## Key points
- NaCl's model per tptacek: binaries built by Google's GCC toolchain (base address 0, text at 0x10000). A "secure ELF loader" fills the first 64k with the trusted code base, which is not verified because Google wrote it.
- No native system calls: "NaCl programs are restricted by the verifier so that they can only run a set of virtual system calls defined by Google", which amounts to its own cross-platform OS interface.
- Banned: INT, SYSCALL, FAR CALL, and segment-override prefixes. A segment-override issue was the "epic fail" Mark Dowd found in Google's NaCl security contest.
- Positioning: "NaCl has as much in common with software virtualization as it does with Java-style bytecode verifiers."
- The trusted runtime has the same weakness as the JVM applet sandbox: a block of trusted code that must be bug-free.
- tptacek in 2009: browsers "would definitely be safer if operating systems had real isolation features".

## Excerpts
> "It's a sandbox implemented with a verifier." — tptacek, https://news.ycombinator.com/item?id=610859

> "NaCl sandboxed code does not use native system calls. If it did, running a NaCl program would be just as bad as running an ActiveX control." — tptacek, https://news.ycombinator.com/item?id=610816

> "In both cases, you have a wad of code that is trusted by the system and needs to be bug free, and in both cases that's the first place a security researcher is going to look for flaws once the system is mature." — tptacek, https://news.ycombinator.com/item?id=610853

> "NaCl has as much in common with software virtualization as it does with Java-style bytecode verifiers." — tptacek, https://news.ycombinator.com/item?id=610783

## Relevance to the talk
The original HN description of SFI-with-a-verifier. It runs NaCl (2009) → PNaCl → Wasm (see "Goodbye PNaCl, Hello WebAssembly", https://news.ycombinator.com/item?id=14448404, 655 points) → RLBox → LFI. The "trusted runtime is the attack surface" point applies to every LFI/Wasm runtime. Pairs with `../../history/` (NaCl) and `../../density/lfi-asplos24.md`.
