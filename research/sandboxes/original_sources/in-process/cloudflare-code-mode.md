---
title: "Code Mode: the better way to use MCP" (+ "Sandboxing AI agents, 100x faster" and "Code Mode: give agents an entire API in 1,000 tokens")
url: https://blog.cloudflare.com/code-mode/
authors: Kenton Varda and Sunil Pai (Code Mode; Dynamic Workers); Matt Carey (Code Mode MCP)
date: 2025-09-26 (Code Mode); 2026-02-20 (Code Mode MCP); 2026-03-24 (Dynamic Workers open beta)
accessed: 2026-11-22
kind: blog
---
Follow-ups read: https://blog.cloudflare.com/code-mode-mcp/ ,
https://blog.cloudflare.com/dynamic-workers/ ,
https://developers.cloudflare.com/changelog/post/2026-03-24-dynamic-workers-open-beta (search snippet only),
https://developers.cloudflare.com/dynamic-workers/usage/egress-control/ ,
https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/ .
Pages were read through a fetch-and-extract tool; quotes below are as returned by it.

## Summary
Code Mode converts an agent's MCP tools into a TypeScript API and has the model write code against
that API instead of emitting tool calls one by one. The code runs in a freshly loaded V8 isolate via
the (then closed-beta) Dynamic Worker Loader API; the isolate gets no general Internet access and
reaches the outside only through bindings, i.e. pre-authorised RPC stubs supplied by the host, so it
never sees API keys. In 2026 Cloudflare extended this: a Code Mode MCP server exposing the entire
Cloudflare API (2,500+ endpoints) through two tools, and Dynamic Workers in open beta for all paid
Workers users.

## Key points
- Mechanism (2025): MCP schemas → TypeScript interfaces; LLM writes code; code runs in a new isolate
  per snippet; MCP servers are exposed as bindings. Network blocked with `globalOutbound: null`
  in the Worker Loader call. Developer docs: `globalOutbound` "intercepts every `fetch()` and
  `connect()` call the dynamic Worker makes"; with `null`, "Any `fetch()` or `connect()` call from
  the dynamic Worker throws an exception."
- Credentials: the binding is "an already-authorized client interface", so the AI "cannot possibly
  write code that leaks any keys". In 2026 the outbound callback also allows credential injection
  (agent never holds the secret).
- Performance claims: isolate start "in a handful of milliseconds using only a few megabytes of
  memory" (2025); "around 100x faster and 10x-100x more memory efficient than a typical container"
  (2026). Isolate per snippet, disposable.
- Security posture (2026 post): acknowledges "security bugs in V8 are more common than security bugs
  in typical hypervisors" and says defence-in-depth layers and Spectre defences are needed around
  isolates.
- Code Mode MCP (2026-02-20): Cloudflare API has "over 2,500 endpoints"; native MCP tools would cost
  ~1.17 M tokens; Code Mode server uses "around 1,000 tokens" via two tools, `search()` and
  `execute()`, both running "inside a Dynamic Worker isolate"; isolate has no filesystem and no env
  vars; external fetches disabled by default; OAuth 2.1 downscoped tokens. (The post body also says
  "over 2 million tokens" in one place; figures differ.)
- Dynamic Workers open beta 2026-03-24; pricing $0.002 per unique Worker loaded per day plus normal
  CPU/invocation pricing, waived during beta (from changelog/search summary; Unverified exact wording).
- Limits stated: agent must write JavaScript/TypeScript ("The only catch, vs. containers"); Python and
  Wasm technically possible but slower; Dynamic Workers expect pre-bundled modules (npm deps via
  `@cloudflare/worker-bundler`). Original 2025 post: the whole API was loaded into context and the
  loader was in closed beta. No arbitrary binaries, no shell, no OS filesystem.

## Excerpts
> "Convert the MCP tools into a TypeScript API, and then ask an LLM to write code that calls that API." — Code Mode (2025), intro

> "The sandbox is totally isolated from the Internet. Its only access to the outside world is through the TypeScript APIs representing its connected MCP servers." — Code Mode (2025), "Running code in a sandbox"

> "The only catch, vs. containers, is that your agent needs to write JavaScript." — Sandboxing AI agents, 100x faster (2026)

## Relevance to the talk
The reference design for **code-against-typed-bindings** with **object-capability** flavour: authority
equals the set of bindings passed into the isolate; there is no ambient network, FS or env.
Guarantees: no egress except via host-controlled bindings/outbound hook; secrets stay host-side;
per-snippet disposable isolate. Costs: JS/TS only, pre-bundled code, no shell/git/package manager,
so it's for orchestration and API work, not repo-editing coding agents. Failure modes: the boundary
is V8 (Cloudflare itself says V8 bugs are commoner than hypervisor bugs, hence its extra layers and
Spectre work); and the bindings are full-power RPC: a binding that can delete resources makes code
that deletes resources (confused deputy / prompt injection through tool results is untouched).
Note: "in-process" here means "inside the Workers runtime process alongside other isolates", which
Cloudflare hardens with process-level and Spectre mitigations it controls.
