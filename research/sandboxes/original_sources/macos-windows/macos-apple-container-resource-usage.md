---
title: "Resource usage (apple/container docs)"
url: https://github.com/apple/container/blob/main/docs/resource-usage.md
authors: Apple Inc.
date: living doc on main (read 2026-11-22; release 1.7.1 current)
accessed: 2026-11-22
kind: docs
---

## Summary
Documents per-container VM sizing and overcommit. Defaults are 1 GiB RAM and 4 vCPUs per container, and
2 GiB / 2 vCPUs for the builder VM. `container` doesn't reject requests that exceed physical capacity.
macOS schedules guest vCPUs like any other threads and swaps under memory pressure.

## Key points
- Default VM per container: 1 GB RAM, 4 CPUs (`--memory`, `--cpus` override).
- Overcommit is allowed. The doc's example puts 16 vCPUs and 14 GB of requests on an 8-CPU, 16 GB host.
- Under pressure macOS swaps guest memory, and "performance degrades".
- Per-process limits inside the guest are available via ulimits (a separate doc).

## Excerpts
> "The default values are 1 gigabyte of RAM and 4 CPUs." — Configure memory and CPUs for your containers

> "`container` does not reject a `--cpus` or `--memory` request that exceeds physical capacity" — Overcommit memory and CPUs across containers

## Relevance to the talk
Gives a concrete per-agent sizing for back-of-envelope density. At the 1 GiB default, a 64 GB Mac fits
roughly 50–60 idle agent VMs before swapping, assuming each touches most of its RAM. Real use depends on
what the guest touches, and freed memory isn't returned (see technical overview). This estimate is ours,
not Apple's.
