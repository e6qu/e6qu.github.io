---
title: "container-use" (README)
url: https://github.com/dagger/container-use
authors: Dagger
date: repo created 2025-05-23; README read 2026-11-22
accessed: 2026-11-22
kind: repo
---

## Summary
container-use is an open-source MCP server/CLI from Dagger that gives each coding agent a fresh container *and its own git branch*, so several agents can work in parallel on one repository without trampling each other or the developer's working tree. It is less a security boundary than a workflow one: isolation is used to enable parallelism, observability (full command history) and cheap discard of failed attempts, with review done through ordinary git.

## Key points
- Works with any MCP-compatible agent (Claude Code, Cursor, Goose, VS Code…): add `container-use stdio` as an MCP server; optional agent rules appended to `CLAUDE.md`.
- "Each agent gets a fresh container in its own git branch - run multiple agents without conflicts, experiment safely, discard failures instantly."
- Real-time visibility of commands/logs "of what agents actually did, not just what they claim"; drop into any agent's terminal; `git checkout <branch>` to review.
- Powered by Dagger (BuildKit-based containers). Marked "early development".

## Excerpts
> "Go from babysitting one agent at a time to enabling multiple agents to work safely and independently with your preferred stack."

> "Real-time Visibility: See complete command history and logs of what agents actually did, not just what they claim."

## Relevance to the talk
Illustrates the "many parallel agents per machine" challenge and the pairing of sandbox with version control (branch-per-agent) as the unit of isolation and review. Also note: as an MCP server the tool relies on the agent *choosing* to use it — isolation by convention, not enforcement.
