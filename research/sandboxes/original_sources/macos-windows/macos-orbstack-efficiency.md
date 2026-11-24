---
title: "Efficiency · OrbStack Docs"
url: https://docs.orbstack.dev/efficiency
authors: Orbital Labs, LLC
date: undated docs page (footer © 2024)
accessed: 2026-11-22
kind: docs
---

## Summary
OrbStack's claims about resource use: about 0.1% CPU when idle, memory allocated on demand, and unused
memory returned to macOS automatically. It contrasts this with the fixed allocation of a typical VM.
The product page (https://orbstack.dev/) adds under 0.1% background CPU on Apple silicon and under 10 MB
of disk out of the box.

## Key points
- Idle CPU is about 0.1%, often 0%.
- Memory is allocated on demand and freed memory is returned to macOS. This is the opposite of Apple
  `container`'s documented behaviour.
- "Dozens of machines" without strain. No numeric memory figures are published on this page.

## Excerpts
> "OrbStack uses around 0.1% CPU when idle, often dropping to 0%." — Efficiency

> "OrbStack allocates memory on-demand, so usage starts low and grows as needed." — Efficiency

## Relevance to the talk
Explains why the shared VM wins on density beyond raw kernel sharing. One VM with dynamic memory
reclaim means idle agents cost almost nothing. A VM per agent on Virtualization.framework currently
keeps its high-water mark.
