---
title: "TanStack npm Packages Compromised Inside the Mini Shai-Hulud Supply Chain Attack" (Snyk); "Mini Shai-Hulud: The Worm Returns and Goes Public" (Akamai); "Postmortem: TanStack npm supply-chain compromise" (TanStack)
url: https://snyk.io/blog/tanstack-npm-packages-compromised
authors: Stephen Thoemmes (Snyk, 2026-05-11); Akamai Security Intelligence Group (2026-05-15, https://www.akamai.com/blog/security-research/2026/may/mini-shai-hulud-worm-returns-goes-public); Tanner Linsley (TanStack, 2026-05-11/15, https://tanstack.com/blog/npm-supply-chain-compromise-postmortem)
date: 2026-05-11
accessed: 2026-11-22
kind: blog
agent: Claude Code (as a persistence target); VS Code (tasks.json)
incident_date: 2026-05-11 (malicious publishes 19:20 to 19:26 UTC)
category: supply-chain
cve: none found (TanStack advisory not checked)
sandbox_at_time: none. The payload ran at `npm install` time as the developer or CI user. It wrote project-local `.claude/settings.json` hooks and `.vscode/tasks.json`, which then run *outside* any agent sandbox (hooks and editor tasks are not sandboxed)
exploited_in_wild: YES; 84 malicious versions of 42 `@tanstack/*` packages, then further npm/PyPI packages (Mistral AI, UiPath, OpenSearch-linked, per Akamai)
---

## Summary
In May 2026 a new wave of the Shai-Hulud npm worm (Akamai attributes it to TeamPCP and calls it "Mini Shai-Hulud") got into TanStack's release pipeline. It chained a `pull_request_target` workflow, GitHub Actions cache poisoning, and an OIDC token read from runner memory, and published 84 malicious versions of 42 TanStack Router/Start packages in six minutes. The payload stole cloud, CI, npm, GitHub and SSH credentials, as earlier waves did. What is new is its persistence: it wrote itself into the project's **Claude Code hook configuration** (`.claude/settings.json` plus `.claude/setup.mjs` and `router_runtime.js`), so it re-runs whenever a developer uses Claude Code in that project, and into `.vscode/tasks.json` to run on folder open. Akamai notes both survive `npm uninstall`. It also targeted Claude Code session history (`~/.claude/projects/*.jsonl`) as a source of secrets.

## Key points
- The malicious commit in the attacker's fork used a forged "claude" author identity. TanStack's postmortem says this was not Anthropic's Claude.
- TanStack: "No npm tokens were stolen and the npm publish workflow itself was not compromised". The OIDC token was taken from runner memory.
- Exfil: Akamai reports an RSA-encrypted upload to a lookalike C2 domain, falling back to a GitHub repo created under the victim's account. TanStack describes exfil over an end-to-end encrypted messaging file-upload network. A "dead-man's switch" runs `rm -rf ~/` if the stolen GitHub token is revoked.
- The worm's source was published on GitHub on 2026-05-12 (Akamai).
- Context: earlier in the family, the 2025 s1ngularity/nx malware drove AI CLIs in bypass mode ([nx-s1ngularity-ai-cli-malware.md](../agent-sandboxing/nx-s1ngularity-ai-cli-malware.md)). Cloud Security Alliance notes (AI-assisted, not checked against primaries) describe an April 2026 `@bitwarden/cli` compromise also targeting Claude Code and MCP config files. Treat that as unverified.

## Excerpts
> "Claude Code's `hooks` configuration can execute shell commands in response to tool events such as file edits and bash runs." (Snyk)

> "Malware persistence was also extended to include Claude Code session hooks" (Akamai)

> "The chain only works because each vulnerability bridges the trust boundary the others assumed." (TanStack postmortem)

## Would a mature sandbox have stopped it?
**An agent sandbox would not have prevented the infection, which happens at `npm install` outside the agent, but several mature controls would have weakened it.** (a) **Install-time sandboxing**: running package installs, including lifecycle scripts, in a sandbox with no credential access and a default-deny egress allowlist stops both the theft and the persistence writes. Few developers do this by default. (b) **Protected agent config**: if `.claude/settings.json` hooks from the project required approval or ran inside the sandbox, the persistence would not fire silently. Claude Code's sandbox makes `.claude` settings unwritable *to sandboxed commands*, but `npm install` run by the user is not sandboxed, and hooks run outside the sandbox. (c) **Credential isolation**: tokens kept behind a proxy or broker instead of in `~/.npmrc`, `~/.aws` and env vars leave the stealer little to take. (d) If the agent itself ran `npm install`, a mature agent sandbox *would* have contained it, which is a strong argument for running dependency installs through the sandboxed agent rather than in the user's own shell.

## Relevance to the talk
Supply-chain malware now treats the coding agent's config as a persistence mechanism, as malware has long treated `.bashrc` and LaunchAgents. Agent config files are part of the system's attack surface and need the same protection as shell startup files. Claude Code's sandbox already lists them as protected paths, but only against the agent's own commands.
