---
title: "Embracing the parallel coding agent lifestyle"
url: https://news.ycombinator.com/item?id=45489884
story_url: https://simonwillison.net/2025/Oct/5/parallel-coding-agents/
points: 174
comments: 138
authors: HN thread (submitted by jbredeche); linked post by Simon Willison
date: 2025-10-06
accessed: 2026-11-22
kind: discussion
---

## Summary
Willison describes running several coding agents at once, mainly for research and low-risk tasks, using Claude Code on the web, Codex cloud and local worktrees, while reviewing results as they come in. The thread covers how to isolate parallel agents (git worktrees vs shallow clones in LXC containers vs cloud VMs), tools for managing them (Conductor, Rover), and whether review capacity makes parallelism self-defeating. Later threads extend the topic: "Git worktrees are not an isolation boundary for coding agents" ([49110389](https://news.ycombinator.com/item?id=49110389)), Superset, agent-of-empires, and Claude Code Projects running parallel workers ([50492141](https://news.ycombinator.com/item?id=50492141)).

## Key points
- Worktrees share one `.git` database, which is global mutable state. One commenter instead gives each LXC container a shallow clone and has the main repo pull from them, so the container is a real security boundary.
- Review is the bottleneck: generation scales, human review does not.
- Willison: parallel *research* tasks work best, and GUI managers such as Conductor run Claude Code across worktrees.
- Cloud agents (Codex cloud, Claude Code web) are a way to parallelise without local isolation work, at the cost of needing environment setup scripts.

## Excerpts
> "Git worktrees are global mutable state; all containers on your laptop are contending on the same git database… The container here is actually providing a security boundary." — CBLT ([45484252](https://news.ycombinator.com/item?id=45484252))

> "I also fire off tons of parallel agents, and review is hands down the biggest bottleneck." — Areibman ([45486217](https://news.ycombinator.com/item?id=45486217))

> "The thing that's working really well for me is parallel research tasks. I can pay full attention to the change I'm making right now, while having a couple of coding agents churning in the background…" — simonw ([45532027](https://news.ycombinator.com/item?id=45532027))

> "I'm trying out Conductor right now… it's a pretty slick macOS desktop app that handles running Claude Code within a GUI and uses Git worktrees to manage separate checkouts at the same time." — simonw ([45531558](https://news.ycombinator.com/item?id=45531558))

> "I'm not convinced there is any hope for a productive, long-term, burnout-free parallel agent workflow. Not while they need even the slightest amount of supervision/review." — grim_io ([45531488](https://news.ycombinator.com/item?id=45531488))

## Relevance to the talk
Parallel agents are what turn sandboxing into a density problem. A worktree isolates code and nothing else: the environment, ports, databases and credentials stay shared. That gap pushes users towards a container or VM per agent, and from there to the memory and cost arithmetic of the density section.
