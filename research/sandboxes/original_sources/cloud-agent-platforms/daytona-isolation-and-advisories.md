---
title: "Isolation", "Billing" and "Limits" (Daytona docs), with Daytona security advisories (April 2026 API-credential exposure; Copy Fail; GitHub advisories GHSA-*)
url: https://www.daytona.io/docs/en/isolation
authors: Daytona
date: docs living, read 2026-11-22; advisories 2026-04-13 (https://www.daytona.io/dotfiles/updates/security-advisory-api-credential-exposure-in-sandboxes), 2026-04-30 (https://www.daytona.io/dotfiles/updates/security-update-cve-2026-31431-copy-fail), GitHub advisories 2026-06-05 to 2026-06-17 (https://github.com/daytonaio/daytona/security/advisories)
accessed: 2026-11-22
kind: docs
---

## Summary
Daytona's isolation page settles what the default sandbox is: a **container** ("dedicated namespaces
and enforced resource limits"). A full VM with its own kernel is a separate class (Linux VM, Windows),
and only VM sandboxes get pause/resume, fork and memory snapshots. Daytona's own Copy Fail advisory
names the container runtime as **Sysbox**, and admits a kernel bug was reachable from a sandbox and
could touch page cache that co-tenants could see. A second advisory says the API key the CLI/SDK used to
reach a sandbox sat in memory inside it, readable via the default image's passwordless sudo. Six
GitHub advisories in June 2026 are mostly control-plane authorization bugs (cross-org IDOR,
org takeover, cross-tenant notifications), not runtime escapes.

## Key points
- **Isolation unit:** Container class = "Isolated container with dedicated namespaces and enforced
  resource limits. Code runs as root inside the sandbox". VM class = "Full virtual machine with its own
  kernel", with pause/resume, fork and hot snapshots as "VM-only capabilities". GPU = container with
  exclusive GPU. The hypervisor for VM sandboxes is **not named**. Nested KVM is available on request.
- **Runtime named in an advisory:** "The Sysbox runtime boundary itself was not breached in our
  testing" (Copy Fail post, 2026-04-30). The last public runner source (`daytonaio/daytona`
  `apps/runner/pkg/docker/container_configs.go` at commit b5a5d9e7, before the repo was archived)
  starts non-GPU sandboxes with Docker `Privileged: true` ("Non-GPU sandboxes still need privileged
  for their current workloads") and an operator-set `CONTAINER_RUNTIME`. That fits Sysbox, which makes
  privileged containers user-namespaced (inference; production config not public).
- **Lifecycle:** auto-stop default 15 minutes of inactivity; auto-archive/delete intervals and a
  wall-clock TTL; no maximum duration documented. Container sandboxes stop/archive (filesystem to
  object storage); VM sandboxes pause (memory kept) or stop (state offloaded). Linked sandboxes share a
  runner and a link network; they are always ephemeral.
- **Pricing (pricing page, read 2026-11-22):** per second; vCPU $0.0504/h, memory $0.0162/GiB-h,
  storage $0.000108/GiB-h (first 5 GiB free); Windows $0.0858/vCPU-h. Billed on **reserved**
  resources: started = all, stopped/paused = disk only, archived = nothing. $200 free credits.
- **Limits:** tiered compute pools by verification status; sandbox-creation rate 300–600/min
  (Tier 1–4). No per-plan concurrency figure published.
- **Credentials:** Secrets are "an opaque placeholder; an outbound proxy substitutes the real value only
  for requests to the secret's allowed hosts". Inbound: preview URLs need a preview token or signed URL
  unless the `public` flag is set; SSH needs an SSH access token.
- **Incident 1, API credential in sandbox memory (reported 2026-04-09, fixed same day in under five
  hours):** the CLI/SDK credential "is passed into a sandbox process and held in memory". With the
  default snapshot's passwordless sudo, anyone with a shell could read it "and impersonate the account
  that launched it". Fix: the Authorization header is stripped at the proxy. Rotation was required.
- **Incident 2, Copy Fail CVE-2026-31431 (2026-04-30):** reachable "from inside a Daytona sandbox". On
  multi-tenant runners it "could affect cached content observable to co-tenant sandboxes". Daytona
  blacklisted `algif_aead`, patched kernels, rotated runner credentials, and **paused signups** until
  the fleet was patched. No escape to the host was observed. Contrast: E2B said it was unaffected
  because each Firecracker guest has its own kernel and page cache
  (https://e2b.dev/blog/not-affected-by-copy-fail-heres-why, 2026-04-30).
- **GitHub advisories (daytonaio/daytona):** GHSA-ww63-pv5x-vfc8 / CVE-2026-54321 (High, 06-05):
  previews stayed public after being made private, from a stale cache. GHSA-m6hx-cffh-3f3h /
  CVE-2026-54320 (High, 06-05): cross-tenant org takeover via invitation with an unverified email.
  GHSA-qxvm-pcfm-qc39 / CVE-2026-54322 (High, 06-09): cross-org IDOR on role update/delete.
  GHSA-375h-72g4-hc9c / CVE-2026-54323 (Medium, 06-09): daemon `git clone` had TLS verification off,
  leaking Git credentials to a MITM. GHSA-qwxf-2m7m-2m3x / CVE-2026-54324 (Medium, 06-16): notification
  WebSocket joined any org room. GHSA-fjv8-j4p5-cr9m / CVE-2026-54319 (Medium, 06-17): volume-path
  traversal "not exploitable in any released version".

## Excerpts
> "Container | Isolated container with dedicated namespaces and enforced resource limits. Code runs as root inside the sandbox without affecting the runner." — Isolation

> "anyone with a shell on the sandbox could read that credential out of memory and impersonate the account that launched it." — API credential advisory, 2026-04-13

> "Non-GPU sandboxes still need privileged for their current workloads." — runner source comment

> "Secrets keep credentials out of sandboxes entirely. A sandbox holds an opaque placeholder; an outbound proxy substitutes the real value only for requests to the secret's allowed hosts." — Isolation

## Relevance to the talk
A clean, vendor-admitted pair of cases. On a shared kernel (Sysbox containers), Copy Fail reached
co-tenants' page cache, while E2B's Firecracker guests were unaffected the same week. Separately, the
platform's own credential sat inside the sandbox. Placeholder secrets only help if the platform's
control credential is also kept outside the sandbox.
