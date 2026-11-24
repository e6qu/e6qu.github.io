---
title: "OpenAPPA: Deterministic guardrails that don't break agents" (repo and site), with "APPA: Recoverable Information-Flow Control for Real-World LLM Agents" (arXiv 2607.24625)
url: https://github.com/archestra-ai/OpenAPPA
authors: Archestra (archestra-ai); paper by Arseny Kravchenko, Vadim Liventsev, Innokentii Konstantinov, Ildar Iskhakov, Matvey Kukuy
date: repo created 2026-08-18 (last push 2026-11-21); arXiv v1 2026-07-27, v2 2026-08-26; accepted to NeurIPS 2026 Workshop on Agents in the Wild (per README)
accessed: 2026-11-22
kind: repo
---

## Summary
This is the project transcribed as "Open APPA" in the talk. OpenAPPA (APPA = Agentic Permissions Policy Algebra) is a deterministic information-flow reference monitor placed between an agent and its tools. It runs either in-process, embedded in the agent, or as a sidecar and MCP gateway. Its labels sit on the **whole trajectory/session**, not on individual values. A label has an *audience* (who may read the data seen so far) and a *trust* level (who could have written it), and both only tighten as the agent works. Each tool has a contract (`delta`, `forwards`, `requires`, `effects`) checked before the call. A blocked call is not simply aborted: the policy offers **remedies**, namely sanitizers, an authority's one-off approval, a narrower audience, a withheld result, or a disposable sub-agent read that returns only a shape-bounded result. The paper calls this "recoverable IFC".

## Key points
- **Labels** (how-it-works page): audience + trust; also **effects** (which accumulate, e.g. "email sent") and **attention** (approval for one action, which does not accumulate). "The security label can become more restrictive as the agent works, but it cannot become less restrictive."
- **Policy** is declarative TOML. The engine decides from the event log alone and makes no network or file calls, so decisions are deterministic and replayable (`appa replay` for CI).
- **Remedies** take the place of declassification: a sanitizer cleans data so that the result may go where the original could not. Remedies can fail or be denied, in which case the action stays blocked.
- **Paper** (abstract): a dual-phase reference monitor at tool dispatch and protocol gateways (MCP). It checks label restrictions and workflow history *before* a call and validates realised outputs *after*, before they are admitted to context. It adds "gradual security typing with bounded cast resolution" for unannotated tools and "on-demand trajectory confinement", where child branches absorb taint and exit via `attest-schema`. Claimed proofs: no-laundering, branch isolation, recovery containment. 6,600 episodes; 64.2–91% utility; zero observed attacks in 1,320 guarded episodes.
- **Self-published benchmarks** (openappa.com/evaluation). Bench-Corp has 20 enterprise workflows × 3 models; AgentThreatBench is the OWASP agentic set in UK AISI's inspect_evals. OpenAPPA: 88–90% completion, 0% attack success. "FIDES (Microsoft)": 37–45% completion, 28–35% attack success (headline 41% / 31%). "Claude Code auto mode": headline 90% / 10%. Ablation: OpenAPPA *without guided recovery* falls to 35.0% completion (GPT-5.6 Luna). This is the source of the "~30–40% task completion" figure in the talk: it describes FIDES on Bench-Corp, or APPA without recovery, i.e. plain monotone IFC.
- **Caveats on those numbers:** self-reported by the vendor; FIDES and Auto configurations are not documented; the Claude Code comparison is single runs with Sonnet 5, where OpenAPPA reaches only 75% completion; on τ-banking (not an attack benchmark) OpenAPPA was within about 1 point of the stock agent (151 vs 156 / 388).
- **Status:** "preview and an RFC … config and wire surfaces may break without shims". An Archestra LLM-proxy release candidate implements it for Claude Code, Cursor, Codex, OpenCode and Copilot CLI.

## Excerpts
> "OpenAPPA sits between an agent and its tools and answers one question before every action: **is this data allowed to go to this destination?**" (README)

> "conventional IFC relies on monotone taint tracking that either over-blocks benign operations or permanently strands downstream execution once an agent ingests unvetted data." (arXiv abstract)

## Relevance to the talk
This is the third data-flow system the talk names after CaMeL and FIDES, and the one aimed most squarely at utility: its argument is that monotone, session-wide taint makes IFC agents useless (around 35–40% completion) unless there is a sanctioned way back down. Within the in-process class it is the coarse-grained end of the IFC sub-type: one label per trajectory instead of TACIT's per-value types or CaMeL's per-value capabilities. Recovery is therefore a policy-mediated declassification, and its safety rests on the sanitizers and authorities being right. All headline comparisons are vendor-run, so flag them as such.
