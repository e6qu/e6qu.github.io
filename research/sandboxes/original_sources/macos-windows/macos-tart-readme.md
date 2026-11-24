---
title: "Tart (README and FAQ)"
url: https://github.com/openai/tart
authors: Cirrus Labs (repository now owned by the openai GitHub org; github.com/cirruslabs/tart redirects there)
date: repo created 2022-02-01; README/FAQ read at HEAD
accessed: 2026-11-22
kind: repo
---

## Summary
Tart is a CLI for building and running macOS and Linux VMs on Apple silicon via Virtualization.framework,
aimed at CI. VM images are pushed and pulled through OCI registries. The FAQ notes VZ's limits: nested
virtualization only on M3/M4 with macOS 15+ and only for Linux guests. A "Softnet" mode gives stricter
network isolation that can't reach the host.

## Key points
- Uses Virtualization.framework for "near-native performance".
- VM images are distributed as OCI artifacts.
- Nested virtualization: M3/M4, macOS 15+, Linux VMs only, behind the `--nested` flag.
- With Softnet, VMs cannot reach the host.
- macOS guests fall under the SLA's two-instance limit (see macos-sla-virtualization-two-instances.md).
- GitHub now resolves the repo to `openai/tart`. We verified only the redirect; we found no
  announcement of the transfer.

## Excerpts
> "Tart is a virtualization toolset to build, run and manage macOS and Linux virtual machines (VMs) on Apple Silicon." — README

> "supports nested virtualization only on M3 or M4 chips running macOS 15 (Sequoia) or later and only for Linux VMs" — FAQ

## Relevance to the talk
The standard way to sandbox macOS-native workloads, including agents that need Xcode, in a full VM.
Density is capped at two macOS VMs per Mac by licence, which is why macOS CI farms buy many Mac minis.
