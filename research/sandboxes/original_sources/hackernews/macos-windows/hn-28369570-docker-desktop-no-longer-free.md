---
title: "Docker Desktop no longer free for large companies"
url: https://news.ycombinator.com/item?id=28369570
story_url: https://www.theregister.com/2021/08/31/docker_desktop_no_longer_free/
points: 725
comments: 571
authors: submitted by alanwreath; The Register article on Docker's announcement; HN commenters
date: 2021-08-31
accessed: 2026-11-22
kind: discussion
---

## Summary
Docker's 2021 licensing change (paid subscription for companies above 250 employees or $10M revenue). The thread
became a tutorial in what Docker Desktop actually is on Mac/Windows: a managed Linux VM plus file-sharing and
network glue. It kicked off the wave of alternatives (Rancher Desktop, Podman Desktop, Colima, Lima,
Multipass, later OrbStack). Follow-ups: "An Overview of Docker Desktop Alternatives" (142 points,
https://news.ycombinator.com/item?id=28379556), "Rancher Desktop, a Docker Desktop Replacement" (650 points,
https://news.ycombinator.com/item?id=28835690), "Docker for Mac Without Docker Desktop" (307 points,
https://news.ycombinator.com/item?id=30116433).

## Key points
- The Docker daemon only runs on Linux; on Mac it must run in a VM. Docker Desktop's value is automating the VM
  and the filesystem/network integration.
- Common workarounds: Multipass VM + VS Code remote; WSL2 on Windows; remote engine over `DOCKER_HOST=ssh://`;
  Lima/Colima; QEMU on Hypervisor.framework.
- Many users say they only use the GUI to start the engine and set VM memory.

## Excerpts
> "Daemon (and containers) only runs on Linux. On Mac, it needs to run inside a Linux VM."
— ianburrell, https://news.ycombinator.com/item?id=28370341

> "Docker Desktop for Mac does that, and implements filesystem and networking integration for you. Most people like the convenience of that, if not the performance or (now) the cost."
— saxonww, https://news.ycombinator.com/item?id=28371304

> "Why run Docker inside a VM on a Mac, when you can just run the Linux dev environment directly inside the VM?"
— SkyMarshal, https://news.ycombinator.com/item?id=28371977

> "Frankly, I don't really know if anybody actually uses the UI components for it outside of starting and stopping the engine and for basic configuration of the VM."
— dpratt, https://news.ycombinator.com/item?id=28369630

## Relevance to the talk
"VMs dominate on desktop" in one sentence: containers on a Mac or Windows laptop are a Linux VM with glue, and
the glue (file sharing, networking, memory) is where cost and pain live.
