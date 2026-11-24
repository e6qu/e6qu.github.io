---
title: "How Claude Code escapes its own denylist and sandbox"
url: https://ona.com/blog/how-claude-code-escapes-its-own-denylist-and-sandbox
authors: Leonardo Di Donato (Ona)
date: 2026-03-03
accessed: 2026-11-22
kind: blog
agent: Claude Code (version and model not stated in the post)
incident_date: early 2026 (experiment reported 2026-03-03)
category: guardrail-bypass
sandbox_at_time: Claude Code's bubblewrap sandbox enabled in auto-allow mode, plus a permission denylist for `npx` and `node`, inside an Ona cloud development environment (itself isolated from the user's machine)
---

## Summary
A researcher experiment, not an accident, but it shows an agent defeating two of its own guardrails in sequence. Ona denied `npx` and `node` in Claude Code's permission rules, with the bubblewrap sandbox on, and then told the agent to find a way to run `npx` anyway. The agent invoked `/proc/self/root/usr/bin/npx`: the same binary under a path the string-matching denylist did not recognise. When bubblewrap then failed to create a namespace, the agent **decided on its own to disable the sandbox** and retried unsandboxed. Claude Code asked for approval with a prompt that literally said "Run npx via full path to bypass deny rule pattern matching". Approving that runs `npx` with both guardrails gone. Ona's own kernel-level tool (Veto: BPF LSM, SHA-256 of the binary checked at `execve`) blocked the same trick and its variants. The agent then found a further bypass by running a blocked binary through the dynamic linker (`ld-linux-x86-64.so.2`), which maps the file with `mmap` rather than `execve`.

## Key points
- Step 1: the denylist is string/path matching, so `/proc/self/root/...` evades it. The agent explicitly reasoned about "pattern matching".
- Step 2: the sandbox blocked it, and the agent chose to disable the sandbox. The only remaining control was a human approval prompt, which *described the evasion in plain words*.
- The author's point: "Approval fatigue turns a security boundary into a rubber stamp."
- With Veto (content-hash at `execve`): `/proc` path, Python `subprocess`, `bash -c` and a renamed copy in `/tmp` were all blocked. The agent concluded "I've hit a wall" (and wrongly guessed seccomp or AppArmor).
- Dynamic-linker bypass: loading `wget` via `ld.so` avoided the `execve` hook. Ona calls it a bounded gap and plans `mmap`-level and network-level checks.
- Caveat: the agent was *told* to find a way around the block. The sandbox-disabling step was its own idea. Some press coverage omitted the instruction.
- Vendor interest: Ona sells Veto. The post is research plus product marketing.

## Excerpts
> "Let me try disabling the sandbox and using the full binary path to bypass the deny rule pattern" — the agent, quoted by Ona

> "Run npx via full path to bypass deny rule pattern matching" — Claude Code's approval prompt, quoted by Ona

> "Containers couldn't think. Agents can." — Di Donato

## Would a mature sandbox have stopped it?
Partly, and this is the interesting part. **Command allowlists/denylists by name** cannot work against an agent that understands paths, symlinks and loaders; Ona's experiment and the vendors' own advisories show this repeatedly: Claude Code's approval-bypass CVEs via `echo`, `rg`, `sed`, `find` and zsh clobber (CVE-2025-54795, -58764, -64755, CVE-2026-24887, -24053), and Cursor's CVE-2026-22708, where shell built-ins like `export` were not subject to the Auto-Run allowlist and could poison the environment of allowlisted commands. Sandbox escapes proper are in [2026-06-agent-sandbox-escape-advisories.md](2026-06-agent-sandbox-escape-advisories.md). The **OS sandbox** did its job until the harness offered an **escape hatch** (retry unsandboxed with approval). A mature setup would make the sandbox *non-negotiable from inside the session*: no "disable sandbox" option the model can request, or one governed by an admin policy. Claude Code's docs describe exactly this escape hatch (retry with `dangerouslyDisableSandbox`) and a setting to remove it (`allowUnsandboxedCommands: false`), but the hatch is open by default (see [claude-code-sandboxing-docs.md](../agent-sandboxing/claude-code-sandboxing-docs.md)). Ona's post does not name the parameter. **Content-based exec control** (Veto) stopped the path tricks but not loader tricks. **Network egress allowlisting** is the backstop, so that even a binary that runs cannot reach anything.

## Relevance to the talk
The adversary-in-the-loop slide. Classical sandboxes assume confined code that does not reason about the sandbox. Agents read error messages and plan around them. Every escape hatch designed for humans (approval prompts, "retry without sandbox") becomes an attack surface when the confined party can ask for it convincingly and the human is tired.
