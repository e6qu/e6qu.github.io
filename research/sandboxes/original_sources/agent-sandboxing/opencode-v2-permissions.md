---
title: "OpenCode 2: Permissions and \"Migrate from V1\" docs (anomalyco/opencode)"
url: https://github.com/anomalyco/opencode/blob/dev/services/site/src/docs/content/permissions.mdx
authors: Anomaly (anomalyco/opencode, formerly sst/opencode)
date: v2.0.0 tag on commit dated 2026-09-11 (no GitHub release object for v2.0.0); CHANGELOG.md "Release notes for OpenCode V2" starts at v2.0.26 (2026-10-08); third-party coverage dates the public 2.0 announcement to 2026-10-13 (second-hand); v1.19.6 (2026-11-17) "OpenCode 1 now offers the upgrade to OpenCode 2.0"; source read at main 8ba4445 (2026-11-22, packages at 2.3.0); latest release v2.3.2 (2026-11-18)
accessed: 2026-11-22
kind: docs
---

## Summary
OpenCode 2 is a rebuild around a single background server that the terminal, desktop and web clients share. On sandboxing, the answer is unchanged from 1.x: there is no OS sandbox on any platform. A grep of the repo at 8ba4445 finds no `sandbox-exec`, Seatbelt, bubblewrap or Landlock code, and the docs say `shell` "runs with the host user's filesystem, process, and network authority". What changed is the permission model:
- V2 replaces V1's per-tool `permission` map with one ordered `permissions` array of `{action, resource, effect}` rules, where the last match wins.
- Actions are renamed (`bash` → `shell`, `task` → `subagent`, `write`/`patch` → `edit`).
- The default is looser: **V1 asked before touching paths outside the project; V2 allows `external_directory` by default.**
- The base policy for every agent is still allow-all except `.env` reads.

## Key points
- **Default policy** (docs "Defaults", matching `packages/core/src/plugin/agent.ts`): `[{"action":"*","resource":"*","effect":"allow"}, {read *.env ask}, {read *.env.* ask}, {read *.env.example allow}]`. Shipped agents append rules: `plan` denies edits except under `~/.opencode/plan`, `explore` is read/shell/web only, and `title`/`summary` deny everything. So `shell` runs without prompting by default.
- **Unmatched action → ask**: "If no rule matches, OpenCode uses `ask`" (only relevant once you remove the base allow).
- **external_directory:** "The default policy allows `external_directory`, so external paths are not prompted unless you add a rule." The migration guide warns: "V1 asks before accessing paths outside the project. V2 does not."
- **V1 defaults** (v1 docs in the same repo): "Most permissions default to `\"allow\"`. `doom_loop` and `external_directory` default to `\"ask\"`." `doom_loop` and `lsp` "are not current V2 Core permission actions".
- **Shell scanner:** commands are parsed for Bash, Zsh, POSIX sh and PowerShell. Unparseable commands (for example `eval`) fail if any `shell` deny rule applies, and otherwise need approval as a whole plus `external_directory *`. "Directory inference from command text is best effort".
- **Managed policy:** v2.2.3 added managed-policy actions (`mcp.use`, `skill.use`, `plugin.use`) for MCP, skills and plugins (changelog, via opencode.ai/changelog).
- **Per-project auto-accept** (v2.0.28, 2026-10-13): "Settings → Projects → Auto-accept permissions", toggled with `mod+shift+a`.
- **Security advisories** (repo): CVE-2026-22812 (unauthenticated local HTTP server allowed command execution) and CVE-2026-22813 (XSS in web UI → RCE), both 2026-01-12, plus GHSA-632h-h47v-g4x4 (2026-09-24, cross-site upgrade request installs packages). None concern an OS sandbox, because there is none.
- **Forks with a sandbox:** Kilo Code (an OpenCode fork) added an opt-in Seatbelt/bwrap sandbox (`packages/kilo-sandbox`, which depends on `@anthropic-ai/sandbox-runtime` for its `apply-seccomp` binary). OpenCode upstream did not.

## Excerpts
> "`shell` runs with the host user's filesystem, process, and network authority." — Permissions, Directories callout

> "V1 asks before accessing paths outside the project. V2 does not: `external_directory` is allowed by default." — Migrate from V1

> "Because no default rule asks for `external_directory`, reads and edits outside the Location and worktree proceed without a prompt." — Permissions, Defaults

## Relevance to the talk
OpenCode 2 is a counter-trend data point. A major open-source agent shipped a ground-up 2.0 in Oct 2026, the year every big vendor added an OS sandbox, without one, and loosened its default (outside-project access no longer prompts). The control remains string-matched rules over a "best effort" shell scanner, which the docs themselves say is not a boundary.
