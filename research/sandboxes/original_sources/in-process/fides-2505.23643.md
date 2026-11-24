---
title: "Securing AI Agents with Information-Flow Control" (FIDES), with "Stop prompt injection from hijacking your agent, new security capabilities now released within Agent Framework"
url: https://arxiv.org/abs/2505.23643
authors: Manuel Costa, Boris Köpf, Aashish Kolluri, Andrew Paverd, Mark Russinovich, Ahmed Salem, Shruti Tople, Lukas Wutschitz, Santiago Zanella-Béguelin (Microsoft); blog by Eduard van Valkenburg and Shruti Tople
date: arXiv v1 2025-05-29, v2 2025-09-03; code github.com/microsoft/fides (created 2025-05-23); Agent Framework blog 2026-05-20
accessed: 2026-11-22
kind: paper
---

## Summary
FIDES (Flow Integrity Deterministic Enforcement System) is Microsoft Research's information-flow-control planner for agents. Every message and tool result carries a confidentiality label and an integrity label. The planner tracks the label of its own context and deterministically blocks tool calls whose policy the current label violates. To avoid the usual IFC failure, where one untrusted read taints the whole run, FIDES *hides* tool results whose labels would raise the context label in variables, passes them by reference, and lets them be *inspected* only through a quarantined, tool-less LLM with constrained (schema-typed) output. In 2026 this shipped as experimental middleware in Microsoft Agent Framework (Python).

## Key points
- **Formal model and guarantees:** dynamic taint tracking gives **non-interference for integrity** (untrusted data cannot trigger consequential tools) and only **explicit secrecy for confidentiality**. Implicit flows through the choice or order of tool calls are deliberately allowed, "a pragmatic compromise". This makes it weaker than TACIT's local purity on confidentiality.
- **Selective hiding:** a result is put into a variable only when adding it to the conversation would raise the context label, which keeps as much as possible visible to the planner.
- **Constrained inspection:** `query_llm` lets the planner ask an isolated LLM about a variable using an output schema enforced by constrained decoding. The result comes back as a new (still labelled) variable.
- **Task taxonomy:** the paper classifies tasks by which planner can do them securely. Tasks whose next action depends on reading untrusted content cannot be done under strict integrity by the basic or variable-passing planners.
- **Evaluated on AgentDojo;** the abstract claims it "enables us to complete a broad range of tasks with security guarantees". *Exact utility deltas not extracted here.*
- **Agent Framework integration** (blog, 2026-05-20): `LabelTrackingFunctionMiddleware` and `PolicyEnforcementFunctionMiddleware`; tools declare `accepts_untrusted` / `max_allowed_confidentiality`; `store_untrusted_content` replaces untrusted text with `var_<id>`; `quarantined_llm`; `approval_on_violation=True` turns blocks into human approvals. Ships in `agent-framework-core` ≥ 1.3.0 under `agent_framework.security`, "experimental on purpose".
- **Stated limits** (blog): labels are opt-in per source, and **an unlabeled tool is treated as trusted and public**; most-restrictive-wins propagation is conservative; approval prompts are coarse; the quarantined LLM is single-turn and tool-free.
- **Third-party comparison** (OpenAPPA's self-published benchmark, see `openappa-appa.md`): FIDES completed 37–45% of Bench-Corp tasks and let 28–35% of attacks through. These figures come from a competitor, and the FIDES configuration they used is not documented.

## Excerpts
> "we present Fides, a planner that tracks confidentiality and integrity labels, deterministically enforces security policies, and introduces novel primitives for selectively hiding information." (Abstract)

> "By making a pragmatic compromise between utility and practical attacks and allowing confidential data to influence control flow decisions, we achieve explicit secrecy for confidentiality" (§1)

## Relevance to the talk
FIDES is the Microsoft entry in the IFC/dual-LLM sub-type, next to CaMeL (`../arxiv/2503.18813-camel.md`) and f-secure (`../arxiv/2409.19091-f-secure-ifc.md`). Like CaMeL, the "sandbox" here is the agent runtime itself: a planner loop that holds the labels and the variable store and decides what reaches the model and the tools. It is in-process in the user's sense. Nothing is isolated at the OS level, and the guarantee is about which data may cause which tool call. Its weak points come with that design: unlabeled tools default to trusted, implicit flows are allowed, and blocking costs utility.
