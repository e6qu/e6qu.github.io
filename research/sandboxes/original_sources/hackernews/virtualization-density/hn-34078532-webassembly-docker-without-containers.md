---
title: "WebAssembly: Docker Without Containers"
url: https://news.ycombinator.com/item?id=34078532
story_url: https://wasmlabs.dev/articles/docker-without-containers/
authors: HN discussion (submitted by RebootStr) of a VMware Wasm Labs post
date: 2022-12-21
accessed: 2026-11-22
kind: discussion
points: 468
comments: 306
---

## Summary
Posted soon after the Docker+Wasm technical preview. The top comment (181 replies) is Solomon Hykes's 2019 tweet: "If WASM+WASI existed in 2008, we wouldn't have needed to create Docker." The replies mostly disagree. Commenters say Docker solves packaging and messy builds (Python), not sandboxing. Wasm is slower than native. Spectre means untrusted Wasm still needs a separate address space. A microVM like Firecracker already removes the shared-kernel problem.

## Key points
- The Hykes quote as reposted: "If WASM+WASI existed in 2008, we wouldn't have needed to create Docker. That's how important it is. WebAssembly on the server is the future of computing." (tweet: https://twitter.com/solomonstre/status/1111004913222324225, March 2019).
- Performance skepticism: "Until WASM advocates start including benchmarks in their blogs, I'll keep watching this stuff from a distance" (jeroenhd). He also asks why not just use Firecracker.
- Spectre (_0w8t): untrusted Wasm still cannot share a process with trusted code. Once you need a separate process anyway, "native containers wins as they are faster by factor of two over WASM".
- Capability gap (nikeee): plain WASI looked like "POSIX for WASM", without Deno-style default-deny permissions.
- GC languages (cmrdporcupine): why run a GC language inside Wasm at a "2-3x or more" overhead when it already has its own tuned VM?
- How Docker+Wasm runs modules: as part of the runtime's cgroup, not one cgroup per container (paulgb, quoting the article).

## Excerpts
> "If WASM+WASI existed in 2008, we wouldn't have needed to create Docker. That's how important it is." — tony-allan quoting Solomon Hykes, https://news.ycombinator.com/item?id=34078737

> "Docker and other sandboxes have to deal with shared kernels and all the risks associated with that, but leveraging virtual machines instead solves that issue." — jeroenhd, https://news.ycombinator.com/item?id=34081170

> "Despite the sandboxing one still cannot run untrsuted WASM code in the same process as trusted code due to hardware bugs. CPU vendors are not going to fix those anytime soon." — _0w8t, https://news.ycombinator.com/item?id=34080075

> "I use Docker where the compilation story (and cross-compilation story) is a mess (looking at you, Python) and I don't have the resources to figure it all out." — tinyspacewizard, https://news.ycombinator.com/item?id=34086594

> "If I'm getting this right, WASI is basically just POSIX for WASM. This means that it does not provide some level of sandboxing that - for example - Deno has done." — nikeee, https://news.ycombinator.com/item?id=34083574

## Relevance to the talk
The best place to show the Hykes quote together with the community's answer. Docker was about packaging, and Wasm's isolation story depends on Spectre and the host interface. Good for a "promise vs reality" slide.
