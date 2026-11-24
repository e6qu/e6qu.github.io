---
title: "Security and permissions" (Deno manual) + "Introducing Deno Sandbox" + denoland/clawpatrol README
url: https://docs.deno.com/runtime/fundamentals/security/
authors: Deno Land Inc. (Deno Sandbox post by Ryan Dahl)
date: manual page undated (read live); Deno Sandbox post 2026-02-03; clawpatrol repo created 2026-04-28
accessed: 2026-11-22
kind: docs
---
Also: https://deno.com/blog/introducing-deno-sandbox , https://github.com/denoland/clawpatrol .
The manual page and blog were read through a fetch-and-extract tool; quotes are as it returned them.

## Summary
Deno runs programs with no access to sensitive APIs unless granted by `--allow-*` flags (or an
interactive prompt), with `--deny-*` flags overriding allows. It is the "outer fence" used by
Pyodide-in-Deno sandboxes (mcp-run-python, langchain-sandbox). Deno's own manual is candid about the
limits: permissions are per-thread/process, not per-module; `--allow-run` and `--allow-ffi` are
equivalent to allow-all; and for untrusted code it recommends multiple layers including OS
sandboxing and VMs/microVMs. In 2026 Deno launched **Deno Sandbox**, which is a Linux microVM
product in Deno Deploy, not an in-process mechanism.

## Key points
- Deny-by-default: "Unless you specifically enable it, a program run with Deno has no access to
  sensitive APIs". Flags named on the page: `--allow-read`, `--allow-write`, `--allow-net`,
  `--allow-env`, `--allow-run`, `--allow-ffi`, `--allow-import`, `-A`/`--allow-all`, and `--deny-*`
  (which override allows); `--no-prompt`. (`--allow-sys` exists in Deno but was not mentioned on this
  page per the extraction.) Flags can be scoped, e.g. `--allow-env=API_KEY`.
- `-A` "grants everything and turns the sandbox off entirely".
- `--allow-run`: a subprocess runs "with its own permissions, not the restricted set you granted";
  `--allow-ffi`: native code "can issue system calls directly"; both to be treated as equivalent to
  `--allow-all`. Also warns not to grant write access to directories holding binaries you allow to run.
- Granularity: "All code executing on the same thread shares the same privilege level"; modules
  cannot have different privileges within a thread. Web Workers can be given a reduced permission set.
- Remote modules in the initial static import graph load without `--allow-net`.
- Untrusted code guidance: more than one layer of defence; limited permissions plus `--frozen`
  lockfile and `--cached-only`; isolate untrusted part in a Worker; OS sandboxing (`chroot`,
  `cgroups`, `seccomp`); "a VM or MicroVM (gVisor, Firecracker, etc)".
- Not addressed by permissions: memory/CPU exhaustion (mcp-run-python's notice: "deno has no good way
  limit memory usage"); bare `--allow-net` includes localhost (root cause of CVE-2026-25904 in
  mcp-run-python).
- **Deno Sandbox (2026-02-03): NOT in-process.** "lightweight Linux microVMs (running in the Deno
  Deploy cloud) to run untrusted code", boot "< 1 second", `allowNet` host allow-list enforced "at the
  VM boundary" via an outbound proxy, secrets replaced by placeholders substituted only on requests to
  approved hosts; recommends combining with Deno's `--allow-net` for defence in depth. The post does
  not name the VMM (third-party coverage says Firecracker; Unverified).
- **clawpatrol (denoland, 2026)**: "The security firewall for agents"; a Go network gateway that parses
  agent traffic (Postgres, ClickHouse, Kubernetes, HTTP) and gates each action with CEL rules in HCL.
  Also not in-process; it is an egress/policy proxy.

## Excerpts
> "All code executing on the same thread shares the same privilege level." — manual, "Executing untrusted code" area (per extraction)

> "Treat both as equivalent to `--allow-all` when deciding whether to trust the code you are running." — manual, on `--allow-run` / `--allow-ffi` (per extraction)

> "When executing untrusted code, it is important to have more than one layer of defense." — manual, "Executing untrusted code"

## Relevance to the talk
Deno permissions are a **capability-ish policy at the runtime API layer**: coarse (per category,
per process/worker), deny-by-default, enforced in the same process as the guest. Good as a second
fence around a Wasm interpreter; fails when (a) the grants are broad (`--allow-net` with no host list
reaches loopback/metadata), (b) `--allow-run`/`--allow-ffi` are needed (game over by design), (c)
resource exhaustion matters (no memory cap), or (d) the inner layer deliberately bridges to JS
(Pyodide). For coding agents the cost is that any useful toolchain needs `--allow-run`, which
collapses the model; that's why Deno's own agent offering moved the boundary to a microVM and its
agent-security tool to a network proxy, which is a nice "the vendor voted with its feet" data point.
