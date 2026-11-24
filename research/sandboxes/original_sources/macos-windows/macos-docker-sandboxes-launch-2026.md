---
title: "Docker Sandboxes: Run Claude Code and Other Coding Agents Unsupervised (but Safely)"
url: https://www.docker.com/blog/docker-sandboxes-run-claude-code-and-other-coding-agents-unsupervised-but-safely/
authors: Srini Sekaran, Eric Jia (Docker Inc.)
date: 2026-01-30
accessed: 2026-11-22
kind: blog
---

## Summary
Docker announced that Docker Sandboxes, which had been in experimental preview "a few months" earlier,
now run each coding agent in a dedicated microVM. It launched on macOS and Windows, with Linux listed as
upcoming. The post argues containers are not enough, because agents need to run Docker themselves
(Docker-in-Docker needs privileges), and that full VMs are too slow and manual.

## Key points
- One microVM per agent. A fresh sandbox comes up "in seconds"; no numbers are published.
- Supported agents named: Claude Code, Codex CLI, Copilot CLI, Gemini CLI, Kiro.
- Positions OS-level sandboxing (Seatbelt-style) as inconsistent across platforms and disruptive to workflows.

## Excerpts
> "Each agent runs inside a dedicated microVM" — post

> "Containers seem like the obvious answer, until the agent needs to run Docker itself." — post

> "Full VMs work, but are slow, manual, and hard to reuse across projects." — post

## Relevance to the talk
A major vendor choosing "a VM per agent, made light" over "a shared VM plus containers" or "an OS
sandbox" for agents on macOS and Windows. A key data point for the density debate.
