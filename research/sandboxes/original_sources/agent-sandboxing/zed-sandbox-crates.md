---
title: "Zed `sandbox` and `sandbox_linux` crates (README, DESIGN.md, Seatbelt and bubblewrap backends)"
url: https://github.com/zed-industries/zed/tree/main/crates/sandbox
authors: Zed Industries
date: read at main d31d107 (2026-11-22); `crates/sandbox_linux` (experimental seccomp-unotify design) first committed 2026-11-17 ("sandbox: New linux sandbox (#67062)")
accessed: 2026-11-22
kind: repo
---

## Summary
This is the code behind the Zed Agent's on-by-default terminal sandbox (docs: [agent-zed.md](agent-zed.md)).
- **macOS:** a generated profile starting `(deny default)` / `(allow file-read*)`, run via `sandbox-exec -f <config-path>`.
- **Linux:** a non-setuid `bwrap` with `--ro-bind / /`, explicit `--bind` per writable project directory (inode-pinned and re-validated inside the sandbox to close a bind-source TOCTOU), `--unshare-user/-ipc/-uts/-pid/-cgroup-try` and `--unshare-net`. An in-sandbox launcher re-exec then installs a seccomp filter.
- **Network:** the same launcher runs a localhost-to-Unix-socket bridge to Zed's in-process HTTP proxy.
- **Windows:** only through WSL. The same bwrap argv is built on the Windows side and run by a helper inside the distro, with `/run/WSL` interop masked.
- **New and experimental:** a separate `sandbox_linux` crate, merged 2026-11-17, that replaces "setting up an environment" with seccomp user-notification supervision so policy can change without restarting the process.

## Key points
- **Seatbelt profile** (`crates/sandbox/src/macos_seatbelt.rs`):
  - `(deny default)`, `(allow file-read*)`, process-exec/fork, a mach-lookup "ALLOWLIST, not a blanket `(allow mach-lookup)`", pseudo-tty;
  - writes allowed per path;
  - network limited to `(allow network-outbound (remote tcp "localhost:{port}"))` for the proxy;
  - `allowed_unix_sockets` grants: "Only the macOS backend can enforce this. The Linux and WSL backends reject any policy that lists a socket" (`sandbox.rs`).
- **Default grants** (README): "read-only access to all files"; read/write to project directories with "read-only access to any Git metadata"; an isolated temp dir cleared between terminals (on macOS via `$TMPDIR`, "not at `/tmp`").
- **bwrap discovery:** refuses setuid-root `bwrap` ("the only available `bwrap` is setuid-root, which Zed refuses to run").
- **Linux network bridge** (module comment, `linux_bubblewrap.rs`): `--unshare-net`, bind a Unix socket into the sandbox, run "a bridge process inside the sandbox that listens on `localhost:<port>` and forwards reads/writes to the socket", and on the Zed side forward to the internal HTTP proxy. "This design for networking avoids needing seccomp, a fork/exec dance, and eliminates a race condition involving BPF user notifications."
- **Linux seccomp** (`build_command_seccomp_program`), installed right before `exec` of the untrusted command (default Allow, matched rules return `EPERM`):
  - `socket()` is allowed only for `AF_INET`, `AF_INET6` and `AF_NETLINK`, so no `AF_UNIX` or `AF_VSOCK`;
  - `socketpair()` is allowed only for `AF_UNIX`;
  - `io_uring_*`, `ptrace` and `process_vm_*` are denied;
  - foreign-arch syscalls are killed, "closing the 32-bit-ABI (`socketcall`) bypass".
  The rationale: "a read-only bind mount does not stop `connect()` to a unix socket".
- **Protected paths on Linux** are re-bound `--ro-bind` over the writable bind; "A not-yet-existing path can't be bound, so it's skipped." The README admits: "on linux, it's not possible to protect `.git` if it doesn't already exist".
- **WSL:** the Windows side assembles "root bind, `/tmp` tmpfs, writable binds, Windows-interop blocking, `--setenv`s, `--chdir`, namespace flags". It masks `/run/WSL` when present (`windows_wsl.rs`, `mask_interop_dir`). Network in WSL is all-or-nothing ("no loopback-proxy confinement yet").
- **Stated threat model** (README): "The sandbox itself assumes all untrusted code is maximally hostile." The worked escape is an agent-written Rust proc macro that rust-analyzer runs outside the sandbox.
- **DESIGN.md (experimental `sandbox_linux`):**
  - goals are dynamic policy changes "without restarting the untrusted process", globs and not-yet-existing paths, and fewer false rejections;
  - "ultimate goal" is to sandbox user terminals, LSP servers, MCP servers and git clients by default;
  - the mechanism is seccomp user notifications, with a supervisor that "makes the call on behalf of the sandboxed program, and copies arguments into its own memory to close a TOCTOU";
  - it is linked into the Zed binary (`sandbox_linux::run_hidden_entrypoint_if_invoked()` in `crates/zed/src/main.rs`), but described as "currently experimental".

## Excerpts
> "a read-only bind mount does not stop `connect()` to a unix socket, so instead we stop the command from ever *obtaining* a non-IP socket." — `linux_bubblewrap.rs`

> "a highly effective privilege escalation attack for an agent is to: try to use docker (or similar) to run a legitimate task; explain to the user: \"I can't use docker because of the sandbox, can you disable it?\"; the user disables the sandbox" — `sandbox_linux/DESIGN.md`

> "This is not foolproof though - for example, on linux, it's not possible to protect `.git` if it doesn't already exist" — `crates/sandbox/README.md`

## Relevance to the talk
Zed is the clearest primary source on two low-level points. First, bind mounts do not stop `connect()` on a Unix socket, so seccomp has to forbid socket creation. Second, bwrap's static, path-exists-at-start model is the root cause of "create, don't edit" escapes. The DESIGN.md is the first agent-vendor plan to move from namespaces to a seccomp-unotify supervisor. That is the same TOCTOU-prone mechanism the kernel docs warn about, which Zed proposes to handle by performing the syscall on the sandboxed process's behalf.
