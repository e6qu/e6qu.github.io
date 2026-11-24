---
title: "Tools" (Amp docs), with "Amp, Rebuilt" (Amp news, 2026-05-06)
url: https://ampcode.com/docs/tools#permissions
authors: Amp Inc. (spun out of Sourcegraph, Dec 2025)
date: living document (lastModified 2026-11-05); read 2026-11-22. Default change announced in https://ampcode.com/news/neo (2026-05-06)
accessed: 2026-11-22
kind: docs
---

## Summary
Amp is current and has been run by Amp Inc. since it spun out of Sourcegraph in December 2025. It runs either as a local CLI/editor agent or in "orbs", cloud sandboxes with one machine per thread. The default orbs are E2B microVMs. The local agent has **no OS-level sandbox and, since May 2026, no approval prompts by default**: what used to be `--dangerously-allow-all` became the default. The old rule-based permission system survives only as a built-in plugin that loads if your settings already use it. Amp's answer to risk is to write a policy plugin or use an isolated environment, which in practice means an orb.

## Key points
- Product status: current. Sourcegraph and Amp became independent companies on 2025-12-02 (https://sourcegraph.com/blog/why-sourcegraph-and-amp-are-becoming-independent-companies, https://ampcode.com/news/amp-inc). "Amp, Rebuilt" (2026-05-06) made the "Neo" rewrite the standard Amp.
- Runs: there is a local CLI (`amp`), local runners (the macOS/Windows/Linux apps can run `amp --no-tui --runner-id ...` to serve threads in chosen folders), and orbs. Orbs are "cloud sandboxes where Amp agents work without using your computer", one fresh isolated environment per thread, which pauses when idle and resumes with its filesystem intact (https://ampcode.com/docs/orbs, lastModified 2026-10-27).
- Isolation (local): none documented. The agent and its shell commands run as the user, with no Seatbelt, bubblewrap or container wrapper in the docs. The Tools page tells users who work with untrusted sources to write "a custom policy plugin" or use "an isolated development environment".
- Isolation (cloud): the customization docs call the default hosted orbs "E2B microVM orbs" running in Google Cloud `us-west1` (https://ampcode.com/docs/orbs/customizing, lastModified 2026-11-16). The orb user has `sudo` and can run Docker inside. Self-hosted orbs use a dispatch program you write against E2B, Modal, Daytona, Vercel or Kubernetes (Helm chart for GKE, EKS and AKS) (https://ampcode.com/docs/orbs/self-hosted).
- Filesystem: the local agent can reach whatever the user can, with no workspace restriction by default. The legacy plugin's `amp.guardedFiles.allowlist` and per-tool `--path` rules were tool-level checks, not OS enforcement. In an orb the agent has the whole VM, and secrets are written to `~/.env` (mode 0600) and masked in shell output (https://ampcode.com/docs/orbs/handling-secrets).
- Network: local, not restricted. Orbs: no egress allowlist or firewall is documented, and the docs assume open outbound access (package installs, Tailscale for private networks, Chrome "Web Use"). Treat orb egress as open, not documented otherwise.
- Approvals: by default Amp "does not ask for approval before running tools". Policy is now code: plugins subscribe to `amp.on('tool.call', ...)` and return `allow`, `reject`, or ask the user. The docs' example uses `amp.ai.ask()` to classify risky `git` commands (https://ampcode.com/docs/customize/plugins#example-plugin-permissions). The legacy engine (`amp.permissions` with ordered `allow`/`ask`/`reject`/`delegate` rules, `amp permissions edit|add|test`, `amp.dangerouslyAllowAll`, `--dangerously-allow-all`) still loads as a built-in plugin only when settings opt in through `amp.permissions`, `amp.dangerouslyAllowAll: false` or `amp.guardedFiles.allowlist`, and it then applies to both `amp` and `amp --execute` (https://ampcode.com/news/neo).
- MCP: `amp.mcpPermissions` still exists as a first-match allow/reject list on MCP server `command`/`args`/`url`, and unmatched servers are allowed (https://ampcode.com/docs/cli/settings, lastModified 2026-11-02).
- Enterprise: workspace admins can publish a policy plugin as a global workspace plugin, distribute managed settings (validated against a JSON schema), and enforce an MCP registry allowlist (https://ampcode.com/docs/enterprise/mcp-registry-allowlist).
- Rationale: Amp argues that string-matching tool calls (for example looking for `rm -rf`) gives "a false sense of security" now that agents write scripts and spawn subagents, so "permissions now live in the Plugin API" (https://ampcode.com/news/neo). The earlier note "How We Think About Permissions" (https://ampcode.com/notes/permissions) describes the legacy rule system and the "full-auto" vs cautious-operator split.

## Excerpts
> "By default, Amp does not ask for approval before running tools." (Tools)

> "Amp will no longer ask for permission before running tools. What was once the --dangerously-allow-all flag is now the default behavior for users who have not configured permissions." (Amp, Rebuilt, Permissions)

> "If you need a policy, build the one that matches your setup." (Amp, Rebuilt, Permissions)

> "Orbs are cloud sandboxes where Amp agents work without using your computer." (Orbs)

## Relevance to the talk
Amp is the clearest case of a vendor giving up on approval prompts as a control: YOLO is the default, and the safety story moves to (a) programmable hooks and (b) cloud microVMs that are disposable per thread. This makes a good contrast slide against Kiro, Factory and Cursor, which added OS sandboxes to local agents. Amp instead says local means trusted and untrusted work goes to an orb. The open-by-default orb egress is the gap.
