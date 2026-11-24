---
title: "Daytona Documentation" (Sandboxes; Network Limits) and daytonaio/daytona README
url: https://www.daytona.io/docs/en/sandboxes/
authors: Daytona
date: living docs read 2026-11-22; GitHub repo created 2024-02-06, archived note says core development moved private "As of June 2026"
accessed: 2026-11-22
kind: docs
---

## Summary
Daytona markets itself as "secure and elastic infrastructure for running AI-generated code": sandboxes described as "full composable computers" that start in under 90 ms, are OCI/Docker-image based, persist state, and support fork, pause/resume and archive. The docs say sandboxes run as Linux containers by default (with Linux VM, Windows, macOS and GPU sandbox types also offered) while also claiming a "dedicated kernel" per sandbox — the precise isolation technology for the default container type is not stated in the pages read. Network egress policy is tiered by account trust level.

## Key points
- Default resources 1 vCPU / 1 GiB RAM / 3 GiB disk; org maximum 4 vCPU / 8 GB / 10 GB.
- Lifecycle: start, pause/resume, stop, archive, delete, recover, **fork**; auto-stop, auto-pause, auto-archive, auto-delete and wall-clock TTL settings.
- Network: Tiers 1–2 restricted by the organisation (no sandbox override); Tiers 3–4 default full internet. `networkAllowList` (IPv4 CIDR, ≤10), `domainAllowList` (hostnames with wildcards, ≤100), `networkBlockAll`. "Essential services" (package registries, git hosts, model providers) reachable under default tier policy but not bypassing a custom allow list.
- The open-source repo (`daytonaio/daytona`) is marked unmaintained; development moved to a private codebase in June 2026.

## Excerpts
> "Each sandbox runs in isolation, giving it a dedicated kernel, filesystem, network stack, and allocated vCPU, RAM, and disk." — Sandboxes

> "Sandboxes are the core component of the Daytona platform, spinning up in under 90ms from code to execution" — README

> "Essential services do not bypass a sandbox allow list or block-all setting." — Network Limits

## Relevance to the talk
Example of trust-tiered egress (new accounts get restricted network to curb abuse) and of the "essential services" problem: agents need registries, git hosts and model APIs, which are exactly the broad domains that make good exfiltration channels. Mechanism ambiguity is itself a point: marketing pages often don't say what the boundary is.
