---
title: "Reflections on Trusting Trust"
url: https://dl.acm.org/doi/10.1145/358198.358210
authors: Ken Thompson (Bell Laboratories)
date: 1984-08 (Communications of the ACM 27(8), pp. 761–763; Turing Award lecture, delivered October 1983)
accessed: 2026-11-22
kind: paper
---

Read from a course-hosted scan of the CACM article (https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf). See also `2023-cox-running-trusting-trust-compiler.md` for the code and the deployment story.

## Summary
Thompson's three-page Turing lecture builds the most famous backdoor in computing in three steps. First a self-reproducing program (a quine). Then a compiler that "learns" a fact and keeps it only in its binary. Then a C compiler with two Trojan horses: one **miscompiles `login`** to accept a known password, and one **recognises the C compiler itself and re-inserts both Trojans**. Install the bugged binary, remove the bugs from the source, and every future compiler built from clean source stays backdoored, with "no trace in source anywhere". The moral: you cannot trust code you did not totally create yourself, and the lower the level (assembler, loader, microcode), the harder the bug is to find.

## Key points
- This is the original argument that **source review does not establish trust in a binary toolchain**. It is today's supply-chain problem, and the reason sandboxes exist at all: if you cannot verify, you contain.
- It extends naturally to sandboxes: the sandbox runtime, the VMM and the kernel are also "program-handling programs" you did not write.
- The joke is in the parenthesis: "(Especially code from companies that employ people like me.)"
- The second half is a period rant about the press glamorising the "414 gang" hackers.

## Excerpts
> "The moral is obvious. You can't trust code that you did not totally create yourself. (Especially code from companies that employ people like me.)" (Moral)

> "No amount of source-level verification or scrutiny will protect you from using untrusted code." (Moral)

> "A well-installed microcode bug will be almost impossible to detect." (Moral)

## Relevance to the talk
It belongs in the history section, or as the philosophical opener for "why sandbox at all". Hook: *"Ken Thompson could log in as anyone on any Unix built with his compiler — and the source was clean."* It fits the supply-chain framing for coding agents (agents install packages, run build scripts and choose dependencies), where containment replaces impossible verification.
