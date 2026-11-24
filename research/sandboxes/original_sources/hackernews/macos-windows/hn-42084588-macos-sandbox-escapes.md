---
title: "Multiple new macOS sandbox escape vulnerabilities"
url: https://news.ycombinator.com/item?id=42084588
story_url: https://jhftss.github.io/A-New-Era-of-macOS-Sandbox-Escapes/
points: 582
comments: 190
authors: submitted by transpute; research by Mickey Jin (jhftss); HN commenters incl. mike_hearn, saagarjha, lapcat
date: 2024-11-08
accessed: 2026-11-22
kind: discussion
---

## Summary
Discussion of Mickey Jin's series of App Sandbox escapes via XPC services in the PID domain that sandboxed
apps could reach. Commenters debate whether patching each XPC service is a design smell, what an escape
actually buys, and whether macOS needs capability-based containers instead of deny-lists.

## Key points
- Escapes go through privileged XPC services reachable from inside the sandbox, not through the Seatbelt
  evaluator itself; Apple fixed them service by service.
- An escape usually yields an unsandboxed process (not root), though kernel-enforcement bugs have existed.
- The Seatbelt profile language is not the weak point; the reachable Mach/XPC surface is.
- A practical limit surfaced: Nix hits Seatbelt's maximum "pattern serialization length" for large profiles
  (NixOS/nix#4119).
- Several commenters reach for VMs (Qubes, ChromeOS-style "Linux VM as escape hatch") as the stronger model.

## Excerpts
> "It's a bit odd that the response here is to patch every single XPC service individually. This feels like some kind of design issue in the sandbox itself."
— mike_hearn, https://news.ycombinator.com/item?id=42086714

> "XPC was designed recently and for macOS/iOS. This is just that it was not designed with security in mind along this axis."
— saagarjha, https://news.ycombinator.com/item?id=42090976

> "Mostly, it just gets you to a non-sandboxed state."
— lapcat, https://news.ycombinator.com/item?id=42087985

> "MacOS should really have some kind of capabilities based Darwin containers, rather than what seems like a giant tangle of blacklists."
— pram, https://news.ycombinator.com/item?id=42088057

> "I like ChromeOS' security model: Nail everything shut, but leave a Linux VM as a escape hatch."
— nolist_policy, https://news.ycombinator.com/item?id=42090119

## Relevance to the talk
The "Seatbelt gaps and escapes" slide: the attack surface of a process sandbox on a shared kernel is every
service the process can still talk to. Relevant to agents under `sandbox-exec`: the profile must also cut Mach
lookups, which agent profiles often leave open for keychain, pasteboard, etc.
