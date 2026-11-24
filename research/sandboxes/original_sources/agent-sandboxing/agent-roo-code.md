---
title: "Auto-Approving Actions | Roo Code Documentation"
url: https://roocodeinc.github.io/Roo-Code/features/auto-approving-actions
authors: Roo Code, Inc.
date: frozen at shutdown; repo RooCodeInc/Roo-Code archived, last commit b867ec9 (2026-05-15), last release v3.54.0 (2026-05-15)
accessed: 2026-11-22
kind: docs
---

## Summary
Roo Code is **dead**: the README and docs state "The Roo Code Extension was shut down on May 15th" (2026), the GitHub repo is archived, and the team moved to a cloud agent product, Roomote (roomote.dev says "By the creators of Roo Code"; the old sunset blog URL now redirects there). The README points users to the community fork Zoo Code and to Cline. While it lived, Roo (a Cline fork) ran as a VS Code extension with the user's privileges and **no OS-level sandbox**: safety came from approval prompts, a prefix allow/deny list for commands, `.rooignore`, and a hard-coded write-protected file list, all enforced by the extension's own path/string checks.

## Key points
- Status: extension shut down 2026-05-15; repo archived and read-only (https://github.com/RooCodeInc/Roo-Code README; docs index "Extension Shutdown" warning). Docs survive on GitHub Pages. Successors named in README: Zoo Code (https://github.com/Zoo-Code-Org/Zoo-Code/), Cline.
- Runs: local VS Code extension process; commands run in the VS Code integrated terminal as the user.
- Isolation: none on any OS. A grep of the archived repo finds no Seatbelt/bwrap/Landlock/seccomp code, and the `.rooignore` doc says outright it "does not create a system-level sandbox".
- Filesystem: reads and writes default to the workspace, with separate "Include files outside workspace" options for each; `.rooignore` (gitignore syntax) blocks Roo's file tools, and `execute_command` only for "a predefined list of file-reading commands" such as `cat`/`grep` (https://roocodeinc.github.io/Roo-Code/features/rooignore). Write-protected files need "Include protected files": the docs name `.roo/` and `.rooignore`; the source list also covers `.roomodes`, `.roorules*`, `.clinerules*`, `.vscode/**`, `*.code-workspace`, `AGENTS.md`, `AGENT.md` (`src/core/protect/RooProtectedController.ts`). All of these are tool-level checks, not OS enforcement.
- Network: no network policy documented; commands and the browser/MCP tools have whatever access the user has.
- Approvals: Auto-Approve dropdown with a master "Enabled" switch (shortcut `Cmd+Alt+A`/`Ctrl+Alt+A`, command `roo-cline.toggleAutoApprove`) and per-permission tiles: read, edit, execute approved commands, browser, MCP (also per-tool "Always allow"), mode switch, subtasks, follow-up answers. Commands: settings `roo-cline.allowedCommands` (default `["git log","git diff","git show"]`) and `roo-cline.deniedCommands` (default `[]`), matched by prefix with "longest-prefix wins" (deny wins on ties); `*` allows all. A "dangerous substitution guard" refuses to auto-approve allowed prefixes that contain risky shell expansions.
- Enterprise: no admin policy for these settings is documented in the surviving docs.

## Excerpts
> "The Roo Code Extension was shut down on May 15th." (README, "Disclaimer")

> "Auto-approve settings bypass confirmation prompts, giving Roo direct access to your system." (Auto-Approving Actions, security warning)

> "`.rooignore` is a powerful tool for controlling Roo's file access via its tools, but it does not create a system-level sandbox." (.rooignore page, "Not a Full Sandbox")

## Relevance to the talk
A former leading VS Code agent (24k GitHub stars at archive) that never had an OS sandbox and then shut down. Its prefix allow/deny lists and "dangerous substitution guard" are a good example of how far string matching on shell commands goes, and of its limits. The pivot to a cloud agent fits the wider move from approval prompts on the laptop to isolation in someone else's VM.
