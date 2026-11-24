---
title: "You've Been Warned: An Empirical Study of the Effectiveness of Web Browser Phishing Warnings"
url: https://css.csail.mit.edu/6.566/2018/readings/youve-been-warned.pdf
authors: Serge Egelman, Lorrie Faith Cranor, Jason Hong (Carnegie Mellon University)
date: 2008-04 (CHI 2008, April 5-10, Florence, Italy)
accessed: 2026-11-23
kind: paper
venue: ACM CHI 2008 (not arXiv). The PDF read is the copy on MIT's 6.566 reading list; the ACM page could not be fetched (bot check).
---

## Summary
A lab study with 60 participants who received simulated spear-phishing emails. 97% fell for at least one. Active (interrupting) warnings were heeded by 79%; the passive IE warning was heeded by one participant. Interviews blamed habituation: people mistook serious warnings for the everyday ones they always dismiss.

## Key points
- 97% of 60 participants fell for at least one phishing message.
- Active warnings: 79% heeded. Passive warning: one participant heeded it.
- Users who recognised a warning were "significantly less likely" to read it fully: the paper calls this habituation.
- Design advice: serious warnings must look unlike routine ones, and should fire "only when there is a clear danger".

## Excerpts
> "We found that 97% of our sixty participants fell for at least one of the phishing messages that we sent them." (Abstract)

> "when presented with the active warnings, 79% of participants heeded them, which was not the case for the passive warning that we tested—where only one participant heeded the warnings." (Abstract)

> "my own PC constantly bombards me with similar messages" (a participant explaining why they ignored the warning)

> "Users ignored the passive indicators because they looked like many other warnings that users have ignored without consequences, thus they appear to be "crying wolf."" (Discussion, "Preventing habituation")

## Relevance to the talk
An agent's approval prompt looks the same for `npm test` and for `curl … | sh`. This paper is the early evidence that identical-looking prompts train people to dismiss the dangerous one too.
