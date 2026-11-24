---
title: "Supabase MCP can leak your entire SQL database"
url: https://news.ycombinator.com/item?id=44502318
story_url: https://www.generalanalysis.com/blog/supabase-mcp-blog
points: 848
comments: 470
authors: HN thread (submitted by rexpository); linked research by General Analysis (URL changed by mods from Simon Willison's write-up)
date: 2025-07-08
accessed: 2026-11-22
kind: discussion
---

## Summary
General Analysis showed that a developer using Cursor with the Supabase MCP server (connected as `service_role`, which bypasses row-level security) could be made to leak the `integration_tokens` table. The trigger was an attacker filing a support ticket that contained instructions addressed to the agent. Simon Willison answered dozens of replies explaining why this is the lethal trifecta and not an ordinary bug: there is no fix in the database layer, LLM-based filters can be prompt-injected themselves, and the only mitigation is to remove a leg (read-only access, no combination with tools that can communicate externally).

## Key points
- Attack chain: attacker-controlled ticket text, then the agent reads it with privileged DB access, then it writes the secret back into the ticket thread the attacker can see.
- `service_role` bypasses RLS, so per-user permissions give no protection once the developer delegates to the agent.
- Willison's mitigations: read-only MCP, and care about which other MCPs are mixed in (anything that can make HTTP requests completes the trifecta).
- The thread's recurring point: prompt injection, unlike SQL injection, has no parameterised-query fix, and "it might work well enough" detectors are not acceptable for data theft.

## Excerpts
> "LLMs are incapable of reliably distinguishing the difference between instructions from their users and instructions that might have snuck their way in through other text the LLM is exposed to." — simonw ([44502685](https://news.ycombinator.com/item?id=44502685))

> "If you show me an app with a SQL injection hole or XSS hole, I know how to fix it. If your app has a prompt injection hole, the answer may turn out to be 'your app is fundamentally insecure and cannot be built'" — simonw ([44503005](https://news.ycombinator.com/item?id=44503005))

> "If a prompt injection detector fails just once to prevent a prompt injection attack that causes your LLM system to leak your private data to an attacker, you've lost that data." — simonw ([44505319](https://news.ycombinator.com/item?id=44505319))

> "Using LLMs to filter requests to LLMs is a flawed strategy because the filtering LLM can itself be tricked by a specially crafted prompt injection." — simonw ([44510561](https://news.ycombinator.com/item?id=44510561))

> "The cursor assistant operates the Supabase database with elevated access via the service_role, which bypasses all row-level security (RLS) protections. This is too bad." — yard2010 ([44502764](https://news.ycombinator.com/item?id=44502764))

## Relevance to the talk
This shows why a process sandbox alone does not solve agent security. The exploit runs entirely through legitimate, allowed channels (an MCP connection and a ticket system), so the only defences are capability removal and credential scoping, which the sandbox design has to make easy.
