---
title: "Linux Namespaces Are a Poor Man's Plan 9 Namespaces"
url: https://news.ycombinator.com/item?id=36414493
story_url: https://yotam.net/posts/linux-namespaces-are-a-poor-mans-plan9-namespaces/
authors: HN discussion of Yotam Nachum's blog post; commenters include ori_b (9front developer), pcwalton, tytso (Ted Ts'o), mike_hearn
date: 2023-06-21
accessed: 2026-11-22
kind: discussion
points: 304
comments: 304
---

Read via the HN Algolia items API (top-level and maintainer replies).
Our source note: [pike-1992-plan9-name-spaces](../../history/pike-1992-plan9-name-spaces.md).

## Summary
The post argues that Linux namespaces are a retrofit of Plan 9's
per-process name spaces onto a system where not everything is a file, so
each resource type needs its own namespace kind and ioctl-shaped
escape hatches. HN agrees with the lineage and argues about the cost.
The 9front side (ori_b) says Plan 9's model holds together only because
every resource goes through one interposable, network-transparent file
protocol, which Linux cannot adopt without removing most of itself.
Skeptics say "everything is a file" is too small a vocabulary for many
APIs, and that Plan 9 looks clean partly because it does less.

## Key points
- The core claim: in Plan 9, namespaces are general because every object exports the same file API; Linux has to add a namespace type per resource (mount, PID, net, IPC, UTS, user, cgroup, time).
- ori_b: Plan 9's coherence comes from "a single, network transparent, universal layer"; "Ioctl is a particularly egregious violation of the model."
- esjeon: the best namespace design comes from microkernels, "where isolation can be achieved by simply rerouting outgoing API calls to alternate servers" (ori_b: that is roughly Plan 9's `mnt` device).
- tytso: cgroups are not namespaces; they constrain CPU, memory, network bandwidth and storage I/O.
- fulafel asks whether Plan 9 had unprivileged network virtualization or user-ID namespaces like Linux; the dump did not show a direct answer.
- Skeptics: "Plan 9 did everything right… because it hardly did anything at all" (oskarw85); mike_hearn: "too limited and low level a vocabulary to express many important APIs".
- In a separate 2021 jails thread ori_b notes Linux namespaces need `CAP_SYS_ADMIN` (outside user namespaces), "one of the complaints the plan 9 people have always" had (<https://news.ycombinator.com/item?id=29657518>).

## Excerpts
> "everything is a poor man's Plan 9 something. Everything. All of it. Plan 9 lived in the goddamned future." — DiabloD3, <https://news.ycombinator.com/item?id=36414699>

> "The feature of plan 9 that makes it all hang together is that all features interact through a single, network transparent, universal layer… Ioctl is a particularly egregious violation of the model." — ori_b, <https://news.ycombinator.com/item?id=36417673>

> "The simple, everything is a file, model of Plan9 is what makes the namespaces API as clear and as general as it is." — afr0ck, <https://news.ycombinator.com/item?id=36415572>

> "The best namespace design should come from the microkernel world, where isolation can be achieved by simply rerouting outgoing API calls to alternate servers." — esjeon, <https://news.ycombinator.com/item?id=36416022>

> "Cgroups are a lot more than just "namespaces". It is also the mechanism by which you can constrain how much CPU, Memory, Network Bandwidth, Storage IOPS or Throughput, etc." — tytso, <https://news.ycombinator.com/item?id=36420488>

> "I often see those "Plan 9 did everything right" posts and can't help but add "... because it hardly did anything at all"" — oskarw85, <https://news.ycombinator.com/item?id=36422103>

## Relevance to the talk
Supports the "namespaces come from Plan 9" slide and explains why Linux
ended up with eight namespace types instead of one mechanism. The
microkernel remark links forward to capability systems, where
redirecting a name is the isolation primitive.
