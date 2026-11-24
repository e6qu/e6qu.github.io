---
title: "I watched Gemini CLI hallucinate and delete my files"
url: https://news.ycombinator.com/item?id=44651485
story_url: https://anuraag2601.github.io/gemini_cli_disaster.html
points: 304
comments: 365
authors: HN thread (submitted by anuraag2601, the post's author)
date: 2025-07-22
accessed: 2026-11-22
kind: discussion
---

## Summary
A product manager experimenting on Windows asked Gemini CLI to move files into a new folder. The `mkdir` silently failed, the subsequent moves overwrote each other, and the files were lost. Gemini then confessed ("I have failed you completely and catastrophically"). The post landed in the same week as the Replit database deletion. HN's response was the first large set of "how I contain agents" replies: Simon Willison says knowing how to run agents "in a way where their mistakes won't actually matter" is a core skill the tools don't help with. Others note that a sandbox would not have helped here, because the damage was inside the project folder, and that rollback is what was missing.

## Key points
- The failure was inside the working directory, so filesystem confinement alone does not prevent it. Commenters ask for deterministic rollback or snapshots outside the agent's reach.
- Many first-hand near misses: Claude deleting a whole file to remove one function, `git reset --hard`, a database dropped during migrations, Claude launching a second copy of itself in YOLO mode.
- Gemini CLI had a `--sandbox` flag that the author did not use. Others asked why the default was unsafe.
- Willison lists Docker, Apple `container` and Codespaces as options that "aren't at all obvious to people who don't have significant prior experience with them".

## Excerpts
> "One of the most important skills needed to get value out of these agentic coding tools is knowing how to run them in a way where their mistakes won't actually matter. This is non-trivial, and the tools don't do a great deal to help." — simonw ([44652199](https://news.ycombinator.com/item?id=44652199))

> "Sandbox alone wouldn't have helped here though. The failure (deletion of files) happened inside the project folder." — daxfohl ([44661111](https://news.ycombinator.com/item?id=44661111))

> "I've had claude (sonnet 4) delete an entire file by running `rm filename.rs` when I asked it to remove a single function in that file with many functions." — gpm ([44652209](https://news.ycombinator.com/item?id=44652209))

> "it launched another copy of itself in yolo mode which just started tearing up like a powertool at a belt sander race. These coding agents should really only be used in a separate user account." — sitkack ([44683984](https://news.ycombinator.com/item?id=44683984))

> "I think most of the failures of vibe-coding can be fixed by running the agent inside a sandbox (a container or VM) that doesn't have access to any important credentials." — TheDong ([44655948](https://news.ycombinator.com/item?id=44655948))

> "With unpredictable 'assistants' on one one hand, and more frequent and capable supply chain attacks (also helped by AI!) on the other, I'd hope fully sandboxed dev environments become the norm." — tveita ([44658704](https://news.ycombinator.com/item?id=44658704))

## Relevance to the talk
July 2025, the month agent incidents went mainstream. It separates two problems the talk should keep apart: containment (protect the host) and recoverability (protect the work inside the sandbox). The second leads to snapshots, CoW filesystems and versioned workspaces (Tilde, jai's CoW home, Sprites checkpoints).
