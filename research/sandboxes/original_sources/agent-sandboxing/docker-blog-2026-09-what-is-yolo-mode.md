---
title: "YOLO Mode: Agent Autonomy Without the Guardrails"
url: https://www.docker.com/blog/what-is-yolo-mode/
also: https://docs.docker.com/get-started/tutorials/run-an-agent/
authors: Eric Jia (Staff Product Manager, Docker), Srini Sekaran (Principal PMM for AI, Docker)
date: 2026-09-03 (datePublished in page metadata)
accessed: 2026-11-23
kind: blog
---

## Summary
Docker's explainer on why developers turn approvals off and where to do it. It lists the reasons (context switching, "prompt fatigue", routine work, momentum), names each agent's off switch, and argues that keeping prompts on does not remove risk because fatigue leads to approving the wrong request. The answer it sells is a boundary (Docker Sandboxes). Docker's own tutorial starts Claude Code inside a sandbox with `--dangerously-skip-permissions` already on.

## Key points
- Reasons given for YOLO: context switching, prompt fatigue, low-risk routine work, momentum.
- Names the flags: Claude Code `--dangerously-skip-permissions`; Codex `--full-auto` and `--dangerously-bypass-approvals-and-sandbox`; Gemini CLI `--yolo` or Ctrl+Y.
- "keeping manual approvals on doesn't remove all risk": fatigue leads to accidental approvals.
- Calls classifier-based auto mode "a filter on top of the agent, not a boundary around it."
- Vendor source: Docker sells the sandbox it recommends.

## Excerpts
> "YOLO mode is when an AI agent auto-approves every action, with no confirmation prompts. It's popular because it's fast, and risky for the same reason."

> "On a regular task, a careful agent asks for permission constantly. "Can I edit this file, run this test, install this package, call this tool?" Dozens of prompts for one feature."

> "Once permission fatigue kicks in, it can be all too easy to accidentally approve the wrong request."

> "The goal is a boundary the agent can't cross, not a more careful set of prompts."

> "Inside a sandbox, Claude Code starts in its bypass-permissions mode ( --dangerously-skip-permissions ), so it doesn't stop to ask before every command." (Docker docs tutorial, "Run your coding agent in a sandbox")

## Relevance to the talk
A third vendor saying the same thing: prompts get turned off, and when they stay on they get clicked through. Docker's fix is the talk's thesis: move the control from the prompt to the boundary.
