---
title: "Launch HN: Freestyle – Sandboxes for Coding Agents"
url: https://news.ycombinator.com/item?id=47663147
story_url: https://www.freestyle.sh/
points: 322
comments: 150
authors: HN thread (posted by benswerd, Freestyle co-founder)
date: 2026-04-06
accessed: 2026-11-22
kind: discussion
---

## Summary
Freestyle launched full-Linux, hardware-virtualised VMs for coding agents. Its headline feature is forking a *running* VM, memory included, via copy-on-write, so fork time is independent of machine size. The founder's replies give a frank competitive map of the hosted-sandbox market: Daytona on Sysbox ("VM-like" but problematic for low-level work), Modal as the only one with GPUs, Fly.io Sprites as the closest (hardware virtualisation, checkpoints, a better network stack, but "bare bones"). He also lists what a self-hoster would use: Sysbox, gVisor, bubblewrap, Firecracker. Sceptics called sandboxing a saturated, "pointless" market with "multiple sandbox for agents products a week".

## Key points
- Memory-level CoW forking. Snapshots cause a 2–4 s IO pause, which they wanted to avoid. Auto-suspend preserves process state.
- Market map per founder: Daytona/Sysbox, Modal (GPU), Sprites (closest competitor), Freestyle (most "EC2-like").
- Competing claims in the thread: a VMM that forks and boots in under 20 ms (UnixShells); exe.dev at $20/month for hobbyist always-on VMs; a $2–5 Hetzner box for self-hosting.
- Sentiment: market saturation and fatigue among some HN readers.

## Excerpts
> "We're using copy on write with the memory itself. Fork time is completely decoupled from the size of the machine." — benswerd ([47663616](https://news.ycombinator.com/item?id=47663616))

> "Daytona runs on Sysbox which is VM-like but when you run low level things it has issues. Modal is the only provider with GPU support." — benswerd ([47663871](https://news.ycombinator.com/item?id=47663871))

> "Fly.io sprites is the most similar to us of the bunch. They do hardware virtualization as well, have comparable start times and are full Linux." — benswerd ([47664021](https://news.ycombinator.com/item?id=47664021))

> "I have so many interesting problems on Ai, sandboxing isn't one of them. It's a pointless excercise yet disproportionately so many people love to to do this." — siva7 ([47664335](https://news.ycombinator.com/item?id=47664335))

> "But like I see multiple sandbox for agents products a week. Way too saturated of a market" — iterateoften ([47664415](https://news.ycombinator.com/item?id=47664415))

## Relevance to the talk
The hosted-sandbox market in 2026 is microVMs plus fork, snapshot and suspend. Agents need "branch the whole machine" semantics that serverless never needed. The founder's comparison is a convenient one-slide market map; it is self-interested and should be checked against the vendor notes in agent-sandboxing/.
