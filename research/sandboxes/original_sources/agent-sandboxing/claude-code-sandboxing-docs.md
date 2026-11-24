---
title: "Configure the sandboxed Bash tool"
url: https://code.claude.com/docs/en/sandboxing
authors: Anthropic (Claude Code documentation)
date: living document; read 2026-11-22 (mentions behaviour changes up to Claude Code v2.1.284)
accessed: 2026-11-22
kind: docs
---

## Summary
The user-facing documentation for Claude Code's sandbox, built on `@anthropic-ai/sandbox-runtime`. It applies to the Bash, PowerShell and Monitor tools on macOS (Seatbelt), Linux and WSL2 (bubblewrap + network namespace + socat relay + optional seccomp for Unix sockets); native Windows runs commands unsandboxed. The page is notable for how much it documents what is *not* inside the boundary and how the sandbox interacts with permission modes, a classifier-driven "auto" mode, and an unsandboxed-retry escape hatch.

## Key points
- Off by default; enabled via `/sandbox` or `sandbox.enabled: true`. Two modes: **auto-allow** (sandboxed commands run with no prompt, except deny rules, `rm` on critical paths, content-scoped ask rules like `Bash(git push *)`) and **regular permissions** (sandbox plus normal prompts).
- **Filesystem defaults:** writes to CWD, a per-user temp dir and `--add-dir` dirs; reads allowed across most of the machine *including* `~/.ssh` and `~/.aws/credentials` unless restricted (`denyRead`, `permissions.blockReadsOutsideWorkingDirectories`). Protected paths (`.claude` settings, `.mcp.json`, shell startup files, `.git/hooks`, `~/.claude`) are never writable.
- **Network defaults:** no direct route out; `allowedDomains` starts empty; UDP, QUIC and ICMP cannot leave; tools ignoring proxy variables can't connect. A new host is allowed (bypass mode), prompted (manual/acceptEdits), classifier-decided (auto) or refused (dontAsk). Hostnames resolving only to local/link-local addresses (incl. `169.254.169.254`) are refused; before v2.1.284 the proxy connected to whatever an allowed hostname resolved to.
- **Escape hatch:** on failure, Claude may retry with `dangerouslyDisableSandbox`; approval depends on mode. `allowUnsandboxedCommands: false` disables it; `failIfUnavailable: true` makes Claude Code refuse rather than run unsandboxed.
- **Credentials:** `credentials.files`/`envVars` with `deny` or `mask` (placeholder inside, real value injected by proxy on allowed hosts; requires `network.tlsTerminate`).
- **Not sandboxed:** built-in Read/Edit/Write/WebFetch/WebSearch tools (governed by permission rules instead), hooks, local MCP servers, LSP servers, status line, `apiKeyHelper`, plugin "mods", `!` shell-mode commands, `excludedCommands`, unsandboxed retries; computer use runs on the real desktop. Recommendation: run all of Claude Code inside srt, a dev container or a VM for a full boundary.
- Managed (enterprise) settings can enforce the sandbox and stop repository settings from loosening it; `allowAppleEvents` is honoured only from user/managed/CLI settings, never project settings.
- **Security limitations:** hostname-only filtering without TLS inspection → domain fronting; broad domains like `github.com` are exfil paths; `allowUnixSockets` for `docker.sock` = host access; broad write access → escalation; `enableWeakerNestedSandbox`; `allowMachLookup` services are unconfined; `allowNestedUserNamespaces` "turn[s] off a security boundary".

## Excerpts
> "On native Windows, Claude Code runs commands unsandboxed."

> "The built-in proxy enforces the allowlist based on the requested hostname and, by default, does not terminate or inspect TLS traffic." 

> "Sandboxing reduces risk but is not a complete isolation boundary." — Limitations

> "Without filesystem isolation, whether from a permissive policy or from disabling the filesystem layer, a compromised agent could backdoor system resources to gain network access." — Limitations warning

## Relevance to the talk
Shows the sandbox as one layer in a policy stack (permission rules, modes, classifier, managed settings) rather than the whole story. The long "what runs outside the sandbox" list is a good slide on the gap between "the agent's shell is sandboxed" and "the agent is sandboxed". The escape-hatch retry illustrates the tension between autonomy and containment.
