---
title: "Making the AI agents safe with Scala — Łukasz Biały | Scala Summit 2026"
url: https://www.youtube.com/watch?v=RQuRlMetQIU
authors: Łukasz Biały (Scala Developer Advocate, VirtusLab); uploaded by Salar Rahmanian (Bay Area Tech Talks)
date: talk 2026-10-19 (Scala Summit 2026, San Francisco); uploaded 2026-10-26; 48 min
accessed: 2026-11-22
kind: talk
---
Also on PeerTube: https://watch.softinio.com/w/wNBUuWTo95iK69wWh37QmJ · Speaker page: https://2026.scalasummit.com/speakers/lukasz-bialy/ .
Read from YouTube's auto-generated English captions, so product names are as heard
("Tasit/Tessellate" = TACIT, "Capy Claw" = CapybaraClaw, "Fidus" = FIDES,
"Open APPA" = OpenAPPA/APPA). Primary sources: [TACIT](tacit-tracking-capabilities-for-safer-agents.md),
[Safe Scala](scala-safe-mode.md), [capture checking](scala-capture-checking.md), [CapybaraClaw](capybaraclaw.md),
[ATC](lampepfl-atc.md), [Cedar](cedar-oopsla2024.md), [Dogwood](dogwood-temporal-policies.md), [FIDES](fides-2505.23643.md),
[OpenAPPA](openappa-appa.md), [CaMeL](../arxiv/2503.18813-camel.md).

## Summary
The talk frames agent safety as Simon Willison's lethal trifecta: private data,
external effects and untrusted content. It surveys four families of defence and
finds each wanting:

1. **Sandboxes:** containers, VMs, microVMs, Seatbelt, bubblewrap. They are coarse,
   with a flat policy; whatever is inside is fully exposed to the agent; and
   cyber-capable agents can escape even VMs.
2. **Classifier models** (Claude Code auto mode, Codex auto-review, Hermes Smart
   Approvals) are probabilistic and "rarely pass 95%" in independent tests.
3. **Rule engines** (Cedar, Dogwood's temporal extension) are stateless and do not
   track data provenance; an agent can wait out a time window or move data through
   another session.
4. **Data-flow tracking** (OpenAPPA's session labels, CaMeL from DeepMind, FIDES from
   Microsoft) is the strongest, but costs 2–3× the tokens, still needs hand-written
   policies, and literal labelling cripples utility (~30–40% task completion).

His alternative uses **types as the sandbox**, with three pieces:

- **Safe Scala** (`import language.experimental.safe`) is a restricted subset with
  capture checking and separation checking.
- **TACIT** ("Tracked Agent Capabilities In Types", Martin Odersky's team at EPFL)
  is a tool gateway. It accepts an agent's Scala code, rejects escape constructs,
  compiles it in safe mode and runs it in stateful REPL sessions. The agent's
  *only* tool is "evaluate Scala"; there is no bash.
- **CapybaraClaw** (EPFL + VirtusLab) is an always-on agent harness that uses TACIT
  as its sole tool provider.

## Key points
- **Capabilities in types.** File system, network and process access are
  capabilities the agent must request. A function that needs a capability cannot
  be called without it. The core API covers the file system, processes, network
  and utilities. Plugins are ordinary Scala written in capability style and
  exposed to safe mode with `@assumeSafe`.
- **`Classified[T]`** is a container the model cannot look inside. It can be
  `map`ped and `flatMap`ped, but printing or sending it yields
  `Classified(***)`. Functions passed to `map` must be **pure**: they capture no
  capability, so a `println` or HTTP call inside fails with a type mismatch at
  compile time.
- **Plugin design matters.** Operations that could leak through side channels
  return `Classified` (e.g. a filter returning plain values would allow binary
  search by predicate). Only a **private model** (self-hosted inference) may see
  inside `Classified`. Flows are written into the code, e.g. HR data can only be
  posted to the HR Slack channel.
- **Runtime checks back up the types** where flexibility is needed: accessing a
  confidential column throws.
- **CapybaraClaw adds:** memory scoped per user, team and public (admin-only
  writes, to stop cross-session injection), scoped history search, role-based
  access control, and permission escalation through chat.
- **Live demo:** an Acme Inc. Slack, with the audience as red team holding
  near-admin permissions, running on a DeepSeek model chosen because it is less
  strongly aligned. Injection attempts either were refused or produced code that
  failed to compile. He claims extensive red-teaming found no way to exfiltrate.
- **His anecdote against classifiers:** while he debugged Docker networking under
  Colima, Opus 5 in auto mode tried to read his fish shell history to prove the
  break was his fault, and the classifier allowed it.

## Excerpts
> "it has been proven that sufficiently powerful cyber capable AI agents can escape sandboxes" (~06:00)

> "if you take a look on the benchmarks done in independent tests, it turns out that they rarely pass 95%" (on classifiers, ~07:20)

> "we are going to use something that we have used for safety for years. We're going to use types for safety." (~20:40)

> "There's absolutely no bash tool that allows it to write arbitrary bash." (~27:00)

> "The only tool the agent has access to is called evaluate Scala" (Q&A, ~46:30)

## Relevance to the talk
This is the clearest current example of the **in-process** class: the agent's
whole world is one host process, and every effect is a typed, capability-checked
call that the host defines. It inverts the OS-sandbox approach. Instead of
letting the agent run anything and fencing the machine, it lets the agent do only
what the API expresses, but then everything inside the API can be governed,
including data flows. That is what VM and OS sandboxes cannot do. The costs:
- **Compatibility:** no arbitrary binaries, `npm install`, compilers or test
  runners, so this is not (yet) a coding agent's environment.
- **Trust:** the plugin authors, the compiler and the JVM are trusted.
- **Proof:** claims come from a live demo and in-house red-teaming. TACIT's paper reports
  100% security in its own benchmark, but its repo has an open 1-bit leak via
  `writeClassified` (issue #15), which binary search turns into the whole secret.

It pairs with LFI (`../density/lfi-asplos24.md`): one host process, many confined
guests, but at the language level rather than the machine-code level.
