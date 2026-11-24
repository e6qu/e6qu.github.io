---
title: "Auto mode is now the default in Claude Code for Pro, Max, Ultra, and Team plans"
url: https://claude.com/blog/auto-mode-default-in-claude-code
authors: Anthropic (Claude blog, product update)
date: 2026-08-07 (update note dated 2026-10-22)
accessed: 2026-11-23
kind: blog
---

Note: the URL now redirects to https://claude.com/resources/articles/auto-mode-default-in-claude-code. HN discussion: [hackernews/agents/hn-49239021-auto-mode-default-claude-code.md](../hackernews/agents/hn-49239021-auto-mode-default-claude-code.md).

## Summary
Anthropic's announcement that new Claude Code sessions on Pro, Max and Team plans start in auto mode from 2026-08-14. The case is built on usage data that manual review has become a habit: 97% of permission prompts approved, 3% rejected (against 39% of plans rejected), half of CLI users with a broad Bash allow-rule, and a quarter of interactive sessions started with every check off. A study with 1,053 paid testers measured how often people catch one dangerous prompt swapped into a session: 13.6%, falling from ~17% early in a session to ~5% after 50 prompts.

## Key points
- 97% of permission prompts approved; 3% rejected. Plans presented for approval: 39% rejected.
- June 2026: 49.5% of active CLI users had made a Bash allow-rule; 5% allow any shell command; 43% have interpreter rules like `Bash(python:*)`, "essentially equivalent in practice"; growing ~5 points every 5 weeks.
- 62% of users have used bypassPermissions or clicked "don't ask again" on Bash; 25% of interactive sessions start in bypass mode.
- Controlled study (1,053 paid testers, one prompt swapped for a clearly dangerous command): humans caught 143 (13.6%), auto mode 937 (89%).
- Habituation inside one session: ~17% caught early, ~5% after 50+ prior prompts.
- Customer quote: Gusto adopted auto mode because fatigue was pushing engineers to bypass permission checks entirely.
- Caveats: vendor data from a vendor selling the alternative; testers knew they were in a study; no artefact to inspect.

## Excerpts
> "Data suggests that manual review can become habitual: users approve 97% of permission prompts in Claude Code."

> "an approval rate that high suggests many users are clicking through reflexively rather than reviewing each command."

> "Beyond allow-rules, 62% of users have used bypassPermissions or clicked "don't ask again" on Bash, and 25% of interactive sessions start in bypass permissions mode."

> "In a controlled experiment with 1,053 paid professional testers, human review caught just 13.6% of dangerous commands, while auto mode caught 89%."

> "As sessions got longer, humans did worse: they blocked about 17% of dangerous commands early in a session, dropping to about 5% after 50 or more prior prompts"

> "Gusto adopted auto mode to end the permission fatigue that was pushing engineers toward bypassing permissions checks entirely."

## Relevance to the talk
The strongest single source for the section: both "optional security" (a quarter of sessions start with checks off; half of users have allow-rules that amount to "run anything") and "fatigue" (13.6% caught; ~17% falling to ~5% within one session, the same curve as the 2017-2018 habituation studies). Note the figure moved from 93% (March post) to 97% (August post).
