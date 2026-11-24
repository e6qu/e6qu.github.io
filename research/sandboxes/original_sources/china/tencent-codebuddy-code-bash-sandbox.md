---
title: Bash Sandbox | Tencent Cloud Code Assistant CodeBuddy – AI Code Editor
url: https://www.codebuddy.ai/docs/cli/bash-sandboxing
authors: Tencent Cloud (腾讯云) CodeBuddy team
date: undated ("Last updated" blank; page sidebar shows CodeBuddy Code release notes up to v2.184.0)
accessed: 2026-11-22
kind: docs
---

## Summary
CodeBuddy Code is Tencent's coding-agent CLI. It ships an optional OS-level sandbox for its Bash tool: bubblewrap on Linux, Seatbelt via `sandbox-cli` on macOS, and a `sandbox-cli` backend on Windows. By default the sandbox can write only to the working directory. Network traffic goes through a proxy outside the sandbox that allows only approved domains. The feature set closely mirrors Anthropic's Claude Code sandbox: `/sandbox`, `autoAllowBashIfSandboxed`, `excludedCommands`, `dangerouslyDisableSandbox`, `enableWeakerNestedSandbox`. The same docs are mirrored at workbuddy.ai (https://www.workbuddy.ai/docs/cli/bash-sandboxing). I found no documented CodeBuddy cloud sandbox for background agents.

## Key points
- Isolation unit: the agent's own Bash subprocesses inside an OS sandbox. On Linux this is bubblewrap (`bwrap`, namespaces and mount rules); on macOS it is Seatbelt. No container or VM is involved.
- Per-session?: per command invocation, as part of the local CLI session. It is off unless enabled; the page says "Platform support does not mean the sandbox is enabled".
- Network egress:
  - A proxy outside the sandbox allows only approved domains. A new domain triggers a permission prompt.
  - Custom proxies are supported.
  - The page warns the filter "does not inspect traffic going through the proxy".
  - Allowing Unix sockets, such as `/var/run/docker.sock`, can open paths around the sandbox.
- Filesystem: read-write in the working directory; read everywhere else except denied paths. Writes to CodeBuddy's own `settings.json` and `settings.local.json` are blocked from Bash and from the Write/Edit tools, to stop sandbox escape through hook injection.
- Persistence: n/a, because commands run on the host filesystem.
- Limits / escape hatches:
  - `dangerouslyDisableSandbox=true` asks to run a command unsandboxed.
  - `excludedCommands` (example: `git`, `docker`) run outside the sandbox.
  - `enableWeakerNestedSandbox` "significantly weakens security".
  - In bypassPermissions mode (v2.90.x and later), escape prompts are auto-granted for SAFE, LOW and MEDIUM risk commands. HIGH and CRITICAL still need confirmation.
- Permission rules (allow/ask/deny, with deny taking precedence) are documented separately at https://www.workbuddy.ai/docs/cli/permissions.
- Pricing: not applicable; this is a feature of the CLI.
- Cloud sandbox: none documented. Search turned up only IDE, plugin and CLI modes (Tencent Cloud docs https://www.tencentcloud.com/document/product/1256/77277). Whether "GenieAI" or WorkBuddy run code in a cloud sandbox could not be verified.

## Excerpts
> "The sandboxed Bash tool uses operating system-level primitives to enforce file system and network isolation." (Bash Sandbox, intro)

> "Linux namespaces and mount rules restrict the resources visible to the process." (Linux / bubblewrap section)

## Relevance to the talk
The Chinese coding-agent CLIs have converged on the same local OS-sandbox design as Claude Code and Codex: bwrap or Seatbelt, a domain-allowlisting proxy, and named escape hatches. CodeBuddy's docs are close to a feature-for-feature clone. That shows the design is becoming a de facto standard, and that it shares the same weak spots: an uninspected proxy, socket passthrough, and excluded commands.
