---
title: "Code Execution Through Deception: Gemini AI CLI Hijack"
url: https://tracebit.com/blog/code-exec-deception-gemini-ai-cli-hijack
authors: Sam Cox (Tracebit)
date: 2025-07-28 (page also shows an update dated 2026-04-08; the change is not described)
accessed: 2026-11-22
kind: blog
agent: Gemini CLI
incident_date: reported 2025-06-27 (two days after launch); fixed 2025-07-25; disclosed 2025-07-28
category: prompt-injection-rce
cve: none assigned per the write-up (Google VDP; reclassified P1/S1)
sandbox_at_time: available but OFF by default. Gemini CLI offered Docker/Podman/Seatbelt sandboxing, but "no sandbox" was the install default, and the researcher's tests ran that way. The only guard was per-command approval with a session allowlist
exploited_in_wild: no; researcher demonstration
---

## Summary
A repository's README hid a prompt injection inside GPL licence text. When a user asked Gemini CLI to describe the repo, the injection had the agent first propose a harmless `grep`. Once the user approved it and added it to the session allowlist, the agent ran a second command that *started with* the same `grep` but chained a payload sending all environment variables to a remote server. Gemini CLI's allowlist matched commands too loosely, so the second command ran without a prompt. Trailing whitespace pushed the payload off-screen in the displayed command.

## Key points
- Root cause: allowlist matching on the root command, so `grep ... ; env | curl ...` counted as "grep". The default sandbox was off, so the payload ran with the user's full privileges and network.
- Timeline: launch 2025-06-25; reported to Google VDP 2025-06-27 and triaged P2/S4; raised to P1/S1 on 2025-07-23; fixed in v0.1.14 on 2025-07-25; disclosed 2025-07-28.
- Google's reply (per Tracebit) pointed to the available Docker, Podman and macOS Seatbelt sandboxes and to a persistent red warning shown when sandboxing is off.
- Tracebit's advice: use the sandbox modes agentic tools provide wherever possible.

## Excerpts
> "consistently leads to silent execution of malicious commands"

> "Gemini's method of matching commands against the whitelist is inadequate as a security control."

> "This is the default setting if you install and run Gemini CLI." (on running without a sandbox)

## Would a mature sandbox have stopped it?
**Mostly yes, and one existed but was off by default.** With the Docker or Seatbelt `*-proxied` profiles, a default-deny egress allowlist would have blocked the `curl` to the attacker's host. Credential isolation (not passing the host's env vars and API keys into the sandbox) would have left little to steal. Note that the *default* Seatbelt profile at the time was `permissive-open`, which has network allowed (see [gemini-cli-sandbox.md](../agent-sandboxing/gemini-cli-sandbox.md)), so merely turning the sandbox on would not have stopped the exfiltration. The allowlist bug itself shows that approvals and command allowlists are not a security boundary. By 2026 Google's replacement product, Antigravity, sandboxes by default ([agent-google-antigravity.md](../agent-sandboxing/agent-google-antigravity.md)).

## Relevance to the talk
The textbook "the sandbox existed, the default was off, and the default sandbox profile allowed network" story. It pairs with [embracethered-claude-code-dns-exfil.md](../agent-sandboxing/embracethered-claude-code-dns-exfil.md) as two allowlist failures within two months.
