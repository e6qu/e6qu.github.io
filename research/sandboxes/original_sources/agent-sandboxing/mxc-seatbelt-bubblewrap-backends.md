---
title: "MXC macOS Seatbelt and Linux bubblewrap backends (microsoft/mxc docs/backends)"
url: https://github.com/microsoft/mxc/blob/main/docs/backends/seatbelt/seatbelt-backend.md
authors: Microsoft
date: read at main 5c331f2 (2026-11-21); npm `@microsoft/mxc-sdk` 1.1.0 (modified 2026-11-14)
accessed: 2026-11-22
kind: repo
---

## Summary
Microsoft eXecution Container (MXC) is the policy SDK behind the local sandboxes of GitHub Copilot CLI, VS Code's Copilot harness and Factory Droid on Windows, and behind Codex's opt-in Windows backend. Its Windows side is covered in [../macos-windows/windows-mxc-repo.md](../macos-windows/windows-mxc-repo.md). This note records the non-Windows backends, which is what those products actually run on macOS and Linux.
- **macOS:** MXC compiles a JSON policy into a Seatbelt profile and applies it with `sandbox_init()` between `fork()` and `exec()` in its own `mxc-exec-mac` binary, rather than shelling out to `sandbox-exec`.
- **Linux:** MXC runs bubblewrap with a generated seccomp program passed as `--seccomp FD`. For a total network block it uses `--unshare-net` alone. When outbound traffic is allowed or proxied, it builds a private network namespace with `slirp4netns` and installs `iptables`/`ip6tables` egress and ingress chains inside it (via util-linux `unshare --map-current-user --keep-caps` and `nsenter`). This differs from the socat-bridge design of srt, Codex and Zed.

## Key points
- **Seatbelt backend:**
  - "Requires macOS 15 (Sequoia) or later. No root, no daemon, no install";
  - "The profile is passed as a string — no temp files";
  - "The child keeps the parent's Mach bootstrap namespace, which is what lets GUI apps run under the sandbox when `guiAccess` is enabled".
- **What Seatbelt can enforce** (doc table): read-only/read-write/denied paths, block-all or allow-all outbound, loopback by port, and UI/clipboard/input lockdown. Inbound is "All-or-nothing — cannot be scoped". There is a "`hostLoopback` trap" warning before setting `egress.default: "allow"`.
- **bubblewrap backend** (`docs/backends/bwrap/bubblewrap-backend.md`):
  - baseline "uses `--ro-bind-try`, `--clearenv` and `--seccomp FD`" and unshares user, PID, IPC and UTS namespaces;
  - "The seccomp filter is always active". It permits `socket()`/`socketpair()` only for `AF_UNIX`, `AF_INET`, `AF_INET6` and `AF_NETLINK` (`ALLOWED_FAMILIES` in `seccomp_filter.rs`), blocks VSOCK and packet sockets, and blocks io_uring because it can "create sockets from submission-queue entries that seccomp cannot inspect".
- **Network-enabled modes (v0.9+)** need `slirp4netns`, iproute2 `ip`, util-linux `unshare` and `nsenter`, and `iptables`/`ip6tables`/`iptables-restore` on the nf_tables backend. "No root is needed: `iptables` runs against the sandbox's own network namespace, where the supervisor holds" the capabilities. "Ruleless `egress.default: \"deny\"` instead uses `--unshare-net` alone." This matches VS Code's documented Linux prerequisites (bubblewrap >= 0.5.0, `slirp4netns`, util-linux >= 2.35, iptables).
- **Address filtering:** `egress.allow`/`egress.deny` by IP/CIDR are enforced by those in-namespace firewall rules. Domain policy goes through `runtimeConfig.networkProxy`.
- **DNS:** the backend exposes the host resolver configuration (systemd-resolved, NetworkManager, resolvconf, WSL) without exposing their runtime directories.

## Excerpts
> "MXC translates your JSON policy into a Seatbelt profile and applies it with `sandbox_init()` between `fork()` and `exec()`." — Seatbelt backend

> "Ruleless `egress.default: \"deny\"` instead uses `--unshare-net` alone and needs none of these additional network tools." — bubblewrap backend

## Relevance to the talk
A third Linux network design next to "socat over a bind-mounted Unix socket" (srt, Kiro, Devin Local) and "in-helper TCP→UDS relay" (Codex, Zed). Here a user-mode TCP/IP stack (slirp4netns) gives the namespace real connectivity, and the kernel's own firewall inside the namespace restricts it. On macOS it shows the `sandbox_init()` route that `sandbox-exec` wraps. Both are deprecated Apple APIs, used here by Microsoft.
