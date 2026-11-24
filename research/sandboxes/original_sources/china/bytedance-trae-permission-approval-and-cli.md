---
title: "Permission and Approval — TRAE docs, with the TraeWork Sandbox and TRAE CLI 2.0 Permissions and Sandbox pages (Chinese-language page)"
url: https://docs.trae.cn/ide_permission-and-approval.md
authors: ByteDance (TRAE)
date: undated pages (docs.trae.cn llms.txt index current on 2026-11-22); TraeWork sandbox page cites TraeWork desktop 0.1.20
accessed: 2026-11-22
kind: docs
---

## Summary
Since the corpus note on TRAE's sandbox page, TRAE has added a permission-and-approval layer that sits above the sandbox. There are three presets. Manual approval and auto approval run commands in the sandbox. Full access turns the sandbox off. In auto approval, an "LLM Guardian" model decides approval requests. A `global.json` file lets users choose what happens when the sandbox blocks a command: re-ask and retry inside the sandbox, escape to the host, or fail. The network default is allow. The same docs cover TraeWork, ByteDance's new desktop/web agent. On Windows its Work and Design modes run in an "isolated virtualised environment" that cannot be turned off, and its cloud tasks run in per-session sandbox containers. TRAE CLI 2.0 (`traecli`) has Codex-style flags (`--sandbox read-only|workspace-write|danger-full-access`, `--yolo`), and its open-source notice lists `@openai/codex`, `landlock` and `seccompiler`.

## Key points
- Isolation unit (TRAE IDE / TraeWork local): the same per-command OS sandbox as before. macOS uses `sandbox-exec`, Windows uses ByteDance's own sandbox SDK, and Linux uses bubblewrap over Remote SSH. The permission page now lists Linux temp and cache paths in the default policy.
- Presets (Permission and Approval page; translated from Chinese):
  - Manual approval: sandbox on; the user confirms each request.
  - Auto approval: sandbox on; the built-in LLM Guardian (or the user's custom model) decides.
  - Full access: sandbox off, commands run on the host, all checks disabled.
  - The page does not say which preset is the default.
- `global.json` (`~/.trae-cn/permission/work/global.json`):
  - `shellSandbox.enable`.
  - `shellSandbox.onRestrict`: `request_permission_retry_sandbox`, `request_escape_host` or `fail_immediately`.
  - `approval.reviewer`: `user`, `llm` (falls back to the user on refusal) or `always_deny`.
  - `sceneRules`: `commandAstDangerChecker` (default true), `shellFileProtection` (`safe_rm` shell aliases, default false), `deleteToolApproval`, `mcpToolApproval`.
  - `filesystem.default` is `read_only`; `network.default` is `allow`.
- Network: all network access is allowed by default. The docs disagree on where network rules work. The sandbox page and the enterprise-sandbox page say Windows only. The chat-settings page says Windows, Linux or Remote SSH.
- Older command-run settings (chat-flow settings page, https://docs.trae.cn/ide_chat-settings.md) still exist alongside the presets:
  - "Sandbox run (with allowlist)": allowlisted prefixes run outside the sandbox.
  - "Manual run": manual, outside the sandbox.
  - "Auto run": commands always run automatically outside the sandbox.
- Linux side effect (sandbox page, https://docs.trae.cn/ide_sandbox.md): if unprivileged user namespaces are blocked, TRAE runs `sysctl -w kernel.unprivileged_userns_clone=1` and `kernel.apparmor_restrict_unprivileged_userns=0`. It then persists both to `/etc/sysctl.d/trae-sandbox.conf`, weakening a host-wide hardening setting.
- TraeWork (https://docs.trae.cn/work_sandbox.md):
  - macOS (all modes) and Windows Code mode use the local sandbox.
  - Windows Work and Design modes use an "isolated virtualised runtime environment", described as "enabled by default and cannot be turned off" (translated from Chinese). Project writes sync back, and writes outside the project land in an isolated area. The hypervisor is not named.
  - Cloud tasks (desktop and web) run in an "independent secure sandbox container" per session, with no access to the host or to other sessions (translated from Chinese). The container technology is not named.
  - From TraeWork 0.1.20, macOS Work mode uses the same local policy as Code mode.
- Enterprise sandbox (https://docs.trae.cn/enterprise_sandbox.md): admins push per-OS JSON policies to "TRAE" and "TRAE CLI", and these override personal config. Network control is Windows-only for now.
- TRAE CLI 2.0 (https://docs.trae.cn/cli_permission-and-sandbox.md, https://docs.trae.cn/cli_command-line-parameters.md, https://docs.trae.cn/cli_config-file.md):
  - Availability: enterprise flagship plan only.
  - Modes: Workspace Edit, Auto-Review (model review of key operations) and Full Access.
  - Flags: `-s/--sandbox read-only|workspace-write|danger-full-access`, `-a/--ask-for-approval untrusted|on-failure|on-request|never`, and `-y/--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`). There is also a `traecli sandbox` subcommand.
  - Sample config: `approval_policy = "on-request"`, `default_permissions = ":workspace"`.
  - The OSS notice (https://docs.trae.cn/cli_open-source-software-notice.md) lists `@openai/codex`, `landlock` and `seccompiler`. That suggests a Codex-derived Linux Landlock+seccomp sandbox (inference). The per-OS mechanism is not documented.

## Excerpts
> "Full access: sandbox off, commands run directly on the host; full filesystem read/write; all safety checks disabled; no approvals triggered." (translated from Chinese; https://docs.trae.cn/ide_permission-and-approval.md)

> "Network access: all network access allowed by default." (translated from Chinese; https://docs.trae.cn/ide_permission-and-approval.md)

> "`request_escape_host`: request to run the current command on the host." (translated from Chinese; https://docs.trae.cn/work_custom-permission-mode-configuration-reference.md)

> "The sandbox is enabled by default and cannot be turned off." (translated from Chinese; TraeWork Windows Work/Design modes, https://docs.trae.cn/work_sandbox.md)

> "`-y, --dangerously-bypass-approvals-and-sandbox`: skip all confirmations and do not sandbox (alias `--yolo`); extremely dangerous; only for environments already isolated externally." (translated from Chinese; https://docs.trae.cn/cli_command-line-parameters.md)

## Relevance to the talk
TRAE has moved from a single sandbox toggle to the now-standard three-tier design: ask, model-reviewed auto, and full access with no sandbox. "Escape to host" is an explicit configuration value. The Linux path quietly relaxes kernel user-namespace hardening for the whole machine and keeps that change across reboots. The CLI appears to reuse OpenAI Codex's sandbox code, which is evidence that Chinese vendors take Western reference implementations rather than build their own. TraeWork on Windows is the only Chinese desktop agent found so far that uses a VM-like environment that cannot be switched off.
