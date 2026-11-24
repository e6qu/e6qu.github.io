---
title: "Capybara Claw: An always-running agent, yet trustworthy and secure" (README, docs/design.md, docs/roadmap.md)
url: https://github.com/lampepfl/capybaraclaw
authors: EPFL LAMP (design doc by Yichen Xu, 2026-04-20); contributors include lbialy (Łukasz Biały, VirtusLab), Linyxus (Yichen Xu), Gedochao, Florian3k, warcholjakub
date: repo created 2026-04-14; last push 2026-10-12
accessed: 2026-11-22
kind: repo
---

## Summary
CapybaraClaw is an always-on, OpenClaw-style personal and team assistant (CLI and Slack, with WhatsApp, Matrix, Telegram, email and others on the roadmap) whose only action tool is a TACIT REPL (`evaluate_scala`). The goal stated in the design doc is "provably-safe behaviours": the LLM has to express intentions as capability-safe Scala, and unsafe actions such as leaking private data "should be rejected at the type level". On top of TACIT it adds per-person roles and grants: who may be *asked* for which permission (files, exec, network, plugins) is set in an operator-owned `identities.json`. The README marks it "Highly experimental … Not yet suitable for production use."

## Key points
- **Architecture** (design doc): a provider-agnostic Completion API, a tool-calling agent loop, and `ClawAgent`, which owns a TACIT `ReplSession` and exposes it as `evaluate_scala`. The system prompt is built from TACIT's bundled `Interface.scala`. A Gateway multiplexes Ports (Slack, CLI) into per-session agents, and SQLite with FTS5 stores transcripts.
- **Repo-level facts:** it depends on a locally published `tacit`. TACIT issue #12 records a TACIT tag mismatch that made CapybaraClaw crash. The default model is `minimax/minimax-m2.7` via OpenRouter, and Anthropic, OpenAI and Ollama are also supported. `execution_timeout_ms` defaults to 120 s.
- **Roles and grants** (README): a role's `may` lists permission patterns (`files:read`, `exec` with items such as `git`, `sbt`, `network:fetch`, `plugin:<id>/<permission>`). A request is shown only to the person whose turn triggered it, and only if their roles allow it. A grant applies to that person in that session only. The terminal operator may be asked for anything.
- **Self-protection:** agent code must never reach `~/.claw`, because whoever can write `identities.json` can give themselves any role. CapybaraClaw refuses to start if the state directory and the workdir overlap (symlinks resolved), and agent code sees the state directory as read-only and classified.
- **Stated limit:** "Per-person grants are not data isolation". Data fetched under one person's grant stays in the shared session context and REPL, where others in the same Slack thread can see it.
- **Plugins.** Roles can grant `plugin:<id>/<permission>`, and a test preamble uses `@scala.caps.assumeSafe`. The roadmap wants a hub (`claw install plugin-name`) for TACIT extensions. Plugins are therefore `@assumeSafe` trusted libraries. *Unverified: whether a published plugin API spec exists beyond the tests and roles; I saw no separate plugin doc in `docs/`.*
- **Roadmap:** more connectors, auto-compaction and "dreaming" memory, web search, browser/computer control, sub-agent teams, and "finer-grained permission system … scoped to its origin (port, thread, user)".
- **Announcement:** no VirtusLab blog post or press announcement for CapybaraClaw was found (*unverified beyond the repo and the talk*).

## Excerpts
> "LLMs must express their intentions in a formal language (which is Scala). Then, all the type level analysis mechanics that have been there for decades come to help reasoning about the **safety** of LLM actions." (docs/design.md)

> "Grants limit what each person's turns may do, not what everyone in a conversation sees … Per-person grants are not data isolation" (README, People and roles)

## Relevance to the talk
This is the in-process class applied to the hardest agent shape: a long-running, multi-user, chat-connected "claw" agent of the kind whose incidents fill `../incidents/`. It shows two things. The type-level harness still has to be supplemented by ordinary access-control plumbing (roles, operator-owned config kept out of the agent's reach). And the guarantees are per-value inside one REPL, not per-user. One shared REPL session is one security domain, which is the in-process version of "one process = one trust domain".
