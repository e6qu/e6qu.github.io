---
title: "Run Each Conversation in Its Own Docker Container" (OpenHands Docs, Agent Canvas)
url: https://docs.openhands.dev/openhands/usage/agent-canvas/backend-setup/docker-execution
authors: OpenHands (All Hands AI)
date: living document; read 2026-11-22 (docs repo OpenHands/docs @ 4b1ea8f531; product repo OpenHands/OpenHands @ 3e9cf433b0, release v1.43.0)
accessed: 2026-11-22
kind: docs
---

## Summary
OpenHands is still current and major (OpenHands/OpenHands, ~94k stars, v1.43.0 on 2026-11-20), but the product has changed shape: the main repo is now **Agent Canvas**, a self-hosted control centre that drives "agent backends" (an OpenHands Agent Server from the Software Agent SDK, or ACP agents such as Claude Code/Codex/Gemini/OpenCode). The standalone OpenHands CLI is marked "no longer actively maintained". The big change for sandboxing is the default: the npm `agent-canvas` install runs the agent server **directly on the host with no isolation** (`OH_CONVERSATION_RUNTIME` defaults to `local`), and confirmation mode is off by default. Docker isolation (whole stack in one container, or one hardened container per conversation) is opt-in; managed Cloud/Enterprise run each sandbox as a Kubernetes pod under a stronger-isolation container runtime.

## Key points
- Runs: Agent Canvas frontend + Agent Server on the user's machine (default), in Docker, on a VM, or on OpenHands Cloud/Enterprise or DigitalOcean Managed Agents as remote backends (https://docs.openhands.dev/openhands/usage/agent-canvas/backends).
- Isolation (local, all OSes): none by default. README "Option 1: Without a Sandbox" warns the agent "will have full access to your filesystem" (https://github.com/OpenHands/OpenHands/blob/main/README.md). Opt-in Docker: (a) run the whole Canvas image `ghcr.io/openhands/agent-canvas` with projects bind-mounted at `/projects`; (b) `OH_CONVERSATION_RUNTIME=docker` gives each conversation its own Agent Server container, run as host UID/GID, `--cap-drop ALL`, `no-new-privileges`, PID/memory/CPU limits (defaults 512 / 4g / 2.0). Canvas and the outer Agent Server stay on the host. Windows: Docker via WSL 2. No Seatbelt/bubblewrap/Landlock anywhere — a grep of OpenHands/software-agent-sdk @ 97b78a9921 finds none.
- Older "V1 sandbox" docs (legacy GUI / `openhands serve`) still say Docker is the default `RUNTIME`, with `process` (alias `local`) "no sandbox isolation" and `remote` (https://docs.openhands.dev/openhands/usage/sandboxes/overview). Those describe the legacy launcher, not Agent Canvas's `OH_CONVERSATION_RUNTIME`.
- Filesystem: local runtime = everything the user can access. In Docker mode the workspace is bind-mounted read-write at `/workspace`, plus per-conversation state directories. The docs warn the mount gives tools read/write access to that host directory. No ignore-file mechanism is documented.
- Network: no egress policy documented for local or Docker modes. Per-conversation containers map `host.docker.internal` to the host gateway, and in that mode the launcher listens on `0.0.0.0`. Enterprise sandbox pods sit on the cluster pod network (no host networking). Egress control is left to the operator's VPC/firewall (https://docs.openhands.dev/enterprise/docker-in-sandbox).
- Approvals: "Confirmation Mode" plus a "Security Analyzer" (LLM risk analyzer is the default, Invariant policy engine optional, or none = confirm every action). Only HIGH-risk actions are paused when an analyzer is set (https://docs.openhands.dev/openhands/usage/confirmation-mode). Agent Canvas defaults are `confirmation_mode: false`, `security_analyzer: "llm"` (src/services/settings.ts @ 3e9cf433b0), so the agent runs unprompted by default. The legacy CLI enables confirmation by default and has `--always-approve` and `--llm-approve` (https://docs.openhands.dev/openhands/usage/cli/command-reference). The SDK exposes `AlwaysConfirm()`, `NeverConfirm()` and `ConfirmRisky()` (https://docs.openhands.dev/sdk/guides/security).
- Cloud/Enterprise: one Kubernetes pod per sandbox under an operator-chosen `RuntimeClass` ("stronger-isolation runtime is the default", not named). Nested Docker runs unprivileged with user-namespace remapping, there is no host Docker socket, and no service-account token is mounted (https://docs.openhands.dev/enterprise/docker-in-sandbox).
- Caveat in the docs: client-supplied `container.memory` / `container.cpus` override the server limits and "are not capped by them".

## Excerpts
> "This runs the agent-server directly on the machine you're installing on — the agent will have full access to your filesystem!" (README, Option 1: Without a Sandbox)

> "Drops all Linux capabilities (`--cap-drop ALL`) and sets `no-new-privileges`." (docker-execution, How Isolation Works)

> "This mode provides **no sandbox isolation**." (Process Sandbox page)

> "HIGH: Action is paused, and user confirmation is requested" (Confirmation Mode and Security Analyzers)

## Relevance to the talk
OpenHands used to be the example of "agent in a Docker sandbox by default". As of late 2026 its flagship install runs on the host with no sandbox and no prompts, and container isolation is an opt-in backend choice. The posture moved from the product default into a deployment decision. Its Enterprise tier is a good example of the other end: a pod per sandbox, a hardened RuntimeClass, rootless nested Docker, and network policy pushed out to the VPC.
