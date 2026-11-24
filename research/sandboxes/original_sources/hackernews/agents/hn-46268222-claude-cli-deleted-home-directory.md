---
title: "Claude CLI deleted my home directory and wiped my Mac"
url: https://news.ycombinator.com/item?id=46268222
story_url: https://old.reddit.com/r/ClaudeAI/comments/1pgxckk/claude_cli_deleted_my_entire_home_directory_wiped/
points: 255
comments: 216
authors: HN thread (submitted by tamnd); Reddit post by a Claude Code user
date: 2025-12-14
accessed: 2026-11-22
kind: discussion
---

## Summary
A Reddit user running Claude Code in YOLO mode reported that a cleanup command ending in `~/` deleted their home directory. Some doubted the story. The substantive discussion was about root cause. `--dangerously-skip-permissions` is the proximate cause, but no harness can reliably predict which shell commands touch `$HOME`. "Bash-based safety layers" (hooks, regex denylists) are not up to the task, and Anthropic should arguably allow skip-permissions only inside a container. One commenter recalls Claude happily operating on `D/../../../../etc/passwd` while believing it was confined to `D`, which is when he moved to Docker.

## Key points
- Proximate cause: YOLO mode. Root cause: an agent running as the user, with the user's whole home directory writable.
- Command-level filtering cannot decide shell semantics, and path-traversal tricks defeat naive directory confinement.
- Proposal: refuse skip-permissions outside a container or sandbox.
- Request for "an agent sandbox that's written by someone who understands security".

## Excerpts
> "there's actually absolutely no way for Claude CLI to 100% determine that a command it runs will not affect the home directory… If it's running on your computer and can run arbitrary commands, it can wipe your disk, that's it." — iLoveOncall ([46268320](https://news.ycombinator.com/item?id=46268320))

> "when Claude thought it was restricting itself to directory D, it was still happy to operate on file `D/../../../../etc/passwd`. That was the last time I ran Claude Code outside of a Docker container." — mjd ([46268612](https://news.ycombinator.com/item?id=46268612))

> "I do think Anthropic should only allow `--dangerously-skip-permissions` to be applied if it's running in a container." — turnsout ([46268379](https://news.ycombinator.com/item?id=46268379))

> "'bash based safety layer' Is this a joke? I have a lot of respect for the authors of bash, but it is not up to this task." — ajb ([46269294](https://news.ycombinator.com/item?id=46269294))

> "So `--dangerously-skip-permissions` is the correct proximal cause. But I agree that it isn't the root cause." — maxbond ([46271342](https://news.ycombinator.com/item?id=46271342))

> "I have written a tool to easily run the agents inside a container that mounts only the current directory." — ashishb ([46268291](https://news.ycombinator.com/item?id=46268291))

## Relevance to the talk
Use it for "proximate vs root cause" on the incidents slide: the flag gets blamed, but running as the user with full home access is the design flaw. Kernel-enforced write scopes (srt, Codex workspace-write, jai) address it, and prompt or regex filters do not.
