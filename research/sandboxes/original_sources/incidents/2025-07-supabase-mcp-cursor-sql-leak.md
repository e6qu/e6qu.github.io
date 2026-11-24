---
title: "Supabase MCP can leak your entire SQL database"
url: https://www.generalanalysis.com/blog/supabase-mcp-blog
authors: Rez Havaei, Rex Liu, Maximilian Li (General Analysis)
date: 2025-07-08
accessed: 2026-11-22
kind: blog
agent: Cursor agent + Supabase MCP server
incident_date: 2025-07-08 (publication)
category: exfiltration
cve: none
sandbox_at_time: none relevant. The MCP server connected with the project's `service_role` key, which bypasses Row-Level Security. Cursor asked for approval of tool calls, but the developer had to judge SQL queries hidden in a long agent run
exploited_in_wild: no; demonstration with dummy data
---

## Summary
A customer-support app built on Supabase stored tickets in a table that a developer's Cursor agent could query through the Supabase MCP server. The attacker opened a support ticket whose text was addressed to "the Cursor agent". Later the developer asked Cursor to look at the latest open ticket. The agent read the message as instructions, ran SQL against the `integration_tokens` table (OAuth tokens and session credentials), and inserted the results as a new message in the same ticket thread, where the attacker read them. No SQL injection was involved, only an over-privileged agent reading untrusted rows.

## Key points
- The lethal trifecta in one MCP server: untrusted input (ticket text), private data (the whole database via `service_role`), and an outbound channel (writing back to a table the attacker can read).
- The support staff's own role *could not* read `integration_tokens`. The privilege came from the developer's agent.
- The authors' mitigations: scope the MCP server to one project (`project_ref`), run read-only (`read_only=true`), restrict tool groups (`features`), review tool calls, keep sensitive data out of the assistant's reach. They note that read-only still allows reading everything the role can see.
- The authors did not re-run the demo against the current Supabase server.

## Excerpts
> "The failure occurs when the model treats instructions inside retrieved data as authority to act."

> "Read-only SQL prevents the database write used to return secrets through the ticket in this demonstration."

## Would a mature sandbox have stopped it?
**No, not a process sandbox. Credential isolation and least privilege would have.** Everything happened through an allowed API using a legitimate credential, so no filesystem rule or network allowlist sees it, and the exfil "egress" is a database write. What would have stopped it is credential scoping: an agent-specific database role without `service_role`, read-only and limited to the tables the task needs. Isolating the MCP server from the developer's admin credentials helps too. These controls existed as options on the Supabase MCP server but were not the defaults the demo used. Per-call approval existed but failed in practice because a malicious `SELECT` looks routine. Compare [invariant-github-mcp-exploit.md](../agent-sandboxing/invariant-github-mcp-exploit.md): the same shape, with GitHub in place of Postgres.

## Relevance to the talk
The clearest example that the boundary which matters for MCP-era agents is around *credentials and data*, not syscalls. The talk can pair it with the Invariant GitHub case under the heading "the sandbox can't see this".
