---
title: "ATC: A Minimal Agent With Tracked Capabilities"
url: https://github.com/lampepfl/atc
authors: EPFL LAMP (lampepfl)
date: repo created 2026-08-17; last push 2026-11-20
accessed: 2026-11-22
kind: repo
---

## Summary
ATC is a terminal coding agent built on TACIT's design, so you do not have to wire an MCP server into Claude Code or a similar agent. Its only action tool is a Scala 3 REPL. Every snippet is compiled with capture checking and safe mode before it runs, and the host also checks configured permissions at runtime (deny by default, with per-request pop-ups and once/session grants). Its README has the clearest "Security model" section in this family. It spells out what the type system enforces and what it does not: any allowed external command is arbitrary code run with the user's privileges.

## Key points
- **Three layers:** capture checking limits which capabilities a snippet can retain; safe mode limits which APIs it can call; the host checks permissions at runtime. "Deny wins": `denyCommands` and `denyHosts` override every allow, session grant, open scope, and `--approve-all`.
- **Modes as types.** Read-only mode hands the sandbox a `FileSystem^{io.rd}`. A write needs `FileSystem^{any}`, so the attempt fails *at compile time* with a capture-set error, and the agent explains the failure to the user.
- **Scoped escalation.** `requestExec(Set("npm *"), "reason"){…}` raises a pop-up (allow once / for the session / deny / tell the agent what to change). The grant cannot be stored, returned or captured beyond the block, and the host closes the scope on exit.
- **Validator rejects `@assumeSafe` in agent code** (`CodeValidator.scala`: "@assumeSafe may only be used by the library").
- **Claimed fix of the termination leak.** Classified computations that fail are "not turned into a one-bit oracle", in contrast to the open TACIT issue #15. The README also says Classified flow is "termination-insensitive" and that timing and resource side channels are not covered.
- **Stated limits** (README, "Assumptions and limits"):
  - "You are trusted; the model is not." ATC does not protect the machine from a permissive configuration.
  - "An allowed command is arbitrary code, run with your privileges, outside the sandbox." A permitted `bash`, `python`, `node`, `make`, or a `git` that runs hooks "can do anything you can". Even `git status` runs programs named in repository config, so `.git` is kept read-only.
  - Allowed hosts can receive any data the agent holds, including classified data via `httpPostClassified` and secret headers.
  - Everything that is not classified goes to the model provider.
  - TCB: "The JVM, the Scala compiler and its capture checker, the OS, the terminal library, the agent library's host implementation, and ATC itself are trusted … Capture checking and safe mode are experimental compiler features."

## Excerpts
> "An allowed command is arbitrary code, run with your privileges, outside the sandbox. The capability system governs the Scala the model writes, not what a program you permitted then does." (Security model › Assumptions and limits)

> "Calling a method without the required capability is a compile error, so the restriction is a typing rule applied before the code runs." (Security model › Enforced restrictions)

## Relevance to the talk
This is what the in-process class looks like as a real product: a coding agent with no shell, only a typed REPL. Its README is the best primary statement of the class's central trade-off. Inside the language you get strong, even information-flow, guarantees. The moment the agent needs `npm test` or `git`, you are back to an ordinary process with ambient authority, and you need an OS or VM sandbox around it. That is why "no arbitrary binaries" is both the strength and the compatibility cost of this class.
