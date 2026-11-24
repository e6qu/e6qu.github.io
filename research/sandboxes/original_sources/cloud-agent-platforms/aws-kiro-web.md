---
title: "Sandbox" and "Internet access" (Kiro web / autonomous agent docs) and "Cloud sessions" (Kiro docs)
url: https://kiro.dev/docs/cloud-sessions/
authors: Amazon Web Services (Kiro)
date: living documents; read 2026-11-22 (companion pages https://kiro.dev/docs/web/sandbox/, https://kiro.dev/docs/web/sandbox/internet-access/, https://kiro.dev/docs/autonomous-agent/sandbox)
accessed: 2026-11-22
kind: docs
---

## Summary
This is a delta note. The main Kiro note, `../agent-sandboxing/agent-kiro.md`, already covers Kiro Web and cloud sessions: one isolated sandbox per task with an undocumented isolation technology, every action auto-approved, three internet levels plus a custom allowlist, and optional VPC attachment. Re-reading the cloud pages on 2026-11-22 adds only small facts. The **isolation technology is still not named** (no VM, microVM, container, or link to AgentCore), and **the default internet level is still not stated**.

## Key points
- **Per what / lifetime:** "Each task runs in its own sandbox with configurable access controls." The sandbox's file state, conversation history and bound repos persist with the session, so you can reattach from any surface. "Deleting the session removes its sandbox." No idle timeout or max lifetime is published.
- **Concurrency and price:** You can run up to 10 cloud sessions in parallel. They are "included with your existing Kiro plan, with no separate charge for cloud compute."
- **What's inside:** The same agent harness as the local IDE and CLI, plus a headless Chrome with browser-automation tools. Repos are cloned server-side through the connected source provider ("your local working copy is never uploaded"). The sandbox cannot reach the user's machine.
- **Network levels:** *Connections access only* ("The minimum access level required for the sandbox to function": clone and PR/MR on GitHub/GitLab "through the gateway service"), *Common dependencies* (registries such as npm, PyPI, crates.io, Maven), and *Open internet*. Custom domains use `.domain` syntax for subdomains. The enforcement mechanism (proxy vs DNS) is not documented. The docs warn of "prompt injection attacks" and "extraction of code and secrets".
- **Credentials:** Git operations go via a Kiro "gateway service", so presumably no raw git token sits in the sandbox *(not stated)*. Other secrets are configured as "environment variables and secrets for task execution" and are therefore visible to the agent inside the sandbox.
- **Region:** Kiro blog posts say cloud sessions run in us-east-1 only *(from search summaries; not re-checked)*. Kiro API PrivateLink endpoints exist, but that is client→Kiro, not sandbox egress.

## Excerpts
> "Each task runs in its own sandbox with configurable access controls." (Autonomous agent: Sandbox)

> "Enabling network permissions exposes your environment to security risks." (Internet access)

## Relevance to the talk
This is a hyperscaler-built coding agent whose hosted sandbox is documented less precisely than AWS's own AgentCore and Lambda MicroVMs. It is a reminder that "runs on AWS" says nothing about the isolation unit. The egress model (git-only, registries, or open, plus allowlist) matches Codex cloud and Copilot's firewall almost exactly.
