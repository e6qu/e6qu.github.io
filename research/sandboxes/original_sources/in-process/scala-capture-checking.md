---
title: "Capturing Types" (TOPLAS 2023), with the Scala 3 reference "Tracked Capabilities Overview" / "Separation Checking", and the follow-ups "Scoped Capabilities for Polymorphic Effects" (arXiv 2207.03402) and "What's in the Box" (arXiv 2509.07609)
url: https://doi.org/10.1145/3618003
authors: Aleksander Boruch-Gruszecki, Martin Odersky (EPFL), Edward Lee, Ondřej Lhoták (Waterloo), Jonathan Immanuel Brachthäuser (Tübingen); follow-up by Yichen Xu, Oliver Bračevac, Cao Nguyen Pham, Martin Odersky
date: arXiv 2207.03402 2022-07-07; TOPLAS 45(4), article 21, Nov 2023 (presented at POPL 2024); "What's in the Box" 2025-09-09; reference pages as of Scala 3.10.1 docs
accessed: 2026-11-22
kind: paper
---

## Summary
Capture checking is the type-system feature underneath Safe Scala and TACIT. A type `A^{c}` records which capabilities (`c`) a value can reach. `A -> B` is a pure function, and `A => B` (shorthand for `A ->{any} B`) may capture anything. Effects are modelled as capabilities: if code holds no capability for an effect, it cannot perform it, and the checker stops a scoped capability from escaping its scope (for example in a returned closure). The calculus (CC<:□, "box" types) comes from Odersky et al. 2022/TOPLAS 2023. "What's in the Box" (2025) makes it scale to generic collections and reports a reimplementation in Scala 3 plus a port of the standard collections library. Separation checking adds unique, un-aliased access for mutable/exclusive capabilities.

## Key points
- **Syntax** (reference overview): `A^{c}` means values of type A that can access capability `c`. `A^` is shorthand for `A^{any}`. Plain `A` is pure. Function types are `A ->{c} B`, `A -> B` (pure) and `A => B` (impure). Classes become capabilities by extending `Capability`, `SharedCapability`, `ExclusiveCapability` or `Mutable` from `caps`.
- **Scoped capabilities and escape checking.** The canonical example is a logger tied to a file that gets closed: returning a closure that uses the logger is rejected because its type would mention the logger. TACIT's `request*` blocks rely on exactly this (a capability "cannot escape its scoped block").
- **Mutation tracking.** Reads charge a read-only fractional capability `m.rd`, writes charge `m`, and writing methods are marked `update`. ATC uses this for its read-only mode: `write` needs `FileSystem^{any}`, but the agent is given `FileSystem^{io.rd}`, so the write is a compile error.
- **Separation checking** (`language.experimental.separationChecking`): it "enforces unique, un-aliased access to capabilities". It adds `consume` parameters (linear use) and `freeze`. The reference says it is "less mature than capture checking proper".
- **Status.** Both features are experimental. The overview calls capture checking fairly mature and expected to stabilise. TACIT's README warns that compiler behaviour "may change across Scala 3 nightly versions".
- **Lineage.** The TOPLAS abstract positions capturing types as a way to "safely implement effects and effect polymorphism via scoped capabilities". "What's in the Box" describes the result as unifying "static effect and resource tracking with object capabilities". In other words it is the E/Joe-E object-capability discipline, enforced by types rather than by the absence of ambient references at run time.
- **Prior Scala capability work** (from memory, not re-verified here): the experimental `CanThrow` capabilities for checked exceptions (Scala 3.1, 2021) sit on the same reference page tree ("CanThrow Capabilities").

## Excerpts
> "Type systems usually characterize the shape of values but not their free variables. However, many desirable safety properties could be guaranteed if one knew the free variables captured by values." (arXiv 2207.03402, abstract)

> "Capturing types in Scala unify static effect and resource tracking with object capabilities, enabling lightweight effect polymorphism with minimal notational overhead." (arXiv 2509.07609, abstract)

> "Separation checking is an extension of capture checking that enforces unique, un-aliased access to capabilities." (Scala reference, Separation Checking)

## Relevance to the talk
This is the theory behind the claim that "the type system is the sandbox". It explains why the in-process language-capability sub-type can promise more than an OS sandbox: a guarantee about a *value* (this closure is pure, so this secret cannot reach a socket) rather than only about a *process* (this process cannot open that socket). It also explains the cost: everything depends on a sound and complete effect discipline in an experimental type checker running on a JVM that shares one address space. For hardware limits on same-address-space confidentiality, see `../virtualization/spectre-is-here-to-stay-2019.md`.
