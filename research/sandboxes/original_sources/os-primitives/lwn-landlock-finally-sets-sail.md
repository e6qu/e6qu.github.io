---
title: Landlock (finally) sets sail
url: https://lwn.net/Articles/859908/
authors: Jonathan Corbet (LWN.net)
date: 2021-06-17
accessed: 2026-11-22
kind: blog
---

## Summary
LWN's account of Landlock's merge for Linux 5.13 after more than five years and 34 versions of the patch
set. The original design was built on eBPF programs attached to LSM hooks; version 14 (February 2020)
dropped BPF for a simpler declarative rule-set API (`landlock_create_ruleset`, `landlock_add_rule`,
`landlock_restrict_self`).

## Key points
- Merged for Linux 5.13 (released 2021-06-27).
- >5 years, 34 revisions; LWN had covered v3 in 2016.
- v14 (Feb 2020) removed BPF in favour of a fixed rule-definition mechanism — goals uncontroversial,
  implementation hard.
- Author of Landlock: Mickaël Salaün.

## Excerpts
> "The goals behind Landlock have never been particularly controversial, but the implementation is a different story."

## Relevance to the talk
Same story arc as seccomp-bpf: years of rejected designs before an unprivileged sandboxing primitive
lands. Good for a "why did this take so long?" aside.
