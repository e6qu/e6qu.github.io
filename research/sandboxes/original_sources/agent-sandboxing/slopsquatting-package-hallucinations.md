---
title: "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs"
url: https://arxiv.org/abs/2406.10279
authors: Joseph Spracklen, Raveen Wijewickrama, A H M Nazmus Sakib, Anindya Maiti, Bimal Viswanath, Murtuza Jadliwala
date: arXiv v1 2024-06-12, v3 2025-03-02; USENIX Security 2025 (https://www.usenix.org/conference/usenixsecurity25/presentation/spracklen)
accessed: 2026-11-22
kind: paper
---

## Summary
Large-scale measurement of "package hallucinations": code-generating LLMs recommending dependencies that do not exist. Because hallucinated names recur, an attacker can register them on npm/PyPI and wait for agents or developers to install them — the attack later named "slopsquatting" (term attributed to Seth Larson of the PSF, April 2025, per secondary sources; not verified at origin).

## Key points
- 16 popular code LLMs; 576,000 code samples in two languages (Python, JavaScript) from two prompt datasets.
- Hallucinated packages averaged at least 5.2% for commercial models and at least 21.7% for open-source models.
- 205,474 unique hallucinated package names.
- Secondary summaries (Socket) add: ~43% of hallucinated names recur in all ten reruns of a prompt; only ~13% are within edit distance 2 of a real package (so typosquat defences miss them) — not checked against the paper text.

## Excerpts
> "poses a critical threat to the integrity of the software supply chain" — abstract

> "highlight package hallucinations as a persistent and systemic phenomenon" — abstract

## Relevance to the talk
Agents install packages autonomously, so a sandbox must assume that `npm install`/`pip install` will run attacker code inside it (install scripts) — and that a package registry on the egress allowlist is also a delivery channel. Supports designs that separate an install phase from the agent phase (Codex cloud) and that keep secrets out of the sandbox.
