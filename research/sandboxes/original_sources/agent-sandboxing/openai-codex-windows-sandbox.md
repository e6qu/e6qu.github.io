---
title: "Building a safe, effective sandbox to enable Codex on Windows"
url: https://openai.com/index/building-codex-windows-sandbox/
authors: David Wiesen (OpenAI)
date: 2026-05-13
accessed: 2026-11-22
kind: blog
---

## Summary
An account of why Windows was the hard platform for agent sandboxing: it has no lightweight, unprivileged "confine this process tree to these paths and no network" primitive comparable to Seatbelt or bubblewrap. OpenAI evaluated AppContainer, Windows Sandbox and Mandatory Integrity Control, rejected each for developer workflows, built an unelevated prototype with weak (advisory) network blocking, then an elevated design with dedicated local sandbox users, firewall rules and write-restricted tokens. (The later post "Inside the Codex sandbox", 2026-11-18, says Codex has since moved to Microsoft's MXC library.)

## Key points
- Before the sandbox, Windows users had to approve nearly every command or use Full Access.
- Rejected: **AppContainer** (built for apps with narrow known needs, not shells/git/python/build tools); **Windows Sandbox** (disposable VM, not acting on the user's checkout/tools, unavailable on Windows Home); **MIC low-integrity labels** (any low-IL process could then write the workspace).
- Prototype: synthetic `sandbox-write` SID granted write on CWD + `writable_roots`, explicit denies on `.git`, `.codex`, `.agents`; commands under a write-restricted token (write needs both user and sandbox-SID permission). Network "blocking" = proxy env vars pointing at a dead endpoint, git transports disabled, stub ssh/scp on PATH — bypassable by any program with its own network stack.
- Elevated design: admin setup creates a SID and two local users, `CodexSandboxOffline` (firewall blocks all outbound) and `CodexSandboxOnline`; passwords DPAPI-encrypted; read ACLs added (best-effort, async) to the profile, Windows, Program Files, ProgramData. Firewall rules can't match restricted tokens or child processes, so commands must run as a *separate principal*; a `codex-command-runner.exe` launched as the sandbox user applies the restricted token and spawns the command. Four layers: harness, setup binary, runner, child.
- Limitations: requires elevation; complex; ACL changes are slow; read list best-effort.

## Excerpts
> "Codex runs with the permissions of a real user by default, meaning it can do everything the user can do."

> "Windows doesn't currently provide this type of capability out of the box."

> "Network protection is weak." — on the unelevated prototype

> "It's not a particularly simple system, but each piece of complexity was added out of necessity,"

## Relevance to the talk
A case study in the mismatch between classic OS sandbox primitives (designed for apps with known needs, or for whole VMs) and what agents need (run arbitrary dev tools against the user's real files, minus network and secrets). Pairs with the srt Windows section, which independently landed on a dedicated user + WFP filter design.
