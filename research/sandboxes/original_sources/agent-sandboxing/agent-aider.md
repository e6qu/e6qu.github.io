---
title: "Options reference | aider"
url: https://aider.chat/docs/config/options.html
authors: Aider-AI (Paul Gauthier)
date: living document; read 2026-11-22 (repo Aider-AI/aider main at 5dc9490, 2026-05-22; latest PyPI release aider-chat 0.86.2, 2026-02-12)
accessed: 2026-11-22
kind: docs
---

## Summary
Aider is a terminal pair-programmer that runs as a local Python process with the user's privileges and has **no OS-level sandbox**. It does not have a free-running shell tool: the model can only *suggest* shell commands, which Aider runs after a "Run shell command?" prompt; code edits to files already in the chat are applied directly and auto-committed to git. In the source, `--yes-always` does **not** cover suggested shell commands: those prompts need an explicit yes and are answered "no" under `--yes-always`. The only isolation on offer is the official Docker image, which the user has to choose to run. The project looks dormant: the last feature release was v0.86.0 (2025-08-09), there was one patch on PyPI (0.86.2, Feb 2026), and the last commit was 2026-05-22.

## Key points
- Status: still listed and installable, but slowing: GitHub releases stop at v0.86.0 (2025-08-09); PyPI `aider-chat` 0.86.2 uploaded 2026-02-12; main's last commit 2026-05-22 (model-list update), version string `0.86.3.dev`; no commits in the six months since.
- Runs: local Python CLI (`aider`), or the official images `paulgauthier/aider` / `paulgauthier/aider-full` with the current directory mounted at `/app` (https://aider.chat/docs/install/docker.html).
- Isolation: none for a normal install on macOS, Linux or Windows; a grep of the repo finds no Seatbelt/bwrap/Landlock/seccomp code. Docker is the only isolation, opt-in, and the docs present it as an install option, not a security feature ("When you use the in-chat `/run` command, it will be running shell commands *inside the docker container*").
- Filesystem: edits go to files the user added to the chat. If the model edits other files, Aider asks "Allow edits to file that has not been added to the chat?", "Add file to the chat?" or "Create new file?". `.aiderignore` (`--aiderignore`) and `--subtree-only` limit which repo files Aider considers, enforced in-process. Git is the safety net: `--auto-commits` and `--dirty-commits` default to true.
- Network: no policy; suggested commands and `/run` have the user's network access. URLs in chat prompt "Add URL to the chat?".
- Approvals: suggested shell commands prompt "Run shell command(s)?" with `explicit_yes_required=True`; in `aider/io.py`, `if self.yes is True: res = "n" if explicit_yes_required else "y"`, so `--yes-always` (env `AIDER_YES_ALWAYS`, documented as "Always say yes to every confirmation") answers other prompts yes but declines shell commands. `--no-suggest-shell-commands` turns suggestions off. User-configured `--lint-cmd`, `--test-cmd` and `--auto-test` run commands without per-command prompts; `/run` (alias `!`) and `/test` run what the user types.
- Enterprise/admin controls: none documented.

## Excerpts
> "Always say yes to every confirmation" (Options reference, `--yes-always`)

> "Enable/disable suggesting shell commands (default: True)" (Options reference, `--suggest-shell-commands`)

> "When you use the in-chat `/run` command, it will be running shell commands *inside the docker container*." (Aider with docker, "Limitations")

## Relevance to the talk
The original human-in-the-loop design: no autonomous shell at all, every model-proposed command needs an explicit yes even in `--yes-always`, and git commits as the undo log. That makes it a useful baseline for comparing agentic CLIs that default to full autonomy (e.g. Cline CLI). It also shows the "just use Docker" answer, here framed as packaging rather than security, from a project now in low maintenance.
