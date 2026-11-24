---
title: "Cedar: A New Language for Expressive, Fast, Safe, and Analyzable Authorization"
url: https://arxiv.org/abs/2403.04651
authors: Joseph W. Cutler, Craig Disselkoen, Aaron Eline, Shaobo He, Kyle Headley, Michael Hicks, Kesha Hietala, Eleftherios Ioannidis, John Kastner, Anwar Mamat, Darin McAdams, Matt McCutchen, Neha Rungta, Emina Torlak, Andrew Wells (AWS)
date: arXiv 2024-03-07 (extended version); Proc. ACM Program. Lang. 8, OOPSLA1 (2024)
accessed: 2026-11-22
kind: paper
---

## Summary
Cedar is AWS's open-source authorization policy language. Policies are `permit`/`forbid` rules over (principal, action, resource, context). A request is allowed only if some `permit` applies and no `forbid` does: deny by default, and forbid overrides permit. The language was designed to have a sound and complete logical (SMT) encoding, so that policy sets can be analysed, for example to prove that a refactoring did not change permissions. It was modelled and proved in Lean, implemented in Rust, and checked against the model by differential random testing. In agent stacks it is the engine behind Amazon Bedrock AgentCore Policy, which checks each tool call at the gateway.

## Key points
- Supports RBAC, ABAC and ReBAC-style patterns, with optional typing through a schema-based validator.
- Analysability was a design constraint: the language is kept restricted enough to allow a "sound and complete logical encoding".
- Verification: Lean model with proofs of key properties, Rust implementation, and differential random testing between them.
- Compared with OpenFGA and Rego: "(subjectively) … equally or more readable policies, but (objectively) performs far better".
- **Agent use:** Bedrock AgentCore Policy uses Cedar at the AgentCore Gateway (see `dogwood-temporal-policies.md`). The TACIT paper criticises this as a second language to coordinate that "offer[s] little more than access lists", and says it cannot express "this sub-computation must be side-effect free".
- **Limit for agents:** Cedar evaluates each request on its own and is stateless. It cannot express "only after approval" or "at most N per hour" without outside state, which is the gap Dogwood fills. Like any gateway policy, it sees the call and its arguments, not where the data in those arguments came from.

## Excerpts
> "Cedar's design has been finely balanced to allow for a sound and complete logical encoding, which enables precise policy analysis, e.g., to ensure that when refactoring a set of policies, the authorized permissions do not change." (Abstract)

> "We have modeled Cedar in the Lean programming language, and used Lean's proof assistant to prove important properties of Cedar's design." (Abstract)

## Relevance to the talk
Cedar is the "verified policy language" end of the tool-gateway sub-type. The *policy engine* is formally verified, but the guarantee covers only per-request access control at the point where the agent calls a tool. Use it to contrast access control (which call is allowed) with the information-flow designs (CaMeL, FIDES, APPA, TACIT's `Classified`), which ask where the data in a call came from and where it may go.
