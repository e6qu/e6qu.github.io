---
title: Understanding Manus sandbox - your cloud computer
url: https://manus.im/blog/manus-sandbox
authors: Manus (Butterfly Effect)
date: 2026-01-14 (page shows "Wednesday, January 14"; year inferred from © 2026)
accessed: 2026-11-22
kind: blog
---

## Summary
Manus gives each task its own "fully isolated cloud virtual machine" with networking, a file system, a browser and tools. The agent and the user have full control inside it, under a "Zero Trust" model where session and account data are not reachable from the sandbox. Idle sandboxes sleep and wake with files intact, and are recycled after 7 days (free) or 21 days (Pro). After recycling, only deliverables are restored, not intermediate files. In April 2026 Manus added a separate always-on "Cloud Computer" (persistent Ubuntu VM). The underlying technology is E2B's Firecracker microVMs, self-hosted (see manus-e2b-case-study).

## Key points
- Isolation unit: "fully isolated cloud virtual machine that Manus allocates for each task" (no technology named on this page; E2B says Firecracker microVM).
- Per-session?: per task. Sandboxes run in parallel and one task does not affect another.
- Network egress: sandboxes have "full capabilities: networking, file system, browser, various software tools"; no restrictions described.
- Persistence: sleep/wake keeps files. Recycling after 7 days (free) or 21 days (Manus Pro) of sleep. On recycle a new sandbox is created and "Manus artifacts, uploaded attachments, and important files such as Slides/WebDev will be restored automatically", but "Intermediate code and temporary files created during execution will not be restored."
- Security model: "Zero Trust". Users and Manus have full control, operations "only affect that Sandbox", and session/account data "cannot be accessed from the Sandbox". Sharing exposes the conversation and outputs, not the sandbox. "Connectors will be automatically disabled once collaboration is enabled."
- Cloud Computer (https://manus.im/blog/manus-cloud-computer, 2026-04-30; help https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer, 2026-06-05): a "dedicated, persistent virtual machine" running Ubuntu Linux, always on, command-line only; "Files, installed tools, and running processes remain active between sessions"; "fully isolated from your personal machine and cannot access your local files". If payment stops, the machine closes and working files are deleted. "Permissions are based on who sent the last message in a session." The standard sandbox "spins up for a task and disappears when the session ends" (Cloud Computer blog; this conflicts with the 7/21-day retention described above).
- Limits: no CPU, RAM or disk figures published. The sandbox is "available to all users across all subscription tiers".
- Leaked system prompt (unverified): a March 2025 gist by jlia0 (https://gist.github.com/jlia0/db0a9695b3ca7609c9b1a08dcbf872c9), said to be extracted from Manus, includes "Ubuntu 22.04 (linux/amd64), with internet access", "User: `ubuntu`, with sudo privileges", "Home directory: /home/ubuntu". Manus has not confirmed it. Heise separately reported Manus saying its sandboxes run Ubuntu 22.04.
- Corporate (press only, unverified by primary docs): Meta agreed to acquire Manus in late December 2025 (reported >$2B, WSJ via AP). China's MOFCOM opened a review in January 2026, and the NDRC ordered the deal unwound on 2026-04-27 (TechCrunch, The Register). Meta cut Manus off from internal systems in June 2026, and Manus confirmed separation and a user-data deletion plan in August 2026 (MLex, SCMP). Manus has resumed independent operation. Search-engine listings for some localized URLs of this blog post (de, it, pt, th, zh-cn) show the title "Manus is now part of Meta", which is probably a stale index entry; not checked.
- Pricing: not on this page.

## Excerpts
> "fully isolated cloud virtual machine that Manus allocates for each task" (sandbox blog)

> "Intermediate code and temporary files created during execution will not be restored." (sandbox blog)

> "Files, installed tools, and running processes remain active between sessions." (Cloud Computer help article)

> "Ubuntu 22.04 (linux/amd64), with internet access" (leaked prompt gist; unverified)

## Relevance to the talk
The reference design for a consumer general agent: one VM per task, full root inside, open internet, isolation at the VM boundary rather than inside it, plus a separate always-on VM product when users want servers. The "Zero Trust" claim means the sandbox is untrusted from the platform's side, not that the agent is restricted.
