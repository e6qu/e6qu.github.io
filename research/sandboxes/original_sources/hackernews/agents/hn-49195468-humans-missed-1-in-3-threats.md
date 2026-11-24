---
title: "Humans missed 1 in 3 threats approving AI agent commands across 40k game runs"
url: https://news.ycombinator.com/item?id=49195468
story_url: https://scalex.dev/blog/ai-agent-permissions-stats/
points: 340
comments: 245
authors: HN thread (submitted by Wirbelwind, the game's author); companion Show HN 48308376 "Continue? Y/N: A 60-second game about AI agent permission fatigue" (386 points, 162 comments)
date: 2026-08-06
accessed: 2026-11-22
kind: discussion
---

## Summary
In May 2026 the author shared a 60-second browser game that simulates approving an agent's permission prompts ([Show HN 48308376](https://news.ycombinator.com/item?id=48308376)). After 40k plays and 409k decisions he reported that players missed one in three threats even though they were warned up front, and that the history above `npm run` commands was mostly ignored. Both threads discuss whether human approval is a security model at all. Commenters called it a liability model, "monitor blindness", and argued for OS-level ACL prompts ("npm run build tried to read your Chrome cookie database") instead of command-level prompts.

## Key points
- Data: 40k plays, 409k decisions, about 33% of threats approved, with the warning shown up front.
- Several commenters reframed approvals as moving responsibility onto the user rather than providing security.
- In the game thread, dns_snek proposed asking about effects instead of commands: per-access prompts from an OS sandbox instead of "allow `npm run build` forever".
- Codex's separate reviewer agent and Claude's auto-approver were described as the industry's answer, and some users turn them off to save tokens.

## Excerpts
> "Even with the warning up front, 1 in 3 threats were missed, and the history log above npm run commands seems to be typically ignored." — Wirbelwind ([49195471](https://news.ycombinator.com/item?id=49195471))

> "It's really not designed as much of a security model as a liability model. When the AI isn't responsible for the decisions, a whole category of liability goes away." — stingraycharles ([49197789](https://news.ycombinator.com/item?id=49197789))

> "In ops we call it monitor blindness. Just constant asks get annoying and folks just want to make it stop" — walt_grata ([49197849](https://news.ycombinator.com/item?id=49197849))

> "Less: Do you want to run 'npm run build'? More: 'npm run build' tried to read your Chrome cookie database, do you want to allow that?" — dns_snek ([48316140](https://news.ycombinator.com/item?id=48316140))

> "--dangerously-skip-permissions is the only way to fly. Of course your environment needs to be properly containerized and autobackup set up, so even rm -rf from your harness would do nothing." — atemerev ([48311157](https://news.ycombinator.com/item?id=48311157))

> "A tool that pushes people into permissions fatigue is in fact the proper recipient of the blame." — chuckadams ([48310338](https://news.ycombinator.com/item?id=48310338))

## Relevance to the talk
This is the one quantitative data point on approval fatigue from HN, and it is slide-ready: "1 in 3 threats approved". It explains why vendors sell sandboxes as prompt reducers (Anthropic cites 84% fewer prompts) and why the control has to move from the prompt to the boundary.
