---
title: "@comate/comatecli 2.0.0 (\"Comate of Terminal\") and @comate/zulu 1.7.21 — npm bundles of Baidu's Zulu coding agent"
url: https://www.npmjs.com/package/@comate/comatecli
authors: Baidu Comate (Wenxin Kuaima) team
date: comatecli 2.0.0 published 2026-09-16; @comate/zulu 1.7.21 published 2026-09-22
accessed: 2026-11-22
kind: package
---

## Summary
Baidu publishes no documentation of a command sandbox for Comate. The shipped Zulu engine does contain one, inside both the `@comate/comatecli` terminal agent and the `@comate/zulu` package. It is a bundled copy of Anthropic's open-source `@anthropic-ai/sandbox-runtime`: Seatbelt (`sandbox-exec`) on macOS, bubblewrap on Linux, and nothing on Windows or WSL1. It runs only in an opt-in terminal run mode, `sandboxAuto`. The default mode is `manual`. If the sandbox cannot start, Zulu silently switches the user to unsandboxed `auto` mode. The network allowlist Zulu passes to the sandbox covers almost every common TLD (`*.com`, `*.cn`, `*.io` …), and all Unix sockets are allowed. In practice the sandbox restricts filesystem writes only.

## Key points
Everything below comes from reading the minified bundle (`dist/zulu/chunk-riLt5CoU.js` in comatecli 2.0.0). Baidu has not documented any of it.
- Run modes: `terminalRunMode` takes `manual`, `auto`, `sandboxAuto` or `yolo`. The default is `getTerminalRunMode(){return getZuluConfig()?.terminalRunMode??"manual"}`. The CLI start-up path sets it from `process.env.ZULU_TERMINAL_RUN_MODE||"manual"`.
- Mechanism: `SandboxManager.wrapWithSandbox`, the same `SandboxManager` API, log strings (`[Sandbox Linux]`, `[Sandbox macOS]`) and temp-dir prefix (`claude-empty-`) as Anthropic's sandbox-runtime. The bundle names the package `@anthropic-ai/sandbox-runtime`.
  - macOS: `env … sandbox-exec -p <profile> bash -c <cmd>`.
  - Linux: `bwrap`, after a dependency check for bubblewrap.
  - Platform gate: `isSupportedPlatform(){… "linux"===e?"1"!==getWslVersion():"macos"===e}`. Windows and WSL1 get no sandbox.
- Fail-open: `resolveSandboxHealth()` returns "degraded" when the sandbox is unhealthy and calls `switchToAutoRunMode()`. That logs "Sandbox unavailable, switching terminalRunMode to auto" and persists `terminalRunMode = "auto"`. A failed wrap does the same.
- Network policy passed to the sandbox: `allowedDomains: ALLOWED_DOMAINS`, where `ALLOWED_DOMAINS=["localhost","*.com","*.org","*.net","*.io","*.dev","*.app","*.ai","*.sh","*.cn",… "*.py","*.js"]`. It also sets `allowLocalBinding:true` and `allowAllUnixSockets:true`, which includes `docker.sock`.
- Escape hatches: approved commands set `bypassSandboxForApprovedCommand`, and the run is then logged as `runMode:"yolo"`. There is also a `yolo` mode. A `terminalAutoExecutionDenyList` still applies in `auto` and `sandboxAuto`.
- Codex integration: the bundle can drive OpenAI Codex as a sub-agent with `sandboxMode:"workspace-write"`. It has a `CodexSandboxSetupError` for "Codex's Linux sandbox uses bubblewrap" failures.
- Neither the existing Baidu changelog (https://cloud.baidu.com/doc/COMATE/s/2lup980mt) nor searches in Chinese or English turned up any user-facing documentation of `sandboxAuto`.

## Excerpts
> `ALLOWED_DOMAINS=["localhost","*.com","*.org","*.net","*.io","*.dev","*.app","*.ai","*.sh","*.cn",…]` (comatecli 2.0.0 bundle)

> `kernel.logger.warn("RunCommand","Sandbox unavailable, switching terminalRunMode to auto")` (comatecli 2.0.0 bundle)

> `network:{allowedDomains:o,deniedDomains:a,allowLocalBinding:!0,allowAllUnixSockets:!0,…}` (comatecli 2.0.0 bundle, `buildSandboxConfig`)

## Relevance to the talk
This corrects the "no sandbox at all" reading of Comate in the existing note: there is a sandbox, but it is undocumented, opt-in and borrowed from Anthropic. The configuration shows how a borrowed sandbox gets hollowed out. A TLD-wide allowlist means the network is effectively open, allowing every Unix socket brings the Docker-socket escape back, and an unhealthy sandbox switches the user to auto-run with no sandbox instead of failing closed.
