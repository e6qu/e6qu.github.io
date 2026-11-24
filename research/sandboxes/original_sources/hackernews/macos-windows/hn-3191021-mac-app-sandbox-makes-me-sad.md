---
title: "Why the Mac App Sandbox makes me sad"
url: https://news.ycombinator.com/item?id=3191021
story_url: http://lacquer.fi/pauli/blog/2011/11/why-the-mac-app-sandbox-makes-me-sad/
points: 299
comments: 187
authors: submitted by pavlov (Pauli Ojala, the article's author); HN commenters
date: 2011-11-03
accessed: 2026-11-22
kind: discussion
---

## Summary
Posted the day after Apple announced that Mac App Store apps must be sandboxed from March 2012 (companion story:
"Mac App Store apps must implement sandboxing as of March 2012", 78 points,
https://news.ycombinator.com/item?id=3189763). The author lists the entitlements and argues that plug-in
architectures and pro tools cannot fit; commenters split between "default-deny is a good thing" and "this
excludes most serious Mac software".

## Key points
- The App Sandbox was available since Lion (10.7); the 2011 news was the Store mandate.
- Developers' worry was less the technology than Apple's unknown exception/rejection policy.
- Apps named as unable to fit: Xcode, browsers, VLC, Dropbox, BBEdit, TextMate, VMware Fusion, Steam.
- Already in 2011 people noted Windows 8 Metro apps would be locked down the same way (AppContainer).

## Excerpts
> "I would love to live in a world where the default environment for any program is a very limited sandbox that can only interact with the outside world via standardized UI elements."
— nhaehnle, https://news.ycombinator.com/item?id=3191150

> "We know everything about it technically. However, we know nothing about how Apple is going to handle exceptions and what will get you rejected."
— natesm, https://news.ycombinator.com/item?id=3191273

> "Xcode, Firefox, Safari, Google Chrome, VLC Player, Dropbox, BBEdit, TextMate, StuffIt, UnRarX. These are all well-known OS X applications, all of them having important features that require being able to open an arbitrary file without user interaction."
— DrJokepu, https://news.ycombinator.com/item?id=3191663

> "Soon to be 1.5 major operating systems (since Windows 8 Metro apps are going to be locked down in exactly the way people fear is coming from Apple evolving the Mac App Store)."
— fpgeek, https://news.ycombinator.com/item?id=3194938

## Relevance to the talk
History slide: the App Sandbox mandate (2011–2012) is when Seatbelt went from Apple-internal to a developer
requirement. It also shows the lasting tension: a static, per-app entitlement model fits consumer apps but not
developer tools, which is the same tension agents hit today.
