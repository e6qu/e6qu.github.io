---
title: "GitHub - agent-infra/sandbox: All-in-One Sandbox for AI Agents that combines Browser, Shell, File, MCP and VSCode Server in a single Docker container."
url: https://github.com/agent-infra/sandbox
authors: agent-infra (ByteDance Web Infra x veFaaS team, per ByteDance Open Source posts)
date: repo active; README pins image tag 1.11.0; ByteDance article 2025-10-31
accessed: 2026-11-22
kind: repo
---

## Summary
AIO Sandbox is an open-source Docker image that puts the following behind one port (8080), sharing one filesystem:
- a Chromium browser (VNC and CDP)
- a WebSocket shell
- file APIs
- VS Code Server (code-server)
- Jupyter
- MCP servers

It is the execution environment for Agent TARS and the "All-in-One Sandbox" template on Volcano Engine veFaaS and AgentKit. The repo itself is only a container. Strong isolation is left to whatever runs the container, such as veFaaS or AgentKit microVMs in the cloud.

## Key points
- Isolation unit: one Docker container. The README's own run commands use `--security-opt seccomp=unconfined`, which turns off Docker's default seccomp filter. Code execution is described only as "Sandboxed Python and Node.js execution" and the mechanism is not described. A ByteDance article says code execution is "inherited from Sandbox Fusion", which matches the architecture diagram listing "Sandbox Fusion".
- Per-session?: no session model in the image. It is one container per agent or user, decided by the deployer. In the cloud, veFaaS and AgentKit map instances to sessions.
- Network egress: unrestricted from inside the container. Compose adds `host.docker.internal:host-gateway` and an optional `PROXY_SERVER`. The README says to "keep port `8080` private and publish it through a reverse proxy or Ingress".
- Auth: optional `SANDBOX_API_KEY`. "Without SANDBOX_API_KEY, services remain open (backward compatible)." The ByteDance article describes a JWT plus asymmetric-key gateway with short-lived tickets for URLs that cannot carry headers.
- Persistence: `docker run --rm` discards everything. The Compose example mounts a named volume `sandbox_data` at `/home/gem/workspace`. The "unified file system" means browser downloads are visible to the shell and file APIs.
- Limits: none built in. The README's Kubernetes example uses 2Gi memory and 1000m CPU limits, and Compose uses `shm_size: 2gb`.
- Pricing: free and open source. Cloud hosting is billed through veFaaS or AgentKit.
- Repo facts at access time: about 6.4k stars, 577 forks, Apache-2.0, and no GitHub releases shown (image tag 1.11.0 in the README). SDKs are `agent-sandbox` (Python), `@agent-infra/sandbox` (TypeScript) and `sandbox-sdk-go`.
- Ownership: the GitHub org page does not mention ByteDance. Evidence that it is ByteDance's:
  - "Introducing AIO Sandbox…" was posted by the ByteDance Open Source account on dev.to (https://dev.to/bytedanceoss/introducing-aio-sandbox-all-in-one-sandbox-environment-for-ai-agents-18k0).
  - The Chinese article "AIO Sandbox：为 AI Agent 打造的一体化、可定制的沙箱环境" (2025-10-31) is credited "字节跳动 Web Infra x veFaas 团队" (ByteDance Web Infra x veFaaS team) and was reposted on CSDN by ByteDanceOpenSource (https://adg.csdn.net/694d04245b9f5f31781acdb2.html).
  - The China image is hosted at `enterprise-public-cn-beijing.cr.volces.com/vefaas-public/all-in-one-sandbox`.
  - bytedance/UI-TARS-desktop's README entry for 2025-11-05 (Agent TARS CLI v0.3.0) says it "features exclusive support for AIO agent Sandbox as isolated all-in-one tools execution environment".
- The README cites arXiv:2509.02544 (UI-TARS-2 Technical Report, 2025-09-02), whose abstract mentions "a unified sandbox platform for large-scale rollouts".

## Excerpts
> "AIO Sandbox is an all-in-one agent sandbox environment that combines Browser, Shell, File, MCP operations, and VSCode Server in a single Docker container." — README

> "Without SANDBOX_API_KEY, services remain open (backward compatible)." — README, authentication

> "既要让 Agent 拿到真实系统能力（网络、文件、浏览器、GPU），又要强隔离避免越权与数据外泄。" — English: "Agents need real system capabilities (network, files, browser, GPU), yet also strong isolation to prevent privilege escalation and data exfiltration." (ByteDance Web Infra x veFaaS article, pain points)

## Relevance to the talk
This is the "fat sandbox" pattern: everything an agent needs in one image, so it stops shuttling files between separate browser and code sandboxes. It also shows the layering clearly. The image provides capabilities, not isolation. The README even disables seccomp, so the security boundary has to come from the platform underneath (veFaaS or AgentKit microVMs). Unauthenticated by default is worth a slide on its own.
