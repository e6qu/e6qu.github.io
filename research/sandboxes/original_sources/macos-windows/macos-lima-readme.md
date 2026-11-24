---
title: "Lima: Linux Machines (lima-vm/lima README and v2.0.0 release notes)"
url: https://github.com/lima-vm/lima
authors: Lima maintainers (CNCF Incubating; top contributor per GitHub: Akihiro Suda)
date: repo created 2021-05-14; v2.0.0 released 2025-11-06 (https://github.com/lima-vm/lima/releases/tag/v2.0.0)
accessed: 2026-11-22
kind: repo
---

## Summary
Lima launches Linux VMs with automatic file sharing and port forwarding, described as "similar to WSL2".
It was originally built to bring containerd/nerdctl to Mac users and now also hosts Docker, Podman and
Kubernetes. v2.0.0 (2025-11-06) added pluggable VM drivers, including a krunkit driver for GPU, and an
MCP integration explicitly aimed at using Lima "as a sandbox for AI agents". It also marked Lima's
promotion to CNCF Incubating.

## Key points
- One VM per Lima instance, using the VZ or QEMU drivers.
- Colima, Rancher Desktop and others build on Lima.
- v2.0.0 highlights:
  - Experimental VM-driver plugins and a krunkit driver.
  - Experimental MCP integration.
  - `/tmp/lima` no longer mounted by default.
- AI docs (https://lima-vm.io/docs/config/ai/) describe two modes: agent inside the VM, or agent outside
  calling Lima's MCP tools.

## Excerpts
> "Lima launches Linux virtual machines with automatic file sharing and port forwarding (similar to WSL2)." — README

> "Lima can be now used as a sandbox for AI agents such as Gemini." — v2.0.0 release notes

## Relevance to the talk
The open-source "one Linux VM on your Mac" baseline, which is now marketing itself for agent
sandboxing. Its density story is one VM per instance: you either share one instance across agents, so
they share a kernel, or pay a VM per agent.
