---
title: "Anthropic Sandbox Runtime (srt)"
url: https://github.com/anthropics/sandbox-runtime
authors: Anthropic
date: repo created 2025-10-20; README read at v0.0.83 (released 2026-11-13)
accessed: 2026-11-22
kind: repo
---

## Summary
`srt` is Anthropic's open-source (Apache-2.0, npm `@anthropic-ai/sandbox-runtime`) process sandbox built for Claude Code and offered as a CLI and a TypeScript library. It wraps an arbitrary command — a bash tool call, a local MCP server, an agent — in OS-native confinement without a container: a generated Seatbelt profile via `sandbox-exec` on macOS, bubblewrap plus a seccomp filter on Linux, and (alpha) a dedicated local user account + Windows Filtering Platform on Windows. Network access is removed from the process and re-offered only through HTTP and SOCKS5 proxies on the host that enforce domain allow/deny lists. Over a year the README has grown into a long catalogue of edge cases (DNS rebinding, ambiguous URL paths, JVM proxy settings, git-over-SSH), which itself illustrates how hard "allow a few domains" is to get right.

## Key points
- **Positioning:** "enforcing filesystem and network restrictions on arbitrary processes at the OS level, without requiring a container." Labelled "Beta Research Preview".
- **Per-OS mechanism** (README "How It Works"):
  - macOS: `sandbox-exec` with dynamically generated Seatbelt profiles. Source (`src/sandbox/macos-sandbox-utils.ts`) starts the profile with `(version 1)` and `(deny default ...)`, then allows outbound only to `localhost:<proxyPort>`.
  - Linux: bubblewrap with the network namespace removed; proxies on the host are reached via Unix sockets bind-mounted in and bridged with `socat`. Dependencies: `bubblewrap` (≥0.4.0), `socat`, `ripgrep` (used to scan for deny paths).
  - Linux seccomp: a static `apply-seccomp` binary (x64/arm64, libc-independent) with a baked-in BPF filter that makes `socket(AF_UNIX, …)` return `EPERM`; applied in a second stage after the socat bridges have started inside bwrap. Without seccomp, Unix sockets are unrestricted (with a warning).
  - Windows (alpha): command runs as a dedicated `srt-sandbox` local account, launched via `CreateProcessWithLogonW` then a restricted token in a job object; WFP `ALE_AUTH_CONNECT` filters keyed on that SID block all egress except loopback to the proxy port range (default 60080–60089); NTFS ACEs implement allow/deny paths.
- **"Dual isolation model":** filesystem *and* network must both be confined — without FS isolation a process can steal SSH keys; without network isolation it can exfiltrate or escape.
- **Filesystem policy:** reads allowed by default (deny-then-allow: `denyRead`, re-opened by `allowRead`); writes denied by default (allow-only: `allowWrite`, narrowed by `denyWrite`, which wins). macOS supports gitignore-style globs; Linux bubblewrap binds concrete paths so globs are expanded at wrap time (later-created files are not covered).
- **Mandatory deny paths:** always write-protected even inside allowed dirs: shell rc files, `.gitconfig`, `.gitmodules`, `.mcp.json`, `.ripgreprc`, `.vscode/`, `.idea/`, `.claude/commands/`, `.claude/agents/`, `.git/hooks/`, `.git/config` — i.e. files that would let sandboxed code get *later* execution outside the sandbox.
- **Network policy:** default deny; `allowedDomains` (wildcards, optional `:port`), `deniedDomains` (wins). HTTP proxy for HTTP/HTTPS (CONNECT), SOCKS5 for other TCP (SSH, DBs). Evaluation order: deny → allow → `strictAllowlist` → per-command list → optional "ask" callback (host app can prompt the user) → deny.
- **Resolved-address check:** before dialing an allowed hostname the proxy resolves it and drops loopback, link-local, multicast, cloud metadata endpoints (e.g. `100.100.100.200`, `168.63.129.16`, `fd00:ec2::/32`), so DNS for a permitted wildcard can't be aimed at local services; private RFC1918 ranges are opt-in via `deniedResolvedAddresses`.
- **Credentials:** `credentials.envVars`/`credentials.files` in `deny` or `mask` mode; masking puts a sentinel inside the sandbox and the proxy substitutes the real value on egress only to `injectHosts`, requiring experimental TLS termination (MITM CA) so the secret only leaves over verified TLS. Source tree also contains AWS SigV4 re-signing (`aws-sigv4.ts`).
- **Model-facing denials:** `deniedDomainReasons` and the ask callback's `reason` are written into a `<sandbox_violations>` block so the *model* learns why it was blocked and what to do instead — reasons are sanitised (control/bidi chars stripped, `<`/`>` removed) because they flow into model context.
- **Live reconfiguration:** `--control-fd` lets the host push a whole new config while the command runs; network lists take effect on next connection, filesystem rules do not change.
- **Documented security limitations:** domain filtering does not inspect traffic; broad domains like `github.com` permit exfiltration; domain fronting may bypass filtering; allowing `/var/run/docker.sock` is a host escape; writable `$PATH`/rc dirs enable escalation; `enableWeakerNestedSandbox` (for running inside Docker without privileged namespaces) "considerably weakens security"; `allowAppleEvents` removes code-execution isolation on macOS; an srt copy inside a writable project's `node_modules` can be rewritten and later run unsandboxed.
- **Known limitation (Linux):** traffic is steered by `HTTP_PROXY`/`HTTPS_PROXY`/`ALL_PROXY`; programs ignoring them simply fail to connect (no namespace network exists) rather than bypass.
- Ubuntu 24.04+ restricts unprivileged user namespaces via AppArmor (`kernel.apparmor_restrict_unprivileged_userns`), which breaks bubblewrap unless relaxed.

## Excerpts
> "`srt` uses native OS sandboxing primitives (`sandbox-exec` on macOS, `bubblewrap` on Linux) and proxy-based network filtering. It can be used to sandbox the behaviour of agents, local MCP servers, bash commands and arbitrary processes." — intro

> "Both filesystem and network isolation are required for effective sandboxing. Without file isolation, a compromised process could exfiltrate SSH keys or other sensitive files. Without network isolation, a process could escape the sandbox and gain unrestricted network access." — Dual Isolation Model

> "Users should be aware of potential risks that come from allowing broad domains like `github.com` that may allow for data exfiltration. Also, in some cases it may be possible to bypass the network filtering through domain fronting." — Security Limitations

> "Embedders should only source this option from trusted user-level configuration — never from project-local files in a checked-out repository, which would let an attacker-authored project elevate its own sandbox permissions." — `allowAppleEvents`

## Relevance to the talk
The reference example of a "classic primitives, new composition" agent sandbox: Seatbelt (2007-era macOS), bubblewrap/namespaces and seccomp-BPF, reused unchanged, but with the novel part moved into a userspace egress proxy that understands domains, credentials and the model as an audience for error messages. The mandatory-deny list and the "project config must not widen the sandbox" warning show the agent-specific threat: the attacker is the content of the repository the agent is working on.
