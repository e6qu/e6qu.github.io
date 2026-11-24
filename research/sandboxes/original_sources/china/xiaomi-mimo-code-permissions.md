---
title: MiMoCode Permissions Reference — XiaomiMiMo/MiMo-Code (packages/cli/src/skill/builtin/.bundle/mimocode-docs/reference/permissions.md)
url: https://github.com/XiaomiMiMo/MiMo-Code
authors: Xiaomi MiMo team
date: repo created 2026-06-10; release v0.1.17 2026-11-13; agent.ts defaults last changed 2026-11-18
accessed: 2026-11-22
kind: repo
---

## Summary
MiMo Code is Xiaomi's open-source terminal coding agent (MIT, about 13.8k stars). It reads OpenCode-style config and can load `.opencode/skills`. It has a rule-based permission layer (`allow` / `ask` / `deny`, glob-keyed per tool) and no OS sandbox. The default `build` agent starts from `"*": "allow"`, so shell commands run without asking unless the user adds rules. Exceptions: reads of `.env` files, paths outside the project, and doom-loop detection prompt, and destructive bash is "forced-ask". The docs point users to containers or sandboxes for unattended `--yolo` runs. The only in-process sandbox is a QuickJS-in-Wasm runtime for deterministic "workflow" scripts.

## Key points
- Isolation unit: none for agent tools. Commands run as the user on macOS, Linux and Windows (one-line installers for all three). I found no Seatbelt, bwrap or Landlock code in the tree. `packages/cli/src/workflow/sandbox.ts` is a QuickJS (`quickjs-emscripten`) sandbox for workflow orchestration scripts, with a default 64 MiB memory cap and 12 h deadline. It does not apply to bash.
- Default permissions (`packages/cli/src/agent/agent.ts`):
  - `"*": "allow"`, `doom_loop: "ask"`, `external_directory: { "*": "ask" }`.
  - `read`: `*.env` asks.
  - README: "**build** | Default. Full tool permissions for development". `plan` is read-only analysis.
- Escape hatches:
  - `mimo --dangerously-skip-permissions` / `--yolo`, `/skip-permissions` at runtime, and `MIMOCODE_DANGEROUSLY_SKIP_PERMISSIONS=1`.
  - The TUI shows a one-time red confirmation, "skipped when there is no TTY, so in CI / piped-stdin the dangerous mode activates with no confirmation".
  - Under skip-all, forced-ask operations (e.g. destructive bash) auto-reject after 60 s.
- Network: `webfetch` and `websearch` are permission keys. Shell network access is unrestricted.
- Per-OS behaviour: identical, since there is no OS layer.

## Excerpts
> "For trusted, disposable environments (containers, sandboxes, CI) you can auto-approve everything the agent does." (permissions.md, Skipping permission prompts)

> "This is dangerous — a malicious prompt, file, or plugin can then run arbitrary commands without confirmation. Only use it where you fully trust the workspace." (permissions.md)

> "Semantics: an **allow-all base is injected UNDER your config**, so a tool with *no* rule auto-approves." (permissions.md)

## Relevance to the talk
MiMo Code is one of the most-starred Chinese coding CLIs of 2026, and like OpenCode, which it follows, it has no sandbox. Its defaults allow everything, and isolation is left to "containers, sandboxes, CI". It belongs in the "approval prompts are not a sandbox" group with ZCode and Kimi Code CLI.
