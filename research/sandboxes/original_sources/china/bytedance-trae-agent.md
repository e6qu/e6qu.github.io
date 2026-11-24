---
title: "GitHub - bytedance/trae-agent: Trae Agent is an LLM-based agent for general purpose software engineering tasks."
url: https://github.com/bytedance/trae-agent
authors: ByteDance
date: repo active; no GitHub releases published (tech report arXiv:2507.23370, 2025-07-31)
accessed: 2026-11-22
kind: repo
---

## Summary
Trae Agent is ByteDance's open-source CLI coding agent. Its README calls the design "research-friendly". Its main tools are a persistent bash session and a file editor. The README does not say where commands run by default. It documents Docker as an opt-in way to run a task in a new or existing container, and there is no other sandbox.

## Key points
- Isolation unit: none by default. The README never says commands are sandboxed, so the inference is that they run on the host in the working directory. Optionally a Docker container can be used: `--docker-image` (new container from an image), `--docker-container-id` (attach to an existing one), `--dockerfile-path` (build one), `--docker-image-file` (load a tar) and `--docker-keep` (keep or remove the container afterwards).
- Per-session?: The bash tool keeps "a shared bash session that maintains state" across commands (docs/tools.md). With Docker, it is one container per task.
- Network egress: not mentioned. No network controls are documented.
- Persistence: Without Docker, changes are written directly to the working directory. `--docker-keep` decides whether the container survives the task.
- Limits: "120-second timeout per command" for the bash tool (https://github.com/bytedance/trae-agent/blob/main/docs/tools.md).
- Pricing: free, open source.
- Repo facts at access time: about 12.2k stars, 1.4k forks, MIT license, and no GitHub releases.
- Default tools in the example config: `bash`, `str_replace_based_edit_tool`, `sequentialthinking`, `task_done`.
- The technical report, "Trae Agent: An LLM-based Agent for Software Engineering with Test-time Scaling" (arXiv:2507.23370, submitted 2025-07-31), is about SWE-bench test-time scaling. Its abstract does not mention sandboxing.
- Trae Agent is a separate codebase from the TRAE IDE. The IDE's Seatbelt/Bubblewrap sandbox is not part of this repo, as far as the README shows.

## Excerpts
> "Specify a Docker image to run the task in a new container" — README, Docker mode

> "**Important**: You need to make sure Docker is configured in your environment." — README, Docker mode

> "Execute shell commands in a persistent session." / "120-second timeout per command" — docs/tools.md, bash tool

## Relevance to the talk
Trae Agent follows the typical research pattern: it runs on the host by default and uses Docker when you ask, which is roughly how SWE-agent and OpenHands started out. Set beside the TRAE IDE, it shows that ByteDance's product team and its research team made different isolation choices.
