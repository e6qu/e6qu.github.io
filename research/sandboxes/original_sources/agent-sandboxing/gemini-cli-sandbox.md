---
title: "Sandboxing in Gemini CLI"
url: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md
authors: Google (google-gemini/gemini-cli contributors)
date: living document; repo created 2025-04-17; read at main on 2026-11-22
accessed: 2026-11-22
kind: docs
---

> **Update 2026-11-22:** consumer access to Gemini CLI ended 2026-06-18; Google replaced it with Antigravity CLI (`agy`), which sandboxes by default. See [agent-google-antigravity.md](agent-google-antigravity.md) and the [matrix](top-coding-agents-matrix.md).

## Summary
Gemini CLI offers the widest menu of sandbox backends of the local agents: macOS Seatbelt profiles, Docker/Podman containers (default image `ghcr.io/google/gemini-cli:latest`), gVisor `runsc`, LXC/LXD full-system containers, and a Windows native sandbox based on integrity levels. Originally it sandboxed the *whole CLI process*; it now defaults to "tool sandboxing" (isolating individual tool executions such as `shell_exec`/`write_file`) with a "sandbox expansion" prompt when a command needs more. The history of its default macOS profile is a small case study in defaults hardening over time.

## Key points
- Enabled by `-s/--sandbox`, `GEMINI_SANDBOX=true|docker|podman|sandbox-exec|runsc|lxc`, or `tools.sandbox` in `settings.json`.
- **macOS Seatbelt**: six built-in profiles via `SEATBELT_PROFILE` — `permissive-`, `restrictive-`, `strict-` × `-open` (network allowed) / `-proxied` (network via proxy). Default `permissive-open`: writes confined to the project, broad reads, **network allowed**.
- Profile history (git log of `packages/cli/src/utils/sandbox-macos-permissive-open.sb`): the first version (2025-06-10, PR #891) began `(allow default)` then `(deny file-write*)` with exceptions; on 2026-07-17 (PR #28424) it was rewritten to `(deny default)` with the comment "do not switch to (allow default)"; 2026-07-06 made `~/.gitconfig` read-only.
- **Docker/Podman**: CWD mounted at the *same absolute path* inside the container; custom images via `GEMINI_SANDBOX_IMAGE` or `.gemini/sandbox.Dockerfile`; extra mounts with `SANDBOX_MOUNTS` (default read-only); `--userns=keep-id` with rootless Podman. Running the CLI itself in Docker requires mounting `/var/run/docker.sock` to spawn sibling sandboxes.
- **gVisor/runsc** (Linux): described as the "strongest isolation available"; user-space network stack means host loopback services are unreachable; `--network=none` would also cut off the Gemini API.
- **LXC/LXD** (experimental): full system with systemd/snapd for tools like Snapcraft; container must pre-exist.
- **Windows native**: uses `icacls` to set a Low Mandatory Level on writable paths; these integrity labels **persist** after the session.
- **Tool sandboxing** (`security.toolSandboxing`) isolates individual tool runs rather than the entire process. *Correction (2026-11-22, from source):* the default is `false` in `settingsSchema.ts` and `config.ts` and in the configuration reference. Only the narrative guide reads as if it were on. See [gemini-cli-tool-sandbox-source.md](gemini-cli-tool-sandbox-source.md).
- **Sandbox expansion**: on a denial, or proactively for commands like `npm install`, a modal "Sandbox Expansion Request" asks the user to grant extra paths/network for that single run.
- Source tree now also has `packages/core/src/sandbox/{linux,macos,windows}` (bubblewrap args builder from 2026-04-01, Seatbelt args builder, `GeminiSandbox.cs` for Windows).

## Excerpts
> "Sandboxing isolates potentially dangerous operations (such as shell commands or file modifications) from your host system, providing a security barrier between AI operations and your environment." — Overview

> "`permissive-open` (default): Write restrictions, network allowed" — macOS Seatbelt

> "Strongest isolation available: runs containers inside a user-space kernel via gVisor." — gVisor / runsc

> "Even after the sandbox session ends, files created or modified by the sandbox will retain their \"Low\" integrity level." — Windows Native Sandbox

## Relevance to the talk
Illustrates the full spectrum available to one product — profile-based syscall policy, containers, user-space kernel, system containers — and the trade-off users face. The default (`permissive-open`, network on) shows how usability pressure shapes defaults; the 2025→2026 switch from `(allow default)` to `(deny default)` shows hardening after launch. The move from whole-process to per-tool sandboxing plus "expansion requests" mirrors Claude Code and Codex.
