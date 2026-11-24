---
title: "Cursor and Claude Code sandbox-escape advisories, 2026" (GitHub security advisories in cursor/cursor and anthropics/claude-code)
url: https://github.com/cursor/cursor/security/advisories
authors: Cursor (Anysphere) and Anthropic advisories; reporters named per entry below
date: 2026-02-06 to 2026-07-14 (advisory publication dates)
accessed: 2026-11-22
kind: docs
agent: Cursor Desktop (Auto-Run Sandbox), Cursor Cloud Agents, Claude Code (bubblewrap / Seatbelt sandbox)
incident_date: 2026-02 to 2026-07 (disclosure dates; the headline cases are CVE-2026-50548/50549, published 2026-06-05)
category: prompt-injection-rce (sandbox escape); CVE-2026-61613 is hosted-sandbox
cve: Cursor CVE-2026-26268, CVE-2026-48124, CVE-2026-50548, CVE-2026-50549, CVE-2026-73217, CVE-2026-73218, CVE-2026-61613; Claude Code CVE-2026-25725, CVE-2026-39861, CVE-2026-55607, CVE-2026-54316, CVE-2026-24052
sandbox_at_time: yes. These are bugs *in* the sandboxes. Cursor runs agent terminal commands in a Seatbelt/Landlock sandbox by default (blog 2026-02-18). Claude Code's sandbox (Seatbelt / bubblewrap, via sandbox-runtime) is opt-in. Cursor Cloud Agents run in a hosted container per session
exploited_in_wild: none reported; researcher reports via bounty programmes
---

## Summary
In 2026, once the major local agents shipped OS sandboxes, the advisory stream moved from "the agent can do anything" to "the agent can escape the sandbox". Almost every advisory below assumes a prompt-injected ("malicious") agent inside the sandbox and shows a way out. The recurring pattern is that the sandbox confines the *agent's commands*, while some more-privileged component outside it (the editor, git, a language-server extension, the agent's own unsandboxed write tool, Docker Desktop, a hook runner) trusts a file or path the sandboxed process could influence. These are disclosed vulnerabilities, not observed attacks.

## Key points
**Cursor (cursor/cursor advisories)**
- CVE-2026-26268 (2026-02-13, high 8.0, fixed 2.5): the sandbox did not protect `.git` config and hooks, so a malicious agent could write a git hook that runs *outside* the sandbox the next time git runs. Credited to Novee, NVIDIA AI Red Team (Daniel Teixeira) and Philip Tsukerman.
- CVE-2026-48124 (2026-05-21, CVSS 4.0 8.5, fixed 3.0.0): Cursor executed *Claude Code* hook commands from `.claude/settings.local.json` in the workspace without approval. One agent's config file became an escape route for another agent.
- CVE-2026-50548 (2026-06-05, critical, fixed 3.0): the sandbox granted write access to the command's `working_directory`, which the agent controls. Setting it outside the workspace allowed overwriting the `cursorsandbox` helper itself so that later commands ran unsandboxed. Credited to Cato AI Labs.
- CVE-2026-50549 (2026-06-05, critical, fixed 3.0): when path canonicalisation failed (missing target, or read permission removed), the write tool fell back to the raw path and wrote through an in-workspace symlink to anywhere. Cato AI Labs / Maor Dokhanian.
- CVE-2026-73217 (2026-07-14, fixed 3.1.2): the agent replaced a venv's `python` with a wrapper, and the Microsoft Python extension later ran it *outside* the sandbox.
- CVE-2026-73218 (2026-07-14, < 3.0.0): with Docker Desktop and the Dev Containers CLI installed, the agent launched a privileged container and mounted Docker's `virtiofs0`, gaining read/write access to the home directory.
- CVE-2026-61613 (2026-07-06, CVSS 4.0 7.7, fixed server-side 2026-03-31), **hosted**: in browser-enabled Cursor Cloud Agents, attacker web content reached an unauthenticated local agent-control endpoint inside the container. The result was code execution in the session, with access to repo contents, env vars and the GitHub App token (read/write on the repo, including workflows), plus any customer secrets configured. Credited to Arbër Salihi (Thomson Reuters).

**Claude Code (anthropics/claude-code advisories)**
- CVE-2026-25725 (2026-02-06, 7.7, fixed 2.1.2): bubblewrap mounted `.claude/` writable and protected `settings.local.json`, but not `settings.json` if it did not exist yet. Sandboxed code could create it with a `SessionStart` hook that runs with host privileges on restart. This is the CurXecute "create, don't edit" bug again, now in a kernel-enforced sandbox.
- CVE-2026-39861 (2026-04-20, 7.7, fixed 2.1.64): sandboxed code creates a symlink, and the *unsandboxed* app then writes through it. "neither … could independently write outside the workspace, but their combination could."
- CVE-2026-55607 (2026-06-25, 7.7, fixed 2.1.163): git worktree named `.git`, plus symlinks, plus `fsmonitor`, allowed overwriting `~/.zshenv`, giving code execution outside the Seatbelt sandbox. Triggered by cloning a malicious repo with injected prompts.
- Egress: CVE-2026-54316 (2026-06-13, 6.0): `huggingface.co` was pre-approved for WebFetch as a bare host, so fetching attacker-repo files (counted server-side as downloads) became a covert exfil channel. CVE-2026-24052 (2026-02-03, 7.1): a `startsWith()` domain check let `modelcontextprotocol.io.example.com` pass as trusted.

- Two related advisories recorded in other notes: **CVE-2025-66479** (Anthropic
  sandbox-runtime treated an *empty* network allowlist as no restriction; see
  [2025-09-codex-cli-model-cwd-sandbox-bypass.md](2025-09-codex-cli-model-cwd-sandbox-bypass.md))
  and **CVE-2026-22708** (Cursor allowlist mode ran shell built-ins such as `export`
  without allowlisting; see [2026-03-ona-claude-code-escapes-denylist-sandbox.md](2026-03-ona-claude-code-escapes-denylist-sandbox.md)).

## Excerpts
> "This enables non-sandboxed Remote Code Execution — for example by overwriting the `cursorsandbox` helper so later commands run unsandboxed — with no user interaction beyond a benign prompt." (GHSA-3p48-7v9f-v5cw, CVE-2026-50548)

> "This allowed a sandbox escape where neither the sandboxed command nor the unsandboxed app could independently write outside the workspace, but their combination could write to arbitrary locations" (GHSA-vp62-r36r-9xqp, CVE-2026-39861)

> "Cloud Agent sessions include GitHub App access tokens for repository operations." (GHSA-whx2-4gvm-m3r3, CVE-2026-61613)

## Would a mature sandbox have stopped it?
**These *are* the sandboxes, and the advisories show where they were immature:**
- **fs write scope incl. protected config**: the protected-path *lists* were incomplete. They missed `.git/hooks`, *creating* a missing `settings.json`, another vendor's config (`.claude/` in Cursor), venv interpreters, and shell startup files reached via worktrees. A mature design makes the workspace writable but treats every file that some unsandboxed component later *executes or loads* as protected, or runs those components inside the same sandbox.
- **Split-brain writes**: the agent's file-edit tool ran unsandboxed and followed paths or symlinks created inside the sandbox (Cursor 50549, Claude Code 39861, and the TOCTOU advisories CVE-2026-88968/103435 from October 2026). All writes should go through the same kernel-enforced policy, not a userspace path check.
- **Agent-controlled policy inputs**: the sandbox boundary was derived from an agent-supplied `working_directory` (Cursor 50548). Policy must not depend on parameters the confined party chooses.
- **Host services reachable from the sandbox**: Docker Desktop (73218) and an unauthenticated control port in the cloud container (61613). Sockets and local endpoints need default-deny too. The Claude Code docs already warn that `docker.sock` equals host access.
- **Network egress allowlist**: bare-host and prefix matching (`huggingface.co`, `startsWith`) turned allowlisted domains into exfil channels, the same lesson as [2025-10-claude-pirate-files-api-exfil.md](2025-10-claude-pirate-files-api-exfil.md).
- **Credential isolation**: the hosted escape (61613) mattered because a repo-write GitHub token lived inside the sandbox. A brokered token outside the container would have limited the blast radius.
Default status: Cursor's local sandbox was on by default. Claude Code's was opt-in. VM-level isolation (the outer boundary that would contain all of the local escapes) was recommended in the docs but was not the default anywhere.

## Relevance to the talk
The strongest evidence for "agent sandboxing is immature": within about six months of shipping, the two leading local sandboxes accumulated a dozen escapes. Almost all of them go through *the components around the sandbox* (editor, git, extensions, hook runners, the agent's own write tool) rather than through the kernel primitive. It is a direct echo of the history section: the policy lives in a large, privileged TCB that trusts files the confined process can write. (Overlap note: the related Codex CVE-2025-59532 writable-root bug is in [2025-09-codex-cli-model-cwd-sandbox-bypass.md](2025-09-codex-cli-model-cwd-sandbox-bypass.md).)
