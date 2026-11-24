---
title: "Apple Silicon and Virtual Machines: Beating the 2 VM Limit (2023)"
url: https://news.ycombinator.com/item?id=47733971
story_url: https://khronokernel.com/macos/2023/08/08/AS-VM.html
points: 236
comments: 177
authors: submitted by krackers; article by Mykola Grymalyuk (khronokernel); HN commenters
date: 2026-04-11
accessed: 2026-11-22
kind: discussion
---

## Summary
A 2023 article on how the macOS kernel enforces the licence's two-concurrent-macOS-guests limit on Apple
Silicon (and how to patch it with SIP off), re-discussed in 2026. Commenters describe what the limit does to
CI farms (racks of Mac minis at two VMs each) and argue about Apple's motive. Related: "How fast is a macOS VM,
and how small could it be?" (280 points, https://news.ycombinator.com/item?id=47984852), which measured a macOS
guest at ~5 GB in use with 8 GB allocated.

## Key points
- The limit applies to macOS guests only; Linux guests are unlimited.
- GitHub-Actions-style providers "rack thousands of Mac Minis and run 2 VMs on each" (claim in thread).
- Proposed fixes: tiered limits by hardware, or paid licences for more VMs.
- Consensus on motive: protecting hardware sales ("It's called 'another Mac'").

## Excerpts
> "Imagine buying a mac studio with 500+ GB of memory and being limited to 2 vms."
— moondev, https://news.ycombinator.com/item?id=47734844

> "I was building a MacOS GitHub Actions farm, or rather, looking into it. I had written most of the code but my inertia screeched to a halt when I discovered the two VM limit for MacOS VMs."
— naikrovek, https://news.ycombinator.com/item?id=47735392

> "Currently services like Github Actions painfully and inefficiently rack thousands of Mac Minis and run 2 VMs on each to stay within the limits."
— mysteria, https://news.ycombinator.com/item?id=47735292

> "You realise you can run VMs for any other os right? It's a limit on running macOS not a limit on running VMs."
— stephenr, https://news.ycombinator.com/item?id=47740049

> "Yes they do. It's called \"another Mac\"."
— jonnrb, https://news.ycombinator.com/item?id=47735580

## Relevance to the talk
The hard ceiling on macOS-native isolation via VMs: at most two macOS guests per Mac. For agents that need
Xcode or macOS APIs, VM-per-agent cannot scale, so process-level confinement (Seatbelt) is the only route to
density.
