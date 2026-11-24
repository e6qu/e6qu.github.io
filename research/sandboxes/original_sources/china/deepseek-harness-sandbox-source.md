---
title: "packages/sandbox (process-sandbox package group) and apps/cli reference — DeepSeek Harness repository"
url: https://github.com/deepseek-ai/deepseek-harness/tree/main/packages/sandbox
authors: DeepSeek
date: commit 4b399c39 (2026-11-22); root package.json 0.2.3-alpha.2; latest npm @deepseek-ai/dsh 0.2.2-rc.5 (2026-11-18)
accessed: 2026-11-22
kind: repo
---

## Summary
DeepSeek Harness's own source and docs confirm the per-OS design that the corpus note took from OX Security and npm. There are three modes, `read-only`, `workspace-write` and `danger-full-access`, borrowed from Codex. The backend chain is bubblewrap then Landlock on Linux, Seatbelt on macOS, and an ACL restricted-token runner on Windows. The sandbox fails closed when no backend works. New sessions default to `workspace-write`. Network access and reads are explicitly not confined, even after the CVE-2026-82533 fix.

## Key points
- Isolation unit: a per-command process sandbox that "shares the host kernel and filesystem". The README says "containers, microVMs, and remote executors replace whole capabilities instead of registering here".
- Per-OS chain (`packages/sandbox/sandbox-local/README.md`): "`linux`: `bwrap` then Landlock; `darwin`: Seatbelt; `win32`: the ACL restricted-token runner".
  - bwrap profile: `--ro-bind / / --dev /dev --unshare-pid --proc /proc --die-with-parent`, with no `--unshare-net`.
  - Seatbelt profile: `(allow default)(deny file-write*)` plus allowed write roots.
- Windows (`sandbox-windows-acl`): a capability-SID allow ACE, a deny on parent-directory delete, and a Low integrity label. The maintainers chose "raw ACL restricted tokens over mxc and AppContainer". Enforcement is reported as `partial`: hard links, unconfined reads and AppContainer-related gaps.
- Default: "New sessions in base-backed profiles default to the `workspace-write` permission preset". The library-level `sandbox-policy` schema defaults to `read-only`. The `sdk-minimal` profile pins `danger-full-access`. `DSH_PERMISSION_MODE` changes the fallback.
- Network: "reads and network access are not confined". The mode vocabulary "governs filesystem effects only". bwrap hides host processes; Landlock and Seatbelt do not.
- Fail-closed: when no runner works, `confine()` rejects with `SANDBOX_UNAVAILABLE`, and "silent unconfined passthrough is forbidden".
- Escape hatch: "A confined call that a policy denies can retry through a user-approved one-time escalation". There is also `danger-full-access`. `--permission-mode <preset>` has an approval choice of `ask` or `never`.
- `SAFETY.md`: "Sandboxing, approval prompts, and permission controls can reduce risk, but they do not guarantee isolation or prevent damage."

## Excerpts
> "Selection is by platform first, probes second: each platform has a runner chain (`linux`: `bwrap` then Landlock; `darwin`: Seatbelt; `win32`: the ACL restricted-token runner)." (sandbox-local README)

> "New sessions in base-backed profiles default to the `workspace-write` permission preset. … reads and network access are not confined" (apps/cli/reference/README.md)

> "confine must return enforcing argv or fail closed at wrap or runner-execution time; silent unconfined passthrough is forbidden." (docs/subsystems/sandbox.md)

## Relevance to the talk
DeepSeek Harness is the Chinese local harness with the most careful engineering: it fails closed, documents partial enforcement on Windows, and records its AppContainer decision. Even so, its threat model covers file writes only. The network stays open by design, and an open network is exactly what CVE-2026-82533 exploited through localhost. It compares directly with Tencent and Baidu, which both fail open.
