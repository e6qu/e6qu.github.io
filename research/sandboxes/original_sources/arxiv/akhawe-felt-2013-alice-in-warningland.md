---
title: "Alice in Warningland: A Large-Scale Field Study of Browser Security Warning Effectiveness"
url: https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/akhawe
pdf: https://files.usenix.org/s3fs-public/cdn/sec13-paper_akhawe.pdf
authors: Devdatta Akhawe (UC Berkeley), Adrienne Porter Felt (Google)
date: 2013-08 (22nd USENIX Security Symposium, Washington, D.C., pp. 257-272)
accessed: 2026-11-23
kind: paper
venue: USENIX Security 2013 (not arXiv)
---

## Summary
A field study of 25,405,944 warning impressions in Chrome and Firefox (May-June 2013), gathered through browser telemetry. Most malware and phishing warnings worked: users clicked through only a tenth of them in Firefox and a quarter in Chrome. Chrome's SSL warning, which users saw often and which was usually a false alarm, was clicked through 70.2% of the time. The authors read the timing data as warning fatigue: the more often an error appears, the faster people click through it.

## Key points
- Click-through rates: Firefox malware/phishing ~10%, Chrome malware/phishing ~25%, Firefox SSL ~33%, Chrome SSL 70.2%.
- Same users, different warning design, very different behaviour: the user experience of the warning matters.
- "warning frequency is inversely correlated with user attention."
- Half of the most common SSL warnings were clicked through in under two seconds.

## Excerpts
> "users continued through a tenth of Mozilla Firefox's malware and phishing warnings, a quarter of Google Chrome's malware and phishing warnings, and a third of Mozilla Firefox's SSL warnings." (Abstract)

> "In contrast to the other warnings, users continued through 70.2% of Google Chrome's SSL warnings." (Abstract)

> "Users clicked through 49% of untrusted issuer warning impressions within 1.7s" (§6.2)

> "We believe that this data is indicative of warning fatigue: users click through more-frequent errors more quickly." (§6.2)

## Relevance to the talk
The classic number behind "everyone clicks yes": a warning that fires often and is usually wrong gets clicked through 70% of the time, in under two seconds. Agent approval prompts are the frequent, usually-benign kind. The paper also gives the counterpoint: rare, well-designed warnings do work.
