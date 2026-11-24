---
title: "The SeL4 Microkernel: An Introduction [pdf]"
url: https://news.ycombinator.com/item?id=43452185
story_url: https://sel4.systems/About/seL4-whitepaper.pdf
authors: HN discussion of the seL4 Foundation white paper (Gernot Heiser); commenters include ryao, nickpsecurity, netbsdusers, bri3d, pjmlp; related comments from NormH (Norm Hardy) and kentonv (Kenton Varda)
date: 2025-03-23
accessed: 2026-11-22
kind: discussion
points: 264
comments: 188
---

Read via the HN Algolia items API. Related capability-system threads
used: [The KeyKOS Nanokernel Architecture (1992)](https://news.ycombinator.com/item?id=10524735)
(2015-11-07, 77 points), [Sel4: We're going open source](https://news.ycombinator.com/item?id=7938149)
(2014-06-24, 185 points), [How sandboxing works in Fuchsia](https://news.ycombinator.com/item?id=14583566)
(2017-06-18, 243 points). Our notes: [klein-2009-sel4](../../history/klein-2009-sel4.md),
[hardy-1985-keykos-architecture](../../history/hardy-1985-keykos-architecture.md).

## Summary
The most active recent HN thread on seL4. It rehearses the microkernel
debate (performance, Mach, NT and XNU) and argues about what the proof
covers. One commenter, ryao, points to a memory-corruption bug that was
present in the specification seL4 was verified against, fixed with a
change to both the code and the proof, and argues the proof is "not as
comprehensive as the wider community has been lead to believe". Others
answer that the claim was always relative to the specification and that
high assurance needs much more than a kernel proof. A side exchange
compares containers to microkernels and finds them opposite in spirit.

## Key points
- What the proof needs: the OS on top need not be verified for isolation to hold, but DMA must be off or contained by an IOMMU and drivers verified; the multicore kernel "is not yet verified" (nabla9, snvzz).
- ryao's challenge: seL4 PR 243 and l4v PR 453 fixed a bug "present in the specification against which seL4 was verified"; other memory bugs are in the issue tracker. This qualifies the "bug-free" framing in our klein-2009-sel4 note; we have not checked the PRs ourselves.
- nickpsecurity: high assurance was always "reduced complexity, precisely-specified behavior… proofs… exhaustive testing, leak analysis"; "Add one thing to the proven TCB and maybe your proof disappears."
- Containers vs. microkernels: "containers and Kubernetes are microkernels revenge" (pjmlp); "Not at all… Microkernels are about building interfaces which sandbox parts of the kernel. Namespaces are about giving sandboxed userlands full access to kernel interfaces." (bri3d)
- 2014 open-source thread: commenters doubted "the implementation is proved to be bug-free" given assumptions about assembly, boot code, caches and hardware.
- KeyKOS thread (2015): Norm Hardy appears ("I wrote many of the Keykos papers") and asks whether Sandstorm can do KeyKOS-style confinement.
- Fuchsia (2017): naasking notes `mx_time_get()` needs no handle, so the clock cannot be sandboxed or virtualised — "any operation you can perform without a handle tends to be subject to DoS".

## Excerpts
> "Being "formally proven" to be free of various flaws did not make seL4 immune to memory corruption flaws." — ryao, <https://news.ycombinator.com/item?id=43454498>

> "This issue was present in the specification against which seL4 was verified." — ryao, <https://news.ycombinator.com/item?id=43456750>

> "Add one thing to the proven TCB and maybe your proof disappears." — nickpsecurity, <https://news.ycombinator.com/item?id=43456958>

> "Microkernels are about building interfaces which sandbox parts of the kernel. Namespaces are about giving sandboxed userlands full access to kernel interfaces." — bri3d, <https://news.ycombinator.com/item?id=43453778>

> "I wrote many of the Keykos papers and can answer most questions you might have." — NormH (2015), <https://news.ycombinator.com/item?id=10549105>

> "1980s-1990s: People incorrectly redefine capabilities in various ways (e.g. as verbs rather than nouns), then declare "capability-based security doesn't work" based on these misunderstandings" — kentonv (2015, Pony thread), <https://news.ycombinator.com/item?id=9484256>

## Relevance to the talk
Capability systems on HN are admired and rarely deployed. This thread
gives the best one-line contrast for the talk (microkernels shrink the
kernel interface; namespaces expose all of it) and a caution on how to
phrase seL4's proof on a slide: correct with respect to its
specification, not "bug-free".
