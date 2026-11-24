---
title: "sandbox-exec(1), sandbox_init(3), sandbox(7) — macOS manual pages"
url: https://keith.github.io/xcode-man-pages/sandbox-exec.1.html
web_copies: https://keith.github.io/xcode-man-pages/sandbox_init.3.html, https://keith.github.io/xcode-man-pages/sandbox.7.html (third-party mirror of Apple's man pages)
original: x-man-page://1/sandbox-exec (shipped with macOS; read locally on macOS 15.6.1, build 24G90)
authors: Apple Inc.
date: sandbox-exec(1) page dated 2017-03-09; sandbox(7) page dated 2010-01-29
accessed: 2026-11-22
kind: man-page
---

## Summary
The local manual pages for Seatbelt, the macOS kernel sandbox. `sandbox-exec` runs a command under a
profile (file, named profile or inline SBPL string), and `sandbox_init(3)` lets a process sandbox
itself. Both are marked DEPRECATED, with developers pointed to App Sandbox instead. They still ship and
still work on macOS 15, and coding-agent tools (Codex CLI, Anthropic sandbox-runtime, Chromium) rely on
them. We also measured locally how cheap a Seatbelt sandbox is.

## Key points
- `sandbox-exec [-f profile-file] [-n profile-name] [-p profile-string] [-D key=value ...] command`.
- `sandbox_init()` named profiles: `kSBXProfileNoInternet`, `kSBXProfileNoNetwork`, `kSBXProfileNoWrite`,
  `kSBXProfileNoWriteExceptTemporary`, `kSBXProfilePureComputation`. All are marked deprecated.
- sandbox(7): sandboxes are inherited by child processes. Restrictions are checked when a resource is
  acquired, so descriptors opened before sandboxing stay usable.
- macOS 15.6.1 ships 459 system `.sb` profiles in `/System/Library/Sandbox/Profiles` and 64 in
  `/usr/share/sandbox`. Apple's own daemons are confined with the same mechanism.
- **Local measurement** (ours, Apple M4 Pro, 24 GB, macOS 15.6.1):
  - `sandbox-exec -p '(version 1)(allow default)(deny network*)' /usr/bin/true` took 0.007 s wall time.
  - Spawning 100 sandboxed `/bin/sleep` processes took about 0.10 s in total. Their RSS was about
    1.2 MB each (118 MB for all 100), the same as an unsandboxed process; Seatbelt adds no per-sandbox
    memory beyond the process itself.
  - A profile with `(deny network*)(deny file-write* (subpath "/Users"))` blocked a write under
    `/Users` ("Operation not permitted") and blocked outbound HTTPS.
  - Process visibility is not isolated. A sandboxed `pgrep sleep` saw the same 36 host processes as an
    unsandboxed one. Adding `(deny process-info*)` hid almost nothing (34 seen). There is no PID-namespace
    equivalent.
  - Setuid binaries such as `/bin/ps` failed to run inside even an `(allow default)` sandbox.

## Excerpts
> "The sandbox-exec command is DEPRECATED. Developers who wish to sandbox an app should instead adopt the App Sandbox feature described in the App Sandbox Design Guide." — sandbox-exec(1), DESCRIPTION

> "New processes inherit the sandbox of their parent. Restrictions are generally enforced upon acquisition of operating system resources only." — sandbox(7)

> "The sandbox facility allows applications to voluntarily restrict their access to operating system resources." — sandbox(7)

## Relevance to the talk
Seatbelt is the lightest isolation primitive on macOS. A sandboxed agent is just a process, so it
costs milliseconds to start and adds no memory. Hundreds fit on a laptop where only a handful of VMs
would. The catch is that the CLI and SBPL are officially deprecated and undocumented. Seatbelt also
filters only file, network, IPC and Mach-service access. It provides no PID or network namespace and no
resource limits.
