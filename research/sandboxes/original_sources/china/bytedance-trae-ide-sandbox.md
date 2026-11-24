---
title: 沙箱
url: https://docs.trae.cn/ide/sandbox
authors: ByteDance (TRAE)
date: unknown (page shows no date; companion blog post 2026-01-08)
accessed: 2026-11-22
kind: docs
---

## Summary
TRAE, ByteDance's AI IDE, has a local sandbox for the terminal commands its agent runs, in both IDE mode and SOLO mode. On macOS it uses the built-in `sandbox-exec`. On Windows it uses TRAE's own sandbox SDK. On Linux it is supported only through Remote SSH and uses Bubblewrap. Filesystem rules and, on Windows only, network rules are set in a `sandbox.json` file. Allowlisted command prefixes skip the sandbox completely. The separate "Auto Run" mode runs every command outside the sandbox.

## Key points
- Isolation unit: an OS-level process sandbox around each agent terminal command. The mechanism is macOS `sandbox-exec`, a ByteDance "sandbox SDK" on Windows (native and Remote WSL 2), or Bubblewrap on Linux over Remote SSH (Debian 10+ / Ubuntu 20.04+). There is no VM or container.
- Per-session?: Each command runs in the sandbox on the user's machine. The docs do not describe any session-level unit.
- Network egress: "当前系统内置安全策略不涉及网络访问" (the built-in policy does not cover the network). `sandbox.json` has a `network` block (`default`, `allow`, `deny`; IPs, CIDRs, ports, wildcard domains; deny wins; the longest match wins) that works only on Windows. Its default is `"default": "allow"`. The docs give two example policies: deny everything except `*.github.com:443`, or allow everything except RFC1918 ranges.
- Persistence: none of its own. Commands act on the real workspace. Read/write access "继承当前用户权限" (inherits the current user's permissions). `/` is read-only by default, `.vscode` is read-only, and `.trae`, `.vscode` and `.git` are excluded from project read-write access.
- Limits: not documented.
- Pricing: no separate charge. It is part of the IDE.
- How to enable: Settings → 对话流 → 自动运行, then choose "沙箱运行（支持白名单）" separately for IDE and SOLO. The docs do not say what the default is. The blog post below says "Sandbox with allowlist" is on by default.
- Other modes, from the companion page https://docs.trae.cn/ide/auto-run-and-security ("目录信任 & 自动运行"): "自动运行" runs commands automatically outside the sandbox (在沙箱外自动执行). Auto-running MCP is a separate toggle, and every external MCP server needs first-time approval. Files the agent deletes go to the OS recycle bin, or to `~/.local/share/Trash/` on Linux.
- High-risk commands (e.g. `rm -rf`) are blocked. The user is offered: skip, add the prefix to the allowlist, or run it in the sandbox this time. If an ordinary command fails inside the sandbox, the user is asked whether to retry it outside.
- Blog post "Making AI Coding Safer: How TRAE Protects Your Codebase" (TRAE Team, 2026-01-08, https://www.trae.ai/blog/engineering_thought_0108):
  - The sandbox was in beta on macOS and remote Linux at that time, with Windows "under development". The current docs page now lists Windows.
  - Reads and writes are limited to the project directory, the temp directory and common dependency directories.
  - A separate shell-interception layer blocks `rm` and `rmdir` outside the permitted scope in PowerShell, bash, git-bash, zsh and fish.
  - TRAE said it was "actively working on ... network permission boundaries".
- SOLO cloud execution: press reports say SOLO standalone (PC and web) runs long tasks on cloud compute. I found no official doc on how that cloud environment is isolated. **Unverified (press only).**

## Excerpts
> "沙箱为智能体生成的命令提供受限的执行环境，确保智能体在安全隔离的环境中运行命令，防止未经授权的文件访问。" — English: "The sandbox provides a restricted execution environment for agent-generated commands, ensuring the agent runs commands in a securely isolated environment and preventing unauthorized file access." (沙箱, intro)

> "白名单中的命令将跳过沙箱，直接在沙箱外执行。" — English: "Commands on the allowlist skip the sandbox and run directly outside it." (沙箱, 白名单)

> "Linux：Debian 10 及以上、Ubuntu 20.04 及以上（通过 Remote SSH 和 Bubblewrap 实现）" — English: "Linux: Debian 10+, Ubuntu 20.04+ (implemented via Remote SSH and Bubblewrap)." (沙箱, supported platforms)

> "当前系统内置安全策略不涉及网络访问。" — English: "The current built-in security policy does not cover network access." (沙箱)

## Relevance to the talk
TRAE uses the same local-sandbox pattern as Cursor, Claude Code and Zed: Seatbelt on macOS, Bubblewrap on Linux, and an allowlist that bypasses the sandbox. It shares the same weak points. Network is out of scope except on Windows, the network default is allow, and the allowlist sends commands straight to the host. It is a good example of a Chinese IDE converging on the Western design.
