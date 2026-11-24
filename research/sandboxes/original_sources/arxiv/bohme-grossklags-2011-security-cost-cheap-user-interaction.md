---
title: "The Security Cost of Cheap User Interaction"
url: https://doi.org/10.1145/2073276.2073284
record: https://pure.psu.edu/en/publications/the-security-cost-of-cheap-user-interaction/
authors: Rainer Böhme, Jens Grossklags
date: 2011-09 (NSPW 2011, Marin County, CA, September 12-15; ACM, pp. 67-82)
accessed: 2026-11-23
kind: paper
venue: New Security Paradigms Workshop 2011 (not arXiv). Abstract read from the Penn State research record; full text not fetched.
---

## Summary
A position paper that treats user attention as a scarce shared resource. Every unnecessary prompt or false alarm spends attention that a later, real warning will need, so a vendor that adds a prompt imposes a cost on everyone else who will ever ask that user something. The authors propose a "lump-of-attention" model and incentive fixes such as a Pigovian tax on interruptions.

## Key points
- Attention is finite; prompts compete for it.
- Each needless prompt is a negative externality on all other prompts.
- Vendors have incentives to over-prompt (shifting responsibility to the user), so attention is over-consumed.
- Fix proposed: price or ration interruptions, not just make them more usable.

## Excerpts
> "Human attention is a scarce resource, and lack thereof can cause severe security breaches." (Abstract)

> "we postulate the view that every false alarm or unnecessary user interaction imposes a negative externality on all other potential consumers of this chunk of attention." (Abstract)

> "The paper identifies incentive problems that stimulate overconsumption of human attention in security applications." (Abstract)

## Relevance to the talk
The theory behind the HN quip that approval prompts are "a liability model": a prompt is cheap for the vendor and expensive for the user. Every `npm test` prompt makes the next `rm -rf` prompt less likely to be read.
