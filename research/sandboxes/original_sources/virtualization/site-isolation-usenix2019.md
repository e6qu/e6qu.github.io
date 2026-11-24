---
title: "Site Isolation: Process Separation for Web Sites within the Browser"
url: https://www.usenix.org/conference/usenixsecurity19/presentation/reis
authors: Charles Reis, Alexander Moshchuk, Nasko Oskov (Google)
date: 2019-08 (28th USENIX Security Symposium, Santa Clara, CA)
accessed: 2026-11-22
kind: paper
---

## Summary
Describes deploying Site Isolation to all desktop Chrome users: each renderer process is locked to documents from a single site (scheme + eTLD+1), cross-site iframes run out-of-process, and the browser filters sensitive cross-site responses (CORB). Originally aimed at compromised renderers, it became urgent after Spectre/Meltdown showed same-process isolation cannot protect secrets. The paper quantifies the cost: more processes, 9–13% total memory overhead, <2.25% page-load latency increase. PDF: https://www.usenix.org/system/files/sec19-reis.pdf . Launch post: "Mitigating Spectre with Site Isolation in Chrome", Charlie Reis, 2018-07-11 (https://security.googleblog.com/2018/07/mitigating-spectre-with-site-isolation.html).

## Key points
- Transient execution attacks "challenge a fundamental assumption made by prior web browser architectures: that software-based isolation can keep sensitive data protected within an operating system process".
- Site Isolation is "necessary" but "not sufficient": OS and hardware mitigations still needed against cross-process/kernel leaks.
- Cost (Chrome 69 field data, 2018): renderer process count +43.5% at the 50th percentile (4.4 → 6.2) and +50.6% at the 99th (35.0 → 52.7); private memory per renderer down 51.5% (87.2 MB → 42.3 MB) at the 50th percentile; total memory overhead 9–13%; page load latency +<2.25%.
- Rollout (launch blog): Chrome 67 enabled Site Isolation for 99% of users on Windows, Mac, Linux and Chrome OS (1% holdback); blog estimated "about a 10-13% total memory overhead in real workloads".
- With Site Isolation enabled, Chrome re-enables SharedArrayBuffer (which had been disabled as a Spectre timer source).

## Excerpts
> "…it is no longer safe to render documents from different web sites in the same process." (Abstract)

> "We find that this architecture offers the best path to protection against compromised renderer processes and same-process transient execution attacks, despite current limitations." (Abstract)

## Relevance to the talk
The canonical example of an industry moving an isolation boundary *outward* (thread/isolate → process) in response to hardware side channels, and paying ~10% memory for it. Same reasoning drives VM-per-tenant designs for agent sandboxes holding user credentials.
