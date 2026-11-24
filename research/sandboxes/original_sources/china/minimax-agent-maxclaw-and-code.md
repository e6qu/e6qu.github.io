---
title: "MaxClaw | Build Your AI Agent with Zero Code - MiniMax Official Cloud Agent" (plus MiniMax Code changelog / permissions docs and Mini-Agent repo)
url: https://agent.minimax.io/activity/max-claw
authors: MiniMax
date: undated page; MaxClaw launched about 2026-02-25/26 (sources differ); MaxHermes 2026-04-16
accessed: 2026-11-22
kind: docs
---

## Summary
MiniMax has three agent surfaces: the hosted MiniMax Agent with its cloud products MaxClaw (hosted OpenClaw) and MaxHermes (hosted Hermes Agent); a local coding tool, MiniMax Code (desktop app and `mcode` CLI); and the open-source demo Mini-Agent. MiniMax's own pages say nothing about how the cloud agents are isolated. A Machine Heart article on Alibaba Cloud's Agent Sandbox says MaxClaw and MaxHermes use it, a MicroVM-based service, as their "secure execution environment" (vendor/press claim, not confirmed by MiniMax). The MiniMax Code changelog mentions "sandboxing" and a read-only filesystem policy, but no backend is named in the docs I could reach.

## Key points
- Isolation unit (MaxClaw/MaxHermes): not stated by MiniMax. Per Machine Heart on Alibaba Agent Sandbox (https://i.ifeng.com/c/8wn8AovQnkX, 2026-09-28), it is Alibaba ACS Agent Sandbox, which "MicroVM 为每个执行环境提供独立的运行边界". Unverified (press/vendor only).
- Scale claim (same article): "MiniMax基于 Agent Sandbox 在 10 秒内拉起 5000 个沙箱，整体 TCO 降低 25%" (5,000 sandboxes in 10 s, TCO down 25%). Vendor claim.
- Per-session?: MaxClaw is an always-on 24/7 agent with "long-term memory" and a 50 GB cloud workspace (MaxClaw page), so it is a persistent per-user environment rather than a per-task one.
- Network egress: not documented.
- Persistence: long-term memory, files and context kept across sessions (MaxClaw page).
- MiniMax Code CLI (changelog, https://code.minimax.io/docs/changelog.md): 0.4.8 (2026-09-16) "with a read-only filesystem policy when sandboxing is available"; 0.6.9 (2026-10-12) "Normal permission modes, sandboxing, root/home recursive-delete protection and network-share blocking remain active"; 0.7.0 (2026-10-26) runs something "in a sandbox and brings only the filtered results back into context". Permission modes: Ask / Auto / Full access; headless `--permission ask|smart|full|off`. Desktop v3.0.72 (2026-09-14) can "Hand local tasks to the cloud". Sandbox technology not named.
- MiniMax Code source: github.com/MiniMax-AI/minimax-code is a "source preview" (0.6.3); first-party code MIT; README says it can "control tool execution with permissions and sandboxing". Desktop app source not included.
- Mini-Agent (https://github.com/MiniMax-AI/Mini-Agent): about 3.1k stars, MIT, no releases listed. File system and shell tools in a `./workspace` directory; no sandbox, isolation or approval mechanism mentioned.
- Limits / pricing: MaxClaw pricing not checked; no sandbox limits published.

## Excerpts
> "Users do not need to deploy servers, configure Docker, or manage API keys." (MaxClaw page)

> "此前MiniMax云端 AI 助手 MaxClaw 和 MaxHermes 的架构中，就使用 Agent Sandbox 作为 agent的安全执行环境。" — English: "MiniMax's cloud assistants MaxClaw and MaxHermes already used Agent Sandbox as the agents' secure execution environment." (Machine Heart via ifeng, 2026-09-28; press)

> "Normal permission modes, sandboxing, root/home recursive-delete protection and network-share blocking remain active" (MiniMax Code CLI changelog 0.6.9)

## Relevance to the talk
MiniMax, like Moonshot (Kimi), appears to rent its isolation from Alibaba Cloud's microVM Agent Sandbox rather than build it. Alibaba is becoming the E2B of China. MiniMax publishes nothing about the boundary itself, which is a transparency gap compared with Zhipu's detailed egress docs.
