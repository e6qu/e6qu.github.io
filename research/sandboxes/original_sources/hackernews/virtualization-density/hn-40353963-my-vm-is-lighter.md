---
title: "My VM is lighter (and safer) than your container (2017)"
url: https://news.ycombinator.com/item?id=40353963
story_url: https://dl.acm.org/doi/10.1145/3132747.3132763
authors: HN discussion (submitted by fanf2) of Manco et al., SOSP 2017 (LightVM)
date: 2024-05-14
accessed: 2026-11-22
kind: discussion
points: 168
comments: 174
---

## Summary
The 2024 resubmission of the LightVM paper. It drew the paper's co-author Felipe Huici (fhuici) and Unikraft's Alexander Jung (nderjung), and it had the most comments of the four HN submissions (2017: 240 points; 2022: 309 points). The top comment says the point of containers was never isolation. Huici gives commercial numbers from KraftCloud, the paper's descendant: NGINX cold-starts in 20 ms and Spring Boot in under 300 ms. Commenters also caution against putting LightVM's 2.3 ms next to Firecracker's 125 ms.

## Key points
- Containers' real value is "defined and reproducible environments and builds"; "If there is some additional isolation required, just run the container in a VM" (andix, the top comment, 88 replies).
- The paper's line continued as Unikraft (EuroSys 2021 best paper) and the commercial kraft.cloud. Dockerfiles are converted to unikernels at deploy time (fhuici).
- Numbers: NGINX cold start 20 ms, Spring Boot < 300 ms on KraftCloud (fhuici).
- Apples and oranges: LightVM's 2.3 ms is VM *creation*, while Firecracker's 125 ms is creation through to a working user space (tpetry).
- The safety conclusions predate rootless containers and user namespaces becoming common, so commenters say they need revisiting (jsheard, epr).
- Earlier threads on the same paper: https://news.ycombinator.com/item?id=15610155 (2017, 240 points), https://news.ycombinator.com/item?id=32764501 (2022, 309 points). The 2022 thread has tptacek's comment that eBPF syscall filtering cannot make shared-kernel containers "comparably as secure as VMs".

## Excerpts
> "I think containers are often misunderstood: The main benefit is not isolation and security, it's defined and reproducible environments and builds. If there is some additional isolation required, just run the container in a VM." — andix, https://news.ycombinator.com/item?id=40354306

> "With this in place, NGINX cold starts in 20 millis, and even heavier apps/frameworks like Spring Boot in < 300 millis" — fhuici (paper co-author, Unikraft), https://news.ycombinator.com/item?id=40354562

> "LightVM is stating a VM creation of 2.3ms while Firecracker states 125ms of time from VM creation to a working user space. So this comparing apples and oranges." — tpetry, https://news.ycombinator.com/item?id=40354490

> "It is pretty obviously not the case that eBPF means shared-kernel containers are comparably as secure as VMs; there have been recent Linux kernel LPEs that no system call scrubbing BPF code would have caught" — tptacek (2022 thread), https://news.ycombinator.com/item?id=32772107

## Relevance to the talk
The density argument for VMs: a specialised guest makes a VM cheaper than a container. The "containers are for packaging, VMs are for isolation" split recurs in nearly every later thread. Pairs with `../../virtualization/lightvm-sosp2017.md`.
