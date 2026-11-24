---
title: "[BUG] ## CRITICAL: Claude Code executed rm -rf deleting entire home directory"
url: https://github.com/anthropics/claude-code/issues/10077
authors: mikewolak (Mike Wolak), GitHub issue on anthropics/claude-code; comments by mbailey, simtrax and others. Second case: Reddit r/ClaudeAI post "Claude CLI deleted my entire home directory! Wiped my whole mac" (https://www.reddit.com/r/ClaudeAI/comments/1pgxckk/), read via Simon Willison's quotation (https://simonwillison.net/2025/Dec/9/claude/)
date: 2025-10-21 (issue opened); auto-closed by bot 2026-02-08 for inactivity
accessed: 2026-11-22
kind: issue
agent: Claude Code 2.0.22 (model not stated) on Ubuntu under WSL2
incident_date: 2025-10-21 ~18:05 UTC
category: destructive-action
sandbox_at_time: none. WSL2 home directory, no OS sandbox in use. Claude Code's opt-in bubblewrap/Seatbelt sandbox had been announced the day before (2025-10-20) and was off by default. The reporter says he did NOT use `--dangerously-skip-permissions`; this is disputed in the thread and not verified
---

## Summary
While rebuilding a firmware project, Claude Code ran a recursive delete that walked from `/`. System files survived only because of Unix permissions (`rm: cannot remove '/bin': Permission denied` …). Everything the user owned under `/home/mwolak` was deleted except dotfiles. The reporter stopped the command when he noticed it, but too late. Claude Code's transcript logged the *output* of the tool call but not the command itself, so the exact command cannot be reconstructed. Other users in the thread reported the same pattern. In December 2025 a Mac user on Reddit lost their home directory to `rm -rf tests/ patches/ plan/ ~/`, where a trailing `~/` was appended to a cleanup command.

## Key points
- Environment (issue): Claude Code 2.0.22, Ubuntu on WSL2, session ID given. Lost: all project directories and source files. Kept: dotfiles (`.cache`, `.config`, `.claude`).
- "The conversation log file contains only the tool output (`tool_result`) but NOT the actual command (`tool_use`)" — so the audit trail failed too.
- The reporter's own wish list: command validation, confirmation for `rm -rf`, "Sandboxing: Restrict operations to project directory", complete audit logging, file snapshots.
- Thread: mbailey describes a similar near-miss "with `--dangerously-skip-permissions`" and no sandbox. mikewolak: "I did not run the agent with `--dangerously-skip-permissions`" and "It had permission to make file modifications in my project directory, not in /". Others reported `rm -rf` running without a prompt (simtrax: `rm -rf /Users/me/code/rust/zarr-reader`).
- Anthropic did not respond in the thread. The issue was closed by the stale bot. A commenter called this an incorrect closure (#16497).
- Dec 2025 Mac case (via Willison): Claude itself, reviewing the log, pointed at `rm -rf tests/ patches/ plan/ ~/` — "See that `~/` at the end? That's your entire home directory." Whether permissions were bypassed in that case is not stated.

## Excerpts
> "The command attempted to delete from root (`/`) and only failed on system files due to permission restrictions, but successfully deleted all user-owned files." — issue body

> "In this case it did, I'd never let it do that." — mikewolak, 2025-10-23, on whether the command was approved

## Would a mature sandbox have stopped it?
Yes, and the controls existed, but none were on. (1) An **fs write scope** limited to the project directory (Claude Code's sandbox writes only to CWD + temp) would have turned the delete into "Permission denied" for everything outside `firmware/`. On Linux/WSL2 it needed bubblewrap and an explicit `/sandbox`, and it was **opt-in and one day old**. (2) A **path-based hard deny** for recursive deletes of `/`, `~` and `$HOME`, independent of approval mode. Claude Code's sandbox docs now list `rm` on critical paths as always-prompting; at the time nothing like it was on by default. (3) **Snapshots/undo** (filesystem snapshot or a VM/container with a disposable home) would have made it recoverable. (4) **Approval** was either bypassed or did not trigger. The thread cannot settle which, and the missing `tool_use` log is itself a finding. A sandbox needs an audit log that does not rely on the agent's own transcript.

## Relevance to the talk
The canonical "`rm -rf ~`" story. The point is not "the model is dumb" but that the only thing between a stray `~/` and the user's home was Unix DAC, which protects the OS *from the user*, not the user *from their own agent*. Pair with [2026-08-claude-code-auto-mode-deletes-home.md](2026-08-claude-code-auto-mode-deletes-home.md): ten months and an AI classifier later, the same class of loss still happens. See [claude-code-sandboxing-docs.md](../agent-sandboxing/claude-code-sandboxing-docs.md) and [anthropic-beyond-permission-prompts.md](../agent-sandboxing/anthropic-beyond-permission-prompts.md).
