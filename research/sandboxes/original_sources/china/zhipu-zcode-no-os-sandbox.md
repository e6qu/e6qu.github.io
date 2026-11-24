---
title: ZCode NOTICE.md (Section 1, AI output, execution permissions and automation risks) and apps/zcode-cli/docs/usage/05-permissions.md — zai-org/ZCode (Chinese-language page)
url: https://github.com/zai-org/ZCode/blob/main/NOTICE.md
authors: Zhipu AI (Z.ai), zai-org
date: NOTICE.md last changed 2026-10-30; 05-permissions.md last changed 2026-10-19; repo opened 2026-09-20; latest release v3.18.2 (2026-11-16)
accessed: 2026-11-22
kind: repo
---

## Summary
ZCode is Z.ai's own coding agent: an Electron desktop "Agentic Development Environment" plus a standalone `zcode` CLI. Z.ai published the source on 2026-09-20 (Apache-2.0, about 8.8k stars). Its NOTICE.md says the shared agent execution adapter has no operating-system sandbox by default. Tools run with the full permissions of the OS account. The CLI docs also say Plan mode is not a read-only OS sandbox, and that allow/deny rules and hooks are no substitute for OS isolation. The only boundary is the approval layer: `plan`, `build` (the shared default), `edit`, `yolo`, and `guarded`. The standalone CLI defaults to `yolo` when run non-interactively with `--prompt`.

## Key points
- Isolation unit: none. NOTICE.md says the shared agent execution adapter provides no default OS sandbox (translated from Chinese, https://github.com/zai-org/ZCode/blob/main/NOTICE.md). The working directory, workspace identity, Git worktree, browser-page isolation and Node REPL context are explicitly not to be taken as a system-level isolation guarantee for all tools.
- Per OS: the same on macOS, Windows and Linux. The desktop app ships for all three, and Linux was beta per a third-party review (flaviocopes.com/zcode, 2026-08-31). I found no Seatbelt, bwrap, Landlock or restricted-token code in the repo tree. The only "sandbox" in the tree is `packages/desktop/src/main/pluginSandbox`, an Electron `<webview>` sandbox for plugin UI (contextIsolation, sandbox, CSP `default-src none`). It does not cover agent commands.
- Permission modes (05-permissions.md, translated from Chinese, https://github.com/zai-org/ZCode/blob/main/apps/zcode-cli/docs/usage/05-permissions.md):
  - `plan` limits ordinary writes and command execution but "is not an OS-level read-only sandbox".
  - `build`: writes and side-effecting tools usually need approval.
  - `edit`: workspace file edits are auto-approved.
  - `yolo`: ordinary tools skip prompts, "suited to already-isolated unattended tasks".
  - `guarded`: lenient, but dangerous commands still need per-call approval.
  - The desktop UI labels are Ask before changes / Edit automatically / Plan mode / Full access (third-party review).
- Defaults (NOTICE.md): the shared run config defaults to `build`. The standalone CLI with `--prompt` and no `--mode` uses `yolo`. Desktop, interactive and resumed sessions may use their own configured, saved or passed-in mode.
- Bash gating: an AST-based command parser with a high-risk root list (`rm`, `chmod`, `dd`, `mkfs`, `mount`, `sh`/`bash`/`zsh`, `powershell`, …) in `bash-command-permission-policy.ts`. The docs say a simple command regex is not a complete sandbox (translated from Chinese).
- Network egress: no restriction. Tools can read and write files, start processes and access the network within the permissions of the OS account they run as (translated from Chinese, NOTICE.md). For untrusted projects the NOTICE tells users to limit the account, credentials and network permissions themselves.
- Remote execution: work can run on SSH hosts, WSL or containers. Provider config, API keys and OAuth tokens may sync automatically into the target environment, with no separate per-credential confirmation step (translated from Chinese, NOTICE.md).
- Credentials: the CLI credential file uses encryption with a key derivable from local machine information. It is not the OS keychain.
- GLM Coding Plan: Z.ai's subscription for GLM models in ZCode and third-party tools such as Claude Code. ZCode setup docs: https://docs.z.ai/devpack/tool/zcode.
- CodeGeeX, the older Zhipu product: the VS Code extension `aminer.codegeex` was last updated on 2025-09-01 (v2.27.6, about 1.4M installs). Its README and changelog describe completion, chat and inline chat, but no agent command execution or sandbox.

## Excerpts
> "The current shared agent execution adapter provides no default operating-system sandbox; the working directory, workspace identity, Git worktree, browser-page isolation and the Node REPL's runtime context should not be taken as a system-level isolation guarantee for all tools." (translated from Chinese; NOTICE.md, https://github.com/zai-org/ZCode/blob/main/NOTICE.md)

> "The shared run configuration uses the `build` permission mode by default; when the standalone CLI runs a non-interactive task via `--prompt` without `--mode`, it uses `yolo`." (translated from Chinese; NOTICE.md)

> "Ordinary deny/allow rules in the configuration cannot replace operating-system isolation either." (translated from Chinese; 05-permissions.md, https://github.com/zai-org/ZCode/blob/main/apps/zcode-cli/docs/usage/05-permissions.md)

## Relevance to the talk
ZCode is unusually honest about having no sandbox. It is a 2026 coding agent from a frontier lab, and it ships with approval modes only. Its own NOTICE says the approval layer is not isolation. It is a good counter-example to TRAE, Qoder and CodeBuddy, which wrap commands in Seatbelt or bwrap. It also shows the "headless CLI defaults to YOLO" pattern.
