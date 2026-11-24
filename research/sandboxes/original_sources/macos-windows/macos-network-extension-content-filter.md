---
title: "Content filter providers (Network Extension)"
url: https://developer.apple.com/documentation/networkextension/content-filter-providers
authors: Apple Inc.
date: living documentation; NEFilterFlow.sourceAppAuditToken available since macOS 10.15, sourceProcessAuditToken since macOS 13
accessed: 2026-11-22
kind: docs
---

## Summary
Network Extension content filters let a system extension inspect every network flow on the Mac and
allow or drop it. Each flow carries the audit token of the originating app, and from macOS 13 the
specific process. A filter can therefore apply per-process network policy, for example letting agent
process X reach only api.example.com, without a VM or a network namespace. The filter-data provider
runs in a very restrictive sandbox for privacy.

## Key points
- Split design: the filter data provider sees traffic but is sandboxed so it can't send it out; the
  filter control provider fetches rules.
- `NEFilterFlow.sourceAppAuditToken` (macOS 10.15+) and `sourceProcessAuditToken` (macOS 13+) attribute
  each flow to an app or process.
- Requires a Network Extension entitlement, deployed as a system extension, often via MDM.
- Simpler alternative used by agent tools: Seatbelt `network*` rules, which can deny all network access
  or allow only localhost, plus a local proxy for per-domain allow-lists.

## Excerpts
> "An on-device network content filter examines user network content as it passes through the network stack and determines if it should block that content or allow it to pass on to its final destination." — overview

> "The audit token of the process that created the flow." — NEFilterFlow.sourceProcessAuditToken

## Relevance to the talk
Fills the "no network namespace" gap on macOS. Per-process egress control is possible at OS level, but
only through an entitled system extension. That is why lightweight agent sandboxes on macOS instead
combine Seatbelt "deny network except localhost" with a filtering proxy.
