---
title: "Auto Approve & YOLO Mode" (Cline Docs)
url: https://docs.cline.bot/features/auto-approve
authors: Cline
date: living document; read 2026-11-22 (repo source read at cline/cline v4.1.27, commit 8075d2e, 2026-11-21)
accessed: 2026-11-22
kind: docs
---

## Summary
Cline is current and large (v4.1.27 released 2026-11-21; now "an SDK, IDE extension, or CLI"). The local agent (VS Code extension, CLI, desktop app) runs as an ordinary process with the user's privileges and has **no OS-level sandbox**: control is purely approval prompts, auto-approve toggles, YOLO mode and optional hooks. The CLI is the most permissive default we have seen: given a prompt it runs in "yolo mode" (all tools auto-approved) unless told otherwise. Only the new Cline Cloud Agents run in an isolated cloud sandbox.

## Key points
- Runs: local Node process (VS Code/JetBrains extension, `cline` CLI, desktop app); Cloud Agents run each session "in its own secure cloud sandbox" with a per-session repo copy and GitHub access limited to that repo — mechanism not documented (https://docs.cline.bot/usage/cloud-agents).
- Isolation: none for local use on macOS, Linux or Windows. A grep of the repo at v4.1.27 finds no Seatbelt/`sandbox-exec`/bwrap/Landlock/seccomp code. The CLI's "sandbox mode" (`--data-dir`, `CLINE_SANDBOX=1`) only redirects Cline's own state to an isolated data dir (`/tmp/cline-sandbox` by default; `apps/cli/src/utils/helpers.ts`); the SDK's `subprocess-sandbox.ts` is a child process for plugin code, not an OS confinement.
- Filesystem: no OS restriction; reads/edits inside vs outside the workspace are tool-level toggles ("Read all files"/"Edit all files"). `.clineignore` is being deprecated and the docs state it "is not a security or access-control boundary" — ignored files remain readable via `@` mentions or shell; a `PreToolUse` hook script is offered to enforce it (https://docs.cline.bot/customization/clineignore).
- Network: no egress control for the local agent; the YOLO docs list "Make network requests to external services" among what can go wrong.
- Approvals (VS Code): per-category toggles — Read project files, Read all files, Edit project files, Edit all files, Execute safe commands, Execute all commands, Use the browser, Use MCP servers. "Safe" is not an allowlist: the model sets a `requires_approval` flag per command. **YOLO Mode** (Settings > Features) auto-approves everything including mode switches. Source note: in v4.1.27 the shipped defaults auto-approve reads, edits, browser and MCP and leave commands on approval (`DEFAULT_AUTO_APPROVAL_SETTINGS`, `apps/vscode/src/shared/AutoApprovalSettings.ts`; mapping in `apps/vscode/src/sdk/sdk-tool-policies.ts`, which gates all command tools on the single `executeSafeCommands` toggle).
- Approvals (CLI): `--auto-approve <boolean>` defaults to `true`; "Runs in yolo mode by default" when given a prompt; opt out with `--auto-approve false`, `--act` or `--plan`; `--yolo` is a shortcut and `/yolo on|off|toggle` switches in-session. ACP (editor) mode ignores the default and needs an explicit `--auto-approve true` (https://docs.cline.bot/cli/cli-reference; `apps/cli/src/main.ts`, `startup-settings.ts`).
- Enterprise: remote config `"yoloModeAllowed": false` disables the YOLO toggle for all users (https://docs.cline.bot/enterprise-solutions/configuration/infrastructure-configuration/control-other-cline-features/yolo-mode); MCP server controls also exist. No admin-enforced OS sandbox is documented.
- Hooks (`PreToolUse` etc.) are the only programmable enforcement point; Cline itself points users to them to block file access.

## Excerpts
> "Cline does not use a fixed allowlist. The model marks each command with a `requires_approval` flag based on the command and arguments." (Auto Approve, "Safe vs Approval-Required Commands")

> "Warning: This is dangerous. YOLO mode disables all safety checks." (Auto Approve, "YOLO Mode")

> "Your prompt. Runs in yolo mode by default; pass --auto-approve false (or --act/--plan) to opt out." (CLI Reference, help output)

> "`.clineignore` filters what Cline loads automatically, but it is not a security or access-control boundary" (.clineignore page)

## Relevance to the talk
The clearest example of the "no sandbox, approvals only" camp among the big open-source agents, and of the trend for headless CLIs to default to full autonomy. Letting the model self-label commands as safe is a good slide on why approval policy should not be decided by the thing being policed. The docs' own advice for YOLO — "Start with isolated environments" — pushes the isolation job back to the user.
