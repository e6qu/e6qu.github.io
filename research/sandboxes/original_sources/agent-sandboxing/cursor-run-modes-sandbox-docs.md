---
title: "Cursor Run Modes and sandbox.json reference (Cursor Docs)"
url: https://cursor.com/docs/agent/security/run-modes
authors: Anysphere (Cursor)
date: living documents, undated; changelog table on the page runs to Cursor 3.23 (2026-10-01); companion reference https://cursor.com/docs/reference/sandbox; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Cursor's current user documentation for its agent terminal sandbox (Cursor is closed source; the engineering post is [cursor-agent-sandboxing.md](cursor-agent-sandboxing.md)).
- **macOS:** Seatbelt through `sandbox-exec` with a generated profile.
- **Linux:** Landlock (kernel 6.2+, Landlock v3) plus seccomp, with a bubblewrap fallback that is reported in an env var. Where neither works, Cursor falls back to asking for approval.
- **Windows:** WSL2 only.
- **Defaults:** reads system-wide, writes to the workspace, network blocked and then opened by a three-level network mode whose default includes ~100 built-in domains. A hard-coded list of protected files covers Cursor's and Claude Code's own config.
- **Run mode:** "Auto-review" (sandbox plus an LLM classifier) has been the recommended default since 3.6 (2026-05-29).
These pages were fetched on 2026-11-22 by a research subagent working for us; quotes below are as it reported them.

## Key points
- **macOS:** "Cursor uses Seatbelt through `sandbox-exec`. A generated sandbox profile limits file access, network access, and other process behavior for the full subprocess tree." Sandboxing has been on by default on macOS since Cursor 2.0 (2025-10-29 changelog: "with read/write access to your workspace and no internet access").
- **Linux:**
  - "Cursor uses Landlock and seccomp. Landlock applies filesystem restrictions. Seccomp blocks unsafe syscalls";
  - requires "Kernel 6.2 or later with Landlock v3 support" and unprivileged user namespaces, otherwise "Cursor falls back to asking for approval before running commands";
  - `CURSOR_SANDBOX_LANDLOCK_STATUS` = `fully_enforced` (Landlock) or `bubblewrap` (fallback), and `CURSOR_SANDBOX` = `seatbelt`/`native`;
  - the process is remapped to UID 0 inside a user namespace;
  - desktop packages ship an AppArmor profile, while the CLI and remote hosts need `cursor-sandbox-apparmor`.
- **Windows:** not on the run-modes page. The 2026-02-18 blog says "we run our Linux sandbox inside WSL2". No native Windows sandbox is documented.
- **Filesystem:**
  - `sandbox.json` `type` is `workspace_readwrite` (default), `workspace_readonly` or `insecure_none`, with `additionalReadwritePaths`/`additionalReadonlyPaths`;
  - the Read Access mode is "System" (default) or "Workspace" (3.23+); "SSL certificate paths and `~/.ssh` are always readable when `readBoundary` is `\"system\"`";
  - always write-protected: `.cursor/*.json`, `.cursor/**/*.json`, `.cursor/.workspace-trusted`, `.claude/*.json`, `.claude/**/*.json`, `.vscode/**`, `.code-workspace`, `.git/hooks/**`, `.git/config`, `.git/info/attributes`, `.cursorignore`.
- **Network:**
  - "Blocked by default, then opened by your network mode and `sandbox.json`";
  - modes are "sandbox.json Only", "sandbox.json + Defaults" (default) and "Allow All";
  - `networkPolicy {default: allow|deny (deny), allow[], deny[]}` takes domains, wildcards or CIDRs; "Deny always beats allow"; "URL paths are ignored";
  - RFC1918 and 169.254.169.254 are blocked by default;
  - merge order is "per-user < per-repo < team-admin < hardcoded", and a `deny` default wins;
  - enforcement is described only in the CLI changelog: "a default-deny network proxy for sandboxed commands" (Jan 2026); git-over-SSH via SOCKS (2026.08.11).
- **Escape hatch:** "If a sandboxed command fails on a sandbox restriction … the agent can rerun it outside the sandbox. The classifier reviews that rerun." Allowlisted commands run outside the sandbox.
- **Scope:** "Sandboxing is a layer on top of Run Modes for shell commands." MCP and Fetch calls go to the classifier, not the OS sandbox. Whether hooks are sandboxed is not documented.
- **Classifier:** "Auto-review is not a security boundary"; the model is "Gemini 3.5 Flash Lite, with Haiku as the fallback".
- **Enterprise:** team admins can restrict modes, set network rules and the read policy (enforced allow/deny lists since 2.5, 2026-02-17); local files "cannot weaken" team rules.

## Excerpts
> "Cursor uses Seatbelt through `sandbox-exec`." (Run Modes)

> "Kernel 6.2 or later with Landlock v3 support" (Run Modes, Linux requirements)

> "Auto-review is not a security boundary." (Run Modes)

## Relevance to the talk
Cursor is the one major agent still on Landlock on Linux. Codex left Landlock for bubblewrap, and Qwen labels its Landlock backend "partial". Cursor's Linux fallback ladder (Landlock → bubblewrap → ask) is a concrete example of "the sandbox you get depends on the kernel you have". Its protected-path list shows the lesson of CVE-2026-26268 and CVE-2026-48124: `.git/hooks` and even *another vendor's* `.claude/*.json` now have to be on it.

## Addendum 2026-11-23: the no-prompt mode and the end of "Ask Every Time"
Re-read from https://cursor.com/docs/agent/security/run-modes.md on 2026-11-23, for the "Everyone clicks yes" section.
- The mode table lists **Run Everything**: "Every tool call runs automatically." Sandbox: "No". Classifier: "No". Use it when: "You accept the risk and want zero prompts."
- "Read access doesn't apply in **Run Everything** mode, which runs every call without checks, so the setting is hidden there."
- Changelog, 3.5 (May 22, 2026): "**Ask Every Time** was deprecated. New users cannot choose it. Use **Allowlist** with an empty allowlist for the same behavior."
- Changelog, 3.6 (May 29, 2026): "Auto-review shipped as the recommended default."
- For the talk: a vendor retiring its ask-every-time mode by name is the fatigue argument made in a changelog; Run Everything is the documented off switch for both sandbox and classifier.
