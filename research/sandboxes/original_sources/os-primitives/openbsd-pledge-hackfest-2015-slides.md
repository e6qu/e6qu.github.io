---
title: "pledge(): a new mitigation mechanism"
url: https://www.openbsd.org/papers/hackfest2015-pledge/
authors: Theo de Raadt (OpenBSD)
date: 2015-11 (Hackfest 2015, Québec City; month inferred from The Register coverage dated 2015-11-10)
accessed: 2026-11-22
kind: talk
---

## Summary
Theo de Raadt's slides introducing pledge() (formerly "tame()"). Thesis: most programs need a rich set of
syscalls during initialisation and a much narrower set in their main loop, so the programmer — who knows
the code — should annotate it with promises like `"stdio rpath"`, and the kernel kills the process if it
breaks them. He critiques SELinux (optional security), systrace (TOCTOU, hard to use), Capsicum (intense
program modification, used in "12 programs") and seccomp ("who watches the watcher?").

## Key points
- "System call interface is rich enough to be called 'attack surface'."
- Implementation: ~1400 lines of kernel code; most programs need 3–10 lines of change.
- 400+ programs converted in six months; "approximately 70% of programs, 2-3 new every week".
- OpenSSH pre-auth sandbox had used systrace since 2011 (150 lines of code, 18 allowed syscalls listed); now `pledge("stdio")`.
- file(1) systrace sandbox: 300 lines; pledge version: two calls.
- Design philosophy: "Optional Security is irrelevant!"; mitigations must not have false positives so they can be mandatory.
- pledge's 2nd argument was then a path whitelist — the idea that later became unveil(2) (2018).

## Excerpts
> "pledge() is a seatbelt" — slide 25

> "I don't work on optional security mechanisms." — slide 5

> "A Turing complete eBPF program watches your program / Who watches the watcher?" — slide 10 (seccomp)

## Relevance to the talk
The developer-authored, coarse-grained, self-imposed sandbox. pledge/unveil are the cleanest mental model
for what an agent should be allowed: "stdio rpath inet" + a few visible paths.
