---
title: Sandbox Configuration (docs_en/features/sandbox.md) — iflow-ai/iflow-cli; plus the iFlow CLI farewell post (Chinese-language page)
url: https://github.com/iflow-ai/iflow-cli/blob/main/docs_en/features/sandbox.md
authors: iFlow (Xinliu), Alibaba
date: sandbox doc last changed 2025-10-15; farewell post 2026-03-20; service shut down 2026-04-17; last npm build @iflow-ai/iflow-cli 0.5.19 (registry modified 2026-05-12)
accessed: 2026-11-22
kind: repo
---

## Summary
iFlow CLI is Alibaba's iFlow (Xinliu) terminal coding agent, about 5.1k stars. It inherited Gemini CLI's opt-in sandbox. The sandbox is off by default and turned on with `--sandbox`/`-s`, `IFLOW_SANDBOX` or `"sandbox"` in settings. It then uses macOS `sandbox-exec` (Seatbelt) when present, otherwise Docker or Podman with the `iflow-cli-sandbox` image. The macOS default profile is `permissive-open`. The CLI has four approval modes, and non-interactive `-p` runs default to YOLO. iFlow announced on 2026-03-20 that it would stop maintenance that day and shut down on 2026-04-17, and pointed users to Qoder.

## Key points
- Lineage: the npm bundle (0.5.19) contains Gemini CLI's six Seatbelt profiles (`sandbox-macos-{permissive,restrictive}-{open,closed,proxied}.sb`). It uses the same selection logic with `GEMINI_SANDBOX` renamed to `IFLOW_SANDBOX`. Settings docs still mention `GEMINI_API_KEY`. The README compares itself with Gemini CLI but does not say it is a fork. The fork relationship is inferred from the code, not stated.
- Isolation unit per OS, from the bundled selection logic:
  - macOS: `sandbox-exec` is preferred whenever sandboxing is on, with `SEATBELT_PROFILE` defaulting to `permissive-open`. A custom `.iflow/sandbox-macos-custom.sb` is supported.
  - Linux: Docker or Podman container.
  - Windows: Docker or Podman. The README says Windows support is via WSL or Git for Windows.
  - Proxied profiles plus `IFLOW_SANDBOX_PROXY_COMMAND` route egress through a proxy.
- Default: off ("The sandbox is disabled by default"; settings `sandbox` default `false`).
- Network egress: open under the default `permissive-open` profile and under Docker. The `*-closed` and `*-proxied` profiles restrict it.
- Approval modes (README):
  - "yolo (model has maximum permissions, can perform any operation)", plus "accepting edits", "plan mode" and "default (model has no permissions)".
  - `--yolo` is "automatically approving all tool calls".
  - The glossary calls yolo the "Default execution mode".
  - In the 0.5.19 code, the fallback is YOLO for non-interactive `-p` and ACP runs. Interactive sessions fall back to a "smart" mode.
- Persistence: in container mode the project is mounted; `.iflow/sandbox.Dockerfile` with `BUILD_SANDBOX=1` builds a custom image.
- Status (farewell post, https://vibex.iflow.cn/t/topic/4819, translated from Chinese):
  - iFlow CLI stopped maintenance on 2026-03-20 and closed on 2026-04-17, with the iFlow API service and model library shut down at the same time.
  - It invites users to migrate to the Qoder platform, with 300 credits offered, and does not mention Qwen Code.
  - Installed copies can keep working with a custom OpenAI-compatible API.
  - The GitHub README carries an English shutdown banner. The repo was last pushed 2026-03-20 and is not archived.

## Excerpts
> "The sandbox is disabled by default, but you can enable it in several ways: Use the `--sandbox` or `-s` flag. Set the `IFLOW_SANDBOX` environment variable. By default, it uses the prebuilt `iflow-cli-sandbox` Docker image." (docs_en/features/sandbox.md)

> "iFlow CLI will be shutting down on April 17, 2026 (UTC+8)." (README.md banner, https://github.com/iflow-ai/iflow-cli)

> "To provide a better, more unified tool experience, we will deeply consolidate our AI coding resources." (translated from Chinese; farewell post, 2026-03-20, https://vibex.iflow.cn/t/topic/4819)

## Relevance to the talk
This is the Gemini CLI pattern exported to China: an off-by-default sandbox, Seatbelt `permissive-open` (writes confined, network open), containers on Linux, and YOLO as the headless default. It is also a short-lived product. Alibaba folded it into Qoder within about a year, and Qoder now has its own per-command Seatbelt, bwrap and restricted-token sandbox.
