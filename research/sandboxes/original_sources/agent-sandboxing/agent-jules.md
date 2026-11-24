---
title: "Environment setup" (Jules docs)
url: https://jules.google/docs/environment
authors: Google (Google Labs)
date: living document; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Jules, Google's asynchronous coding agent, runs each task in a "secure, short-lived virtual machine" in Google's cloud. The VM runs Ubuntu with common toolchains and Docker preinstalled, and has **internet access**. The docs name no hypervisor, egress allowlist or in-VM sandbox. The human control point is **plan approval**: Jules writes a plan before coding, but the UI auto-approves it on a timer, and API sessions skip approval unless `requirePlanApproval` is set. Jules is also being shut down. It went read-only after 2026-11-11 and shuts down on 2026-12-31, folding into Google Antigravity.

## Key points
- Status: winding down. "Jules will wind down on December 31, 2026. You have until November 11, 2026 to continue finishing up sessions", then read-only. Learnings go to "our agent-first platform, Google Antigravity" ("Jules Turndown", changelog 2026-10-29, https://jules.google/docs/changelog/2026-10-29). As of 2026-11-22 it is read-only.
- Runs: cloud VM per task. "Each task runs in a fresh virtual machine where Jules clones your repo, installs dependencies, and makes changes" (FAQ, https://jules.google/docs/faq). The VM image is Ubuntu with Node, Bun, Python, Go, Java, Rust, clang/gcc and Docker 28 plus Compose. An optional setup script can be saved as an environment **snapshot** for later tasks (Environment setup).
- Isolation: VM per task. The virtualisation technology is not documented, and nothing is documented beyond the VM.
- Filesystem: the agent controls the whole VM. The repo comes via the Jules GitHub App, with repo scope set in GitHub's app settings. Results return as a branch or PR that the user creates ("You are the branch owner"; https://jules.google/docs/running-tasks).
- Network: open. Code runs "in a secure, cloud-based virtual machine (VM) with internet access" (FAQ). No allowlist or proxy is documented. The FAQ puts the risk on the user: "You are responsible for the code you run."
- Secrets: repo-level environment variables, enabled per task, last for the whole task and "cannot be changed after the task has begun" (changelog 2025-10-01, https://jules.google/docs/changelog/2025-10-01). MCP support (2026-02-02) covers only hand-picked servers (Linear, Stitch, Neon, Tinybird, Context7, Supabase), "with a focus on security" (https://jules.google/docs/changelog/2026-02-02).
- Approvals: UI flow is plan, then **approve plan**, then code. "If you navigate away, Jules will eventually auto-approve the plan, which is set on a timer" (https://jules.google/docs/review-plan). In the REST API, the `approvePlan` call "is only needed when `requirePlanApproval` was set to `true`" (https://jules.google/docs/api/reference/sessions). `automationMode: AUTO_CREATE_PR` opens PRs automatically. Since 2026-01-26 a second-model "Planning Critic" reviews "all plans that do not require human intervention" (https://jules.google/docs/changelog/2026-01-26-1). Users can pause or steer at any time. There is no per-command approval.
- Enterprise or admin controls: none documented beyond GitHub App repo scoping.

## Excerpts
> "Jules runs each task inside a secure, short-lived virtual machine (VM)." (Environment setup)

> "When you run code in Jules, it's executed in a secure, cloud-based virtual machine (VM) with internet access." (FAQ)

> "If you navigate away, Jules will eventually auto-approve the plan, which is set on a timer." (Reviewing plans)

## Relevance to the talk
This is the minimal hosted-agent pattern: a throwaway VM, an open network, and a single human checkpoint at the plan. Even that checkpoint auto-approves on a timer, and for unattended plans it is backed by another model (the Planning Critic). In other words, an LLM reviewer replaces the human gate rather than any OS-level control. It also shows how fast this space moves: the public changelog starts in 2025, and the product shuts down at the end of 2026.
