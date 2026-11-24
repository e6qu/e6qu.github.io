---
title: "Sandboxing and the Mac App Store"
url: https://developer.apple.com/news/?id=11022011a
authors: Apple Developer
date: 2011-11-02
accessed: 2026-11-22
kind: blog
---

## Summary
Apple's developer-news announcement that all apps submitted to the Mac App Store must implement
sandboxing, starting 2012-03-01. This followed App Sandbox's introduction with OS X Lion (July 2011).

## Key points
- Deadline as first announced: 2012-03-01.
- It was later moved to 2012-06-01 (see macos-news-sandboxing-deadline-extended-2012.md).
- Apple framed the rule as anti-malware: sandboxing limits the resources an app can access.

## Excerpts
> "As of March 1, 2012 all apps submitted to the Mac App Store must implement sandboxing."

> "Sandboxing your app is a great way to protect systems and users by limiting the resources apps can access"

## Relevance to the talk
This is the point at which the macOS sandbox became mandatory for a distribution channel, the moment
mandatory app sandboxing arrived on the desktop. It also explains why Apple calls `sandbox-exec`
deprecated: the App Sandbox entitlement model is the supported surface.
