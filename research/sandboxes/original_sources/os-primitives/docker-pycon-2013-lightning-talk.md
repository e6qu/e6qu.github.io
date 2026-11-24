---
title: "Lightning Talk - The future of Linux Containers"
url: https://pyvideo.org/pycon-us-2013/the-future-of-linux-containers.html
authors: Solomon Hykes (dotCloud)
date: 2013-03-15 (PyCon US 2013, Santa Clara, Friday lightning talks)
accessed: 2026-11-22
kind: talk
---

## Summary
The ~5-minute lightning talk where Solomon Hykes first showed Docker publicly, presenting dotCloud's
internal container engine as an open-source tool. The first tagged release, v0.1.0, followed on
2013-03-26 (GitHub tag date). The v0.1.0 README describes Docker as "the Linux container runtime" that
"complements LXC with a high-level API".

## Key points
- Video: https://www.youtube.com/watch?v=9xciauwbsuo
- pyvideo lists the talk as Fri 15 March 2013; some secondary decks say March 21 — pyvideo is the primary listing.
- v0.1.0 tag: 2013-03-26T01:11:12Z (https://github.com/moby/moby/tree/v0.1.0).
- v0.1.0 README "Under the hood": Linux cgroups and namespaces, AUFS copy-on-write, Go, and lxc scripts.
  Network isolation via a per-container network namespace; resource isolation via cgroups.
- The README's spec section includes a "Security" heading with no text under it (as do most headings in that
  skeleton section) — an amusing but not damning detail.
- dotCloud renamed itself Docker, Inc. in October 2013 (InfoQ/Business Wire, secondary).

## Excerpts
> "Solomon talks about Linux Containers which they use at dotCloud and how people are interested in how they do it" — pyvideo description

> "Docker complements LXC with a high-level API which operates at the process level." — v0.1.0 README

## Relevance to the talk
The packaging moment: Docker didn't add isolation primitives, it made namespaces + cgroups + CoW images
usable. That usability is why "container" became the default unit — and why people mistook it for a
security boundary.
