---
title: "Standardizing WASI: A system interface to run WebAssembly outside the web"
url: https://news.ycombinator.com/item?id=19501614
story_url: https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/
authors: HN discussion (submitted by bnjbvr) of Lin Clark's Mozilla Hacks post
date: 2019-03-27
accessed: 2026-11-22
kind: discussion
points: 434
comments: 231
---

## Summary
The WASI announcement thread. The dominant reaction was "didn't Java/the JVM/.NET already promise this?". Mozilla's Till Schneidereit answered design questions: WASI is modelled on CloudABI/Capsicum, with Fuchsia as further inspiration, and its libc is based on musl. Some code will never compile unchanged "because that runs into constraints imposed by our security goals". A commenter linked Solomon Hykes's tweet ("If WASM+WASI existed in 2008, we wouldn't have needed to create Docker"), which was posted the same day.

## Key points
- Capability lineage: "We've mainly based the current design on CloudABI/Capsicum". Syscalls are exposed as Wasm function imports (tschneidereit).
- wasi-sysroot libc is musl-based. It "won't ever be 100% compatible" because of the security model.
- Write-once-run-anywhere skepticism is the top-voted theme (gwbas1c, naikrovek, droobles).
- The Hykes tweet first appears on HN here, as a link in a comment (hathawsh). The 2022 "Docker without containers" thread (hn-34078532) made it a top comment.
- Gary Bernhardt's "The Birth & Death of JavaScript" is cited, as in most Wasm-on-the-server threads.

## Excerpts
> "We've mainly based the current design on CloudABI/Capsicum, but it's all early days, and Fuchsia is on our list of systems to at the very least take heavy inspiration from :)" — tschneidereit (Mozilla), https://news.ycombinator.com/item?id=19502005

> "It won't ever be 100% compatible with all code, because that runs into constraints imposed by our security goals, but the vast majority of code should eventually just compile when targeting this." — tschneidereit, https://news.ycombinator.com/item?id=19503260

> "I thought Java was supposed to do this with the JVM... I thought .Net was supposed to do this with the CLR... What's different now?" — gwbas1c, https://news.ycombinator.com/item?id=19504584

> "Solomon Hykes, co-founder of Docker, believes WASM+WASI could take the place of Docker." — hathawsh, https://news.ycombinator.com/item?id=19506458

## Relevance to the talk
WASI is a capability-based OS interface (a Capsicum descendant) delivered through a portable bytecode. In the talk's terms it is "pledge/Capsicum, but enforced by the compiler/runtime". Pairs with `../../virtualization/wasi-standardizing-2019.md` and `../../os-primitives/` (Capsicum).
