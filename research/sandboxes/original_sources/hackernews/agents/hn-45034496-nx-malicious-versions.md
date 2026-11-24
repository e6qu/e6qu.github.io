---
title: "Malicious versions of Nx and some supporting plugins were published"
url: https://news.ycombinator.com/item?id=45034496
story_url: https://github.com/nrwl/nx/security/advisories/GHSA-cxm3-wv7p-598c
points: 443
comments: 433
authors: HN thread (submitted by longcat); Nx security advisory (also discussed in [45038653](https://news.ycombinator.com/item?id=45038653), Semgrep, 493 points)
date: 2025-08-27
accessed: 2026-11-22
kind: discussion
---

## Summary
The "s1ngularity" Nx compromise (August 2025). Malicious `nx` releases with a postinstall script stole credentials and crypto wallets and, as a first, checked for Claude Code and Gemini CLI and ran them with permission-skipping flags and a prompt asking them to search the filesystem for secrets. The stolen data was pushed to public GitHub repos. HN's reaction was the first time many developers saw local coding agents as an attacker's tool sitting on their machine. Some answered "I do most of my coding in a VM now". Others argued that LLM use changes little, since any local process can already do anything.

## Key points
- A new technique: malware offloads reconnaissance to an installed agent CLI via a prompt, which makes the payload less fingerprintable (disputed in the thread).
- It used the agents' YOLO flags (`--dangerously-skip-permissions`, `--yolo`, `--trust-all-tools`), so vendors' bypass switches became part of the attack surface.
- Responses: develop in VMs, or in podman containers that share only the source directory. Some called for Android-style per-app sandboxing on desktops.
- See agent-sandboxing/nx-s1ngularity-ai-cli-malware.md for the vendor-side write-up.

## Excerpts
> "Interestingly, the malware checks for the presence of Claude Code CLI or Gemini CLI on the system to offload much of the fingerprintable code to a prompt." — algo_lover, quoting the advisory coverage ([45038916](https://news.ycombinator.com/item?id=45038916))

> "Honest to goodness, I do most of my coding in a VM now. I don't see how the security profile of these things are tolerable." — roenxi ([45038912](https://news.ycombinator.com/item?id=45038912))

> "Similar, but in a podman container which shares nothing other than the source code directory with my host machine." — christophilus ([45039756](https://news.ycombinator.com/item?id=45039756))

> "So any process on my computer could just start using Claude Code for their own purposes or what? o_O" — divan ([45038932](https://news.ycombinator.com/item?id=45038932))

> "'All the executable files I run are trusted and have access to all my personal files' doesn't work anymore in 2025. Android fixed this for the most part…" — fph ([45049665](https://news.ycombinator.com/item?id=45049665))

## Relevance to the talk
The supply chain runs inside, and the agent becomes a living-off-the-land tool. This makes the case for sandboxing the agent even when the user trusts the vendor: the threat is any other code on the machine driving the agent.
