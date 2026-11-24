---
title: "OpenSandbox: Secure, Fast, and Extensible Sandbox runtime for AI agents" (GitHub README), with docs/guides/secure-container.md and OSEP-0001 FQDN-based Egress Control
url: https://github.com/opensandbox-group/OpenSandbox
authors: Alibaba (original author, now hosted by the Agentic AI Foundation / Linux Foundation)
date: repo created 2025-12-17; announced by Alibaba 2026-03-03 (press); donated to AAIF 2026-10-22; latest release 1.3.0-rc.2 on 2026-11-19
accessed: 2026-11-22
kind: repo
---

## Summary
OpenSandbox is Alibaba's open-source, self-hosted sandbox platform for agents (Apache-2.0, about 17.8k stars). A sandbox server exposes a unified lifecycle API, and an in-sandbox `execd` daemon exposes code, command and file APIs. It runs on Docker locally or on Kubernetes through an operator. Isolation is runc by default, with opt-in gVisor, Kata (QEMU) or Kata+Firecracker. Egress control is an FQDN policy enforced by a sidecar that shares the sandbox's network namespace. Alibaba contributed it to the Agentic AI Foundation in October 2026. `github.com/alibaba/OpenSandbox` now resolves to `opensandbox-group/OpenSandbox`.

## Key points
- Isolation unit: a container per sandbox. The default is runc ("Standard runc is the default when `type` is empty"). Secure runtimes are configured server-wide in `[secure_runtime]`: `gvisor` (runsc), `kata` (Kata + QEMU) or `firecracker` (Kata + Firecracker). The Kubernetes RuntimeClass names are `gvisor`, `kata-qemu` and `kata-fc`, and Firecracker is not available in Docker mode (https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/guides/secure-container.md). One runtime applies to every sandbox a server creates; mixing runc and Kata needs separate server releases. The secure-container guide contradicts itself on the default (it says "kata" in one list and runc elsewhere).
- Per-session?: one sandbox per create call. Kubernetes supports resource pools and batch creation (BatchSandbox) aimed at evaluation and RL.
- "Fast Sandbox" runtime on Kubernetes uses Firecracker microVMs. The README reports about 64 ms P50 creation (serial) and 125.4 ms P99 (10 concurrent), and pause/resume "with memory and disk state preserved".
- APIs (https://github.com/opensandbox-group/OpenSandbox/blob/main/docs/api/index.md): `sandbox-lifecycle.yml` (`/v1`: create/list/delete, pause/resume, timeouts, endpoints, templates, snapshots, credential vault). `execd-api.yaml` (code-interpreter contexts, shell, bash sessions, filesystem, metrics). `egress-api.yaml` (sidecar policy and credential vault). `diagnostic-api.yml`. SDKs exist for Python, Java/Kotlin, TS/JS, C#/.NET and Go, plus the `osb` CLI and an MCP server. **E2B compatibility is not claimed** in the README or the API index.
- Network egress (OSEP-0001, status Implemented, last updated 2026-01-22): an egress sidecar in the sandbox netns. Layer 1 is a DNS proxy on 127.0.0.1:15353 with port 53 redirected by iptables, returning NXDOMAIN for denied names. Layer 2 (optional) is an nftables allowlist of IPs learned from DNS. Only the sidecar gets CAP_NET_ADMIN. When a `network_policy` is given, `defaultAction` defaults to deny. Third-party doc mirrors (mintlify, deepwiki) say the sidecar is injected only when a `network_policy` is given, which would leave egress unfiltered by default. This is unverified in the repo, and the OSEP's notes on the no-policy case are inconsistent. The OSEP itself says DNS-only mode is "soft": "applications can bypass DNS filtering by using direct IP connections". There is no L7 inspection and no IPv6 yet. gVisor cannot run the sidecar (no `nat` table), so the server rejects gVisor + `network_policy` with HTTP 400. A Credential Vault injects outbound credentials so the sandbox never sees the real secrets.
- Persistence: pause/resume and snapshots (Firecracker sandboxes keep memory and disk). Docker gVisor snapshots need `--overlay2=none`.
- Limits: the egress rule cap `OPENSANDBOX_EGRESS_MAX_RULES` defaults to 4096 (seen via third-party doc mirrors, unverified in the repo).
- Pricing: none (self-hosted OSS).
- Provenance: the Linux Foundation press release (2026-10-22, https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox) says Alibaba contributed OpenSandbox alongside Anthropic's Agent Skills, OpenAI's Open Responses and Hugging Face's OpenEnv. It quotes Alibaba's Xiaobin Xu (Head of Development Infrastructure): "we don't want its future to be defined by a single company." The 2026-03-03 launch date comes from press only (cryptonomist and others).

## Excerpts
> "Start with Docker and deploy on Kubernetes through a unified lifecycle API." (README)

> "Firecracker sandboxes support pause/resume with memory and disk state preserved." (README)

> "Without Layer 2 (nftables), applications can bypass DNS filtering by using direct IP connections" (OSEP-0001)

> "The server validates this combination at request time and returns HTTP 400 with a clear error message" (secure-container guide, on gVisor + network_policy)

## Relevance to the talk
This is the open-source, self-hosted counterpart to E2B and Alibaba's managed Agent Sandbox. The default isolation is plain runc, and stronger isolation is a server-wide opt-in, which is worth stating plainly on a slide. The egress design is honest about its weak spot (DNS-only filtering can be bypassed with a direct IP). The gVisor-vs-egress-sidecar incompatibility is a concrete example of isolation layers interfering with each other. It is now vendor-neutral under the AAIF, which matters for anyone choosing a self-hosted sandbox API to standardise on.
