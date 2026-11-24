---
title: "An AI agent deleted our production database. The agent's confession is below"
url: https://news.ycombinator.com/item?id=47911524
story_url: https://twitter.com/lifeof_jer/status/2048103471019434248
points: 860
comments: 1032
authors: HN thread (submitted by jeremyccrane, the post's author)
date: 2026-04-26
accessed: 2026-11-22
kind: discussion
---

## Summary
HN's largest agent-incident thread by comment count. A founder reported that Cursor (running Claude Opus 4.6), working on a *staging* task, found a Railway CLI token in the environment and called `volumeDelete`. The token had been created only to manage custom domains, but Railway tokens are not scoped ("every token is effectively root"), and because backups lived in the same volume, production data went with it. The post blamed both vendors and quoted the agent's "confession". HN mostly blamed the operators: a credential with blanket authority was within the agent's reach, there was no sandbox, and there were no separate backups. A follow-up essay, "AI didn't delete your database, you did" ([48022742](https://news.ycombinator.com/item?id=48022742), 545 points), made that the headline.

## Key points
- The chain was task in staging, then the agent discovered an unrelated credential, then that credential had destructive power across environments, then backups were co-located and deleted too.
- The core failure is credentials in reach plus unscoped tokens, not a sandbox escape. Several commenters generalise this to IaaS/SaaS APIs that make least privilege hard.
- Asking the agent "why did you do that" and treating the answer as a confession was criticised as misunderstanding how models work.
- Agent-side prevention, short of approving every command: keep credentials outside the agent's environment, inject them through a proxy, and use sandboxes that hold no production secrets.

## Excerpts
> "I'm sorry this happened to you, but your data is gone. Ultimately, your agents are your responsibility." — Invictus0 ([47911637](https://news.ycombinator.com/item?id=47911637))

> "They asked the LLM to do something on the staging environment, it chose to delete a staging volume using an API key that it found. But the API key was generated for something else entirely and should not have been scoped to allow volume deletions…" — rahoulb ([47911784](https://news.ycombinator.com/item?id=47911784))

> "> Tokens are not scoped by operation, by environment, or by resource at the permission level. There is no role-based access control for the Railway API — every token is effectively root." — oskarkk, quoting the post ([47913358](https://news.ycombinator.com/item?id=47913358))

> "On the agent side of things, how would one prevent this, short of manually approving all terminal commands?" — qnleigh ([47912102](https://news.ycombinator.com/item?id=47912102))

> "It's also the API design of many IaaS/SaaS providers. It's often extremely hard to limit tokens to the right scope, if even possible." — andix ([47912980](https://news.ycombinator.com/item?id=47912980))

> "I consider users asking a coding agent 'why did you do that' to be illustrating a misunderstanding in the users mind about how the agent works. It doesn't decide to do something and then do it, it just outputs text." — pierrekin ([47911720](https://news.ycombinator.com/item?id=47911720))

## Relevance to the talk
The 2026 successor to Replit (July 2025), and a stronger example. It shows that "credentials must stay outside the sandbox" is the decisive design principle: no file or process sandbox would have helped once a root-equivalent API token was readable. It supports the talk's point about credential-injecting proxies (srt mask mode, Docker Sandboxes, nono, OneCLI).
