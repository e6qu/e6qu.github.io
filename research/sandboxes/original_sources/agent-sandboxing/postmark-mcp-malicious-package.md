---
title: "Security Alert: Malicious 'postmark-mcp' npm Package Impersonating Postmark"
url: https://postmarkapp.com/blog/information-regarding-malicious-postmark-mcp-package
authors: Postmark (ActiveCampaign)
date: 2025-09-25
accessed: 2026-11-22
kind: blog
---

## Summary
Postmark's alert about an unofficial npm package, `postmark-mcp`, that impersonated the company's email service as an MCP server. After building trust over fifteen benign versions, version 1.0.16 added a backdoor that silently BCC'd every email sent through it to an external address. (The discovery is widely credited to Koi Security; Koi's original post now redirects to a Palo Alto Networks product page and was not read.)

## Key points
- Impersonation of a real vendor's name; Postmark had no involvement.
- Rug-pull pattern: 15 clean versions, then a one-line malicious change in 1.0.16 (BCC to an attacker-controlled address).
- Advice: remove the package, review email logs, rotate any credentials sent by email during the exposure window. The official Postmark MCP server lives under ActiveCampaign on GitHub.

## Excerpts
> "We didn't develop, authorize, or have any involvement with the \"postmark-mcp\" npm package"

> "The legitimate Postmark API and services remain secure and unaffected by this incident"

## Relevance to the talk
First widely reported malicious MCP server in the wild. Local MCP servers run as ordinary processes with the user's privileges and — per Claude Code's and Docker Sandboxes' own docs — usually *outside* the agent sandbox. Argues for sandboxing MCP servers too (the srt README's headline example is wrapping an MCP server in `srt`).
