---
title: "5x faster Edge Functions: V8 isolates to Firecracker MicroVMs"
url: https://news.ycombinator.com/item?id=49912444
story_url: https://www.netlify.com/blog/edge-functions-firecracker-microvms/
authors: HN discussion (submitted by jbott) of Netlify's engineering post (built with Unikraft)
date: 2026-09-30
accessed: 2026-11-22
kind: discussion
points: 230
comments: 109
---

## Summary
Netlify moved Edge Functions from V8 isolates (Deno) to Firecracker microVMs built with Unikraft. It reports 5× faster functions by snapshotting the microVM once the JS server is listening, then starting new VMs from the snapshot. Commenters relay about 15 ms warm and 25 ms cold. Kenton Varda (Cloudflare Workers) replied that the isolates-vs-microVMs risk line "isn't really based on any rigorous mathematical analysis, it's mostly vibes". He notes microVMs put more trust in hardware correctness, while a trusted JIT can work around hardware bugs. Others raised the risk of forked RNG state in snapshot clones.

## Key points
- Design as quoted from the post: "When the MicroVM boots up and the JavaScript server begins to listen on a port, we take a snapshot of the MicroVM. [...] we start a new MicroVM from that snapshot."
- Latency, as summarised by commenters: about 15 ms warm and 25 ms cold. Commenters contrast this with Lambda Node cold starts ("wtf is lambda doing for the other 1500ms?").
- Puzzle: Cloudflare's isolates are much faster than the 25–40 ms Netlify reported for its own isolate setup, so the old latency was implementation-specific, not inherent to isolates (nchmy).
- kentonv's risk framing: isolates are riskier than microVMs, which are riskier than dedicated machines, and where to draw the "acceptable" line "is mostly vibes". Cloudflare claims "nearly a decade with no breaches".
- His caveat: microVMs running arbitrary x86 code "place a huge amount of trust in the hardware to be exactly correct", whereas "a trusted JIT makes it much easier to work around hardware bugs when they are found".
- Snapshot cloning risk: "forked RNG states can lead to catastrophic failures in UUID generators or cryptography" (CodesInChaos). This is the same issue mjb raised for CodeSandbox in 2022.
- Unikraft's Alexander Jung (nderjung) answered microVM questions. smolvm's author plugged an open-source alternative.

## Excerpts
> "It's true that V8 isolates are more risky than micro VMs*. However, it's also true that micro VMs are more risky than giving each tenant their own machine." — kentonv (Cloudflare Workers), https://news.ycombinator.com/item?id=49925639

> "Some people argue that isolates are below the necessary threshold and micro VMs are above it. But this isn't really based on any rigorous mathematical analysis, it's mostly vibes." — kentonv, https://news.ycombinator.com/item?id=49925639

> "Micro VMs that allow tenants to run arbitrary x86 code place a huge amount of trust in the hardware to be exactly correct; a trusted JIT makes it much easier to work around hardware bugs when they are found." — kentonv, https://news.ycombinator.com/item?id=49925639

> "That sounds scary, since forked RNG states can lead to catastrophic failures in UUID generators or cryptography." — CodesInChaos, https://news.ycombinator.com/item?id=49914744

> "if netlify can do 15ms warm start + 10ms cold start, wtf is lambda doing for the other 1500ms?" — notatoad, https://news.ycombinator.com/item?id=49916326

## Relevance to the talk
Evidence that snapshot-restored microVMs have caught up with isolates on latency, which removes the main reason to accept the weaker boundary. kentonv's "it's mostly vibes" comment is the most honest one-liner on choosing an isolation level, and it fits the talk's spectrum slide.
