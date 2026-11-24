---
title: "Inside the Codex sandbox"
url: https://openai.com/index/inside-the-codex-sandbox/
authors: Michael Bolin (OpenAI); acknowledgements to David Wiesen, Charlie Weems, Viyat Bhalodia, Fotis Chantzis
date: 2026-11-18
accessed: 2026-11-22
kind: blog
---

## Summary
OpenAI's engineering write-up of how the open-source Codex CLI/harness confines the shell commands it runs on a developer's machine. Codex deliberately uses each OS's native sandbox rather than containers or VMs, so the agent works in the user's real environment and toolchain (the example given: iOS development, where Docker would cut off Xcode and the simulator). A shared userspace network proxy enforces domain policy across all three platforms; per-OS backends are Seatbelt on macOS, bubblewrap + seccomp on Linux, and Microsoft's MXC library on Windows.

## Key points
- Defence in depth: the sandbox is one layer next to model training/alignment and approvals.
- Default `:workspace` profile: write inside the workspace, `.git` and `.codex` read-only, broad reads (subject to OS permissions), **network disabled**. Residual risks acknowledged: other sensitive files stay readable; a tampered `node_modules` package could run later when an editor formats on save.
- Single harness API `spawn_command_under_sandbox()` (command + permission profile + optional network proxy); child processes inherit restrictions. Per-command escalation requests: `use_default`, `with_additional_permissions`, `require_escalated`; granted by a user prompt or an "auto-review" route.
- Profiles in `config.toml`: filesystem entries `read`/`write`/`deny` with `:workspace_roots` and globs; network modes disabled / full / proxy-mediated with domain allow+deny (deny wins). Admins constrain choices with `requirements.toml` and `allowed_permission_profiles`.
- `codex sandbox` exposes the sandbox to other tools (e.g. running an MCP server via `npx --offline` with network off).
- `codex-network-proxy` crate: HTTP + SOCKS5 proxies, env-var injection; requests to unmatched domains can be *suspended pending approval*; **DNS resolution only after a request is allowed**, because a lookup itself can leak data in the hostname. Broad wildcards still allow DNS-based exfiltration.
- macOS: `sandbox-exec` with SBPL profiles starting `(deny default)`; the post concedes the tool is deprecated and undocumented for third parties but they intend to keep using it.
- Linux: `codex-linux-sandbox` drives bubblewrap (mount namespace, `--unshare-net`), seccomp-bpf, `no_new_privs`; a relay outside the sandbox bridges a loopback listener to the proxy over a Unix socket.
- Windows: moved from their own earlier design (admin setup, slow ACLs, persistent host state) to Microsoft's MXC library; profiles translated to MXC filesystem/network policy.

## Excerpts
> "At OpenAI, we take a defense in depth approach when it comes to safeguarding agents."

> "Codex uses each platform's sandboxing facilities to constrain commands running in the user's existing environment."

> "Codex's base profile starts with `(deny default)`, so outbound connections remain blocked unless explicitly allowed."

> "The order matters here because even a DNS lookup can leak information encoded in a hostname."

## Relevance to the talk
Independent convergence: OpenAI and Anthropic arrived at nearly the same architecture (native OS sandbox per platform + shared HTTP/SOCKS proxy + domain policy + escalation prompts). The "why not Docker" argument (native toolchains) and the DNS-ordering detail are good talk material; so is the admission that macOS Seatbelt is deprecated yet still the only practical choice.
