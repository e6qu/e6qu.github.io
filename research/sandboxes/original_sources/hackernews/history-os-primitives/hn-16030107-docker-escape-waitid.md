---
title: "Escaping Docker container using waitid() – CVE-2017-5123"
url: https://news.ycombinator.com/item?id=16030107
story_url: https://www.twistlock.com/2017/12/27/escaping-docker-container-using-waitid-cve-2017-5123/
authors: HN discussion of Twistlock's write-up; commenters include shykes, wahern, geofft, hacknat
date: 2017-12-29
accessed: 2026-11-22
kind: discussion
points: 444
comments: 121
---

Read via the HN Algolia items API.

## Summary
A kernel bug in `waitid()` (Linux 4.12–4.13: a missing `access_ok()`
check) let a container process write to kernel memory and overwrite its
credentials, escaping Docker. It is the example Ptacek later uses for
"nobody's container lockdown configuration was blocking `waitid`". The
thread has the "it's a Linux bug, not a Docker bug" camp (and Hykes
calling the title marketing), the "user namespaces would have stopped
it" camp, and wahern's reply that nothing short of blocking a core
syscall would, so high-value assets should not rely on containers.

## Key points
- The bug: `waitid()` wrote a `siginfo_t` to a user-supplied pointer without `access_ok()`, giving a limited kernel write; the exploit sprayed the heap and patched `cred` (geofft, wahern).
- Naming fight: "Apparently Linux privilege escalation bugs are now "Docker container escapes"?" (zenlikethat); Hykes: "Marketing… Twistlock is selling Docker security by amplifying the meme of "insecure Docker"".
- User-namespace camp (hacknat): with per-container user namespaces "this exploit doesn't do anything". wahern: "User namespaces don't magically protect you from a vulnerability that allows writing to kernel memory. Neither would AppArmor."
- seccomp cannot help without breaking software: "waitid is a pretty fundamental Unix syscall and blocking it would break a lot of basic software" (wahern).
- The article's figure, repeated in the thread: "In 2017 alone, 434 linux kernel exploits where found".
- "It has been general knowledge that escaping from a container is trivial since forever… Who is saying that containerization can be used for isolation?" (upofadown).

## Excerpts
> "There's a long tradition by enterprise vendors large and small to market someone else's product as insecure, in order to create demand for their "improved, secured" version." — shykes, <https://news.ycombinator.com/item?id=16030696>

> "User namespaces don't magically protect you from a vulnerability that allows writing to kernel memory. Neither would AppArmor. seccomp could theoretically, but waitid is a pretty fundamental Unix syscall and blocking it would break a lot of basic software." — wahern, <https://news.ycombinator.com/item?id=16032027>

> "Unless you're prepared to pour over every published exploit, 24/7, meticulously devise countermeasures, and be prepared to run effectively crippled software, you really shouldn't be relying on containers to isolate high-value assets." — wahern, <https://news.ycombinator.com/item?id=16032027>

> "Apparently Linux privilege escalation bugs are now "Docker container escapes"?" — zenlikethat, <https://news.ycombinator.com/item?id=16032649>

> "Nobody was going to DAC or MAC out `waitid`, but `waitid` for a time take a kernel address for its siginfo_t parameter." — tptacek (2022, cgroups thread), <https://news.ycombinator.com/item?id=30558788>

## Relevance to the talk
The canonical case where every container hardening layer (capabilities,
user namespaces, MAC, seccomp) is irrelevant because the bug is in a
syscall every program needs. This is the strongest single argument for
putting a separate kernel (VM, gVisor) under untrusted code.
