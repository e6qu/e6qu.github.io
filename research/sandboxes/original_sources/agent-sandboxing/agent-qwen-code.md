---
title: "Sandbox | Qwen Code Docs"
url: https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/
authors: Qwen team (Alibaba), QwenLM/qwen-code
date: living document; read 2026-11-22 (repo @ b6ad80d8b2, release v0.28.4)
accessed: 2026-11-22
kind: docs
---

## Summary
Qwen Code is current and very active (v0.28.4 on 2026-11-22, ~31k stars). It forked from Gemini CLI v0.8.2 and stopped syncing at v0.1. It kept Gemini CLI's **whole-CLI sandbox**: macOS Seatbelt (`sandbox-exec`, default profile `permissive-open`) or Docker/Podman on any OS. It has since added a new **Linux tool-execution sandbox** (`tools.executionSandbox`, bubblewrap preferred, partial Landlock fallback) that confines only the tools while the CLI stays on the host. Both are **off by default**, and `--yolo` does not turn them on. The default approval mode in trusted folders is `auto`, where an LLM classifier approves or blocks. Trusted Folders is itself disabled by default, so every folder counts as trusted.

## Key points
- Runs: local Node CLI/TUI. Optionally the whole CLI is relaunched inside Seatbelt or a container (`ghcr.io/qwenlm/qwen-code:<version>`). With `tools.executionSandbox` on Linux, only tools run confined.
- Isolation, macOS: Seatbelt via `-s` / `--sandbox[=sandbox-exec]`, `QWEN_SANDBOX`, or `tools.sandbox`. `SEATBELT_PROFILE` takes `permissive-|restrictive-` × `open|closed|proxied`, or a custom `.qwen/sandbox-macos-<name>.sb`. Off by default.
- Isolation, Linux: (1) `tools.executionSandbox` `{backend: auto|bwrap|landlock, filesystem: read-only|workspace-write, network: open|closed}`. bwrap gives PID and network namespaces. Landlock is reported as "partial": no PID/net namespace, cannot enforce `network: closed`, and has metadata gaps. It can be set only in User or System settings, never per workspace. It is inspected with `qwen sandbox --verify`. ACP, `qwen serve`, web terminals, MCP/LSP, hooks and extensions are rejected or disabled under it. (2) Docker/Podman whole-CLI sandbox. The old whole-CLI `--sandbox bwrap` was replaced by (1). Both are off by default.
- Isolation, Windows: Docker/Podman whole-CLI sandbox only, opt-in.
- Filesystem: Seatbelt `permissive-open` restricts writes outside the project directory and a few others but allows reads. Containers mount the workspace and `~/.qwen`. Execution sandbox `workspace-write` allows writes only in the canonical workspace plus private scratch, but "reads remain broad: this mode does not hide host secrets". `.qwenignore` (and `.agentignore` / `.aiignore`) only filter what tools consider; they are not OS-enforced (https://qwenlm.github.io/qwen-code-docs/en/users/configuration/qwen-ignore/).
- Network: Seatbelt `*-open` (the default) allows outbound traffic, `*-closed` blocks it, and `*-proxied` routes through `QWEN_SANDBOX_PROXY_COMMAND` (a proxy on :8877, e.g. an allowlist). Execution sandbox `network: closed` (bwrap only) blocks IP connections from commands. No restriction without a sandbox.
- Approvals: `tools.approvalMode` / `--approval-mode` = `plan`, `default` (shown as "Ask Permissions"), `auto-edit`, `auto` (LLM classifier; default in trusted folders) or `yolo` (`--yolo`). Untrusted folders, `--bare` and `--safe-mode` default to Ask Permissions. Rules go in `permissions.allow`, `permissions.ask` and `permissions.deny`, plus `--allowed-tools`. `ui.allowedApprovalModes` (user/system scope) limits which modes are offered, but the docs say it is presentation only (https://qwenlm.github.io/qwen-code-docs/en/users/configuration/settings/, https://qwenlm.github.io/qwen-code-docs/en/users/features/approval-mode/).
- Default-mode caveat: the repo docs @ b6ad80d8b2 (docs/users/features/approval-mode.md) say "Standard sessions in trusted folders default to Auto Mode". The published approval-mode page read on 2026-11-22 contradicts itself: it calls Auto the default but also says Ask Permissions "is the initial mode when you start Qwen Code". The settings reference lists the `tools.approvalMode` default as `auto`.
- Headless `--yolo` without a sandbox prints a stderr warning, which can be suppressed with `QWEN_CODE_SUPPRESS_YOLO_WARNING=1` (settings docs).

## Excerpts
> "On Linux, install `bwrap` (Bubblewrap) at `/usr/bin/bwrap` ... then enable the tool execution sandbox in your **User** settings" (Sandbox, Linux tool execution sandbox)

> "Landlock cannot enforce `network: closed` or hide explicit masked paths." (Sandbox)

> "Approval and YOLO do not expand the filesystem or network policy." (Sandbox)

> "`--yolo` does _not_ automatically enable a sandbox." (Settings, sandbox section)

## Relevance to the talk
This is the one Gemini CLI fork that kept and extended the sandbox. The new Linux design confines tools rather than the whole CLI, cannot be configured from the workspace, and reports Landlock honestly as "partial". It is a good contrast with Codex's bubblewrap approach. It still shows the usual gap, though: the sandbox is opt-in, while the shipped default is an LLM classifier deciding approvals in folders that are trusted by default.
