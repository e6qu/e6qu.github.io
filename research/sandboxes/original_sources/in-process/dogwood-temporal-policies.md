---
title: "Dogwood" (reference interpreter README) and "Temporal policies" (Amazon Bedrock AgentCore Developer Guide)
url: https://github.com/dogwood-policy/dogwood
authors: AWS (dogwood-policy org); AgentCore docs by AWS
date: repo created 2026-07-27; AWS launch August 2026 (per AgentCore docs, launch coverage on InfoQ/The New Stack, and the MPI pitfalls repo); docs page as accessed
accessed: 2026-11-22
kind: repo
---

## Summary
Dogwood is AWS's open-source policy language for agent tool calls. It is a superset of Cedar that adds temporal conditions over the agent's recent event history: `formerly within`, `since within`, `once`, and `count`/`sum` aggregations. With it a gateway can enforce rules such as "pay only if this claim was approved in the last hour" or "at most N refunds per window". Policies lower to plain Cedar. The temporal predicates become `context.*` slots that the engine fills at runtime from the recorded history. AgentCore Policy enforces Dogwood at its Gateway, scoped to a caller-supplied policy session. The open-source repo is explicitly a **reference interpreter, "NOT intended for production use"**.

## Key points
- Every valid Cedar policy is valid Dogwood. Deny by default; forbid overrides permit.
- **Information providers:** computed facts injected at evaluation time, written as Rhai scripts or supplied as AgentCore integrations such as Bedrock Guardrails. There is a Lean 4 formal spec (`dogwood-lean/`), "checked against the crate".
- **AgentCore specifics** (docs): history is per *policy session*, identified by the `x-amzn-bedrock-agentcore-policy-session-id` header, **which the caller generates**. Changing a temporal policy invalidates open sessions (HTTP 409). Quotas: 20 temporal policies per engine, 3 temporal operators per policy, 24 h maximum window. A denied action is recorded as `error`, not `response`. Self-referential counts include the current request.
- **Docs-stated weakness:** "Because temporal history is scoped to a session and the session ID is supplied by the caller … Starting a new session begins a new count." An agent, or whoever controls the session header, can reset a rate limit by opening a new session.
- **Reference interpreter caveats** (README): it does not validate timestamps or authenticate events. Events must populate both the `logged` and `request_context` bags, or checks "silently" weaken, and action-name mismatches make temporal predicates silently not match. The in-memory trace has no eviction and is lost on crash. The `net` feature's `http_get` does "NO host or IP validation" (an SSRF risk to 169.254.169.254). Rhai provider scripts have no CPU or memory limits by default.
- **Third-party failure study** (mpi-dsg/temporal-policy-pitfalls, Nov 2026, "One approval, one refund"): nine encodings of one rule, replayed over seven histories. Eight of the nine refuse a refund the rule requires, and six of those eight pass the toolchain "clean". The most natural encoding, which counts settled refund *responses*, **pays twice** when the agent retries before the first refund's response arrives. The gateway sees the `request` before the outcome, so in-flight actions are invisible to the count. *(Small research repo, 2 stars; findings reproduced by its script, not independently re-run here.)*
- Search-result summaries (InfoQ, The New Stack) report that temporal conditions lose Cedar's automated-reasoning analysis. *Unverified against a primary AWS statement.*
- **Deployment with OS isolation:** `strands-agents/box` (Rust, macOS/Linux) "combines OS isolation with default-deny Dogwood policies and credential injection". In other words, Dogwood is being paired with an OS sandbox rather than replacing one.

## Excerpts
> "This reference interpreter is **NOT** intended for production use." (README)

> "Because temporal history is scoped to a session and the session ID is supplied by the caller, a `count`-based limit such as 'at most N calls per session' counts only the events recorded for that session." (AgentCore docs, Security considerations)

## Relevance to the talk
This is the "temporal extension to Cedar" named in the talk. Stateful policy over a tool-call trace is a real step beyond per-request ACLs. It is still a reference monitor at the tool boundary, though, and it inherits that position's blind spots: it does not see data provenance, it sees requests before their outcomes (the double-refund race), and its state can be reset by whoever owns the session identifier. These are the same time-of-check/time-of-use and "mirror the OS state" problems Garfinkel described for syscall interposition (`../history/garfinkel-2003-traps-and-pitfalls.md`), now at the tool-call layer.
