---
title: "App Sandbox"
url: https://developer.apple.com/documentation/security/app-sandbox
authors: Apple Inc.
date: living documentation (feature introduced with OS X Lion 10.7, July 2011)
accessed: 2026-11-22
kind: docs
---

## Summary
Apple's reference page for the App Sandbox, the supported, entitlement-driven way to use the Seatbelt
kernel sandbox. An app opts in with the `com.apple.security.app-sandbox` entitlement and is then
confined to resources granted by further entitlements. The topics are Essentials, Network, Hardware,
App Data and File Access. It is required for Mac App Store distribution. Text was read from the doc's
JSON source.

## Key points
- Access is granted per resource class by code-signing entitlements, for example
  `network.client`/`network.server` and `files.user-selected.*`.
- Sandboxing is fixed at signing time and identity-bound to the app bundle. Unlike `sandbox-exec`, it
  cannot be parameterised per run or per working directory.
- Mandatory for the Mac App Store.

## Excerpts
> "Restrict access to system resources and user data in macOS apps to contain damage if an app becomes compromised." — abstract

> "To distribute a macOS app through the Mac App Store, you must enable the App Sandbox capability." — overview

## Relevance to the talk
The supported face of Seatbelt. It is a poor fit for agents, because agents need a different policy
per task and project directory, and network policy is all-or-nothing (client/server) rather than
per-domain. That is why agent tools reach for the "deprecated" `sandbox-exec` and raw SBPL instead.
