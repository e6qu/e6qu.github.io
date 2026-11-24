---
title: "Choose a permission mode" and "CLI reference" (Claude Code documentation)
url: https://code.claude.com/docs/en/permission-modes
also: https://code.claude.com/docs/en/cli-reference ; https://code.claude.com/docs/en/sandboxing
authors: Anthropic (Claude Code documentation)
date: living documents; read 2026-11-23
accessed: 2026-11-23
kind: docs
---

## Summary
Claude Code's own docs on its modes. `bypassPermissions` (the `--dangerously-skip-permissions` flag) turns off prompts and safety checks and is documented as for isolated containers and VMs only. Auto mode is offered for "reducing prompt fatigue". The sandbox page says the sandbox is off by default. Organisations can switch bypass and auto mode off through managed settings.

## Key points
- Mode table: `auto` is for "Long tasks, reducing prompt fatigue"; `bypassPermissions` is for "Isolated containers and VMs only".
- `--dangerously-skip-permissions` equals `--permission-mode bypassPermissions`.
- Deny rules and a short list of actions still prompt even in bypass mode.
- Admins: `permissions.disableBypassPermissionsMode: "disable"`; `permissions.disableAutoMode: "disable"`.
- Repository settings (`.claude/settings.json`) cannot start a session in `auto` or `bypassPermissions`.
- Sandbox: "The sandbox is off by default."
- The auto-mode classifier blocks, by default, launching another agent loop with `--dangerously-skip-permissions` or `--no-sandbox`.

## Excerpts
> "`bypassPermissions` mode disables permission prompts and safety checks so tool calls execute immediately, including writes to protected paths." (permission-modes)

> "Only use this mode in isolated environments like containers, VMs, or dev containers without internet access, where Claude Code cannot damage your host system." (permission-modes)

> "The `--dangerously-skip-permissions` flag is equivalent." (permission-modes)

> "`--dangerously-skip-permissions` | Skip permission prompts. Equivalent to `--permission-mode bypassPermissions`." (cli-reference)

> "The sandbox is off by default. To turn it on, run `/sandbox` in a session" (sandboxing)

> "Launching an autonomous agent loop that runs without human approval or a sandbox, such as one started with `--dangerously-skip-permissions` or `--no-sandbox`." (permission-modes, under "Blocked by default")

## Relevance to the talk
The off switch is one documented flag, the sandbox is opt-in, and (per [anthropic-2026-08-auto-mode-default.md](anthropic-2026-08-auto-mode-default.md)) a quarter of interactive sessions start with the switch thrown. See also [claude-code-sandboxing-docs.md](claude-code-sandboxing-docs.md).
