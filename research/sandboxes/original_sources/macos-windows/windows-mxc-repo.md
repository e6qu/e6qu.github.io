---
title: Microsoft eXecution Container (MXC)
url: https://github.com/microsoft/mxc
authors: Microsoft
date: repo created 2026-02-06; releases v0.8.0 2026-08-22, v1.0.0 2026-10-07, v1.1.0 2026-11-15
accessed: 2026-11-22
kind: repo
---

## Summary
MIT-licensed SDK (Rust, .NET, Node) and executors for running untrusted code
— "model output, plugins, and tools" — under a single JSON policy (filesystem
read-only/read-write/deny lists, network egress/ingress and proxy, UI
clipboard/display/input) with pluggable backends. On Windows the default
backend is `processcontainer` (AppContainer-based process isolation, Windows
11 24H2+); other Windows backends are `isolation_session`, `wslc`, and
experimental `windows_sandbox`, `microvm` (NVX, x64 only) and `hyperlight`.
Linux defaults to Bubblewrap (also LXC, Hyperlight); macOS to Seatbelt.

## Key points
- Backend table (README): Windows 11 default `processcontainer`; Linux
  `bubblewrap`; macOS `seatbelt`.
- ProcessContainer uses "BaseContainer" and a Windows "process security
  environment" (PSEC); filesystem access also inherits ACL grants to
  `ALL_APPLICATION_PACKAGES` (docs/backends/process-container/filesystem.md).
- Networking (docs/backends/process-container/networking.md): per-container
  WFP egress filters (default block, allow by IP/CIDR, protocol, port) and a
  per-container WinHTTP proxy; maps to AppContainer capabilities
  `internetClient` and `privateNetworkClientServer`; no UAC prompt per launch.
- OS support (os-version-support.md): process isolation from Windows 11 24H2
  build 26100.9278 / 25H2 26200.9278 (August 2026 update); session isolation
  from 26100.9550 (September 2026 update).
- IsolationSession requires an interactive sign-in; fails in Session 0 or in
  scheduled tasks running without the user signed in.
- Learning/audit mode records denied accesses to help author least-privilege
  policies (`wxc-exec.exe --audit` disables enforcement).
- Windows release builds send four "Required" telemetry events that are not
  user-consent-gated (README, Telemetry).
- No density or startup-time figures in the repository docs read.

## Excerpts
> "MXC is a **sandboxed code execution system** for running untrusted code (model output, plugins, and tools) on Windows, Linux, and macOS." (README)

> "The containment boundary is the absence of direct internet capability." (process-container/networking.md)

> "Windows exposes `privateNetworkClientServer` as one bidirectional AppContainer capability." (process-container/networking.md)

## Relevance to the talk
The clearest 2026 evidence that the industry's answer to "many agents per
Windows box without a VM each" is a policy-driven *process* sandbox built on
AppContainer + WFP + job objects, with VMs only as an opt-in tier. Also a
cross-platform abstraction directly comparable to Anthropic's sandbox-runtime
(Seatbelt/bubblewrap) — see agent-sandboxing/.
