---
title: "sandbox-runtime (srt) source: generated Seatbelt profile, bubblewrap + socat bridge, apply-seccomp filter, Windows backends"
url: https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts
authors: Anthropic (anthropics/sandbox-runtime contributors)
date: read at v0.0.83 (commit 0bbebed, 2026-11-12); seccomp Unix-socket filter first added 2025-10-24; io_uring block added 2026-03-30 (#183); Windows srt-win wiring 2026-05-27; opt-in MXC backend 2026-11-06 (#766)
accessed: 2026-11-22
kind: repo
---

## Summary
This is the source behind Anthropic's srt, which Claude Code uses and which JetBrains Junie CLI, VS Code's legacy terminal sandbox (`@vscode/sandbox-runtime`) and Kilo Code (its `apply-seccomp` binary) reuse. The existing note [anthropic-sandbox-runtime.md](anthropic-sandbox-runtime.md) covers the README; this one records what the code does.
- **macOS:** a generated profile string beginning `(deny default (with message "<logTag>"))`, run as `env … /usr/bin/sandbox-exec -p <profile> <shell> -c <command>`.
- **Linux:** `bwrap` with `--unshare-net`, `--unshare-pid` and `--unshare-user`, a fresh `/proc`, and two `socat` relays per proxy: a host-side `UNIX-LISTEN` → `TCP:localhost:<proxy>`, and an in-sandbox listener on `localhost:3128` (HTTP) or `1080` (SOCKS) → the bind-mounted Unix socket. A static `apply-seccomp` binary then installs a libseccomp filter.
- **Windows (alpha):** either a dedicated `srt-sandbox` user with a WFP fence, a restricted token and ACEs, or, opt-in since 2026-11-06, Microsoft MXC's BaseContainer tier only.

## Key points
- **macOS profile** (`src/sandbox/macos-sandbox-utils.ts`):
  - the base comment says "Essential permissions - based on Chrome sandbox policy": `(allow process-exec)`, `(allow process-fork)`, process-info/signal only `(target same-sandbox)`, and a named mach-lookup allowlist ("specific services only (no wildcard)");
  - with network restricted, outbound is `(allow network-outbound (remote ip "localhost:<httpProxyPort>"))` plus the SOCKS port, and nothing else;
  - Unix sockets need three separate operations allowed (`system-socket` for `socket(AF_UNIX)`, `network-bind`, `network-outbound (remote unix-socket …)`), and are blocked unless configured;
  - the read policy is `(allow file-read*)` then `(deny file-read* …)`/re-allow layers; writes are allow-listed.
- **Seatbelt localhost subtleties documented in comments:**
  - `(local ip …)` on `network-outbound` matches the *source* address, which is `INADDR_ANY` at `connect()` time, so it "admits every outbound connection". srt therefore uses `(remote ip "localhost:*")`;
  - IPv4-mapped `::ffff:127.0.0.1` is not matched by Seatbelt's `localhost`, so srt injects `JAVA_TOOL_OPTIONS` to force AF_INET.
- **Mandatory write denies** (`src/sandbox/sandbox-utils.ts`):
  - `DANGEROUS_FILES = ['.gitconfig', '.gitmodules', '.bashrc', '.bash_profile', '.zshrc', '.zprofile', '.profile', '.ripgreprc', '.mcp.json']`;
  - directories `.vscode`, `.idea`, `.claude/commands` and `.claude/agents`;
  - `.git` itself stays writable while `.git/hooks` and `.git/config` are denied;
  - paths are lower-cased before comparison to defeat case tricks like `.cLauDe/Settings.locaL.json`.
- **Linux bwrap argv** (`src/sandbox/linux-sandbox-utils.ts`):
  - filesystem binds (`--ro-bind`, `--bind`, `--tmpfs`), `--dev /dev`, `--unshare-pid` ("If we don't have --unshare-pid, it is possible to escape the sandbox"), `--unshare-user` (requested explicitly so a root parent in an unprivileged container works), `--proc /proc` (or `--bind /proc /proc` under `enableWeakerNestedSandbox`), `--unshare-net` when network is restricted, `--die-with-parent`;
  - globs are expanded with `rg --files --hidden --no-ignore` at wrap time;
  - the code's own architecture note says "Linux's --unshare-net provides only all-or-nothing network isolation. Domain filtering happens at the host proxy level".
- **apply-seccomp filter** (`vendor/seccomp-src/seccomp-unix-block.c`, libseccomp, default `SCMP_ACT_ALLOW`):
  - `socket(AF_UNIX, …)` and `socket(AF_VSOCK, …)` → `EPERM`, with a 32-bit masked compare;
  - `io_uring_setup`/`enter`/`register` → `EPERM`, because "IORING_OP_SOCKET (Linux 5.19+) creates sockets in kernel context without going through the socket() syscall";
  - `unshare`/`clone` with `CLONE_NEWUSER|CLONE_NEWNS` → `EPERM`, and `clone3` → `ENOSYS` (so libc falls back to `clone`);
  - `setns`, `mount`, `umount2`, `pivot_root`, `open_tree`, `move_mount`, `fsopen`, `fsconfig`, `fsmount`, `fspick`, `mount_setattr` and `open_tree_attr` → `EPERM`;
  - ia32 is unsupported because `socketcall()` multiplexes socket ops beyond the filter's sight.
- **Windows (README "Windows (alpha)", `vendor/srt-win-src/src/{wfp,token,job,acl,logon,user}.rs`):**
  - a one-time elevated `windows-install`;
  - a machine-wide WFP filter set keyed on the `srt-sandbox` SID that blocks outbound except loopback to the proxy port range (default 60080–60089);
  - a write-restricted token, NTFS ACEs and a job object;
  - Schannel/WinHTTP clients cannot do TLS under the restricted token;
  - SMB and the WSL service are carried by system services the fence does not match.
- **MXC backend** (`src/sandbox/mxc-sandbox-utils.ts`, `windows.backend: 'mxc'`): uses only MXC's BaseContainer tier and refuses MXC's AppContainer tiers because "srt-win's WFP fence is mandatory and fail-closed, where MXC's AppContainer network enforcement is cooperative".

## Excerpts
> "(deny default (with message \"${logTag}\"))" — `macos-sandbox-utils.ts`

> "Linux's --unshare-net provides only all-or-nothing network isolation. Domain filtering happens at the host proxy level, not the sandbox boundary." — `linux-sandbox-utils.ts` architecture note

> "seccomp cannot inspect io_uring SQEs (they live in a shared-memory ring), so the only safe option is to deny ring creation and use." — `seccomp-unix-block.c`

> "MXC's AppContainer tiers are never used: srt-win's WFP fence is mandatory and fail-closed, where MXC's AppContainer network enforcement is cooperative." — `mxc-sandbox-utils.ts`

## Relevance to the talk
The most reused agent sandbox, and a good one to show line by line, because the comments explain each Seatbelt and seccomp trap in prose (source vs remote address, IPv4-mapped loopback, io_uring, clone3). The Linux design shows how a domain allowlist actually gets into a network namespace that has no network at all: through two socat hops over a bind-mounted Unix socket, with seccomp then forbidding any *other* Unix socket.
