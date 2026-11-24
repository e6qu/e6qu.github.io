---
title: "The Confused Deputy (or why capabilities might have been invented)"
url: https://dl.acm.org/doi/10.1145/54289.871709
authors: Norm Hardy (Key Logic)
date: 1988-10 (ACM SIGOPS Operating Systems Review 22(4), Oct. 1988, pp. 36–38)
accessed: 2026-11-22
kind: paper
---

Full text read from <https://pdos.csail.mit.edu/6.1810/2004/readings/hardy88confused.pdf>.
The issue date is from the ACM bibliographic record; the PDF itself does not
print it.

## Summary
A three-page story from Tymshare, about eleven years before publication. A
compiler in directory SYSX was given "home files license" so it could write
its statistics file. A user named the billing file (SYSX)BILL as the
compiler's debug-output file, and the OS let the compiler overwrite it. The
compiler was a *deputy* serving two masters — the user and its own install
directory — with no way to say whose authority applied to which file.
Hardy argues that only capabilities, which bundle designation with
authority, fix this cleanly.

## Key points
- Ambient authority (permission attached to the program, not to the request)
  is the root cause.
- Name-checking fixes (scan for "SYSX", block "BILL") are rejected as
  unmaintainable.
- Capabilities fix it: the user passes a capability for the output file, so
  the compiler can only write what the caller could.
- Hardy says this incident is what convinced him capabilities were
  *necessary*, not merely tidy.

## Excerpts
> "The billing information was lost." (story)

> "Before this happened I had heard of capabilities and thought that they were
> neat and tidy, but was not yet convinced that they were necessary. This
> occasion convinced me that they were necessary." (opening)

## Relevance to the talk
The confused deputy is *the* threat model for tool-using AI agents: an agent
holding the developer's credentials and filesystem access acts on
instructions from untrusted input (prompt injection) and misdirects its
authority. A strong slide: 1977-era billing file ≈ 2025-era `~/.ssh` or
`.env`.
