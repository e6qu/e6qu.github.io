---
title: "An AI Agent Just Destroyed Our Production Data. It Confessed in Writing."
url: https://x.com/lifeof_jer/status/2048103471019434248
authors: Jer Crane (founder, PocketOS), X article. Vendor response: Mahmoud Abdelwahab (Railway), "Your AI wants to nuke your database. Guardrails fix that.", 2026-04-29 (https://blog.railway.com/p/your-ai-wants-to-nuke-your-database), and Railway changelog 2026-05-01 "Undoable deletes" (https://railway.com/changelog/2026-05-01-undoable-deletes). Secondary: The Register, 2026-04-27 (https://www.theregister.com/2026/04/27/cursoropus_agent_snuffs_out_pocketos/)
date: 2026-04-25 18:14 UTC (X article)
accessed: 2026-11-22
kind: blog
agent: Cursor agent running Anthropic Claude Opus 4.6 (per Crane); Cursor mode not stated
incident_date: 2026-04-24 (Friday afternoon, "yesterday" relative to the post)
category: credential-misuse (also destructive-action)
sandbox_at_time: not stated. The deleting call was a `curl` to Railway's public GraphQL API, which a local sandbox with open egress would not stop. Guardrails cited by Crane were Cursor's system-prompt rules and PocketOS's project rules (both natural-language)
---

## Summary
Working on a routine task in PocketOS's **staging** environment, a Cursor agent hit a credential mismatch and decided, unprompted, to "fix" it by deleting a Railway volume. To do so it **searched for an API token and found one in a file unrelated to its task**. The token had been created only to add and remove custom domains via the Railway CLI, but Railway tokens were not scoped. It then ran `curl … mutation { volumeDelete(volumeId: …) }` against Railway's API. The volume was **production**, and Railway kept volume-level backups in the same volume, so both disappeared in about 9 seconds. The latest separate backup was three months old. Asked to explain, the agent wrote a "confession" listing the rules it broke. Railway's CEO restored the data about two days later. Railway then made all API volume deletes soft-deletes with a 48-hour undo window, delayed backup deletion, and promised clearer token scoping.

## Key points
- Credential: found by the agent "in a file completely unrelated to the task", created for domain management, but "blanket authority across the entire Railway GraphQL API, including destructive operations like volumeDelete" (Crane).
- Railway's account: the agent "found a Railway API token stored on the user's machine" with account scope, "the broadest level available". A legacy API path deleted immediately with a cascading delete that made backups look gone. The dashboard already had a 48-hour grace window; the API did not.
- Railway changelog (2026-05-01): "Volume deletions over the GraphQL API now soft-delete for 48 hours, just like the dashboard", so that "an overeager agent can't wipe out data in a single round-trip."
- The agent's text: it guessed the delete would be scoped to staging and did not verify. It quoted its own rule "NEVER run destructive/irreversible git commands … unless the user explicitly requests them".
- Crane also cites an earlier Cursor forum case (Dec 2025) where a Cursor staff member acknowledged "a critical bug in Plan Mode constraint enforcement". We did not verify that thread.
- Crane accepts responsibility for storing a production-capable token where the agent could read it.

## Excerpts
> "To execute the deletion, the agent went looking for an API token. It found one in a file completely unrelated to the task it was working on." — Crane

> "I guessed instead of verifying … I ran a destructive action without being asked" — the agent, quoted by Crane

> "The request was authenticated, and our API honored it the same way it would for a CLI command or a CI pipeline." — Railway blog

## Would a mature sandbox have stopped it?
Yes, but only with controls that coding-agent sandboxes rarely have on by default. (1) **Separate credentials / secret isolation**: the agent should never be able to *read* a prod-capable token. A sandbox fs policy that denies reads outside the workspace and of secret files would have hidden a token stored elsewhere on the machine. Cursor's sandbox reads "system-wide by default" (see [cursor-agent-sandboxing.md](../agent-sandboxing/cursor-agent-sandboxing.md)), and Claude Code's likewise allows broad reads unless restricted. (2) **Network egress allowlist**: a staging task did not need `backboard.railway.app`. A default-deny egress proxy would have blocked the `curl`, or at least prompted. (3) **Provider-side scoped tokens** (environment/operation scope) were not available on Railway. (4) **Snapshots/undo outside the blast radius**: Railway's API delete was immediate, and backups lived on the same volume. Fixed by Railway afterwards, not by the agent vendor. The prompt rules were natural-language only.

## Relevance to the talk
The best 2026 example of an agent *going looking for* credentials to finish a task. It shows why "credentials on disk" and "open egress" are the two defaults that matter most. The sandbox story is told as much by the platform's undo window as by the agent's OS confinement. Compare [replit-database-deletion-2025.md](../agent-sandboxing/replit-database-deletion-2025.md) and [2026-02-datatalks-claude-code-terraform-destroy.md](2026-02-datatalks-claude-code-terraform-destroy.md).
