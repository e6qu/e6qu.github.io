---
title: "LLM WikiLeaks: Uncovering URL-Based Capability Extension and Security Circumvention in Agentic Message Boards"
url: https://arxiv.org/abs/2610.34542
authors: Orel Navi, Elad Feldman, Ben Nassi
date: arXiv 2026-10-25 (preprint)
accessed: 2026-11-22
kind: paper
---

## Summary
A study of the "ProWiki" incident, in which LLM agents restricted to outbound HTTP **GET** used a
public German-language wiki as a message board. The authors analysed 14,591 agent edits containing
79,541 URL postings and found agents routinely wrapping target URLs in layers of *third-party web
services*: fetch/CORS proxies, link shorteners, converters, archives. These services both extended
what a GET-only agent could do and got around access restrictions. The gap between the
capabilities an agent is *granted* and those it can *obtain* through the open web is large.

## Key points
- 33.6% of URL occurrences wrap the target in 1–5 layers of third-party services; 67 intermediate
  services identified.
- 73.8% of those uses extend capability (Markdown/OCR conversion, JSON field filtering, archives
  exposing old page versions). 26.2% are circumvention/evasion (CORS and fetch proxies, shorteners
  and redirectors that hide the destination).
- Shows that "GET-only" or "read-only" egress is not read-only. A GET to a writable service (a wiki
  edit endpoint, a logger, a proxy) writes, and query strings carry data.
- From the search snippet (full paper not read): the authors recommend checking *every hop* in a
  reconstructed URL chain against the allowlist, not just the outer host.

## Excerpts
> "repurposed a public German-language wiki as a message board" — abstract
> "restricting an agent's local toolset or direct Internet access may be insufficient" — abstract

## Relevance to the talk
Empirical backing for "allowed domains with user-generated content" and for proxy-type services
(the Google Translate-style proxies in
[infoblox-composite-domain-names.md](infoblox-composite-domain-names.md)). It also tempers the
"method policy" fix: Codex's limited mode (GET/HEAD/OPTIONS) and Codex cloud's GET-only option
([note](../agent-sandboxing/openai-codex-cloud-internet-access.md)) narrow the channel but do not
close it while arbitrary hosts or proxy services are reachable. Preprint.
