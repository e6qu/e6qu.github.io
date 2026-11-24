---
title: Sandboxing AI agents, 100x faster (Dynamic Workers / Dynamic Worker Loader)
url: https://blog.cloudflare.com/dynamic-workers
authors: Kenton Varda, Sunil Pai (Cloudflare) — per page sidebar
date: 2026-03-24 (open beta; API first announced Sept 2025 in the Code Mode post)
accessed: 2026-11-22
kind: blog
---

## Summary
Cloudflare's Dynamic Worker Loader lets a Worker create new Workers at runtime from code strings — e.g. code an LLM wrote ("Code Mode": agents write code that calls APIs instead of making tool calls). Each runs in its own V8 isolate with no ambient authority: it gets only the bindings (RPC stubs) the parent passes, and outbound HTTP can be blocked or intercepted. The post claims isolates are ~100× faster to start and 10–100× more memory-efficient than containers, and concedes that V8 bugs are more common than hypervisor bugs, so Cloudflare layers extra defences.

## Key points
- Isolation unit: V8 isolate (JS first; "Workers (including dynamic ones) can use Python and WebAssembly", but for small snippets JS "will load and run much faster").
- Numbers (vendor): "An isolate takes a few milliseconds to start and uses a few megabytes of memory" — "around 100x faster and 10x-100x more memory efficient than a typical container", which takes "hundreds of milliseconds to boot and hundreds of megabytes of memory".
- Scale claim: no global limit on concurrent sandboxes or creation rate (contrasted with container sandbox providers); scenario of a million requests/s each loading its own Dynamic Worker.
- Capabilities: sandbox receives only APIs passed in (example: "Give agent access to the chat room API"); `globalOutbound: null` blocks internet; or a callback intercepts every request, e.g. to inject credentials so the agent "never knows the secret credentials".
- Security admissions/defences: "security bugs in V8 are more common than security bugs in typical hypervisors"; V8 patches to production "within hours"; extended V8 sandbox; "custom second-layer sandbox with dynamic cordoning of tenants"; Spectre research collaborations.
- Pricing: "$0.002 per unique Worker loaded per day" plus CPU/invocations; waived during beta.
- See also agent-sandboxing/cloudflare-sandbox-sdk.md (Dynamic Workers vs microVM Containers in one product) and virtualization/cloudflare-workers-security-model-2020.md.

## Excerpts
> "An isolate takes a few milliseconds to start and uses a few megabytes of memory."

> "That's around 100x faster and 10x-100x more memory efficient than a typical container."

> "security bugs in V8 are more common than security bugs in typical hypervisors."

## Relevance to the talk
Strictly a V8-isolate (language VM) sandbox rather than Wasm, but it is the same class — in-runtime, capability-passing isolation — and the strongest production example of it being sold *for agent code* in 2026. Gives the density/startup numbers for the class (ms, MB) and the honest counterweight (engine bugs; needs defence in depth; Spectre — cite virtualization/v8-sandbox-2024.md and spectre-is-here-to-stay-2019.md). Fits only "agent writes a short program against APIs", not "agent runs `npm install` and a test suite".
