---
title: "Codex sandbox source: Seatbelt .sbpl policies, linux-sandbox seccomp, Windows backend selection (openai/codex)"
url: https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl
authors: OpenAI (openai/codex contributors)
date: read at main 61cb947 (2026-11-22T19:23Z); earliest commit touching the Seatbelt policy at codex-rs/core/src/seatbelt_base_policy.sbpl is 2025-04-29 (PR #732), moved to codex-rs/sandboxing 2026-03-24 (PR #15593); earliest commit touching codex-rs/linux-sandbox/src/landlock.rs is 2025-05-23 (PR #1086); MXC crate first commit 2026-09-11 (PR #44872)
accessed: 2026-11-22
kind: repo
---

## Summary
The source code behind Codex CLI's local sandbox, read directly rather than through docs. On macOS Codex runs `/usr/bin/sandbox-exec -p <policy>` with a policy assembled from four `.sbpl` files plus generated rules: a `(deny default)` base derived from Chromium's renderer policy, `-D` parameters for each writable root, `require-not` carve-outs for protected metadata, and `localhost:<port>` allowances for the proxy. On Linux the `codex-linux-sandbox` helper builds a bubblewrap argv (`--unshare-user`, `--unshare-pid`, `--unshare-ipc`, `--unshare-net` when restricted, `--new-session`, `--die-with-parent`) and installs a seccompiler filter with `PR_SET_NO_NEW_PRIVS`. On Windows the source shows four backends (none, unelevated restricted token, elevated sandbox users, MXC). The sandbox level defaults to `Disabled`, and MXC is opt-in (`windows.sandbox = "mxc"` or the default-off, "UnderDevelopment" `prefer_mxc` feature).

## Key points
- **macOS invocation.** The binary path is pinned: `MACOS_PATH_TO_SEATBELT_EXECUTABLE = "/usr/bin/sandbox-exec"`, "to defend against an attacker trying to inject a malicious version on the PATH" (`sandboxing/src/seatbelt.rs`). Args are `-p <full_policy>` plus `-DWRITABLE_ROOT_0=…`, `-DWRITABLE_ROOT_0_EXCLUDED_0=…` parameters.
- **Policy files** (`codex-rs/sandboxing/src/`):
  - `seatbelt_base_policy.sbpl` (116 lines): `(deny default)`, process-exec/fork, signal and process-info only `(target same-sandbox)`, a sysctl-read allowlist copied from Chromium, `/dev/null` writes.
  - `seatbelt_network_policy.sbpl` (31 lines): AF_SYSTEM sockets plus mach-lookup for `com.apple.SecurityServer`, `trustd.agent`, `ocspd`, `networkd`, `SystemConfiguration.DNSConfiguration`/`configd`.
  - `seatbelt_read_only_platform_defaults.sbpl` (188 lines) and `seatbelt_preferences_policy.sbpl` (8 lines).
- **Writable roots** are emitted as `(allow file-write* (require-all (subpath (param "WRITABLE_ROOT_0")) (require-not (literal (param "…EXCLUDED_0"))) (require-not (subpath (param "…EXCLUDED_0"))) …))`. The code comment says the `literal` exclusion exists because "`subpath` alone leaves a gap for first-time creation of the protected directory itself, such as `mkdir .codex`".
- **Protected metadata** (`protocol/src/permissions.rs`): `PROTECTED_METADATA_PATH_NAMES = [".git", ".agents", ".codex", ".aws"]`, "Top-level workspace metadata paths that stay protected under writable roots."
- **Network on macOS.** With a managed proxy, the generated rules are `(allow network-outbound (remote ip "localhost:<port>"))` for each proxy port only. Tests assert there is no bare `(allow network-outbound)` and no `*:53` rule (`seatbelt_tests.rs`). Full network adds `(allow network-outbound)\n(allow network-inbound)`.
- **Linux seccomp** (`linux-sandbox/src/seccomp.rs`, default action Allow, matched rules return `EPERM`):
  - always denied (except the VM-socket-only mode): `ptrace`, `process_vm_readv`, `process_vm_writev`, and `request_key` ("can invoke host helpers that perform network requests outside the sandbox's network namespace");
  - always denied: `io_uring_setup`, `io_uring_enter`, `io_uring_register` ("io_uring can create AF_VSOCK sockets without a socket() syscall");
  - `Restricted` network mode: also denies `connect`, `accept`, `accept4`, `bind`, `listen`, `getpeername`, `getsockname`, `shutdown`, `sendto`, `sendmmsg`, `recvmmsg`, `getsockopt` and `setsockopt`, and allows `socket`/`socketpair` only for `AF_UNIX` (`recvfrom` deliberately left allowed for `cargo clippy`);
  - `ProxyRouted` mode: allows only `AF_INET`/`AF_INET6` sockets inside the empty netns (so tools can reach the in-namespace bridge), denies new `AF_UNIX` sockets unless `dangerously_allow_all_unix_sockets`, and allows `AF_NETLINK` only as `NETLINK_ROUTE` in transparent-TCP mode;
  - `VmSocketRestricted` mode: denies only `AF_VSOCK`.
- **Linux bwrap argv** (`linux-sandbox/src/bwrap.rs`): `--new-session --die-with-parent`, filesystem args (root `--ro-bind / /`, writable roots `--bind`, protected paths re-bound read-only), then `--unshare-user` (requested explicitly "rather than relying on bubblewrap's auto-enable behavior, which is skipped when the caller runs as uid 0"), `--unshare-pid` unless inheritance is enabled, `--unshare-ipc`, `--unshare-net` when network is restricted, `--proc /proc`.
- **WSL.** The bwrap path masks WSL's Windows-interop socket directory: "WSL's Windows-process bridge uses Unix sockets under /run/WSL. Mask them after all filesystem binds so network access cannot bypass the Linux filesystem policy by launching an unrestricted Windows process" (`--tmpfs /run/WSL`).
- **Landlock is legacy.** Feature `use_legacy_landlock` is `Stage::Deprecated`, `default_enabled: false` (`features/src/lib.rs`).
- **Windows selection** (`core/src/windows_sandbox.rs`, `protocol/src/config_types.rs`):
  - `WindowsSandboxLevel` has `#[default] Disabled`, plus `RestrictedToken` and `Elevated`;
  - `[windows] sandbox = "elevated" | "unelevated" | "mxc"` selects explicitly, and `allow_mxc = false` blocks MXC;
  - the old `experimental_windows_sandbox`/`elevated_windows_sandbox` feature flags are `Stage::Removed`, and `prefer_mxc` is `Stage::UnderDevelopment`, `default_enabled: false`;
  - the TUI has a "Prompt to enable the Windows sandbox feature before using Agent mode" event and elevated/non-elevated setup flows (`tui/src/app_event.rs`).
- **MXC backend** (`mxc-sandbox/README.md`): calls Microsoft's MXC V1 SDK directly and "never invokes MXC's AppContainer dispatcher". The child is created suspended and put in a kill-on-close job. Loopback is allowed for the proxy, while direct non-loopback egress and inbound are denied. Known gaps: hard-link names and junction/volume-root aliases.

## Excerpts
> "; start with closed-by-default\n(deny default)" — `seatbelt_base_policy.sbpl`

> "; inspired by Chrome's sandbox policy:" — `seatbelt_base_policy.sbpl`, line 3

> "// io_uring can create AF_VSOCK sockets without a socket() syscall, so\n// keep it unavailable in every mode with socket-family restrictions." — `linux-sandbox/src/seccomp.rs`

> "`windows.sandbox = \"mxc\"` is strict. The default-off `features.prefer_mxc` selects MXC for local execution when available" — `mxc-sandbox/README.md`

## Relevance to the talk
This is the concrete artifact behind the "one recipe" slide. A Chromium-derived `(deny default)` SBPL is passed as a string to `sandbox-exec`. bubblewrap's `--ro-bind / /` plus `--unshare-net` is followed by a seccomp filter that has to chase `io_uring` and `request_key`. A per-OS proxy reaches the sandbox only over loopback. It also corrects an over-simple reading of OpenAI's 2026-11-18 post: in the CLI source on 2026-11-22, MXC is an opt-in backend, and an unconfigured Windows install resolves to no sandbox until the user runs setup.
