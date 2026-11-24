---
title: "Sandbox" (Factory docs)
url: https://docs.factory.com/autonomy-and-safety/sandbox
authors: Factory (Factory AI)
date: living document; read 2026-11-22 (docs moved from docs.factory.ai to docs.factory.com, which now 308-redirects)
accessed: 2026-11-22
kind: docs
---

## Summary
Factory's Droid runs as a local CLI or desktop-app process, in CI via `droid exec`, or on Factory-managed cloud "Droid Computers" and Environments. Locally it has an **opt-in** OS sandbox (`sandbox.enabled: true`): Seatbelt on macOS, bubblewrap plus seccomp on Linux, and Microsoft "MXC" natively on Windows (or the Linux sandbox under WSL2). All platforms add a filtering HTTP/SOCKS proxy with a domain allowlist. With the sandbox on, the default policy is reads allowed, writes only in the CWD, and network denied except Factory and WorkOS domains. It fails closed when the OS primitive is missing. Separately, a four-level Autonomy Level (Off/Low/Medium/High) plus `permissionRules` decides what runs without asking. `droid exec` is read-only unless given `--auto low|medium|high`, and `--skip-permissions-unsafe` skips all prompts.

## Key points
- Runs: local CLI (`droid`), the Factory App (desktop, with local machine access), headless `droid exec` for CI, Remote Control (attach your own VPS or workstation), and Factory-hosted Droid Computers (persistent) or Environment-based cloud sessions (a fresh computer from a snapshot per launch) (https://docs.factory.com/droid-computers/overview, https://docs.factory.com/environments/run-droids). Enterprise "Factory Private" runs the sandboxes in your VPC through OpenCompute (https://docs.factory.com/enterprise/network-and-deployment).
- Isolation (local, opt-in): macOS Seatbelt profiles; Linux bubblewrap with a seccomp filter; Windows Microsoft MXC natively, or the Linux sandbox when Droid runs in WSL2. Two modes: `per-command` (the default once enabled; each shell command and its children are sandboxed and the main Droid process is not) and `whole-process` (the whole Droid process, MCP transports and subagents are sandboxed, and Droid refuses to start if isolation fails). Hooks are wrapped too and blocked if the sandbox cannot be set up.
- Default: off. The page says to "Set `sandbox.enabled` to `true`". Settings merge org > project > user, so an org can switch it on for everyone and set the mode.
- Filesystem (sandbox on): reads allowed except `sandbox.filesystem.denyRead`; writes denied except the CWD plus `allowWrite`, with `denyWrite` overriding. Shell commands are confined by the OS. File tools (`Read`, `Edit`, `Create`, `ApplyPatch`, ...) are checked by Droid before each operation, which is a tool-level check. Sandboxed processes cannot write Droid's own `settings.json`. Org-level `denyRead`/`denyWrite` are unioned downstream and cannot be overridden by a user's "Allow always". With the sandbox off, there is no FS restriction beyond approvals.
- Network (sandbox on): deny all except Factory's own and WorkOS auth domains, with `sandbox.network.allowedDomains` adding hosts. It is enforced by routing outbound traffic through an HTTP/SOCKS filtering proxy. `FetchUrl` and `WebSearch` are checked against the same list. TUI violations raise a domain prompt with a 60 s auto-deny, and `droid exec` auto-denies.
- Approvals: Autonomy Level is Off, Low (file edits plus low-risk commands), Medium (installs, builds, `git commit`/`push`, `gh pr create`) or High (high-risk actions unless safety checks intervene). `Ctrl+L` cycles levels. `permissionRules` (allow/ask/block) replace the deprecated `commandAllowlist`/`commandDenylist`/`commandBlocklist`. Block beats ask beats allow, and an `ask` still prompts at High (https://docs.factory.com/autonomy-and-safety/auto-run).
- YOLO / headless: `droid exec` is read-only by default and takes `--auto low|medium|high`. `--skip-permissions-unsafe` "skips all permission prompts, but command blocks still apply" and cannot be combined with `--auto`. The docs say to use it only in "throwaway containers, ephemeral CI runners, and temporary VMs" (https://docs.factory.com/droid-exec/overview). Missions require High or `--skip-permissions-unsafe`.
- Droid Shield: a pattern-based secret scanner on the diff of `git commit`/`git push` that Droid itself runs. It blocks the git operation on a hit and does not cover git run outside Droid. Admins can enforce it (https://docs.factory.com/autonomy-and-safety/droid-shield).
- Enterprise: Default and Maximum Autonomy Level, org-wide sandbox mode and deny lists, MCP restrictions, managed hooks. The enterprise guidance says: "Run Droid with higher autonomy levels only inside a sandboxed container or VM, never directly on a developer host" (https://docs.factory.com/enterprise/network-and-deployment).
- Cloud isolation: Droid Computers and Environments are "hosted and managed by Factory", but the virtualization technology and default egress policy are **not documented** on the pages read. Factory Private sandboxes inherit the customer's firewall, VPN and Kubernetes network controls.
- Caveats stated by Factory: allowed egress domains are still exfiltration channels, writable paths include your own project code, and "Treat the sandbox as defense in depth ... not as a hard boundary around untrusted code". The autonomy page warns: "Command rules are not operating-system isolation".

## Excerpts
> "Because the sandbox relies on these host primitives, it blocks rather than running without isolation when they are unavailable." (Sandbox, How OS-level isolation works)

> "outbound traffic is routed through an HTTP/SOCKS filtering proxy that permits only the allowed domains" (Sandbox, How OS-level isolation works)

> "To evaluate code you do not trust, run Droid inside a container or a dedicated virtual machine." (Sandbox, Security limitations)

> "`--skip-permissions-unsafe` skips all permission prompts, but command blocks still apply." (Autonomy Level)

## Relevance to the talk
Factory is one more vendor converging on the Seatbelt + bubblewrap/seccomp + egress-proxy recipe, and the first among these notes to name a native Windows primitive (MXC) instead of falling back to WSL. Its `per-command` vs `whole-process` switch is a clean way to show the trade-off between sandboxing tool calls and sandboxing the agent itself. The sandbox is still opt-in, while autonomy levels and the `--skip-permissions-unsafe` flag are what most users touch.
