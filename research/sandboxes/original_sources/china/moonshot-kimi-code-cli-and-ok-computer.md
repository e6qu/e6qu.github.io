---
title: Interaction and input | Kimi Code Docs (plus Kimi Agent / "OK Computer" help page and Alibaba Cloud case study)
url: https://www.kimi.com/code/docs/en/kimi-code-cli/guides/interaction.html
authors: Moonshot AI
date: undated docs page (current as of 2026-11); OK Computer launched 2025-09-26
accessed: 2026-11-22
kind: docs
---

## Summary
Moonshot's local coding agent is Kimi Code CLI (github.com/MoonshotAI/kimi-code). The original Python Kimi CLI (github.com/MoonshotAI/kimi-cli) is archived and points users to it. Kimi Code runs on the user's own machine with no OS-level sandbox described in the docs. Safety comes from approval modes, a dangerous-command guard and hooks. Moonshot's hosted agent mode, "OK Computer" (launched 2025-09-26, now "Kimi Agent"), does run in a cloud sandbox. Moonshot's own help page does not describe that sandbox; Alibaba Cloud's case study says each agent task runs in a MicroVM on Alibaba's ACS Agent Sandbox.

## Key points
- Isolation unit (Kimi Code CLI): none documented; the agent runs directly on the user's system. The docs advise using YOLO-style modes only in an isolated environment (third-party summary of the docs; not quoted from the page I fetched).
- Permission modes (Kimi Code CLI docs): "Always Ask" (default; formerly Manual); "Ask When Needed" (formerly YOLO, `/yolo`), which auto-approves regular tool calls but still asks before sensitive actions such as reading `.env` or SSH keys; "Never Ask" (formerly Auto, `/auto`), where every approval is automatic and the built-in dangerous-command guard does not interrupt. Leaving Plan mode always needs confirmation, in every mode.
- Hooks: lifecycle hooks can "gate risky tool calls, audit decisions" (repo README).
- Repos: MoonshotAI/kimi-code, about 8.3k stars, MIT; MoonshotAI/kimi-cli, about 11.4k stars, Apache-2.0, archived ("Legacy Python Kimi CLI, no longer maintained"). Neither page lists a release.
- Isolation unit (OK Computer / Kimi Agent): per Alibaba Cloud, "The ACS Agent Sandbox uses MicroVM technology to provide hardware-level isolation for every Agent task" (https://www.alibabacloud.com/blog/602942, 2026-03-12, vendor-written). Moonshot's own help page (https://www.kimi.com/en/help/agent/agent-overview) does not mention a sandbox or VM.
- Per-session?: per agent task (Alibaba case study).
- Network egress: Kubernetes NetworkPolicy restricts agent-to-agent traffic (Alibaba). Internet egress policy is not described.
- Persistence: hibernation releases CPU and memory but keeps memory state, temporary storage and IP; wake-up takes seconds; per-agent NAS subdirectories (Alibaba).
- Scale (Alibaba, vendor claims): 100,000+ concurrent user requests at peak; "tens of thousands of sandboxes per minute"; startup latency cut by over 50%. A Machine Heart article on Alibaba Agent Sandbox (https://i.ifeng.com/c/8wn8AovQnkX, 2026-09-28) repeats: Kimi "实现每分钟数万个沙箱的弹性扩容，启动时间缩短 50%".
- Limits / pricing: Kimi Agent is freemium with quota tiers (third-party review); no sandbox limits published by Moonshot.

## Excerpts
> "auto-approves regular tool calls, making it suitable for batch tasks you know are safe." (Kimi Code docs, Ask When Needed mode)

> "Exiting Plan mode always requires your confirmation, in every permission mode, including Never Ask." (Kimi Code docs)

> "On September 26, 2025, Kimi released its first Agent product mode: \"OK Computer.\"" (Kimi help center)

> "The ACS Agent Sandbox uses MicroVM technology to provide hardware-level isolation for every Agent task." (Alibaba Cloud blog, 2026-03-12)

## Relevance to the talk
The same split as at Western labs: the local coding CLI relies on approvals and no sandbox, while the hosted agent gets a microVM per task. Moonshot buys that microVM layer from Alibaba Cloud rather than building it, even though it built AgentENV (Firecracker) for training. The renamed modes ("YOLO" became "Ask When Needed") show vendors moving toward permission tiers.
