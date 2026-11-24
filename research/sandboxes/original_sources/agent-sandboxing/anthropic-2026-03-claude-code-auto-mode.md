---
title: "Claude Code auto mode: a safer way to skip permissions"
url: https://www.anthropic.com/engineering/claude-code-auto-mode
authors: John Hughes (Anthropic), with thanks to Alex Isken, Alexander Glynn, Conner Phillippi, David Dworken, Emily To, Fabien Roger, Jake Eaton, Javier Rando, Shawn Moore, Soyary Sunthorn
date: 2026-03-25
accessed: 2026-11-23
kind: blog
---

Note: the URL now redirects to https://www.anthropic.com/research/claude-code-auto-mode.

## Summary
Anthropic's engineering post introducing auto mode, a two-stage classifier that approves or blocks Claude Code's actions instead of the user. It opens by naming approval fatigue as the problem, and places the three existing options on one chart: sandbox (safe but high-maintenance), `--dangerously-skip-permissions` (no protection), and manual prompts, which users accept 93% of the time. Auto mode is pitched as a replacement for the skip-permissions flag, not for careful manual review.

## Key points
- Manual prompts: users accept 93%.
- Users' two escapes from fatigue: the sandbox, or `--dangerously-skip-permissions`.
- Deployed classifier: 0.4% false positives on real traffic; 17% false negatives on real overeager actions (n=52); 5.7% on synthetic exfiltration.
- Anthropic says itself that for a careful manual reviewer, auto mode is "arguably a regression".

## Excerpts
> "This keeps users safe, but it also means a lot of clicking "approve." Over time that leads to approval fatigue, where people stop paying close attention to what they're approving."

> "Users have two solutions for avoiding this fatigue: a built-in sandbox where tools are isolated to prevent dangerous actions, or the --dangerously-skip-permissions flag that disables all permission prompts and lets Claude act freely, which is unsafe in most situations."

> "Bypassing permissions is zero-maintenance but offers no protection. Manual prompts sit in the middle, and in practice users accept 93% of them anyway."

> "The 17% false-negative rate on real overeager actions is the honest number."

> "Auto mode is meant to replace --dangerously-skip-permissions without bringing back interruptions."

## Relevance to the talk
The vendor's own statement of both halves of "Everyone clicks yes": prompts get rubber-stamped (93%), and the popular escape is a flag that turns every check off. Source of the deck's ~93% and ~17% figures.
