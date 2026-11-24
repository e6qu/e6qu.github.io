---
title: "Agent Safehouse – macOS-native sandboxing for local agents"
url: https://news.ycombinator.com/item?id=47301085
story_url: https://agent-safehouse.dev/
points: 823
comments: 178
authors: HN thread (submitted by atombender); project by e1g
date: 2026-03-08
accessed: 2026-11-22
kind: discussion
---

## Summary
Agent Safehouse generates `sandbox-exec` (Seatbelt) profiles that let local agents (Claude Code, Codex, Amp, Pi…) run "full-auto" on the user's own Mac, with no container or VM. It is the highest-scoring agent-sandbox post we found on HN. The author explains that he wanted agents on his own tuned machine and that most of the work was finding the minimum permissions each agent needs (auto-update, keychain, pasting images). He also criticises the built-in sandboxes: Claude's can be escaped and still reads the whole disk, and Codex sandboxes only shell commands, not the agent runtime. Commenters debate whether `sandbox-exec` is really deprecated, and point to nono.sh (which adds a credential proxy), Treebeard (sandbox-exec plus worktrees plus CoW), Apple `container`, and Lima VMs.

## Key points
- Design: a policy generator for `sandbox-exec`, so there are no dependencies and no virtualisation. Agents keep native macOS tooling.
- The author's comparison: Claude Code "can escape its sandbox (there are GitHub issues about this) and, when sandboxed, still has full read access to everything on your machine". In Codex "only shell commands are sandboxed; the actual agent runtime is not."
- Commenters raised credentials: filesystem sandboxing does not help if the agent already holds a token in memory, hence proxies (nono) and scoped authorisation.
- Strategic framing from one commenter: sandboxing is "THE major challenge" before agents are acceptable in regulated environments.

## Excerpts
> "I built this because I like my agents to be local. Not in a container, not in a remote server, but running on my finely-tuned machine. This helps me run all agents on full-auto, in peace." — e1g ([47301472](https://news.ycombinator.com/item?id=47301472))

> "Claude: can escape its sandbox (there are GitHub issues about this) and, when sandboxed, still has full read access to everything on your machine (SSH keys, API keys, files, etc.) Codex: IIRC, only shell commands are sandboxed; the actual agent runtime is not." — e1g ([47302251](https://news.ycombinator.com/item?id=47302251))

> "This is just a wrapper around sandbox-exec. It's nice that there are a ton of presets that have been thought out, since 90% of wielding sandbox-exec is correctly scoping it to whatever the inner environment requires…" — xyzzy_plugh ([47301342](https://news.ycombinator.com/item?id=47301342))

> "I honestly think that sandboxing is currently THE major challenge that needs to be solved for the tech to fully realise its potential. Yes the early adopters will YOLO it and run agents natively." — zmmmmm ([47302296](https://news.ycombinator.com/item?id=47302296))

> "It's a little worrisome that everyone is playing catch up on this front and many of the builtin solutions aren't good." — synparb ([47301978](https://news.ycombinator.com/item?id=47301978))

> "Sandbox-exec contains local blast radius, and that's important. But if the agent already has a credential in memory, sandboxing the filesystem doesn't help." — niyikiza ([47305781](https://news.ycombinator.com/item?id=47305781))

## Relevance to the talk
Seatbelt, deprecated and undocumented since about 2016, is the macOS primitive that every vendor and hobbyist ends up using. That 823 points went to a profile generator for it shows how much demand there is for "local, native, no VM", and how little users trust the sandboxes built into the harnesses.
