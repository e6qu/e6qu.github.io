---
title: "MXC - a sandboxed code execution system"
url: https://news.ycombinator.com/item?id=50016489
story_url: https://github.com/microsoft/mxc
points: 196
comments: 85
authors: HN thread (submitted by nreece); repository by Microsoft
date: 2026-10-09
accessed: 2026-11-22
kind: discussion
---

## Summary
Microsoft's open-source MXC (MIT) is a cross-platform layer for "what may this workload touch?" policy aimed at agents. Commenters describe it as a front end/SDK over bubblewrap (Linux), Seatbelt (macOS) and a Windows process container, with a "learning" mode that discovers the permissions a runtime needs. Codex later used MXC on Windows (see agent-sandboxing/openai-inside-the-codex-sandbox.md). On HN the reception was mixed: "pretty decent" and useful because hand-rolling these sandboxes "is a really bad idea", against complaints about about 350k SLOC, upstream sandboxes not vendored, and "why is everyone building their own agent runtime" instead of agreeing on a common policy model "like unix did".

## Key points
- Positioning per commenters: one policy, three OS backends. Enterprise IT could push company-wide policy across platforms.
- Learning mode, MIT licence, optional telemetry clearly disclosed.
- Criticism: size of the codebase, and fragmentation (OpenShell, nono, srt, MXC…) with no shared policy language.
- Counter-argument for WebAssembly: OS-level sandboxes shrink your addressable market because every OS differs.

## Excerpts
> "Sure, you could consider it a frontend/SDK for bubblewrap/seatbelt/processcontainer; but setting em up consistently is far from trivial; and hand rolling is a really bad idea (speaking from experience)." — dannyw ([50017836](https://news.ycombinator.com/item?id=50017836))

> "Why is everyone making their own code execution agent runtime engines… why not first come up with a sandboxing policy design, like unix did, and then build on top of that." — minraws ([50017731](https://news.ycombinator.com/item?id=50017731))

> "Everyone has been building a harness/sandbox the last 6 months. Ive seen dozens and dozens shared in discords." — lifeisloving ([50018607](https://news.ycombinator.com/item?id=50018607))

> "350,000 of mostly Rust SLOC… And the upstream sandboxes aren't even vendored! I'd be way more confident building upon something I can grasp and understand." — kernc ([50018330](https://news.ycombinator.com/item?id=50018330))

> "The problem with OS level sandboxes, and the reason why WebAssembly's being explored in this space… is that relying on OS/hardware features means your TAM shrinks to a fraction of total" — torginus ([50018202](https://news.ycombinator.com/item?id=50018202))

## Relevance to the talk
MXC is the OS vendor's own attempt to standardise agent sandboxing across Seatbelt, bubblewrap and Windows. The HN reaction ("everyone is building the same thing") captures the fragmentation the talk describes: one shared set of primitives, many incompatible policy front ends.
