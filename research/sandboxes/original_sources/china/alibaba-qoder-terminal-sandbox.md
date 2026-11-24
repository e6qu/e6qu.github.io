---
title: Terminal and Sandbox - Qoder
url: https://docs.qoder.com/user-guide/quest/terminal-and-sandbox
authors: Qoder (Alibaba)
date: undated (footer © 2026); companion vendor blog "Terminal Sandbox: Infrastructure for the Agent Harness", 2026-08-06
accessed: 2026-11-22
kind: docs
---

## Summary
Qoder is Alibaba's agentic IDE. Tongyi Lingma (通义灵码) was renamed "Qoder CN" on 2026-05-20 (https://help.aliyun.com/zh/lingma/qoder-cn/product-overview/what-is-qoder-cn). Qoder has a native per-command terminal sandbox: Seatbelt on macOS, bubblewrap on Linux, and a home-grown restricted-token engine on Windows. Commands are routed to run directly, run sandboxed, or ask the user, based on the mode and an LLM/AST risk classification. If a sandboxed command fails because of the sandbox, the agent asks to escalate and run it unsandboxed. The workspace is writable, the rest of the disk is read-only, `~/.ssh` and similar paths are hidden, and network control is a coarse on/off switch.

## Key points
- Isolation unit: an OS process sandbox per terminal command, not a VM or container. macOS uses Seatbelt (`sandbox-exec`, policy generated at runtime from deny-all, `.git` read-only). Linux uses bubblewrap with user namespaces (read-only root, explicit writable binds, tmpfs over sensitive paths, `--unshare-net`). If bwrap is missing, commands run unsandboxed with a warning. Windows uses a "proprietary sandbox engine distributed with the IDE". The blog (https://alibabacloud.com/blog/terminal-sandbox-infrastructure-for-the-agent-harness_603433, vendor blog) describes it as a Rust `sandbox.exe` built on `CreateRestrictedToken`, dynamic DACLs with a capability SID, and a Job Object. AppContainer was rejected so that Windows 7 stays supported. The docs admit the Windows sandbox is user-mode and "can't fully stop adversarial attacks".
- Per-session?: per command. In Agent Mode, routine commands run directly and risky or blocklisted ones ask for approval. In Experts Mode, non-risky commands run directly (ignoring the blocklist) and risky ones run in the sandbox without asking. The page does not say whether the sandbox is on by default outside Experts Mode.
- Risk pipeline (blog): an LLM risk flag at generation time, AST parsers for PowerShell, Bash/Zsh and CMD, and a dangerous-command list. Then a two-stage AI review (sandbox entry, then a stricter escalation review) with a 10 s timeout and 3 retries. If the model is unreachable, everything is blocked.
- Network egress: "Network control is currently a coarse on/off switch; granular domain-level filtering is planned." The blog says the default allows all traffic.
- Filesystem: "The workspace directory is writable, while other directories are read-only." Sensitive paths such as `~/.ssh` are hidden.
- Escalation: if a command fails, the AI checks whether the sandbox caused it, asks permission, and on approval runs it in the terminal "without sandbox limits".
- Numbers (blog, vendor): "nearly one million terminal commands per day", more than 10,000 flagged for review, and close to 100 touching protected resources directly. macOS `sandbox-exec` adds 43–72 ms one-time startup. Windows overhead averages +7.7%. The blog says "PowerShell spawn ~+19%, roughly 4.8 seconds additional per invocation". The 4.8 s figure looks inconsistent with a 19% overhead and may be a typo for ms (unverified).
- Qoder CLI also documents a sandbox (https://docs.qoder.com/cli/sandbox): backends sandbox-exec, Docker or Podman, with runsc and lxc set explicitly via `QODER_SANDBOX`. **Unverified**: the URL returned 404 when fetched and was seen only in a search snippet. Qoder Cloud Agents run in an Ubuntu 22.04 "ephemeral workspace" container, reclaimed after 24 h idle, and the page names no isolation technology (https://docs.qoder.com/en/cli/cloud-agents/container-reference).
- The Qoder docs label the "Quest window" (where this page lives) as retired and being closed to existing users in batches.
- Pricing: n/a.

## Excerpts
> "Network control is currently a coarse on/off switch; granular domain-level filtering is planned." (Terminal and Sandbox)

> "The workspace directory is writable, while other directories are read-only." (Terminal and Sandbox)

> "The sandbox protects the moment that judgment fails—so a wrong click doesn't cost an entire disk." (Alibaba Cloud blog, 2026-08-06)

## Relevance to the talk
Qoder follows the same local-sandbox pattern as Claude Code and Codex: Seatbelt and bubblewrap. It adds a Windows restricted-token design that avoids AppContainer, which is rarely documented, and an LLM gate on escalation. The blog publishes real overhead numbers and daily command volumes. The weak points are the familiar ones: network is all-or-nothing, it falls back to no sandbox when bwrap is missing, and "approve to run unsandboxed" is the escape hatch.

Alibaba's other local coding agent, Qwen Code, is covered in [../agent-sandboxing/agent-qwen-code.md](../agent-sandboxing/agent-qwen-code.md) and in the [top coding agents matrix](../agent-sandboxing/top-coding-agents-matrix.md). It has an opt-in Seatbelt, Docker/Podman or bwrap/Landlock sandbox, open network by default, and an `auto` classifier approval mode. A re-check on 2026-11-22 found nothing new for it: no cloud sandbox and no AgentBay or E2B integration. Qoder's sandbox, by contrast, works per command, and it covers Windows natively.
