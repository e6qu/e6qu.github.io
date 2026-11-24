---
title: "Programmatic tool calling"
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling
authors: Anthropic
date: docs page undated (read live); requires code execution tool version `code_execution_20260120` or later
accessed: 2026-11-22
kind: docs
---
Read via the official Claude Platform docs tool. Related: code execution tool docs,
https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool ; Anthropic
engineering post "Advanced tool use" (linked, not read).

## Summary
Programmatic tool calling (PTC) lets Claude write Python that calls the developer's tools as async
functions, executed in Anthropic's code execution container. When the code calls a tool, execution
pauses, the API returns a `tool_use` block (with a `caller` naming the code-execution run), the
client supplies the result, and the code resumes; only the final output enters Claude's context.
This is the code-against-bindings pattern, but the isolation is a managed **container**, not an
in-process interpreter, and the tools themselves run on the client with the client's authority.

## Key points
- Opt-in per tool with `allowed_callers: ["code_execution_20260120"]`; tools appear to code as async
  functions taking a dict and returning a string (`asyncio.gather` allowed).
- `allowed_callers` "is not a hard API-level block on direct calls... Do not rely on `allowed_callers`
  as a security boundary."
- Containers: new per request unless reused; checkpointed after ~5 min inactivity; expire 30 days after
  creation; a pending tool call times out after ~4 minutes (`TimeoutError` inside the code).
- Restrictions: MCP-connector tools and computer/browser-use toolsets cannot be called programmatically;
  `strict: true` tools unsupported; tool results for programmatic calls must be text.
- Numbers (Anthropic's own evals): +11% average on agentic search benchmarks with 24% fewer input
  tokens; ~38% fewer billed input tokens on a 75-tool benchmark; ~8% *more* cost on τ²-bench where
  calls are sequential; 20-40% typical savings for requests with 10-49 tools.
- "Alternative implementations" section compares client-side direct execution ("Runs untrusted code
  outside of a sandbox"), self-managed sandboxed execution (e.g. no network egress; needs an IPC
  protocol for tool calls), and Anthropic-managed execution.
- Security note in docs: tool results are strings that may contain code; validate external results
  against code injection.
- Not eligible for ZDR; container data retained up to 30 days. Not available in Managed Agents.

## Excerpts
> "Programmatic tool calling allows Claude to write code that calls your tools programmatically within a code execution container, rather than requiring round trips through the model for each tool call." — intro

> "`allowed_callers` controls how the tool is presented to Claude and is validated against `tool_choice`, but it is not a hard API-level block on direct calls." — "The `allowed_callers` field"

> "Runs untrusted code outside of a sandbox" — "Alternative implementations", disadvantage of client-side direct execution

## Relevance to the talk
**Code-against-typed-bindings, but NOT in-process isolation.** Same idea as Cloudflare Code Mode /
Pydantic AI Code Mode / LangChain PTC (tools surfaced as functions, model writes glue code), but the
guest runs in a full Linux container with Python and Bash, so the "no real OS" property of the
in-process class does not hold; the boundary is the container. Worth showing because it separates two
axes that are often conflated: *how the agent reaches authority* (bindings/RPC back to the host) vs
*what isolates the code* (interpreter vs isolate vs container). The docs' own warning that
`allowed_callers` is guidance, not enforcement, is a nice example of "presentation is not policy".
