# In-process — the agent's whole world is one host process

The fourth class of the taxonomy ([../../taxonomy.md](../../taxonomy.md)). The
agent never reaches the OS: every effect is a call into an API that the host
process defines. The host can therefore govern not only *which resources* the
agent touches but *which values flow where*. Software fault isolation (LFI, NaCl,
Wahbe 1993) belongs here too and is covered in
[../density/](../density/README.md) and [../history/](../history/README.md).
CaMeL, f-secure and Progent are in [../arxiv/](../arxiv/README.md).

## Index

The talk that prompted this folder:
- [bialy-scala-summit-2026-safe-agents.md](bialy-scala-summit-2026-safe-agents.md) — Łukasz Biały, Scala Summit 2026: Safe Scala + TACIT + CapybaraClaw; sandboxes vs classifiers vs rule engines vs data-flow tracking.

Language capabilities and types:
- [tacit-tracking-capabilities-for-safer-agents.md](tacit-tracking-capabilities-for-safer-agents.md) — EPFL, arXiv 2603.00991 + `lampepfl/tacit`: the agent's only tool is a safe-mode Scala REPL; `Classified[T]` with pure functions; 100% security on its own benchmark; open 1-bit leak (issue #15).
- [scala-safe-mode.md](scala-safe-mode.md) — `language.experimental.safe`: the restricted subset (release status unclear: 3.8.3 notes vs "nightly only").
- [scala-capture-checking.md](scala-capture-checking.md) — Capturing Types (TOPLAS 2023), arXiv 2207.03402 and 2509.07609; separation checking.
- [lampepfl-atc.md](lampepfl-atc.md) — ATC, a terminal coding agent on TACIT; its README says any `exec`'d command (git, npm) runs outside the guarantee.
- [capybaraclaw.md](capybaraclaw.md) — always-on agent harness (EPFL + VirtusLab) with TACIT as its only tool provider; scoped memory, RBAC.
- [hardened-javascript-ses-endo.md](hardened-javascript-ses-endo.md) — SES/Endo object capabilities for JS, applied to agents; CVE-2023-39532, CVE-2025-32792.
- [deno-permissions.md](deno-permissions.md) — Deno's permission flags; its docs recommend seccomp or VMs as well; Deno Sandbox is a microVM product.

History of language-based confinement:
- [miller-2003-capability-myths-demolished.md](miller-2003-capability-myths-demolished.md) — Miller, Yee, Shapiro: capabilities vs ACLs.
- [miller-2006-robust-composition.md](miller-2006-robust-composition.md) — Miller's thesis, the E language and object capabilities.
- [mettler-wagner-2010-joe-e.md](mettler-wagner-2010-joe-e.md) — Joe-E, a capability-safe subset of Java; taming libraries is part of the TCB.
- [google-caja.md](google-caja.md) — Caja: 25 advisories, several "complete breach"; archived 2021.
- [safe-haskell-2012.md](safe-haskell-2012.md) — Safe Haskell: `Safe`/`Trustworthy`, under deprecation discussion.

Restricted interpreters:
- [pydantic-monty.md](pydantic-monty.md) — Monty, a Python subset interpreter in Rust for AI-written code.
- [smolagents-local-python-executor.md](smolagents-local-python-executor.md) — Hugging Face's AST-restricted executor; CVE-2025-5120, CVE-2025-9959, CVE-2026-4963; "no local python sandbox can ever be completely secure".
- [pydantic-mcp-run-python.md](pydantic-mcp-run-python.md) — Pyodide in Deno; archived after CVE-2026-25905 (JS-bridge escape) and CVE-2026-25904 (SSRF).
- [langchain-sandboxes.md](langchain-sandboxes.md) — langchain-sandbox (Pyodide, archived) and Deep Agents' sandbox backends.

Simulated environments and code against bindings:
- [vercel-just-bash.md](vercel-just-bash.md) — bash reimplemented in TypeScript over a virtual FS; a hard-link escape (GHSA-g5pf-mh4h-h655).
- [cloudflare-shell.md](cloudflare-shell.md) — `@cloudflare/shell`: a just-bash fork for six days (0.0.2), then a JS-in-isolate filesystem API, deprecated for `@cloudflare/computer`.
- [cloudflare-code-mode.md](cloudflare-code-mode.md) — agents write TS against typed bindings in a Dynamic Worker; `globalOutbound: null`.
- [anthropic-programmatic-tool-calling.md](anthropic-programmatic-tool-calling.md) — code calls tools from Anthropic's code-execution container (a container, so *not* in-process isolation; listed for contrast).

Policies and information flow at the tool boundary:
- [cedar-oopsla2024.md](cedar-oopsla2024.md) — Cedar (AWS), a verified, analyzable authorization language.
- [dogwood-temporal-policies.md](dogwood-temporal-policies.md) — Dogwood, Cedar with temporal conditions, in Bedrock AgentCore Policy (Aug 2026); caller-supplied session IDs reset limits.
- [fides-2505.23643.md](fides-2505.23643.md) — Microsoft FIDES: labels plus a planner; integrity non-interference; unlabeled tools are treated as trusted.
- [openappa-appa.md](openappa-appa.md) — OpenAPPA / APPA (arXiv 2607.24625): trajectory labels (audience × trust) with "remedies" to recover utility.

## Synthesis

The in-process class has five sub-types:

1. **Language capabilities and types:** TACIT/ATC/CapybaraClaw, E, Joe-E, Caja,
   SES/Endo, Safe Haskell.
2. **Restricted interpreters:** Monty, smolagents, Pyodide runners.
3. **Simulated environments:** just-bash.
4. **Code against typed bindings in an isolate:** Code Mode. This sub-type
   straddles the Wasm/isolate class.
5. **Information-flow and dual-LLM runtimes at the tool boundary:** CaMeL, FIDES,
   APPA, with Cedar and Dogwood as the access-control-only baseline.

All of them can promise things OS and VM sandboxes cannot. There is **no ambient
authority**: effects happen only through capabilities that cannot be forged.
Labels can decide **which value may reach which sink**. Only the Scala line adds
compile-time purity, so a secret inside `Classified[T]` cannot reach a sink even
through code the agent writes itself.

The costs and failures repeat across all of them:

- **Compatibility.** One language or a subset, no bash, no arbitrary binaries.
  The moment the agent needs `git`, `npm` or a compiler, those run outside the
  guarantee. ATC and the TACIT paper both say to add an OS sandbox for defence in
  depth.
- **The trusted base grows sideways.** Tamed libraries, `@assumeSafe` plugins,
  `Trustworthy` modules, the JVM or V8, and experimental compiler features all
  become trusted.
- **Escapes are frequent in interpreters.** smolagents has three CVEs (one with no
  patch), mcp-run-python was archived after two, just-bash had a hard-link escape,
  SES has two CVEs, Caja had 25 advisories, and TACIT has an open 1-bit leak.
- **Side channels are out of scope.** Timing, termination and exceptions (TACIT
  #15) are not covered, and Spectre applies to everything in one address space.
- **Utility versus strictness.** Monotone taint leaves 35–45% task completion
  (FIDES, and APPA without recovery), so systems add "remedies" or approvals, which
  then reopen the hole. Policies are hand-written, and natural policies can be
  wrong.

All benchmark figures here are self-reported by the systems' authors.

For the talk, this class has the answer to the lethal trifecta *in principle*,
but not a coding agent's environment *in practice*. The realistic design is
layered: an in-process policy layer for the data that matters, around an
OS-level or VM sandbox for the tools that need a real machine.
