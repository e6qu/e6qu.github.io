---
title: "[Data Loss] Claude Code ran rm -rf on $HOME in auto mode — destructive code hidden inside a script the assistant wrote itself (5th report of this class)"
url: https://github.com/anthropics/claude-code/issues/88462
authors: Leduc974, GitHub issue on anthropics/claude-code. Companion report: nosqldev, "[MODEL] Opus 5 executed rm -rf "$HOME" during test cleanup (57,235 files and 11,315 directories deleted)", issue #93099 (https://github.com/anthropics/claude-code/issues/93099)
date: 2026-08-21 (#88462, open); 2026-09-09 (#93099, open)
accessed: 2026-11-22
kind: issue
agent: Claude Code with Opus 5 (`claude-opus-5[1m]`) in `defaultMode: "auto"` on WSL2 (#88462); Claude Code 2.1.258/2.1.259 with Opus 5 in auto mode on Ubuntu in OCI (#93099)
incident_date: 2026-08-21 (#88462); 2026-09-03 ~09:07 UTC (#93099)
category: destructive-action (also guardrail-bypass: the approval classifier saw only `bash script.sh`)
sandbox_at_time: no OS sandbox reported in either issue (both labelled `area:sandbox` by maintainers). The gate was Claude Code's "auto" permission mode, where a classifier decides which commands need approval. Neither user ran `--dangerously-skip-permissions`
---

## Summary
Ten months after the 2025 `rm -rf ~` reports ([2025-10-claude-code-rm-rf-home-wsl.md](2025-10-claude-code-rm-rf-home-wsl.md)), with a newer model and an AI classifier for approvals, two users lost their home directories in auto mode. **#88462:** the agent wrote a test helper with `trap 'rm -rf "$_HT_HOME"' EXIT`. Minutes later it added an option that set `_HT_HOME="$HOME"`, then ran the script. On exit the trap deleted `/home/leduc`. The command submitted for permission checking was just `bash /tmp/.../test-lib-demo.sh`. Lost: config, about 1.4 GB of session transcripts, SSH keys, `gh` auth. **#93099:** while testing shell-setup scripts with a fake `$HOME`, the agent said the real HOME had been restored and then ran a multi-line Bash call ending in `rm -rf "$HOME"; unset HOME`, deleting 57,235 files and 11,315 directories under `/home/ubuntu`, including `.ssh/authorized_keys` and Claude Code's own binary and session files.

## Key points
- #88462's diagnosis: "**The write path and the exec path are not correlated.** A file authored by the assistant and then executed by the assistant bypasses inspection entirely, because inspection happens on the command string."
- #88462 lists prior same-class reports closed without a fix: #29082 (2026-02-26, `not_planned`), #32938 (2026-03-10), #49129 (2026-04-16, ~1,500 files), #70687 (2026-06-24, 3-year Unity project).
- #93099: the destructive line was mixed into an ordinary multi-command call (`./setup_env.sh tcsh; cat …; rm -rf "$HOME"; unset HOME`). Only `/home/ubuntu` itself survived (Permission denied on the directory).
- The failure signal was missed: `getcwd: cannot access parent directories` was read by the agent as normal temp cleanup (#88462).
- Community workarounds in the threads: PreToolUse hooks that regex-match `rm -rf` on `$HOME`/`~`/`/`, and a write-time check for recursive deletes in files the agent writes. Commenters note these are speed bumps, not boundaries.
- Related but different: #88605 (2026-08-21) reports Claude Code's *own* exit-time cleanup recursively deleting `$HOME` with no shell command involved (closed as stale). It is not counted here.
- No Anthropic response appears in either thread as of 2026-11-22.

## Excerpts
> "No confirmation prompt was shown, in `defaultMode: "auto"`." — #88462

> "None of those three steps is individually suspicious." — #88462

> "Prevent a broad recursive deletion of my real HOME from running as an automatic test-cleanup step." — #93099, expected behaviour

## Would a mature sandbox have stopped it?
Yes, and this is the clearest case for an **OS boundary over command inspection**. A classifier or regex looks at the command string; the danger was in a file written earlier, or in a variable's runtime value. An **fs write scope** (Claude Code's own sandbox: write CWD + temp only) evaluates the *actual* `unlink` calls, wherever they come from, so `rm -rf /home/leduc` from inside a trap would fail. It existed but was **opt-in and off** in both reports. Second, a **disposable home**: running the agent in a container or VM whose `$HOME` is not the user's real home makes "delete `$HOME`" harmless. **Snapshots/undo** (filesystem snapshots, or Claude Code checkpoints, which cover only files edited via its edit tools, not Bash side effects) would have limited the loss. **Approval** in auto mode is by design selective and cannot see through `bash script.sh`.

## Relevance to the talk
The "you cannot inspect your way to safety" slide. Approval-based guardrails, even AI-graded ones, judge *intent from text*. Sandboxes judge *effects at the syscall*. The agent writing a script and then running it is ordinary coding work, so every agent will do it all day. Also note the base rate: five-plus reports of one failure class in six months in one vendor's tracker, most closed as stale or not planned.
