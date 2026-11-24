---
title: "Exploiting the DRAM rowhammer bug to gain kernel privileges"
url: https://googleprojectzero.blogspot.com/2015/03/exploiting-dram-rowhammer-bug-to-gain.html
authors: Mark Seaborn ("sandbox builder and breaker"), with Thomas Dullien (Google Project Zero)
date: 2015-03-09
accessed: 2026-11-22
kind: blog
---

## Summary
Rowhammer: reading one DRAM row over and over can flip bits in neighbouring rows. Seaborn and Dullien turned this into two exploits. One is a Linux privilege escalation that flips bits in page table entries (PTEs) until the process gets write access to its own page table, and so to all of physical memory. The other, which matters for this talk, is a **Native Client (NaCl) sandbox escape**. NaCl validates x86 code before running it, so the sandbox's safety rests on the code staying what was validated. The exploit fills 250 MB of NaCl's dynamic code area with validated indirect-jump sequences (`andl $~31,%eax; addq %r15,%rax; jmp *%rax`) and hammers it with `CLFLUSH`. Because the sandboxed program can read its own code, it then **searches for a useful bit flip**: for example, `jmp *%rax` becoming `jmp *%rcx`, which jumps to an unaligned address where a `SYSCALL` (`0f 05`) is **hidden inside the immediate of a validated `movabs`**. It can exploit about 13% of possible flips. NaCl's fix was to forbid `CLFLUSH` in the validator (CVE-2015-0565).

## Key points
- Seaborn worked on NaCl and had "written proof-of-concept NaCl sandbox escapes before". This was the builder breaking his own sandbox.
- The core lesson: software-fault-isolation sandboxes **assume the hardware is correct**. Rowhammer breaks the assumption that memory changes only when written.
- The same lesson recurs with Spectre for in-process and Wasm sandboxes (already in the corpus at `virtualization/spectre-attacks.md`).

## Excerpts
> "NaCl assumes that the hardware behaves correctly. It assumes that memory locations don’t change without being written to!" (NaCl sandbox escape)

> "A bit flip in validated code can turn a safe instruction sequence into an unsafe one." (same)

> "I picked NaCl as the first exploit target because I work on NaCl and have written proof-of-concept NaCl sandbox escapes before." (same)

## Relevance to the talk
This is the perfect bridge from language and SFI sandboxes (NaCl, Wasm) to "the hardware answers too". Hook: *"The sandbox validated every instruction — then a bit flipped in RAM and `jmp *%rax` became `jmp *%rcx`."* It fits the Wasm and in-process section's limits slide and the argument for hardware-backed boundaries (separate address spaces or VMs) for hostile code.
