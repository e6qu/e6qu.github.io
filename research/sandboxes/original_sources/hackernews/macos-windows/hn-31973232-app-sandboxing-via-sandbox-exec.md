---
title: "macOS: App sandboxing via sandbox-exec (2020)"
url: https://news.ycombinator.com/item?id=31973232
story_url: https://www.karltarvas.com/2020/10/25/macos-app-sandboxing-via-sandbox-exec.html
points: 144
comments: 22
authors: submitted by emdashcomma; article by Karl Tarvas; HN commenters incl. saagarjha, jmmv
date: 2022-07-04
accessed: 2026-11-22
kind: discussion
---

## Summary
Pre-agent era thread on wrapping ordinary apps with `sandbox-exec`. Short, but it captures the standing
interpretation of the deprecation notice and early practical uses (CI write-confinement, Nix on macOS).

## Key points
- Deprecation read as "internal detail, subject to change", or as a deterrent rather than a removal plan.
- Apple's likely reason: hand-written profiles are hard to make escape-proof and break Apple's frameworks;
  third parties are steered to the App Sandbox profile.
- TinyScheme confirmed; "friendlier than seccomp" despite being undocumented.
- Used in CI to limit writes outside the build folder; jmmv (Julio Merino) had a 2019 write-up; lynaghk's
  `sandboxtron` wrapper was inspired by the article.

## Excerpts
> "The macOS sandbox isn't \"deprecated\", but it's treated as an internal detail of the OS subject to change without warning."
— jmillikin, https://news.ycombinator.com/item?id=31973393

> "No. It's the recommended way to sandbox software on macOS. The \"this is deprecated\" comment is just to keep the undesirables out."
— saagarjha, https://news.ycombinator.com/item?id=31973451

> "I think Apple doesn't want third-party developers to compose their own sandboxing rules, because it's pretty hard to do that in a way that can't be escaped and that doesn't break Apple's frameworks."
— xnyhps, https://news.ycombinator.com/item?id=31976275

> "the whole facility is largely undocumented, but it still somehow manages to be friendlier than seccomp"
— 0x69420, https://news.ycombinator.com/item?id=31977315

> "We actually use this in our CI system to limit write access outside of the build environment's build folder."
— staticfloat, https://news.ycombinator.com/item?id=31978865

## Relevance to the talk
Shows that the "deprecated but load-bearing" status of Seatbelt predates agents by years, and that build
systems were the first wave of third-party users, before coding agents.
