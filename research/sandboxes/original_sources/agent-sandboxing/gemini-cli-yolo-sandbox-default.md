---
title: "Gemini CLI configuration reference and CLI reference" (google-gemini/gemini-cli docs)
url: https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md
also: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/cli-reference.md
authors: Google (google-gemini/gemini-cli contributors)
date: living documents at main; read 2026-11-23
accessed: 2026-11-23
kind: docs
---

Note: consumer access to Gemini CLI ended 2026-06-18 (see [gemini-cli-sandbox.md](gemini-cli-sandbox.md)); the docs and repo remain.

## Summary
Gemini CLI's sandbox is off by default. Its YOLO approval mode (`--yolo`, now `--approval-mode=yolo`) auto-approves every tool call; the docs say the sandbox is turned on by default when YOLO is used, the one agent here that couples "no prompts" with "a box". Per-tool sandboxing (`security.toolSandboxing`) also defaults to false. Admins can disable YOLO mode.

## Key points
- "Sandboxing is disabled by default"; enable with `--sandbox`/`-s`, `GEMINI_SANDBOX`, or `tools.sandbox` (default `undefined`).
- "Sandbox is enabled when using `--yolo` or `--approval-mode=yolo` by default." Not checked against source.
- `security.toolSandboxing` default `false`.
- `--yolo` / `-y`: default `false`, "Deprecated. Auto-approve all actions."
- `security.disableYoloMode`: "Disable YOLO mode, even if enabled by a flag."
- YOLO cannot be set from settings files, only from the command line.

## Excerpts
> "Sandboxing is disabled by default, but you can enable it in a few ways:" (configuration.md, Sandboxing)

> "Sandbox is enabled when using `--yolo` or `--approval-mode=yolo` by default." (configuration.md, Sandboxing)

> "`--yolo` | `-y` | boolean | `false` | **Deprecated.** Auto-approve all actions. Use `--approval-mode=yolo` instead." (cli-reference.md)

> "YOLO mode (auto-approve all actions) can only be enabled via command line (--yolo or --approval-mode=yolo)." (configuration.md)

## Relevance to the talk
Off by default, one flag to drop prompts. The Nx malware (2025) ran `gemini --yolo` ([nx-s1ngularity-ai-cli-malware.md](nx-s1ngularity-ai-cli-malware.md)), so an off switch is also an attacker's on switch.
