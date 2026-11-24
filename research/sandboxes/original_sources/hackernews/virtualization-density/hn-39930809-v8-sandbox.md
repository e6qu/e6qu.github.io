---
title: "The V8 Sandbox"
url: https://news.ycombinator.com/item?id=39930809
story_url: https://v8.dev/blog/sandbox
authors: HN discussion (submitted by todsacerdoti) of Samuel Groß's V8 blog post
date: 2024-04-04
accessed: 2026-11-22
kind: discussion
points: 279
comments: 104
---

## Summary
V8 announced that its in-process "sandbox" (pointer compression cage plus off-heap pointer tables) had been on by default in 64-bit Chrome for about two years. The post argued that V8 bugs are mostly logic bugs in the JIT and runtime, so Rust or memory tagging would not help. Commenters contested that claim with V8's own bug list, and quoted the post's figure that dropping the JIT would cost 1.5–10× on compute-heavy work. Others asked what this means for Cloudflare Workers-style isolation.

## Key points
- From the post, as quoted in the thread: V8 vulnerabilities are "rarely 'classic' memory corruption bugs", so "neither switching to a memory safe language, such as Rust, nor using current or future hardware memory safety features, such as memory tagging, can help".
- Also quoted: about half of exploited V8 bugs were in the compilers, and a memory-safe no-JIT engine would be 1.5–10× slower for compute-heavy work.
- tptacek's framing: the attacker controls the JIT's output, which is "closer to that of an attacker that can write unsafe{} blocks than it is to attackers finding a bug in Vec".
- Pushback: the bug list still has plenty of UAF/OOB entries (egnehots). WebKit shipped Gigacage years earlier (sanxiyn). GraalJS-style partial evaluation of a memory-safe interpreter could avoid this bug class (mike_hearn).
- Cloudflare question: does a hardened V8 make Workers' pure-isolate model look right after all? The thread asks but does not answer.

## Excerpts
> "The problem is closer to that of an attacker that can write unsafe{} blocks than it is to attackers finding a bug in Vec." — tptacek, https://news.ycombinator.com/item?id=39933461

> "They say that Rust is not enough and dismiss it quickly" — egnehots, https://news.ycombinator.com/item?id=39932158

> "The V8 Sandbox has already been enabled by default on 64-bit (specifically x64 and arm64) versions of Chrome on Android, ChromeOS, Linux, macOS, and Windows for roughly the last two years." — pjmlp quoting the post, https://news.ycombinator.com/item?id=39931523

> "Perhaps, thinking out loud, CF Workers had the right level of isolation to begin with (i.e. pure V8 isolation)?" — pciexpgpu, https://news.ycombinator.com/item?id=39933652

## Relevance to the talk
The V8 sandbox is software fault isolation inside a JIT engine. It is the browser vendor admitting that the language VM alone is not a boundary and adding an SFI-style cage. It links isolates to the SFI/LFI section. Pairs with `../../virtualization/v8-sandbox-2024.md`.
