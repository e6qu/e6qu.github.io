---
title: "Gemini CLI tool-sandbox source (packages/core/src/sandbox: Seatbelt, bubblewrap, GeminiSandbox.cs)"
url: https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/sandbox
authors: Google (google-gemini/gemini-cli contributors)
date: read at main eecccfc (2026-11-20; package version 0.71.0-nightly.20261118); `GeminiSandbox.cs` path first committed 2026-03-24 (#23645, file reorganisation)
accessed: 2026-11-22
kind: repo
---

## Summary
Gemini CLI has two sandbox layers: the older whole-CLI sandbox (Seatbelt `.sb` profiles in `packages/cli/src/utils/`, or Docker/Podman/runsc/LXC) and a newer per-tool "tool sandboxing" layer in `packages/core/src/sandbox/{macos,linux,windows}`. The tool layer is the closest to what Codex and Claude Code do. Its code shows three platform designs:
- **macOS:** `(deny default)` with `(import "system.sb")`, run via `sandbox-exec -f <tempfile>`.
- **Linux:** bwrap with `--unshare-all` (plus `--share-net` when network is allowed) and a hand-assembled 7-instruction BPF program that only kills foreign-arch syscalls and returns `EPERM` for `ptrace`.
- **Windows:** a C# helper that runs the command under a `CreateRestrictedToken(DISABLE_MAX_PRIVILEGE)` token lowered to Low integrity (S-1-16-4096) inside a job object. "No network" is implemented by setting the job's network *rate limit* (`JobObjectNetRateControlInformation`, `MaxBandwidth = 1`), and on failure it only warns.

`security.toolSandboxing` defaults to **false** in the settings schema and in `config.ts`, although `docs/cli/sandbox.md` describes how to "turn off" tool sandboxing as if it were on.

## Key points
- **Whole-CLI Seatbelt profiles** (`packages/cli/src/utils/sandbox-macos-*.sb`):
  - six profiles (permissive/restrictive/strict × open/proxied), loaded with `sandbox-exec -D …` parameters;
  - `permissive-open` is `(deny default)` + `(allow file-read*)` + project writes + `(allow network-outbound)` + `(allow network-inbound (local ip "*:*"))`;
  - it explicitly denies the Docker/Colima/OrbStack/Rancher sockets and binaries, `com.docker.*` mach services, and writes to `~/.gemini` and OAuth credential files.
- **Tool-sandbox macOS base** (`macos/baseProfile.ts`): "uses a strict allowlist (deny default) but imports Apple's base system profile to handle undocumented internal dependencies … to avoid \"Abort trap: 6\"". Network is all-or-nothing: `NETWORK_SEATBELT_PROFILE` adds `(allow network-outbound)`, `(allow network-inbound)` and `(allow network-bind)`. There is no proxy port rule in this layer.
- **Linux bwrap** (`linux/bwrapArgsBuilder.ts`): `--unshare-all --new-session --die-with-parent`, then `--share-net` if network is allowed, `--ro-bind / /`, `--dev /dev`, `--proc /proc`, `--tmpfs /tmp`, then workspace/allowed binds and `--seccomp 9`.
- **Linux seccomp** (`linux/LinuxSandboxManager.ts`): the BPF is assembled byte by byte. It loads arch, kills the process if it is not the native `AUDIT_ARCH`, returns `EPERM` for `ptrace`, and allows everything else. There is no `AF_UNIX`/`io_uring` rule. Network isolation relies entirely on the unshared netns.
- **Network decision:** `networkAccess = modeConfig.network || req.policy.networkAccess || isYolo`, so YOLO mode shares the host network.
- **Windows** (`windows/GeminiSandbox.cs`, `WindowsSandboxManager.ts`):
  - `CreateRestrictedToken(hToken, DISABLE_MAX_PRIVILEGE, …)`, then `SetTokenInformation(TokenIntegrityLevel)` with S-1-16-4096 (Low), then `CreateJobObject` + `AssignProcessToJobObject`;
  - with `network:0` it sets `JOBOBJECT_NET_RATE_CONTROL_INFORMATION { MaxBandwidth = 1, ControlFlags = ENABLE | MAX_BANDWIDTH }`, and on failure prints "Warning: … Network might not be throttled.";
  - secret files are "explicitly deny[ed] … for Low Integrity processes".
- **Default:** `toolSandboxing: { default: false }` (`packages/cli/src/config/settingsSchema.ts` line ~1853; `config.ts:1046` `?? false`). The reference docs agree (`Default: false`); the sandbox guide implies the opposite. This corrects [gemini-cli-sandbox.md](gemini-cli-sandbox.md), which said "default on".

## Excerpts
> "(deny default)\n\n(import \"system.sb\")" — `macos/baseProfile.ts`

> "{ code: 0x15, jt: 0, jf: 1, k: SYS_ptrace }, // If ptrace, jump to ERRNO" — `linux/LinuxSandboxManager.ts`

> "netLimits.MaxBandwidth = 1;\nnetLimits.ControlFlags = 0x1 | 0x2; // ENABLE | MAX_BANDWIDTH" — `windows/GeminiSandbox.cs`

## Relevance to the talk
A good contrast slide. It uses the same primitives as Codex and srt, but the seccomp filter blocks only `ptrace` (not `AF_UNIX` or `io_uring`), the network is on/off with no proxy at the tool layer, and on Windows "offline" means throttled to the minimum bandwidth by a job-object QoS knob rather than blocked by WFP. Gemini CLI is also retired for consumers (2026-06-18), so these details matter mainly for enterprise users and for the forks that inherited the code (Qwen Code).
