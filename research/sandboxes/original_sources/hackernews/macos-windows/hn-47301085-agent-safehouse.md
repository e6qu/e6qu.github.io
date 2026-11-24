---
title: "Agent Safehouse – macOS-native sandboxing for local agents"
url: https://news.ycombinator.com/item?id=47301085
story_url: https://agent-safehouse.dev/
points: 823
comments: 178
authors: submitted by atombender; project by e1g (Eugene); HN commenters
date: 2026-03-08
accessed: 2026-11-22
kind: discussion
---

## Summary
The biggest HN thread on using Seatbelt (`sandbox-exec`) to confine coding agents. Agent Safehouse is a Bash
policy generator for `sandbox-exec` with per-agent presets (Claude Code, Codex, Amp, Pi…) and a web "policy
builder". The discussion covers why people want *native* (not VM) confinement on a Mac, what SBPL cannot do (no
overlay / copy-on-write filesystem, no domain-level network filtering), the deprecation question, and how
Claude Code's and Codex's built-in sandboxes compare.

## Key points
- The creator's position: no virtualization, no dependencies, "just a policy-generator for sandbox-exec"; most
  of the work was finding the minimum permissions agents need for auto-update, keychain, image pasting.
- Recurring gap: macOS has no way to let writes happen but be discarded (overlay/CoW/bind mounts). People work
  around it with read-only-outside-CWD, tree copies, worktrees, or macFUSE (called "a shitshow").
- Friction reported in practice: home-directory dotfiles (`~/.gitconfig`) unreadable without broad grants;
  `lldb`/`pkill` blocked; headless Chrome flaky inside the sandbox.
- Deprecation debate: deprecated "for about a decade" yet used by Chrome, Claude Code, Codex; one commenter
  argues the underlying mechanism is safe because App Sandbox and Apple daemons depend on it.
- Claims (unverified, from the author): Claude Code's built-in sandbox can be escaped (GitHub issues) and gives
  full read access when sandboxed; Codex sandboxes only shell commands, not the agent runtime.
- Native-macOS needs (Xcode toolchains, iOS builds) are why people want "real macOS Docker" rather than Linux VMs.
- Overhead remark: Docker on macOS takes a constant ~0.5% CPU for its host VM; `sandbox-exec` costs nothing idle.
- Others mention alternatives: yoloai (Docker/Seatbelt/Tart backends), nono (proxy for credentials), Treebeard
  (sandbox-exec + worktrees + overlay), Apple `container`, Lima VMs.

## Excerpts
> "This is just a wrapper around sandbox-exec. … 90% of wielding sandbox-exec is correctly scoping it to whatever the inner environment requires (the other 90% is figuring out how sandbox-exec works)."
— xyzzy_plugh, https://news.ycombinator.com/item?id=47301342

> "The main issue I want to solve is unexpected writes to arbitrary paths should be allowed but ultimately discarded. macOS simply doesn't offer a way to namespace the filesystem in that way."
— xyzzy_plugh, https://news.ycombinator.com/item?id=47302477

> "Yes, it's just a policy-generator for sandbox-exec. IMO, that's the best part about the project - no dependencies, no fancy tech, no virtualization."
— e1g (creator), https://news.ycombinator.com/item?id=47301472

> "Yes, for about a decade. But it's available everywhere, and still works - and protects us - like brand new!"
— e1g, on whether sandbox-exec is deprecated, https://news.ycombinator.com/item?id=47303965

> "My guess is sandbox-exec is deprecated more because it never was adequately documented rather than because it's flawed in some way."
— TheTon, https://news.ycombinator.com/item?id=47305043

> "I see docker taking a continuous 1/2% CPU on MacOS when running its host, where sandbox-exec or containers on linux are zero unless used."
— scosman, https://news.ycombinator.com/item?id=47313495

> "Claude: can escape its sandbox (there are GitHub issues about this) and, when sandboxed, still has full read access to everything on your machine (SSH keys, API keys, files, etc.)"
— e1g, https://news.ycombinator.com/item?id=47302251

> "It's clear to me that Apple is trying to make the ratio jobs/#MacMinis as small as possible"
— qalmakka, https://news.ycombinator.com/item?id=47305522

## Relevance to the talk
The clearest evidence that practitioners pick Seatbelt for local agents because it is native, light, and
VM-free, and of exactly where it falls short (no filesystem namespacing, coarse network control). It supports
the fws framing: the missing piece on macOS is copy-on-write/namespace semantics, not syscall filtering.
