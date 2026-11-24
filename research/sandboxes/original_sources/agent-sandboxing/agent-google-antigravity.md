---
title: "Terminal sandbox" (Google Antigravity Docs)
url: https://antigravity.google/docs/sandbox/
authors: Google
date: living document (no date shown; references App versions up to v2.29.0 and CLI v1.4.4+); read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Google Antigravity is Google's agent-first coding platform: a desktop app/IDE and, since May 2026, the Antigravity CLI (`agy`), which replaces Gemini CLI for consumer users. Both run locally as the user and wrap agent shell commands in an OS "terminal sandbox". It uses Seatbelt (`sandbox-exec` with SBPL profiles) on macOS, kernel namespaces on Linux, and AppContainer on Windows (CLI only, Windows 11 24H2 with the Aug 2026 update). In the App the sandbox is on by default (the "Default" preset). In the CLI the setting `enableTerminalSandbox` defaults to `false`, but `agy` starts in `auto` mode where available, and auto mode switches the sandbox on. Inside it, project folders are writable, `~/.ssh` and `.env` are blocked, anything not mounted is invisible on macOS and Linux, and the network is closed except for approved `read_url` domains.

## Key points
- Status: current and major. Google announced on 2026-05-19 that Gemini CLI transitions to Antigravity CLI. Consumer Gemini CLI and Gemini Code Assist IDE extensions stopped serving Pro, Ultra and free users on 2026-06-18, while enterprise Code Assist licences keep access ("An important update: Transitioning Gemini CLI to Antigravity CLI", Google Developers Blog, https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/). The existing gemini-cli-sandbox.md note therefore describes a product being retired for consumers.
- Runs: local process (desktop app and `agy` CLI). The blog says the App and CLI share a backend and "server-side harness"; commands still execute locally.
- Isolation: macOS uses `sandbox-exec` with Seatbelt SBPL profiles (filesystem and sockets). Linux uses kernel namespaces for filesystem, process and network isolation; the page does not name a tool such as bubblewrap. Windows (CLI) uses AppContainer, where folders outside the user profile are readable but not writable. Default ON in the App under the "Default" and "Auto" presets, and OFF under "Request Review" and "Turbo". In the CLI, `enableTerminalSandbox` is false by default, but `--mode=auto`/`agentMode: "auto"` turns it on, and `agy` "starts in `auto` mode where `auto` mode is available for your account and platform" (https://antigravity.google/docs/cli/modes/). Auto is unavailable for business and enterprise accounts (including Gemini Enterprise) and where the sandbox is unsupported (Windows 10, older Windows 11, hosts or containers without unprivileged user namespaces). Those users default to an unsandboxed mode unless they set `--sandbox` or `enableTerminalSandbox`. Where the sandbox is unavailable, its settings "have no effect".
- Filesystem (sandbox, OS-enforced): project folders read-write. `read_file`-allowed paths are mounted read-only and `write_file`-allowed paths read-write. `/usr` and `/etc` are readable; temp and common build caches are writable. `~/.ssh` and `.env` are blocked. On macOS and Linux unmounted paths are invisible. Outside the sandbox, App presets set file-tool scope: Request Review covers the workspace only, Default and Auto add temp, and Turbo allows the full filesystem (https://antigravity.google/docs/permissions/).
- Network: sandboxed commands have no network by default. `read_url` allow rules add domains to an outbound allowlist; the docs do not describe the enforcement mechanism. Browser actions are permissioned separately (`read_url`, `execute_url`, `download_url`), and every file upload needs one-time approval "even in Turbo".
- Approvals: App presets are Request Review (always ask), Default (run in sandbox, ask outside), Auto (sandbox, plus an AI check for out-of-sandbox commands: safe or reversible ones run, risky ones ask) and Turbo (no sandbox, unrestricted). Rules use `action(target)` (`command(git)`, `command(regex:...)`, `read_file(...)`, `write_file(...)`, `read_url(...)`, `mcp(server/tool)`) in allow, ask and deny lists, and Deny > Ask > Allow. CLI: `--mode` = `auto` | `accept-edits` | `default` (Shift+Tab); `toolPermission` = `request-review` (default) | `proceed-in-sandbox` | `strict` | `always-proceed`; `always-proceed` = `--dangerously-skip-permissions` and overrides auto; config lives in `~/.gemini/antigravity-cli/settings.json`. Escaping the sandbox goes through `command(...)` allow rules, or `unsandboxed(...)` for business and enterprise accounts.
- Caveats: the docs mix current and "previous" or legacy settings ("Enable Sandbox Mode (Preview)", "Terminal Command Auto Execution"), and business and enterprise accounts still see the legacy permission system. Defaults differ by account type, so verify in `/config`.

## Excerpts
> "Antigravity includes a **terminal sandbox**, enabled by default, that isolates shell commands executed by agents." (Terminal sandbox)

> "`agy` starts in `auto` mode where `auto` mode is available for your account and platform, and in `default` mode otherwise." (Choose an execution mode - Antigravity CLI)

> "Conflicting rules are strictly evaluated in priority order: Deny > Ask > Allow." (Permissions)

> "we can serve you best by pouring our energy into a single product built for today's multi-agent reality." (Google Developers Blog, 2026-05-19)

## Relevance to the talk
Google's flagship coding agent is no longer Gemini CLI, whose sandbox was opt-in Seatbelt or Docker. Antigravity has a native per-OS sandbox (Seatbelt / namespaces / AppContainer) that is on by default in the App and tied to the AI-judged "auto" mode in the CLI. It shows the industry pattern: a sandbox inside which commands run freely, with an approval or classifier only at the boundary. It also shows the enterprise twist that the most autonomous mode is withheld from business accounts, and a closed-by-default network allowlist driven by URL permissions.
