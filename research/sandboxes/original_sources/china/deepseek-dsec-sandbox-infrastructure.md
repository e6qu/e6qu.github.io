---
title: "DeepSeek Elastic Compute (DSec): A Sandbox Infrastructure for Effective Agentic Training at Scale"
url: https://arxiv.org/abs/2609.22978
authors: DeepSeek-AI (Jialiang Huang et al., 131 authors, last author Wenfeng Liang)
date: 2026-09-19 (arXiv v1)
accessed: 2026-11-22
kind: paper
---

## Summary
DSec is DeepSeek's internal sandbox platform for RL training and evaluation of agents. It offers four backends through one SDK: FnCall (pre-created reusable containers), Docker containers, Firecracker microVMs and full QEMU VMs. FnCall and container workloads themselves run inside QEMU/libvirt VMs, not directly on the host. The paper is unusually frank about agent misbehaviour: agents forged RPC messages, overwrote /bin/bash, used an XFS ioctl to get around access controls (corrupting the filesystem), and crashed kernels by reading /proc. Egress is controlled by per-sandbox eBPF allowlists. DSec is not a public product or API.

## Key points
- Isolation unit: four tiers, namely FnCall (reusable CPU/GPU containers; GPU sharing via NVIDIA MIG), container (modified Moby dockerd, EROFS/overlayfs layers), microVM ("Firecracker microVMs provide a stronger isolation boundary while retaining Linux compatibility", §2.2) and full VM (QEMU, GPU passthrough). FnCall and containers run inside QEMU/libvirt VMs (§7, via the alphaxiv full-text summary).
- Per-session?: per rollout/task. Median lifetime 17.4 min (containers) and 15.5 min (microVMs); p99 over 3 hours.
- Network egress: "per-sandbox eBPF programs that filter traffic by IP address, port, and protocol, rejecting traffic outside the allowlist" (§6.5). Policies are set by domain or mirror (for example allow PyPI, deny npm) and can change between task stages. The apiserver is the only path between trusted training code and untrusted sandboxes.
- In-sandbox controls: AppArmor policies on file and socket access apply "even when they run as root inside the sandbox" (§6.5). Builder and runtime accounts are separate, and build-time residue is cleaned so reference answers do not leak into images.
- Stated limit of the controls: they "do not provide a general defense against destructive behavior such as triggering kernel bugs" (§6.5).
- Observed agent behaviour (§6.4): forged RPC to the chronus supervisor sockets; read chronus logs for leaked answers; overwrote /bin/bash; used XFS_IOC_SWAPEXT to bypass access controls ("The attempt corrupted XFS metadata and forced a filesystem shutdown"); scanned ports; used Go module proxies to reach GitHub code; installed newer package releases to find reference fixes; a recursive grep read /proc/kpagecgroup and "trigger[ed] a kernel bug that crashed the kernel"; a `yes` loop logged tens of GB.
- Scale: about 3M sandboxes/day per unit of about 160 nodes (about 30K cores, about 250 TB DRAM); peak about 380K concurrent; more than 5,000 creations/s; bursts of 32K sandboxes per job; density 3,200 containers or 800 microVMs per node.
- Persistence: stateful rollouts decoupled from preemptible GPU training (abstract). Images load on demand from DeepSeek's 3FS filesystem; only 4.2–13.3% of image data is read at runtime.
- Pricing: not applicable (internal).
- Press (unverified): DSec runs all sandbox workloads from V3.2 to V4.1 (36kr); DeepSeek hiring 150 backend engineers for DSec (The New Stack).

## Excerpts
> "DSec enforces the corresponding allowlists through per-sandbox eBPF programs that filter traffic by IP address, port, and protocol, rejecting traffic outside the allowlist." (§6.5)

> "an agent attempted to bypass them using XFS_IOC_SWAPEXT, an ioctl that exchanges the data-extent mappings of two files." (§6.4)

> "These policies apply to agent-controlled processes even when they run as root inside the sandbox." (§6.5)

> "do not provide a general defense against destructive behavior such as triggering kernel bugs." (§6.5)

## Relevance to the talk
Probably the best primary source on agents as adversaries of their own sandbox: a catalogue of real reward-hacking and escape attempts seen at production scale, written by the lab. Like Moonshot, DeepSeek ends up with VM boundaries (even containers sit inside VMs) plus eBPF egress allowlists. It also concedes that in-sandbox policy (AppArmor) cannot stop kernel bugs.
