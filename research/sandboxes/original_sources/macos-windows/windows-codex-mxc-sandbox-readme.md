---
title: Native Windows MXC sandbox (codex-rs/mxc-sandbox/README.md)
url: https://github.com/openai/codex/blob/main/codex-rs/mxc-sandbox/README.md
authors: OpenAI Codex contributors
date: first commit 2026-09-11; last modified 2026-11-18
accessed: 2026-11-22
kind: repo
---

## Summary
Engineering notes for Codex's MXC backend on Windows. Codex re-invokes itself
as a helper that calls Microsoft's MXC V1 SDK directly; MXC creates the child
suspended, assigns a kill-on-close job, then resumes it. Filesystem policy
comes from Codex's permission profile and is enforced by BaseContainer;
networking allows loopback (for Codex's proxy) and denies direct non-loopback
egress and general inbound. The README candidly lists known alias gaps.

## Key points
- Requires a working Windows "process security environment" (PSEC); never
  edits host ACLs, creates users, or requests elevation.
- Process tree: child created suspended, kill-on-close job assigned before
  resume; descendants are terminated when the foreground process exits (a
  behaviour change from the legacy backends).
- Network: IPv4/IPv6 loopback allowed (proxy listeners), direct non-loopback
  egress and general inbound denied; direct DNS denied.
- UI: Win32k calls and desktop handles remain available (PowerShell needs
  them); clipboard, input injection and desktop/system control restricted.
- Path precedence: deny > read-only > read-write; more specific paths override
  ancestors.
- Known gaps: hard-link names keep independent permissions (an allowed name
  can modify a file also reachable via a denied name); volume-root/junction
  alias interactions can produce writable grants.
- `windows.sandbox = "mxc"` is strict; `features.prefer_mxc` is default-off.

## Excerpts
> "MXC creates its child suspended, assigns a kill-on-close job before resuming it, and retains the native policy through workload completion."

> "Hard-link names retain independent path permissions."

## Relevance to the talk
Concrete anatomy of a lightweight Windows agent sandbox: AppContainer-style
token (BaseContainer/PSEC) + job object + WFP filters + loopback proxy. Also a
reminder that path-based filesystem policy on NTFS has alias holes (hard
links, junctions) — the Windows analogue of Seatbelt/Landlock path caveats.
