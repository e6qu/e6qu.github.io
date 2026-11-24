---
title: "Quickstart" (Junie CLI, Junie Documentation; section "Sandbox mode")
url: https://junie.jetbrains.com/docs/junie-cli.html
authors: JetBrains
date: living document, last updated 2026-11-21; read 2026-11-22
accessed: 2026-11-22
kind: docs
---

## Summary
Junie is JetBrains' coding agent and is current. It ships as an IDE plugin, recommended through the AI Chat of the AI Assistant plugin, and as a standalone Junie CLI. Both run locally as the user. By default they gate sensitive actions with approval prompts, an Action Allowlist and a three-level "Brave mode". The CLI adds an opt-in, Early Access **sandbox mode** (`junie --sandbox` or `/sandbox`, macOS and Linux only) built on Anthropic's sandbox-runtime (`srt`), JetBrains build. It confines terminal-command writes to the project, git dirs, temp and tool caches, but leaves the network **unrestricted by default**. The IDE plugin and AI Assistant pages document no OS sandbox, only approvals, the allowlist and `.aiignore`.

## Key points
- Runs: local process. The IDE plugin runs in the JetBrains IDE; the Junie CLI is a terminal agent and an ACP server. AI Assistant's AI Chat hosts Junie alongside Claude Agent, Codex and GitHub Copilot, and accepts other agents via ACP (https://www.jetbrains.com/help/ai-assistant/agents.html, dated 2026-10-07). The Agents page lists no separate native "AI Assistant agent mode"; agentic work in AI Chat goes through these agents.
- Isolation, CLI sandbox mode (EAP): every agent-issued terminal command is wrapped by `srt`, and the native edit tools are restricted. macOS uses srt's system sandbox (the page does not say "Seatbelt" but reads denials from the macOS sandbox log). Linux uses bubblewrap and needs `bwrap`, `socat` and `ripgrep`; Ubuntu needs an AppArmor userns grant via the opt-in `junie-sandbox-setup.sh`. Not available on Windows. OFF by default: new sessions start unsandboxed unless `--sandbox` is passed. Junie runs a forbidden-write test (and a blocked-connection test if filtering is on) before enabling. If activation fails, terminal execution stays blocked until verification succeeds or the user turns sandboxing off.
- Isolation, IDE plugin and AI Assistant: none documented. The Junie IDE plugin page and AI Assistant's Junie page describe only approvals, Brave mode and `.aiignore` (https://junie.jetbrains.com/docs/junie-ide-plugin.html, updated 2026-11-21; https://www.jetbrains.com/help/ai-assistant/junie-agent.html, 2026-10-07). Third-party agents in AI Chat (Codex, Claude Agent, Copilot) bring their own sandboxes and permission modes; Codex, Claude Agent and Copilot do not honour `.aiignore` (Agents page).
- Filesystem (sandbox, OS-enforced): writes go to `${PROJECT_DIR}`, `${GIT_DIR}`/`${GIT_COMMON_DIR}`, temp, and caches such as `~/.gradle`, `~/.m2`, `~/.npm`. Reads are unrestricted except `~/.ssh` (only `config` and `known_hosts`). srt also blocks writes to `.git/hooks`, `.git/config`, shell rc files, `.mcp.json`, `.vscode` and `.idea`. The policy lives in global `~/.junie/sandbox.json` (`allowWrite`, `denyWrite`, `allowRead`, `denyRead`). A project-local `.junie/sandbox.json` is ignored, so a cloned repo cannot widen its own sandbox. Agent-proposed policy edits each need a fresh "Allow once" that Brave mode cannot bypass.
- Filesystem (no sandbox, tool-level): `.aiignore` makes Junie ask before viewing or editing listed paths. Per the plugin page, Brave mode and allowlisted commands that reference those paths bypass it. Reads and writes outside the project, editing config or hidden files, and reading files with secrets are approval-gated action types.
- Network: unrestricted by default, even with the sandbox on. Opt-in filtering uses `network.unrestricted: false` plus `allowedDomains`, enforced by srt (Junie's page does not detail the mechanism; see anthropic-sandbox-runtime.md for srt's proxy design). Unix-socket access is controlled by `network.allowUnixSockets` and `allowAllUnixSockets`. Without sandbox mode the network is not restricted at all.
- Approvals: by default terminal commands, MCP tools and other sensitive actions need approval; `ls`, `cd` and `pwd` (any args) are auto-allowed but chained commands are not. The Action Allowlist (https://junie.jetbrains.com/docs/action-allowlist.html) covers Terminal (exact or regex; docs advise excluding `; | & < > @ $`), RunTest, Build, Preview, MCP (all-or-nothing), read or write outside the project, editing build scripts, editing config or hidden files, and reading secrets. The CLI stores it in `~/.junie/allowlist.json`; the IDE has Settings | Tools | Junie | Action Allowlist. Brave mode has three levels: CLI Off/Auto/On via `/brave`, Ctrl+B or `--brave` (interactive only); IDE Safe/Auto/Brave. Auto uses a safety classifier for terminal commands. Brave preference is stored separately for sandboxed and unsandboxed sessions, and the sandbox defaults to Brave On. `--act-as-interactive` runs unattended ("the agent never asks the user anything"), and `--trust-project` loads project `.junie` config for one run (https://junie.jetbrains.com/docs/parameters.html).
- Caveats from the docs: sandbox mode is "not hardened isolation like a container or VM". MCP servers, hooks and Junie's own non-tool operations are not isolated. The IDE plugin page says "using brave mode is not recommended" and points to the allowlist instead.
- Enterprise or admin controls specific to Junie's permissions: not documented on the pages read.

## Excerpts
> "Sandbox mode wraps every agent-issued terminal command in an OS-level sandbox (sandbox-runtime, `srt`) and restricts native edit tools." (Quickstart, Sandbox mode)

> Network access is unrestricted by default, while "the filesystem restrictions stay fully in force". (Quickstart, Sandbox mode)

> "By default, Junie requires user approval for running terminal commands, MCP tools, and other types of actions." (Action Allowlist)

> "using brave mode is not recommended" (Junie IDE plugin)

## Relevance to the talk
This is a second vendor, after Zed, that adopted an existing agent sandbox rather than building one: Junie CLI uses Anthropic's `srt`. Its default posture is different, though. The sandbox is opt-in and EAP, it constrains writes but not the network, and it has a nice anti-self-widening rule (global-only policy, edits need a one-shot approval). In the IDE the guard is still approvals, an allowlist and a YOLO-style "Brave" switch, and the docs themselves discourage that switch. The IDE now also hosts several third-party agents, each with its own sandbox semantics.
