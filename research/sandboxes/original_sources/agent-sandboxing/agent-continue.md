---
title: "Tool Permissions | Continue Docs"
url: https://docs.continue.dev/cli/tool-permissions
authors: Continue Dev, Inc.
date: frozen; final 2.0.0 release (v2.0.0-vscode tagged 2026-06-19); repo continuedev/continue main at 5522c6f (2026-07-21), README says no longer maintained
accessed: 2026-11-22
kind: docs
---

## Summary
Continue is **discontinued**: the README says the repository "is no longer actively maintained and is read-only for all users", the team shipped a "Final 2.0.0 Release" of the VS Code extension, JetBrains plugin and CLI (`cn`) with authentication and telemetry removed, and continue.dev now says "Continue was acquired by Cursor". The open-source extension and CLI still install. Both run locally as the user with **no OS-level sandbox**; safety is per-tool policies: "Ask First"/"Automatic"/"Excluded" in the IDE, and `allow`/`ask`/`exclude` plus `--auto` in the CLI. Hosted pieces (Hub, sign-in) were stripped from the repo and docs in the wind-down.

## Key points
- Status: final release 2.0.0 (June 2026); acquired by Cursor (https://continue.dev/); repo read-only by README notice although not formally archived on GitHub. Before the wind-down it had repositioned from IDE assistant to "open-source coding agent" with a CLI; the final cleanup removed sign-in, Hub and Checks references (commits 0d6f8ec "remove Checks section and Hub references", 5522c6f "login flow retired").
- Runs: local VS Code/JetBrains extension process or local `cn` Node CLI; terminal commands run from the workspace root as the user.
- Isolation: none on macOS, Linux or Windows. A grep of the final source finds no Seatbelt/bwrap/Landlock/seccomp or container execution; the docs mention Docker only for reaching a host Ollama.
- Filesystem: no OS restriction; file tools are gated only by tool policy (CLI patterns like `Write(**/*.ts)` restrict by path glob at tool level). A `fileAccess` policy helper and the `@continuedev/terminal-security` package (shell-quote parsing that can escalate a command to "requires permission" or "disabled") are the in-process checks.
- Network: no network policy; `Fetch` defaults to `allow` (source comment: "Technically not read only").
- Approvals (IDE): per-tool policy "Ask First (default)", "Automatic", "Excluded", stored locally per user (https://docs.continue.dev/ide-extensions/agent/how-to-customize).
- Approvals (CLI `cn`): read-only tools `allow`; `Edit`/`MultiEdit`/`Write` and `Bash` `ask`; flags `--allow`, `--ask`, `--exclude` with tool patterns; persistent `~/.continue/permissions.yaml` ("Continue + don't ask again"); modes `--auto` (`*: allow`) and `--readonly` (plan mode, which still allows `Bash`). Headless `cn -p`: docs say `ask` tools are excluded, but the final source's `getDefaultToolPolicies(isHeadless)` sets `Bash` and `*` to `allow` in headless mode (`extensions/cli/src/permissions/defaultPolicies.ts` @ 5522c6f) — docs and code disagree.
- Enterprise: no admin/org controls documented in the final docs.

## Excerpts
> "The `continuedev/continue` repository is no longer actively maintained and is read-only for all users." (README)

> "In headless mode, tools that would normally prompt for approval (`ask` permission) are automatically excluded — there's no one to approve them." (Headless mode docs, "Tool permissions")

> "MCP and Bash are ask in TUI mode, auto in headless" (source comment, `defaultPolicies.ts`)

> "Be careful setting tools to "automatic" if their behavior is not read-only." (How to customize Agent mode)

## Relevance to the talk
Another major open-source agent that ended its life with approvals only and no sandbox, then folded into a vendor (Cursor) that does sandbox. The headless docs-vs-code mismatch is a concrete example of why "what the docs say the agent is allowed to do" is not a security boundary.
