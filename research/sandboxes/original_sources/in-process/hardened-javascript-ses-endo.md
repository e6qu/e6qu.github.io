---
title: "SES" (packages/ses/README.md, Endo) + Endo README + "Containing AI Agents: The Endo Familiar Demo"
url: https://github.com/endojs/endo/tree/master/packages/ses
authors: Endo / Agoric / MetaMask contributors (Kris Kowal, Mark S. Miller et al.); demo article by Decentralized Cooperation Foundation (DCF)
date: README read live (main, 2026-11-21); TC39 SES proposal Stage 1 (last TC39 discussion 2020-02); Compartments proposal Stage 1 (2020-03, revisited 2022-07); DCF article 2026-04-22
accessed: 2026-11-22
kind: repo
---
Also: https://github.com/endojs/endo (README), https://github.com/tc39/proposal-ses ,
https://github.com/tc39/proposal-compartments , https://dcfoundation.io/containing-ai-agents-the-endo-familiar-demo/ (read via fetch-and-extract tool).
Advisories: https://github.com/advisories/GHSA-9c4h-3f7h-322r (CVE-2023-39532),
https://github.com/advisories/GHSA-h9w6-f932-gq62 (CVE-2025-32792).

## Summary
Hardened JavaScript (the `ses` shim) makes a JS realm safe for mutually suspicious code in one
process: `lockdown()` freezes and tames the shared intrinsics, `harden()` deep-freezes object graphs,
and `Compartment`s give each guest its own global object with no ambient authority (no `fetch`,
no `Date.now`, no `Math.random`). Authority is then handed in explicitly as endowments: the
object-capability model. MetaMask (Snaps, LavaMoat) and Agoric use it in production. In 2026 the Endo
project demoed "the Familiar", an LLM user agent whose generated code runs in compartments holding
only capabilities the user granted.

## Key points
- Single-guest claims (after `lockdown`): guest initially reaches only its compartment's
  `globalThis`; cannot modify shared primordials; cannot perform I/O; "cannot measure the passage of
  time at any resolution".
- Explicit non-claims: a guest "can execute for an indefinite amount of time", "allocate arbitrary
  amounts of memory", detect endianness, and on some engines observe stack contents (occluded on V8
  and SpiderMonkey, not JavaScriptCore). So no availability guarantees.
- Timing/side channels: compartments omit `Date.now`/`Math.random` because they are covert channels;
  hosts "must avoid exposing `SharedArrayBuffer`" (it builds a high-resolution timer); a guest that
  needs a high-res timer should get its own OS process. The README does not discuss Spectre by name
  (searched; Unverified whether other Endo docs do), but its timer guidance is the standard
  Spectre-style mitigation and it says `ses` "combines well with coarser boundaries".
- Reentrancy: shared objects run guest code on the host's stack (accessors, proxy traps), enabling
  reentrancy attacks; hosts should interact with guest objects on a clean stack via promises.
- TCB: hardware, OS, hypervisor, memory manager, a conformant JS engine with no extra host behaviour
  (Node's `domain` is a known exception, so incompatible), any debugger, and any JS run before
  `lockdown`. Audited June 2021 (4 weeks, 3 engineers).
- Known escapes: CVE-2023-39532 (critical): `{...import(specifier)}` gave a no-endowment guest the
  host's dynamic import; in Node, data-URL imports made this arbitrary execution. CVE-2025-32792
  (high, fixed in ses 1.12.0): top-level `const`/`let`/`class` bindings of a page's `<script>` leaked
  into compartment lexical scope through the scope proxy. Older: realms-shim breakout (2019,
  GHSA-6jg8-7333-554w).
- Standards: TC39 "SES (Secure EcmaScript)" and "Compartments" are both Stage 1 per tc39/proposals
  (stage-1 list). Endo README says LavaMoat "generates reviewable policies" for dependency
  capabilities "and enforces those policies at runtime with Endo".
- Agent work (DCF article, 2026-04-22, Kris Kowal demo): agent "lal" starts with one capability;
  file access is a directory mount that cannot climb above its root; the LLM writes a program that
  runs in a compartment and returns a narrower (read-only) capability; capabilities have petnames and
  are revoked by dropping the reference. The article calls it a working prototype, not a product.

## Excerpts
> "SES safely executes third-party JavaScript 'strict' mode programs in compartments that have no excess authority in their global scope." — SES README, intro

> "However, such a program can: execute for an indefinite amount of time, allocate arbitrary amounts of memory, detect the platform endianness" — SES README, "Security claims and caveats" (list flattened)

> "The compartment is the safety mechanism, not the trust in the model." — DCF, "Containing AI Agents: The Endo Familiar Demo"

## Relevance to the talk
The **object-capability** sub-type in its most principled form: no ambient authority at all, and
authority = references. It is finer-grained than any OS sandbox (per object, per plugin) and runs
ordinary JS with high library compatibility. What it guarantees: integrity and confidentiality of
what you did not hand over, within one realm. What it does not: availability (infinite loops, memory),
side channels/timing (mitigated only by withholding clocks), and correctness of the host's
endowments (a hardened `fs` that can write anywhere is still `fs`). Escape history shows the TCB is the
whole JS engine plus subtle language features (spread + dynamic import). Cost for coding agents: JS
only, no processes, no shell, no native modules; useful as the policy layer for tool composition, not
as a place to run `npm test`.
