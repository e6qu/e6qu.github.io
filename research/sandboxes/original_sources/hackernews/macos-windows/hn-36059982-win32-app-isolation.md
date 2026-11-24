---
title: "Win32 App Isolation"
url: https://news.ycombinator.com/item?id=36059982
story_url: https://github.com/microsoft/win32-app-isolation
points: 117
comments: 89
authors: submitted by pjmlp; Microsoft; HN commenters incl. mike_hearn, withinrafael, Avery3R
date: 2023-05-24
accessed: 2026-11-22
kind: discussion
---

## Summary
Microsoft's Win32 App Isolation preview (Build 2023): AppContainer-based isolation for classic Win32 apps
packaged as MSIX, with capability plumbing and file brokering. Commenters clarify what is new versus plain
AppContainers, and vent about Microsoft's churn of packaging and UI frameworks. Follow-up: "Sandboxing Python
with Win32 App Isolation" (64 points, https://news.ycombinator.com/item?id=39684567).

## Key points
- AppContainers supported Win32 since Windows 8; what is new is capability plumbing for Win32 APIs, brokering
  and implicit grants (powerbox file pickers).
- Lineage: UWP AppContainer → MSIX packaging → Win32 App Isolation.
- Developer fatigue with APPX/MSIX packaging is a recurring adoption barrier.

## Excerpts
> "AppContainers have supported win32 from the start, not just WinRT."
— Avery3R, https://news.ycombinator.com/item?id=36061029

> "The low level container tech doesn't care what high level APIs you use, it just blocks or redirects stuff, but if you want things like file brokering, implicit grants based on powerboxes and stuff like that then it wasn't previously available."
— mike_hearn, https://news.ycombinator.com/item?id=36061147

> "What's new here is that a handful of Win32 APIs are now slowly getting plumbed into the capability system."
— withinrafael, https://news.ycombinator.com/item?id=36064513

> "I have spent weeks of my life trying to get windows packaging to work. Twice with APPX, twice with MSIX."
— mastax, https://news.ycombinator.com/item?id=36065450

## Relevance to the talk
Windows has a richer process-sandbox primitive than macOS (AppContainer + ACL checks on every object), but tying
it to packaging limited adoption, as the App Sandbox mandate did on Mac. MXC (2026) finally exposes it without
packaging or admin rights.
