---
title: "macOS's Little-Known Command-Line Sandboxing Tool (2025)"
url: https://news.ycombinator.com/item?id=47101200
story_url: https://igorstechnoclub.com/sandbox-exec/
points: 224
comments: 89
authors: submitted by Igor_Wiwi; HN commenters incl. bdash (author of bdash.net.nz "Sandboxing on macOS"; reputedly a former Apple/WebKit engineer, unverified), comex
date: 2026-02-21
accessed: 2026-11-22
kind: discussion
---

## Summary
A re-post (first posted 2025-04-18, 5 points, https://news.ycombinator.com/item?id=43731663) of a
`sandbox-exec` tutorial. The comments are the best HN explanation of how Seatbelt, SBPL, App Sandbox and
entitlements relate, plus an inventory of who depends on `sandbox-exec` despite its deprecation.

## Key points
- Who uses it: Claude Code and Codex (both document Seatbelt), Chrome, Firefox, Safari, Homebrew ("at least 6 or
  7 years"), Bazel, Swift Package Manager, Nix (via libsandbox), a Common Lisp build system.
- The man page still says DEPRECATED on macOS 26.3; deprecated since at least 10.13 era.
- App Sandbox is "Seatbelt + Cocoa containers": `secinitd` turns entitlements into a profile applied before
  `main()`; `application.sb` evaluates `(entitlement …)` predicates. App Sandbox apps crash with
  `forbidden-sandbox-reinit` if run under `sandbox-exec`.
- SBPL is literally TinyScheme, run once to produce a binary policy; the kernel evaluator has no loops (forward
  jumps only), so is not known to be Turing-complete.
- bdash: App Sandbox's advantage is that the policy ships with the OS and Apple updates it with frameworks; a
  custom profile breaks silently when frameworks change. That is the practical meaning of "deprecated".
- Critique: `sandbox-exec` is "a high-level seccomp", not a sandbox in the virtualizing sense; failures are hard
  errors far from the cause. Wish list: overlay mounts.
- Counter: simonw says file read/write + network control is everything he expects from a sandbox.

## Excerpts
> "App Sandbox is fundamentally a way for programs to use the underlying sandbox subsystem without having to write SBPL code themselves. … By far the biggest advantage of App Sandbox is that the policy ships along with the OS."
— bdash, https://news.ycombinator.com/item?id=47103444

> "Technically, it's not just Scheme-like but literally a Scheme interpreter (TinyScheme). However, the Scheme isn't being executed to make individual sandboxing decisions."
— comex, https://news.ycombinator.com/item?id=47102364

> "\"sandbox-exec\" is deprecated in the sense of \"please don't use this method to run sandboxes\" rather than the mechanism going away."
— VogonPoetry, https://news.ycombinator.com/item?id=47104879

> "It drives me nuts that sandbox-exec has \"sandbox\" in the name, since it's nothing like a real sandbox, and much closer to something like a high-level seccomp … If macOS simply had overlay mounts in a sandbox then it would unlock so much."
— xyzzy_plugh, https://news.ycombinator.com/item?id=47101662

> "The App Sandbox is literally Seatbelt + Cocoa \"containers\". … macOS does no OS-level virtualization."
— m132, https://news.ycombinator.com/item?id=47103333

> "Homebrew uses sandbox-exec during builds and installs, yeah. To my memory we've used it for at least 6 or 7 years, probably longer."
— woodruffw, https://news.ycombinator.com/item?id=47102235

> "Still deprecated. Still in use by everyone."
— selridge, https://news.ycombinator.com/item?id=47102070

## Relevance to the talk
The mechanism slide: Seatbelt = TrustedBSD MAC hooks + compiled SBPL; App Sandbox is a profile generator on top.
Also the honest definition of "deprecated" and the list of load-bearing users, which explains why agents can
rely on it in 2026.
