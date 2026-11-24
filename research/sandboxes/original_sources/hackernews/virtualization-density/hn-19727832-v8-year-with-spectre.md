---
title: "V8: A Year with Spectre"
url: https://news.ycombinator.com/item?id=19727832
story_url: https://v8.dev/blog/spectre
authors: HN discussion (submitted by tosh) of the V8 team's post (companion to "Spectre is here to stay", arXiv 1902.05178)
date: 2019-04-23
accessed: 2026-11-22
kind: discussion
points: 352
comments: 212
---

## Summary
V8 explained why it gave up on software Spectre mitigations and moved to site isolation. Untrusted code "can read a process's entire address space", and the only effective defence is to move sensitive data out of the process. Programming-language people in the thread mourned the end of "safe languages enforce a proper abstraction boundary". Ben Titzer (V8) explained that a modern out-of-order CPU is "essentially always speculating". Commenters immediately asked what this meant for Cloudflare's and Fastly's in-process isolation.

## Key points
- Post conclusion, quoted by jcranmer: "in principle, untrusted code can read a process's entire address space using Spectre and side channels ... The only effective mitigation is to move sensitive data out of the process's address space."
- Chrome's model "no longer assumes language-enforced confidentiality within a renderer process" (quoted by bithavoc), who then asks about Cloudflare Workers and Fastly Lucet.
- titzer: with about 200 µops in flight, "probably 99% of all cycles are spent with at least one unexecuted branch somewhere in the reorder buffer".
- samth (Racket/PL): the guarantee that well-typed programs cannot read arbitrary memory "is not true on today's hardware".
- Cost of the alternative: per-site processes cost memory (several MB of relocated vtables per process in Firefox). fork/zygotes reduce start-up cost (kllrnohj, bzbarsky).
- A skeptic notes there were still no demonstrated real-world Spectre attacks (jnordwick).

## Excerpts
> "Our research reached the conclusion that, in principle, untrusted code can read a process’s entire address space using Spectre and side channels." — jcranmer quoting the V8 post, https://news.ycombinator.com/item?id=19728828

> "It is a depressing conclusion that our models were wrong — this guarantee is not true on today’s hardware." — samth, https://news.ycombinator.com/item?id=19728497

> "The right mental model is that, in modern out-of-order CPUs, there is no difference between executing "in speculation" and "not in speculation"." — titzer, https://news.ycombinator.com/item?id=19729204

> "So V8 never was and never will be a silver bullet for running JS/WASM without isolation. I wonder what Edge CDN such as Cloudflare[0] and Flastly[1] are doing to isolate their functions." — bithavoc, https://news.ycombinator.com/item?id=19728602

> "When Spectre first came out, my prediction was basically that the only effective mitigation would be to move the untrusted code into another address space." — jcranmer, https://news.ycombinator.com/item?id=19728828

## Relevance to the talk
This is the point where language-based isolation lost confidentiality and the address space returned as the unit of isolation, a key turn in the talk. Pairs with `../../virtualization/spectre-is-here-to-stay-2019.md` and `../../virtualization/site-isolation-usenix2019.md`. Cloudflare's counter-position is in hn-31740885.
