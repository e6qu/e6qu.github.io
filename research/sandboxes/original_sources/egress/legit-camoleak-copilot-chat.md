---
title: "CamoLeak: Critical GitHub Copilot Vulnerability Leaks Private Source Code"
url: https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code
authors: Omer Mayraz (Legit Security)
date: 2025-09-30 (wider coverage 2025-10-08); reported June 2025 via HackerOne; fixed 2025-08-14
accessed: 2026-11-22
kind: blog
---

## Summary
Copilot Chat on github.com rendered Markdown images, but GitHub's Content Security Policy only
let images load through GitHub's own Camo proxy (`camo.githubusercontent.com`), with URLs that
GitHub signs. An attacker can't sign a URL that carries stolen data, so the usual
"image-URL-with-secret" trick fails. Mayraz pre-generated a signed Camo URL for *every character*,
each pointing at his server, and embedded the dictionary in a hidden PR-description prompt. Copilot,
running with the victim's access to private repos, then "drew" secrets as a sequence of 1×1 images.
Each image load was one character, sent through an allowed GitHub domain. CVSS 9.6.

## Key points
- Injection vector: hidden content in a pull request description, which reached any user who asked
  Copilot Chat about that PR.
- Allowed-domain channel: Camo URLs are on a GitHub domain and validly signed, so both the CSP and
  Camo's signature check pass. A random parameter defeated caching, so every character produced a
  fetch.
- Data: private source code and secrets visible to the victim's Copilot session.
- Fix: GitHub disabled image rendering in Copilot Chat entirely (2025-08-14).

## Excerpts
> "Attackers cannot craft arbitrary URLs to exfiltrate dynamic data." — on the Camo signing model, before the bypass
> "GitHub fixed it by disabling image rendering in Copilot Chat completely." — Timeline

## Relevance to the talk
The sharpest example of "image URLs in rendered markdown" as an egress channel. It also shows that
an allowlist of *your own* domains isn't safe when one of them is a proxy that forwards to
arbitrary origins. `camo.githubusercontent.com` is on Claude Code cloud's default allowlist
([claude-code-cloud-environments-network.md](claude-code-cloud-environments-network.md)), though
there the agent fetches rather than a browser rendering. The fix, removing the renderer, is the
one that works. Earlier cases of the same channel: Bard via Apps Script
([embracethered-bard-apps-script-exfil.md](embracethered-bard-apps-script-exfil.md)) and GitLab
Duo ([incident](../incidents/2025-05-gitlab-duo-remote-prompt-injection.md)).
