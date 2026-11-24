---
title: "Hacking Google Bard - From Prompt Injection to Data Exfiltration"
url: https://embracethered.com/blog/posts/2023/google-bard-data-exfiltration
authors: Johann Rehberger (Embrace The Red)
date: 2023-11-03 (reported to Google VRP 2023-09-19; fixed 2023-10-19)
accessed: 2026-11-22
kind: blog
---

## Summary
An early, clear case of an *allowlisted domain with user-generated content* used as an
exfiltration endpoint. Bard's CSP blocked images from arbitrary hosts but allowed Google domains
(`*.google.com`, `*.googleusercontent.com`). Google Apps Script web apps are served from exactly
those domains, and anyone can deploy one. Rehberger deployed a "Bard Logger" script that wrote
query parameters into a Google Doc, then used an indirect prompt injection (via a Google Doc shared with the victim, which
we recall but did not re-confirm on this read) to make Bard emit an image tag pointing at it with chat history in the URL.

## Key points
- CSP allowed `*.google.com` and `*.googleusercontent.com`, which "seemed quite broad".
- Apps Script endpoints on `script.google.com` / `googleusercontent.com`, configured to run without
  authentication, gave an anonymous, attacker-owned logger on an allowed domain.
- Zero-click once the injected content was in context: the image rendered automatically.
- Google's fix (per the author) left the CSP unchanged and images still rendered. It appears to
  stop data from being placed into image URLs; the mechanism was not public at the time of
  writing.

## Excerpts
> "The CSP contains locations such as `*.google.com` and `*.googleusercontent.com`, which seemed quite broad." — post

## Relevance to the talk
The template for the "allowed domain, attacker-writable" class: Apps Script, gists, issues,
pastebins, webhook.site (Antigravity's default allowlist:
[incident](../incidents/2025-11-google-antigravity-exfil.md)), S3/GCS/R2 buckets under wildcard
cloud domains, and Hugging Face download counters (Claude Code CVE-2026-54316, in
[2026-06-agent-sandbox-escape-advisories.md](../incidents/2026-06-agent-sandbox-escape-advisories.md)).
Any platform domain where strangers can host an endpoint is effectively a public domain.
