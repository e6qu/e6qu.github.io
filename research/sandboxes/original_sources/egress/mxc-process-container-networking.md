---
title: "Process Container Networking Configuration, GA (microsoft/mxc docs/backends/process-container/networking.md)"
url: https://github.com/microsoft/mxc/blob/main/docs/backends/process-container/networking.md
authors: Microsoft (MXC project)
date: last changed 2026-10-23 (read at HEAD)
accessed: 2026-11-22
kind: docs
---

## Summary
How Microsoft's MXC library, now the Windows backend for Codex and an option in Anthropic's `srt`,
enforces network egress for a Windows "ProcessContainer" (AppContainer-based). There are two
models. Direct egress grants the AppContainer `internetClient` capability and then narrows it with
per-container **WFP** (Windows Filtering Platform) filters by IP/CIDR, protocol and port. The
recommended **proxy-only** model withholds `internetClient` entirely and lets WFP allow only one
loopback proxy endpoint, optionally bound to the proxy's package identity. The doc states plainly
that "the containment boundary is the absence of direct internet capability". The proxy settings
themselves are only advisory.

## Key points
- Two OS-level primitives per container, with no UAC prompt per launch: WFP egress filters
  (default block; allow/block by IP or range, protocol, port; IPv4 and IPv6; explicit block wins;
  scoped to this container) and a per-container WinHTTP proxy. MXC also sets `HTTP_PROXY`,
  `HTTPS_PROXY` (and lowercase) for runtimes that read env vars.
- Capability matrix: egress deny + ingress deny → no capabilities, so no internet and no private
  network. `internetClient` grants internet outbound. `privateNetworkClientServer` is one
  *bidirectional* capability, so allowing private-network egress also allows inbound private
  traffic.
- Model 1 (direct, least restrictive): `internetClient` + WFP CIDR/port allow rules (the example
  allows 140.82.112.0/20:443). There is no name-based policy at this layer.
- Model 2 (proxy-only, recommended): the client container's WFP egress is limited to the configured
  loopback proxy address and port. MXC rejects non-loopback proxy endpoints. `allowedProxyPeer`
  ties the endpoint to a package family name or AppContainer profile, so another process can't
  squat on the port. An unpackaged non-AppContainer proxy is "development/testing compatibility",
  with weaker host-loopback guarantees.
- Proxy-unaware clients: code should use WinHTTP or a library that asks the system for proxy
  settings. Anything else simply has no route (it fails rather than bypasses).
- Known gap (build 26691.1002): in the proxy mapping, host-to-container listener connections time
  out, so the bidirectional `hostLoopback: "allow"` contract is not fully implemented.

## Excerpts
> "The containment boundary is the absence of direct internet capability." — §1
> "Windows exposes `privateNetworkClientServer` as one bidirectional AppContainer capability." — §1

## Relevance to the talk
The Windows column of the egress story. AppContainer capabilities give the "no route" base,
WFP narrows it by IP, and names are left to a user-space proxy, the same layering as bubblewrap
`--unshare-net` + proxy on Linux and Seatbelt "localhost:proxy only" on macOS
([srt note](../agent-sandboxing/anthropic-sandbox-runtime.md)). WFP itself is the kernel filter
engine under Windows Firewall
(https://learn.microsoft.com/en-us/windows/win32/fwp/windows-filtering-platform-start-page);
`srt`'s alpha Windows backend uses WFP `ALE_AUTH_CONNECT` filters keyed on a dedicated user SID.
Related MXC notes: [windows-mxc-repo.md](../macos-windows/windows-mxc-repo.md),
[windows-codex-mxc-sandbox-readme.md](../macos-windows/windows-codex-mxc-sandbox-readme.md).
