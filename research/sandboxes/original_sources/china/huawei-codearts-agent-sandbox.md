---
title: 安全策略 (Agent / 码道IDE 用户指南) - CodeArts Agent - 华为云
url: https://support.huaweicloud.com/usermanual-codeartsagent/codeartsagent_ug_0045.html
authors: Huawei Cloud (华为云) CodeArts
date: updated 2026-11-13 (CLI counterpart updated 2026-11-16)
accessed: 2026-11-22
kind: docs
---

## Summary
Huawei's coding agent, CodeArts Agent (码道; formerly CodeArts Snap), runs agent commands in a local sandbox in its IDE and CLI. Two of the three permission modes ("manual approval" and "auto approval") use the sandbox. The third, "full access", runs directly on the host. A per-user `sandbox.json` sets filesystem read-write and read-only paths, a network default with allow/deny rules (domain:port or IP:port, CIDR), and CPU and memory caps. The docs do not name the OS mechanism. Whitelisted command prefixes bypass the sandbox entirely. If the network section is unset, network access is allowed by default.

## Key points
- Isolation unit: a local OS-level process sandbox on Windows 10/11, macOS 11+ and Linux x64/ARM64. The mechanism is not named; bubblewrap, Seatbelt and AppContainer do not appear. On Linux the sandbox creates an isolated simulated address 127.0.0.1, which suggests a network namespace (my inference).
- Per-session?: applies to every command in the manual and auto-approval modes. "Full access" has no sandbox.
- Network egress:
  - Four policies: full network, local/LAN only (not available on Linux), no network (blocks all TCP), and custom.
  - Custom `network` has `default` (Allow/Deny) plus `allow`/`deny` lists in "域名:端口" or "IP:端口" form, with wildcards and CIDR. Priority is deny, then allow, then default.
  - If the network section is omitted, network access is allowed.
- Filesystem defaults:
  - Read is allowed broadly. Read-write covers the workspace, temp/cache and toolchain caches (Maven, Gradle, npm, Cargo).
  - Credential and system paths are denied, e.g. `~/.ssh`, Keychains, `/etc/shadow`, `/etc/sudoers`. On macOS, Documents, Desktop and Downloads are also blocked.
  - If a path is in both `readOnly` and `readWrite`, readOnly wins.
  - Optional protections: dotfile protection (e.g. `.env`), edit scope limited to the project, read scope limited to the project.
- Resources: `cpu` (percent, default 50, minimum 20) and `memory` (GB, default 8, minimum 1). If unset, the sandbox shares host resources.
- Persistence: not applicable; the sandbox works on the host filesystem.
- Escape hatches:
  - Whitelisted command prefixes "绕过沙箱机制，直接在沙箱外执行".
  - When a high-risk command is detected, the IDE offers Skip, Add to whitelist, or Continue (run outside the sandbox once). The CLI blocks high-risk commands outright, while the TUI asks.
- CLI page: https://support.huaweicloud.com/usermanual-cli/codeartsagent_cli_0007.html (updated 2026-11-16). The config directory is `%USERPROFILE%/.codeartsdoer`, which still carries the old "CodeArts Doer/Snap" naming.
- Pricing: not applicable.

## Excerpts
> "沙箱（Sandbox）为智能体生成的指令提供隔离且受限的执行空间。" — English: "The sandbox provides an isolated, restricted execution space for commands the agent generates." (安全策略)

> "被加入白名单的命令将绕过沙箱机制，直接在沙箱外执行。" — English: "Whitelisted commands bypass the sandbox mechanism and run directly outside it." (安全策略)

## Relevance to the talk
This is a good slide example of the "allowlist means unsandboxed" anti-pattern. Cursor's allowlist also skips the sandbox. Here a whitelisted prefix escapes isolation rather than being auto-approved inside it, and the network default is allow-all unless configured. It also shows that local coding-agent sandboxes in China now include resource caps (CPU% and memory), which most Western equivalents do not expose.
