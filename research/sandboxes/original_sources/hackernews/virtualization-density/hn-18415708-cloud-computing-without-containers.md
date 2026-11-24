---
title: "Cloud Computing Without Containers"
url: https://news.ycombinator.com/item?id=18415708
story_url: https://blog.cloudflare.com/cloud-computing-without-containers/
authors: HN discussion (submitted by zackbloom, Cloudflare) of Zack Bloom's Cloudflare blog post
date: 2018-11-09
accessed: 2026-11-22
kind: discussion
points: 663
comments: 241
---

## Summary
The thread where Cloudflare made the case for V8 isolates as a multi-tenant cloud primitive. Kenton Varda, tech lead and architect of Workers, posted over a dozen comments. His headline claim: isolates let Cloudflare host "10,000+ tenants on one machine". He set out the defence-in-depth around V8: tracking Chrome's V8, ASLR, a tight seccomp filter, no eval, and alerting on segfaults. Google's boulos and gVisor's amscanne challenged the security model and the post's numbers for process memory and start time.

## Key points
- Density: 10,000+ tenants per machine with isolates, "totally unrealistic with containers or VMs" (kentonv). Each tenant is replicated across thousands of servers in 150+ locations, which is why per-server tenant count matters.
- Memory: at Sandstorm.io, kentonv's earlier container platform, the rule of thumb was 100 MB of RAM per container. Workers is "an order of magnitude better".
- Defence in depth: V8 is updated to track Chrome, and Google pays a $15k bounty for V8 breakouts. There is ASLR, and a seccomp filter denying all filesystem and network syscalls. eval and other code-from-strings are disabled, so all executed code passed through the deploy pipeline. Every segfault raises an alert and is investigated.
- Spectre stance: Cloudflare focuses on preventing *observation* of the side channel (timers, etc.) rather than blocking speculation. kentonv argues this is more robust to unknown variants.
- Pushback: boulos (Google Cloud) notes that Google built gVisor "precisely because things like Isolates aren't (historically?!) trustworthy enough for side-by-side". amscanne says the post's figures for process memory (30 MB) and context-switch cost (100 µs) are off by orders of magnitude: "A context switch is O(10000) cycles".
- Limits at the time, as quoted by commenters: 5–50 ms CPU per request, 128 MB RAM, 1 MB script.

## Excerpts
> "With Isolates, we can host 10,000+ tenants on one machine -- something that's totally unrealistic with containers or VMs." — kentonv (Cloudflare Workers tech lead), https://news.ycombinator.com/item?id=18418120

> "With Sandstorm.io, the rule of thumb we landed on was that a container takes 100MB of RAM. ... With Workers, we're seeing an order of magnitude better." — kentonv, https://news.ycombinator.com/item?id=18424505

> "we get a lot of comfort knowing there's a $15,000 bug bounty for V8 breakouts. We update V8 continuously, tracking the version shipping in Chrome." — kentonv, https://news.ycombinator.com/item?id=18417818

> "We built gVisor [1] (and historically used nacl or ptrace) precisely because things like Isolates aren't (historically?!) trustworthy enough for side-by-side." — boulos (Google Cloud), https://news.ycombinator.com/item?id=18417257

> "A node process doing nothing does not consume 30MB of private memory (shared mappings are shared, just like the "shared runtime"), nor does it take 500ms-10s to start a process or 100us to context switch." — amscanne (gVisor), https://news.ycombinator.com/item?id=18420203

> "Running a single tenant in a container or VM should have the same performance as bare metal. The problems come when you want to scale the number of tenants, incurring RAM and context switching overhead." — kentonv, https://news.ycombinator.com/item?id=18418065

## Relevance to the talk
This is the key thread for the density end of the spectrum: language-runtime isolation trades the hardware boundary for about 100× density. kentonv's 100 MB per container vs 10,000 tenants per machine is a strong slide. Pairs with `../../virtualization/cloudflare-workers-security-model-2020.md`.
