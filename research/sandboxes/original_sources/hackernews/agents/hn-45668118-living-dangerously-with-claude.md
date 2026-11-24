---
title: "Living Dangerously with Claude"
url: https://news.ycombinator.com/item?id=45668118
story_url: https://simonwillison.net/2025/Oct/22/living-dangerously-with-claude/
points: 250
comments: 108
authors: HN thread (submitter not recorded by the API); linked talk write-up by Simon Willison
date: 2025-10-22
accessed: 2026-11-22
kind: discussion
---

## Summary
Willison's talk write-up argues that YOLO mode (`--dangerously-skip-permissions`) is far more productive, and that the safe way to get it is a sandbox, ideally someone else's VM (Claude Code for web, Codex cloud). The talk was given the same week Anthropic shipped Claude Code sandboxing. The thread covers how annoying network-restricted sandboxes are in practice (Claude Code for web blocking GitHub API calls), whether `sandbox-exec` is really deprecated (Mike Hearn: no, Chrome depends on it), and whether a well-tuned `permissions.allow` list is enough without YOLO.

## Key points
- Willison: the three projects in the talk carried "effectively zero risk" because they ran in throwaway containers or a remote sandbox.
- Friction: the Claude Code for web sandbox blocked `api.github.com` release lookups, which broke setup scripts.
- `sandbox-exec` is "a tiny wrapper around some semi-private undocumented APIs", and is not really deprecated because Chrome uses it.
- The counter-camp says allowlists in `.claude/settings.local.json` are enough, citing dropped staging databases and deleted unstaged code under YOLO.
- Exfiltration creativity: Willison notes a payload that hides `env | base64` in an HTML comment on a site's terms page.

## Excerpts
> "The sandbox idea seems nice, it's just a question of how annoying it is in practice. For example the 'Claude Code on the web' sandbox appears to prevent you from loading `https://api.github.com/repos/.../releases/latest`." — lacker ([45675963](https://news.ycombinator.com/item?id=45675963))

> "sandbox-exec isn't really deprecated. It's just a tiny wrapper around some semi-private undocumented APIs, it says that because it's not intended for public use." — mike_hearn ([45684957](https://news.ycombinator.com/item?id=45684957))

> "I don't understand why people advocate so strongly for `--dangerously-skip-permissions`. Setting up 'permissions.allow' in `.claude/settings.local.json` takes minimal time." — jampa ([45685161](https://news.ycombinator.com/item?id=45685161))

> "OK, that is a pretty great exfiltration vector." — simonw, on hiding `env | base64` in a terms-and-conditions page ([45700501](https://news.ycombinator.com/item?id=45700501))

> "Anyone from the Cursor world already YOLO's it by default." — almosthere ([45684535](https://news.ycombinator.com/item?id=45684535))

## Relevance to the talk
This is the point (Oct 2025) when "YOLO, but in a sandbox" became the mainstream recommendation from the most-read practitioner, in the same week Anthropic published its sandbox-runtime. The thread already lists the 2026 pain points: network allowlists break workflows, and Seatbelt is undocumented.
