---
title: "Auto mode is now the default in Claude Code"
url: https://news.ycombinator.com/item?id=49239021
story_url: https://claude.com/blog/auto-mode-default-in-claude-code
points: 292
comments: 313
authors: HN thread (submitted by sbehere); linked post by Anthropic
date: 2026-08-10
accessed: 2026-11-22
kind: discussion
---

## Summary
Anthropic made "auto mode" the default permission mode in Claude Code. In auto mode a classifier approves or blocks each action instead of asking the user. The announcement argued that it is at least as safe as an average user clicking through prompts, and that most permission requests were being accepted without scrutiny. Many commenters confused auto mode with `--dangerously-skip-permissions`. Several long-time YOLO users said they had had no incidents in 6–12 months, and others answered that tool-level permissions are "a bandaid for bad sandboxing". A commenter recalled the blocking rates Anthropic had published (83%, then 89% of dangerous commands blocked).

## Key points
- Auto mode is not YOLO: a classifier runs before every command. Commenters pointed out that even the vendor's own figures leave roughly one dangerous command in nine or ten getting through.
- The rationale is approval fatigue: users approve almost everything. One commenter read the published statistics as implying that a significant number of dangerous commands are attempted every day.
- Many respondents already run fully unprompted, either in containers, VMs, bubblewrap or Docker Sandboxes, or bare with backups.
- One commenter had built his own pre-approval classifier on Haiku before auto mode shipped. Auto mode turns that DIY pattern into a product.

## Excerpts
> "These tools prompt me to review an absurd number of very complex bash commands where there is realistically no way to carefully review them. I just want to put the thing in a box with the code and let it run any number of commands on the code without prompting." — SchemaLoad ([49239838](https://news.ycombinator.com/item?id=49239838))

> "In auto mode, there's a classifier that runs before any command is executed and theoretically blocks any dangerous commands from running." — sandcat_ ([49239584](https://news.ycombinator.com/item?id=49239584))

> "To be more precise, this article says auto mode blocked 89% of dangerous commands in their testing. A previous article said it blocked 83%…" — Fishkins ([49249873](https://news.ycombinator.com/item?id=49249873))

> "Imo these explicit tool-level permissions are really just a bandaid for bad sandboxing." — glerk ([49239866](https://news.ycombinator.com/item?id=49239866))

> "Using more Claude to categorize the safety of Claude commands is not the answer." — awkii ([49239648](https://news.ycombinator.com/item?id=49239648))

> "I've been running Claude Code with --dangerously-skip-permissions in a Docker container for the last month or so… I definitely wouldn't want to run it unsandboxed." — steve_taylor ([49239365](https://news.ycombinator.com/item?id=49239365))

> "it's a good default because you really do get prompted incessantly without it." — kevinqi ([49239354](https://news.ycombinator.com/item?id=49239354))

## Relevance to the talk
This marks the shift from human-in-the-loop to model-in-the-loop as the default control. The thread contains both positions the talk sets against each other: a classifier is better than a fatigued human, and a probabilistic gate is no substitute for an OS boundary. It pairs with the Embrace The Red break of auto mode ([note](hn-49506819-breaking-claude-code-auto-mode.md)) three weeks later.
