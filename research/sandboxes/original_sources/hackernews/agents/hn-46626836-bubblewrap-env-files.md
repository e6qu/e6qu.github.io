---
title: "Bubblewrap: A nimble way to prevent agents from accessing your .env files"
url: https://news.ycombinator.com/item?id=46626836
story_url: https://patrickmccanna.net/a-better-way-to-limit-claude-code-and-other-coding-agents-access-to-secrets/
points: 187
comments: 140
authors: HN thread (submitted by 0o_MrPatrick_o0, the post's author)
date: 2026-01-15
accessed: 2026-11-22
kind: discussion
---

## Summary
The post argues for wrapping Claude Code (or any agent) in bubblewrap launched by the user, rather than relying on the bubblewrap that Claude Code invokes internally. The reasoning is that a sandbox the harness configures from inside the session is only as trustworthy as the harness. Simon Willison defends YOLO mode ("feels like using a different product") as long as secrets are limited. Others argue that real secrets should not be on a dev box at all, that a separate Unix user and chmod already solve this, and that bubblewrap does not protect against kernel exploits or exposed X11/Wayland sockets.

## Key points
- The author (0o_MrPatrick_o0) confirms that Claude Code's sandbox uses bubblewrap and calls embedding it in the binary a "risky design": a bug in how the client invokes bwrap undoes it, and an outer wrapper gives the same policy across all agents.
- Willison's position: YOLO is worth it if API keys are staging-only, and full Bash inside a file and network sandbox beats a restricted tool set.
- Limits named in the thread: misconfiguration, kernel exploits, X11/Wayland sockets. "Passable" against automated attacks without a 0-day.
- Users share their own bwrap invocations (opencode, flattened Docker image roots), and compare bwrap with container-use.

## Excerpts
> "YOLO mode is so much more useful that it feels like using a different product. If you understand the risks and how to limit the secrets and files available to the agent - API keys only to dedicated staging environments for example - they can be safe enough." — simonw ([46627660](https://news.ycombinator.com/item?id=46627660))

> "I think embedding bubblewrap in the binary is risky design for the end user… what if there is a bug in how the client invokes the bubblewrap container? You wouldn't have this risk if they drove you to invoke Claude with bubblewrap." — 0o_MrPatrick_o0 ([46628144](https://news.ycombinator.com/item?id=46628144))

> "Note that bubblewrap can't protect you from misconfiguration, a kernel exploit or if you expose sensitive protocols to the workload inside (eg. x11 or even Wayland without a security context)." — coppsilgold ([46627965](https://news.ycombinator.com/item?id=46627965))

> "Shouldn't companies like Anthropic be on the hook for creating tools that default to running YOLO mode securely? Why is it up to 3rd parties to add safety to their products?" — catlifeonmars ([46627749](https://news.ycombinator.com/item?id=46627749))

> "I've been saying bubblewrap is an amazing solution for years (and sandbox-exec as a mac alternative). This is the only way i run agents on systems i care about" — dangoodmanUT ([46627609](https://news.ycombinator.com/item?id=46627609))

> "Docker containers aren't safe enough to run untrusted code, there are privilege escalation vulnerabilities reported fairly often." — kondu ([46629069](https://news.ycombinator.com/item?id=46629069))

## Relevance to the talk
This thread asks who should hold the sandbox: the harness from the inside, or the user from the outside. It also shows practitioners recognising that Anthropic's `srt` and their own wrappers use the same Linux primitive.
