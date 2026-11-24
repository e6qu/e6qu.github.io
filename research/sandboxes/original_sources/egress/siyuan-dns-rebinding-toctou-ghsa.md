---
title: "SiYuan Agent Tools SSRF via DNS-Rebinding TOCTOU (Bypass of CheckHostSSRF) — GHSA-x8gv-g2g3-65fj"
url: https://github.com/advisories/GHSA-x8gv-g2g3-65fj
authors: Reported by joysinleung; GitHub Advisory Database (siyuan-note/siyuan)
date: published 2026-10-02 (reported 2026-08-13); affects <= 3.8.0, fixed 3.8.1
accessed: 2026-11-22
kind: advisory
---

## Summary
A clean, recent write-up of time-of-check/time-of-use DNS rebinding in an AI agent's outbound
tools. SiYuan's agent `http_request` and `web_fetch` tools resolved the hostname once to check that
it was not private, loopback or link-local, then let the HTTP client resolve it *again* to
connect. An attacker-controlled domain answers the first lookup with a public IP and the second
with `127.0.0.1` or `169.254.169.254`, so a prompt-injected fetch reaches cloud metadata or
internal services. It is an incomplete-fix variant of an earlier SSRF advisory: the agent paths got
the parse-time check but not the connect-time dialer.

## Key points
- Guard: `CheckHostSSRF` does one `net.LookupIP` plus a private-IP test. Connect: the default
  `net.Dialer` resolves independently, with no connect-time check on this path.
- Reproduced on v3.8.0 with a resolver that alternates 203.0.113.1 and 127.0.0.1. Both agent tools
  returned an internal-only proof body.
- Reachable in the default configuration (SafeMode on or off). The precondition is that the
  attacker can steer the agent/MCP client to fetch their domain (prompt injection).
- The project already had the right pattern elsewhere: a sibling path mounts a dialer `Control`
  hook that checks the *connected* IP.
- The same bug class appeared across 2026 agent stacks (from advisory-database search results,
  not each read): PraisonAI `web_crawl` (CVE-2026-61430), MCP Atlassian (GHSA-489g-7rxv-6c8q),
  FastGPT (CVE-2026-42344), OpenClaw browser (GHSA-w7rc-vvgx-pj45).
- Fix pattern: pin the validated IP and dial it (or check at connect time), never re-resolve.

## Excerpts
> "an attacker-controlled domain can answer the guard-resolution with a public IP (passing `CheckHostSSRF`) and the connect-resolution with a private/loopback/metadata IP" — Summary
> "This is a classic DNS-rebinding TOCTOU that bypasses the SSRF defense entirely." — Summary

## Relevance to the talk
Time-of-check DNS is the egress version of the filesystem TOCTOU bugs in the escape-advisory
cluster ([incidents note](../incidents/2026-06-agent-sandbox-escape-advisories.md)). Proxy designs
that get it right: Smokescreen and `srt` check the resolved address
([stripe-smokescreen.md](stripe-smokescreen.md),
[srt](../agent-sandboxing/anthropic-sandbox-runtime.md)). Codex admits it can't fully prevent it
without transport-level pinning ([codex-network-proxy-readme.md](codex-network-proxy-readme.md)).
AWS Network Firewall's resolved-domain check is the network-layer version.
