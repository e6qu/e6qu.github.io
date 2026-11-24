---
title: Sandbox (Chromium design doc, Windows)
url: https://chromium.googlesource.com/chromium/src/+/main/docs/design/sandbox.md
authors: The Chromium Authors
date: living document; last modified 2025-05-05 (per GitHub mirror commit history)
accessed: 2026-11-22
kind: docs
---

## Summary
Chromium's Windows sandbox design: a broker (browser process) spawns
target processes (renderers) that run under four stacked Windows mechanisms —
a restricted token, a job object, an alternate desktop, and integrity levels —
plus an AppContainer (Low Box) token for network denial, and process
mitigation policies. It is the canonical example of building a strong
same-kernel sandbox on Windows without a VM, and of its stated limits.

## Key points
- "Sandbox operates at process-level granularity"; API calls that policy
  allows are forwarded via IPC to the broker, which re-issues them.
- Core mechanisms: restricted token (no privileges, Untrusted integrity), job
  object (no clipboard, no global hooks, no desktop switching, no USER handles
  from outside, one active process limit), alternate desktop (blocks "shatter"
  window-message attacks), integrity levels (Untrusted for renderers, Low for
  GPU).
- Job objects "can (but currently does not)" limit CPU, memory and I/O.
- Alternate desktop costs "approximately 4MB of RAM from a separate pool".
- Network denial comes from adding Low Box (AppContainer) attributes without
  the `INTERNET_CLIENT` capability. LPAC (Less Privileged AppContainer) is used
  on newer Windows 10.
- Stated limits: only securable resources are protected (FAT volumes,
  unlabelled anonymous shared memory are not); "no practical way to prevent
  code in the sandbox from calling a system service"; third-party DLL injection
  can weaken it.

## Excerpts
> "At its core, the sandbox relies on the protection provided by four Windows mechanisms" — restricted token, job, desktop, integrity levels. (Sandbox restrictions)

> "The interception + IPC mechanism does not provide security; it is designed to provide compatibility" (The target process)

> "The only disadvantage of an alternate desktop is that it uses approximately 4MB of RAM from a separate pool, possibly more on Vista." (The alternate desktop)

> "network checks are enforced if the token is a Low Box token and the `INTERNET_CLIENT` Capability is not present." (App Container (low box token))

## Relevance to the talk
Proof that a hardened per-process sandbox on Windows is cheap (MBs, not a
guest OS) and runs at huge density (one per browser tab). The limits section
is the honest list of gaps for any agent sandbox built the same way: shared
kernel attack surface (syscalls/win32k), non-securable resources, and no
default resource caps.
