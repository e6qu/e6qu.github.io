---
title: "@tencent-ai/codebuddy-code 2.185.0 (npm package: CHANGELOG.md and bundled sandbox-cli 5.13.0-beta.2 binaries) (Chinese-language changelog)"
url: https://www.npmjs.com/package/@tencent-ai/codebuddy-code
authors: Tencent Cloud CodeBuddy / WorkBuddy team
date: 2.185.0 published 2026-11-20; changelog entries 2026-07-10 to 2026-11-13
accessed: 2026-11-22
kind: package
---

## Summary
This note comes from the shipped CodeBuddy Code CLI itself: its Chinese-language changelog plus strings read from the platform binaries of its `@tencent-ai/sandbox-cli-*` dependencies (5.13.0-beta.2). It goes beyond the docs page already in the corpus.
- macOS: `sandbox-cli` runs `/usr/bin/sandbox-exec` with a generated SBPL profile. That profile denies outbound network except to a localhost proxy and denies writes to `/`.
- Linux: the binary's default backend is minijail with Landlock and seccomp. bubblewrap is an alternative selected with `WB_SANDBOX_BACKEND=bwrap`. The docs, by contrast, say bubblewrap.
- Windows: the binary injects a DLL (`tsbx.dll`, plus `tsbx_x86.dll` for 32-bit processes) that hooks `Nt*` system calls in user mode. It is combined with a job object and a restricted token, and a `sandbox-center` service makes allow/ask/deny decisions.
- Default: the sandbox is off in the standalone CLI. On Linux it also needs `ENABLE_LINUX_SANDBOX_CLI=1`.
- The changelog shows Tencent first shipped Anthropic's `@anthropic-ai/sandbox-runtime` as a backend and removed it on 2026-10-21. It also records a fail-open rule for when the policy service is down.

## Key points
- Isolation unit: an OS process sandbox per Bash call, through the `sandbox-cli` runtime. The docs say the local Bash sandbox is now executed by the sandbox-cli runtime (translated from Chinese; https://www.codebuddy.ai/docs/zh/cli/bash-sandboxing, lastUpdated 2026-11-04).
- Per-OS mechanism. The docs name the backends; the details below come from my reading of strings in the binaries and are not vendor statements.
  - macOS: `sandbox-exec -f` with an SBPL profile containing `(deny network-outbound)`, `(allow network-outbound (remote ip "localhost:…"))` and `(deny file-write* (subpath "/"))`.
  - Linux: the string "sandbox backend: minijail (auto, default)" appears, alongside `landlock_create_ruleset` and `landlock_restrict_self`, seccomp `USER_NOTIF`, and "sandbox backend: bwrap (env WB_SANDBOX_BACKEND=bwrap)".
  - Windows: the binaries contain `tsbx.dll` and `tsbx_x86.dll`, with `NtCreateFile`, `NtDeleteFile`, `NtCreateKey` and similar strings, plus "inject" and "hook_enter". They also contain `CreateRestrictedToken`, `AssignProcessToJobObject` and a rules file `tsbx_rules.json` with `"default_action": "ask"` and deny rules for `%USERPROFILE%\.ssh` and `.gnupg`.
- Default on or off: off. The docs say platform support does not mean the sandbox is enabled (translated from Chinese), and the sandbox is enabled with `/sandbox`.
  - 2.172.1 (2026-10-21) made `sandbox-cli` the Linux default.
  - 2.173.0 (2026-10-22) reverted that. It now enters `sandbox-cli` only when `ENABLE_LINUX_SANDBOX_CLI=1` (translated from Chinese). WorkBuddy injects `1`.
- Before 2.172.1 the Linux standalone path did not actually isolate. That release's notes say that previously, with the sandbox enabled, commands on Linux ran without isolation (translated from Chinese). The same release removed the `@anthropic-ai/sandbox-runtime` backend.
- Fail-open: 2.143.1 (2026-09-03) says that when Sandbox Center fails to start, times out or hits an IPC error, WebFetch, network-policy checks and file guards degrade to allow (translated from Chinese). For server sessions, 2.176.0 (2026-10-25) added `sandboxUnavailable`, which defaults to `'fail'`.
- Network: a proxy with a domain allowlist (docs). 2.134.0 (2026-08-11) added a malicious-domain hash blocklist for sandbox network requests.
- Escape hatches:
  - `dangerouslyDisableSandbox` retries need approval and are disabled with `allowUnsandboxedCommands: false`.
  - `excludedCommands`. WorkBuddy Desktop stopped honouring it in 2.151.0 (2026-09-14), because compound commands could write outside the workspace without approval.
  - `-y` / `--dangerously-skip-permissions` equals `bypassPermissions`. It still asks for HIGH/CRITICAL commands unless `CODEBUDDY_IS_SANDBOX=1` is set, which gives a "true full pass" as of 2.139.0 (2026-08-25).
  - Admins can block bypass with `permissions.disableBypassPermissionsMode`.
- Permission modes (https://www.codebuddy.ai/docs/zh/cli/permission-modes): `default` (the default), `acceptEdits`, `auto` (model judges), `dontAsk`, `plan`, `bypassPermissions` and `delegate`. IDE clients can also pass `fullAccess` or `work`. That is the only documentation I found on how the CodeBuddy IDE maps onto the CLI; I found no IDE sandbox page.

## Excerpts
> "On Linux, once the sandbox is enabled, commands run through sandbox-cli by default … previously, when the standalone CLI enabled the sandbox on Linux, commands actually ran directly without isolation … also removed the old @anthropic-ai/sandbox-runtime backend, which no longer had an execution path." (translated from Chinese; CHANGELOG 2.172.1, 2026-10-21, in the npm package)

> "When Sandbox Center fails to start, a request times out or IPC errors, WebFetch, network-policy checks and file guards degrade to allow." (translated from Chinese; CHANGELOG 2.143.1, 2026-09-03)

> "CODEBUDDY_IS_SANDBOX=1 plus -y is a true full pass; the agent can run dangerous commands without confirmation." (translated from Chinese; https://www.codebuddy.ai/docs/zh/cli/permission-modes)

## Relevance to the talk
This is a rare look at how a Chinese vendor's sandbox actually changed over time. Tencent started on Anthropic's open-source sandbox-runtime and replaced it with its own Rust/C++ runtime. For a while the Linux "sandbox" ran nothing in isolation, and the Linux default had to be rolled back because user namespaces are often unavailable. The Windows backend uses user-mode syscall hooking by DLL injection, which is weaker than a kernel-enforced boundary. And the policy service fails open.
