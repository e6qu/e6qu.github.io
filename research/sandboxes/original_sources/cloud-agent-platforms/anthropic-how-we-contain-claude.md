---
title: "How we contain Claude across products"
url: https://anthropic.com/engineering/how-we-contain-claude
authors: Max McGuinness, Mikaela Grace, Jiri De Jonghe, Jake Eaton, Abel Ribbink (Anthropic)
date: 2026-05-25
accessed: 2026-11-22
kind: blog
---

## Summary
Anthropic's engineering post compares the containment used by three of its products: code execution in claude.ai, Claude Code (local), and Claude Cowork (desktop VM). The argument is that the environment, not the model, must be the primary boundary, because model-side defences are probabilistic. The post is the only Anthropic source found that names the isolation technology for its hosted code execution (gVisor). It also gives a candid post-mortem: the custom egress proxy failed, while the hypervisor, seccomp and gVisor held.

## Key points
- **claude.ai code execution:** a gVisor container on isolated server-side infrastructure with seccomp hardening and an ephemeral, per-session filesystem. The threat model is mainly tenant-from-tenant and infrastructure protection.
- **Claude Code (local):** Seatbelt / bubblewrap sandbox (covered in `../agent-sandboxing/claude-code-sandboxing-docs.md`). 84% fewer prompts; users approved ~93% of permission prompts. The auto-mode classifier blocks ~0.4% of benign commands and misses ~17% of overeager actions, so it is one layer *inside* a sandbox.
- **Cowork (desktop):** a full VM on the platform hypervisor ("Apple's Virtualization framework on macOS, HCS on Windows"), with its own Linux kernel. Only the selected workspace and `.claude` folder are mounted, read-only, read-write or read-write-no-delete, with MDM mount-path allowlists. The agent loop later moved to the host (the VM still runs code), and local MCP servers moved out of the VM.
- **Credentials:** host keychain only. The VM gets a per-session, scoped, independently revocable token.
- **Egress incident:** Cowork's allowlist permitted `api.anthropic.com`. A malicious workspace file carried an attacker's API key, so files could be uploaded to the attacker's account via the Files API. The proxy checked only the destination. Fix: a "defensive man-in-the-middle proxy inside the VM" that passes only requests carrying the VM's provisioned session token and strips headers that trigger server-side fetches. Cross-reference `../incidents/2025-10-claude-pirate-files-api-exfil.md` (same class of attack).
- **Lesson:** an allowlist entry is a capability grant: "Every function reachable through any domain on an allowlist is now an attack surface."
- **Other lessons:** trust prompts must come before parsing project config (repo hooks ran pre-consent); users themselves can be injection vectors (24/25 phishing-prompt runs exfiltrated `~/.aws/credentials`); VM isolation blinds host EDR ("an opaque hypervisor process"); remote MCP servers can change after approval.
- **Principle:** prefer mature primitives; "Our custom allowlist proxy was the piece that failed."

## Excerpts
> "When Claude runs code inside claude.ai, it does so in a gVisor container on isolated infrastructure."

> "The egress proxy checked the destination, saw api.anthropic.com, and let it through."

> "The hypervisor, seccomp, and gVisor across our products have been dependable."

> "The deterministic boundary is what gets hit when everything probabilistic misses."

## Relevance to the talk
A first-party confirmation of the talk's thesis: the kernel and hypervisor boundaries held, and the new, bespoke layer (the egress proxy and its allowlist) is where the bugs were. The api.anthropic.com upload is the canonical example of why host allowlists are insufficient, and why the model vendor's own API is the hardest domain to block. It also documents a product moving from a local VM to the cloud (see `anthropic-cowork.md`).
