---
title: "Sprite networking", "Checkpoints", "Lifecycle and Persistence", "Connectors" (Fly.io Sprites docs), with the Sprites product/pricing page
url: https://docs.fly.io/sprites/concepts/networking
authors: Fly.io
date: living docs, read 2026-11-22 (docs.sprites.dev and fly.io/docs/sprites redirect to docs.fly.io/sprites; sprites.dev redirects to https://fly.io/sprites); no page dates shown
accessed: 2026-11-22
kind: docs
---

## Summary
The Sprites docs fill in what the launch post ([../agent-sandboxing/flyio-sprites-code-and-let-live.md](../agent-sandboxing/flyio-sprites-code-and-let-live.md))
left vague. Each Sprite is a "hardware-isolated" microVM; the VMM is not named in the docs. It is
fixed at 8 vCPU and 100 GB, with memory that autoscales. It pauses about 30 s after activity stops:
first "warm" (memory frozen, resume 100–500 ms), then "cold" (VM stopped, 1–2 s, processes gone).
**Checkpoints capture only the writable filesystem overlay, not memory.** Egress is unrestricted by
default. The opt-in policy is a **DNS-based allowlist** applied from outside, which also blocks raw-IP
connections unless the IP came from an allowed lookup. Credentials go through "Connectors": a gateway
holds the token and authorizes each call by the calling Sprite's identity.

## Key points
- **Isolation:** "persistent, hardware-isolated Linux VMs"; "Hardware-level — dedicated microVM".
  Firecracker is **not named** in the docs or on the product page (it was named in launch coverage).
- **Lifecycle:** active → (~30 s idle) warm (VM suspended, memory kept, compute billing stops) →
  cold (VM stopped, memory dropped). Open TCP connections never survive a pause. "Services" restart on
  cold wake; a Tasks API holds a Sprite active. No maximum duration documented.
- **Filesystem:** ext4 on NVMe cache, "syncs to [object storage] continuously, not as a snapshot
  taken at hibernation". 100 GB per Sprite, no autoscaling yet; billed on bytes written (TRIM-aware).
- **Checkpoints:** "snapshots the writable filesystem overlay … does not capture anything that only
  lives in memory". Copy-on-write, roughly a second, non-disruptive; sequential IDs; the last five are
  mounted read-only at `/.sprite/checkpoints/`. Automatic checkpoints are hidden and pruned. Restore
  restarts the environment. Agents inside can checkpoint/restore via `sprite-env` or
  `/.sprite/api.sock`. This **corrects** the "whole environment" reading in the launch-post note: restore
  "rewinds files rather than resuming a paused process" (product page).
- **Egress policy:** rules in `/.sprite/policy/network.json` (read-only inside); `{"include":
  "defaults"}` pulls GitHub, npm, PyPI, Docker Hub and major AI APIs. Denied names get DNS REFUSED.
  "Raw IP connections are blocked unless the IP was resolved from an allowed domain". Private IPs are
  always blocked. Live reload drops existing connections to newly blocked domains. `{"rules": []}`
  means no enforcement.
- **Inbound:** URL `https://<name>-<org>.sprites.app/` is **private by default** (org members / org
  token); `--url-auth public` opens it.
- **Credentials (Connectors):** credential stored once per org. Gateway URL
  `https://api.sprites.dev/v1/gateway/<provider>/<connection_id>/<path>`; Sprites "authenticates the
  call using the requesting Sprite's identity". Access policy is deny-by-default and matches on Sprite
  name prefix and/or labels, with an "allow all" override. "The Sprite never holds the provider token."
- **Pricing (fly.io/sprites):** CPU $0.0385/CPU-hour; memory $0.021875/GB-hour; hot storage
  $0.000683/GB-hour (~$0.50/GB-month) while awake; cold storage $0.000027/GB-hour (~$0.02/GB-month).
  Warm/cold Sprites are not billed for compute. $1 trial; Free plan $5/month usage. Concurrency (Hero
  tier): 100 running + 100 warm, unlimited cold; creation 10/min (pay-as-you-go) to 240/min (top tier).

## Excerpts
> "A checkpoint snapshots the writable filesystem overlay: everything you've added on top of the base image. It does not touch the base image itself, and it does not capture anything that only lives in memory." — Checkpoints

> "By default, a Sprite's outbound is unrestricted: it can resolve and reach any domain. Egress can be tightened with a network policy, a DNS-based allowlist" — Sprite networking

> "Raw IP connections are blocked unless the IP was resolved from an allowed domain. You can't route around the allowlist by dialing an address directly." — Sprite networking

> "the policy decides what a Sprite may reach, Connectors decide what it may reach as." — Sprite networking

## Relevance to the talk
A clear example of DNS-as-policy done properly. Tying IP reachability to a prior allowed lookup closes
the "dial the IP" bypass that plain DNS filtering leaves open; whether it handles shared-CDN IPs is
not documented. The warm/cold split shows that memory persistence is real but implicit and
best-effort, while the user-facing snapshot primitive is disk-only.
