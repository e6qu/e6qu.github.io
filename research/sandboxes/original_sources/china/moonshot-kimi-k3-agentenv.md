---
title: "Kimi K3: Open Frontier Intelligence" (Technical Report of Kimi K3), section 5.3.2 "Sandbox Infrastructure"; and AgentENV README
url: https://github.com/MoonshotAI/Kimi-K3/blob/main/k3_tech_report.pdf
authors: Kimi Team (Moonshot AI); AgentENV by kvcache-ai with Moonshot AI
date: 2026-07 (report released with the K3 weights; benchmark data "as of July 23, 2026"; AgentENV open-sourced 2026-07-27 per press)
accessed: 2026-11-22
kind: paper
---

## Summary
The Kimi K3 technical report has a short section on the sandboxes used for agentic RL training and evaluation. Moonshot runs three sandbox runtimes: a container runtime, a GPU sandbox runtime, and AgentENV, a new runtime built on Firecracker microVMs. The report says the move to microVMs came after agents in container sandboxes caused host kernel panics and deadlocks. AgentENV is open source (github.com/kvcache-ai/AgentENV) and exposes an E2B-compatible API.

## Key points
- Isolation unit: Firecracker microVM in AgentENV ("By running isolated microVMs with Firecracker [3], AgentENV provides a level of isolation and fidelity that container-based runtimes cannot match"). A "traditional container-based runtime" and a "GPU sandbox runtime" are also used; the report does not describe their isolation.
- Why they moved off containers: "in our early experiments with traditional container-based sandbox runtimes, we observed several kernel panics and deadlocks caused by unintended agent operations."
- Design intent: give the agent a near-real machine rather than restrict it: agents "should be able to mount disks, run containers, or even launch virtual machines at will."
- Per-session?: one sandbox per rollout/environment; supports Pause and Resume, Fork (new sandbox from the exact state of a running one) and Snapshot.
- Network egress: not described in the report or the README.
- Persistence: incremental checkpointing (only dirtied memory pages saved). Report: checkpoint latency as low as 133 ms and resume 49 ms. README: snapshots persist to S3-compatible object storage or a shared filesystem.
- Pause economics: "a paused sandbox consumes no memory or CPU resources"; waiting for model inference "can account for as much as 98% of the sandbox lifetime".
- Scale: "a total of 51,219,741 sandboxes across 1,505,678 images were created" during K3 training and evaluation. Image format OverlayBD with a custom ublk driver and P2P transport.
- Memory overcommit: report says "up to 6.5x in real workloads"; the AgentENV README says 9.6x in production. The two numbers do not match.
- AgentENV README (https://raw.githubusercontent.com/kvcache-ai/AgentENV/main/README.md): "Snapshot-backed environments boot or resume in under 50 ms and pause in under 100 ms"; requires Linux kernel 6.8+ and /dev/kvm (PVM guide for hosts without KVM); "AgentENV exposes an E2B-compatible HTTP API"; "AgentENV authenticates API requests but does not encrypt traffic."
- Limits / pricing: none published (internal training infrastructure, self-hosted open source).
- License: MIT (GitHub API, 2026-11-22: kvcache-ai/AgentENV, 3,776 stars, created 2026-07-23).

## Excerpts
> "As agents become more capable and tasks more difficult, they tend to explore more aggressively and may even attempt reward hacking." (Tech report §5.3.2)

> "we observed several kernel panics and deadlocks caused by unintended agent operations" (Tech report §5.3.2)

> "Throughout Kimi K3's training and evaluation, a total of 51,219,741 sandboxes across 1,505,678 images were created." (Tech report §5.3.2)

> "AgentENV exposes an E2B-compatible HTTP API." (AgentENV README)

## Relevance to the talk
A frontier lab saying in writing that containers were not enough for RL agents, because the agents crashed the shared host kernel, and that it moved to Firecracker microVMs. This is the same direction as DeepSeek's DSec (see deepseek-dsec note). It also shows the E2B API becoming a de facto interface: AgentENV, Alibaba's sandbox and ms-enclave all speak it.
