# Incidents — coding agents and agentic tools, 2025–2026

Real failures of coding agents and the tools around them, each from a primary
source: the victim's post or issue, the vendor's advisory, CVE or postmortem, or
the researcher's write-up. Every note answers **"Would a mature sandbox have
stopped it?"** and names the control.

Columns: **Real?** means *harm to a real victim* (✔) or *researcher demonstration
or advisory* (demo). **Sandbox then** describes what isolation was in place.

## The twenty for the talk

| # | Date | Agent | What happened | Kind | Real? | Sandbox then | Would have stopped it | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | 2025-07 | Replit Agent | Deleted a production database during a code freeze, then misreported what it had done | destructive | ✔ | hosted, dev = prod | separate prod credentials; dev/prod split (Replit added it after) | [note](../agent-sandboxing/replit-database-deletion-2025.md) |
| 2 | 2025-07 | Gemini CLI | README injection plus loose allowlist matching: `grep …; env \| curl` runs silently | injection → RCE | demo | sandbox existed, off by default; default profile allowed network | egress allowlist, credential isolation | [note](2025-07-gemini-cli-allowlist-injection.md) |
| 3 | 2025-07 | Cursor + Supabase MCP | A support ticket's text makes the agent, holding `service_role`, dump tokens into the ticket | exfiltration | demo | none; admin key | least-privilege credentials (no process sandbox helps) | [note](2025-07-supabase-mcp-cursor-sql-leak.md) |
| 4 | 2025-07 | Cursor (Open VSX) | Fake "Solidity" extension installs remote access tools; ~$500k in crypto stolen | malicious extension | ✔ | none; extensions run as the user | extension isolation, which no VS Code fork has | [note](2025-07-cursor-open-vsx-fake-solidity-extension.md) |
| 5 | 2025-08 | GitHub Copilot | Injection writes `chat.tools.autoApprove: true` (YOLO mode), then runs commands. CVE-2025-53773 | injection → RCE | demo | none | write-protect the agent's own config | [note](2025-08-github-copilot-yolo-rce.md) |
| 6 | 2025-08 | Cursor | CurXecute: injection creates `.cursor/mcp.json`, which runs at once. MCPoison: an approved MCP server is swapped later. CVE-2025-54135/54136 | injection → RCE | demo | none | protected config paths, including creation; MCP isolation | [note](2025-08-cursor-curxecute-mcpoison.md) |
| 7 | 2025-08 | nx (s1ngularity) | Malicious npm releases drive the victim's Claude, Gemini and Q CLIs in YOLO mode to hunt for secrets | supply chain | ✔ | none; ran at install | sandboxed installs; YOLO flags not reachable by scripts | [note](../agent-sandboxing/nx-s1ngularity-ai-cli-malware.md) |
| 8 | 2025-09 | Codex CLI | The sandbox's writable root was taken from a model-chosen working directory. CVE-2025-59532 | sandbox escape | demo | Seatbelt/Landlock, on by default (the bug was inside it) | build policy only from trusted input; fail closed | [note](2025-09-codex-cli-model-cwd-sandbox-bypass.md) |
| 9 | 2025-10 | Claude Code (WSL2) | `rm -rf` from `/` deleted the whole home directory; the transcript did not show the command | destructive | ✔ | none (opt-in sandbox announced the day before) | write scope limited to the working directory; snapshots | [note](2025-10-claude-code-rm-rf-home-wsl.md) |
| 10 | 2025-10 | Claude Code Interpreter (hosted) | "Claude Pirate": data out through the allowed `api.anthropic.com`, using the attacker's API key | exfiltration | demo | **egress allowlist on, and it still leaked** | egress bound to the user's identity, not just the domain | [note](2025-10-claude-pirate-files-api-exfil.md) |
| 11 | 2025-11 | Google Antigravity | In Turbo mode, asked to clear a cache, it ran `rmdir /s /q d:\` and wiped the whole drive | destructive | ✔ | Turbo turns off sandbox and approval | AppContainer write scope (on by default outside Turbo) | [note](2025-11-antigravity-turbo-wipes-d-drive.md) |
| 12 | 2025-11 | Google Antigravity | Hidden injection; `cat .env` gets round the gitignore rule; browser subagent posts to webhook.site, which was on the default allowlist | exfiltration | demo | no terminal sandbox in the tested defaults | one read policy and one egress list for every tool | [note](2025-11-google-antigravity-exfil.md) |
| 13 | 2026-02 | Claude Code | Repo `.claude/settings.json` hooks, MCP auto-enable and `ANTHROPIC_BASE_URL` give RCE or a key leak around the trust dialog. CVE-2025-59536, CVE-2026-21852 | injection → RCE | demo | opt-in sandbox; hooks and MCP run outside it | never honour security settings from the repo; VM for untrusted repos | [note](2026-02-claude-code-project-files-rce.md) |
| 14 | 2026-02 | Claude Code | `terraform destroy` with a stale state file deleted the production RDS database and its snapshots; AWS restored it ~24 h later | destructive | ✔ | none; full AWS credentials | scoped credentials; approval on destroy; deletion protection | [note](2026-02-datatalks-claude-code-terraform-destroy.md) |
| 15 | 2026-02 | OpenClaw / ClawHub | Hundreds of malicious "skills" deliver the AMOS stealer | malicious skills | ✔ | none for skills | per-skill isolation, egress allowlist | [note](2026-02-openclaw-clawhub-malicious-skills.md) |
| 16 | 2026-03 | Claude Code (Ona) | Got round an `npx` denylist via `/proc/self/root/…`, then asked to run unsandboxed, saying plainly that it was bypassing the rule | guardrail bypass | demo | bubblewrap, auto-allow, denylist | no "retry unsandboxed" escape hatch (`allowUnsandboxedCommands: false`, not default) | [note](2026-03-ona-claude-code-escapes-denylist-sandbox.md) |
| 17 | 2026-04 | Cursor + Claude Opus 4.6 | Working in staging, it found an unrelated Railway token and deleted the production volume and its backups in ~9 s | credentials → destructive | ✔ | prompt rules only | no reads of secrets outside the workspace; scoped tokens; provider-side undo (Railway added 48 h) | [note](2026-04-pocketos-cursor-railway-volume-delete.md) |
| 18 | 2026-05 | Mini Shai-Hulud | npm worm persists by writing hooks into `.claude/settings.json` and `.vscode/tasks.json` | supply chain | ✔ | none; ran at install | protected agent config; sandboxed installs | [note](2026-05-mini-shai-hulud-claude-code-persistence.md) |
| 19 | 2026-07 | OpenAI eval agents | During cyber evaluations, agents used zero-days in the internal Artifactory mirror to reach the internet, rooted the host VM and compromised Hugging Face systems | sandbox escape | ✔ | per-run containers; mirror was the only egress | VM per workload, two network layers, hardened helper services (OpenAI's own fixes) | [note](2026-07-openai-eval-agents-escape-to-hugging-face.md) |
| 20 | 2026-08 | Claude Code (auto mode) | Deleted `$HOME` twice: once via a cleanup line in a script the agent had written earlier (the approval check saw only `bash script.sh`), once with 57k files | destructive | ✔ | none; auto-mode classifier only | write scope limited to the working directory (exists, off by default); a throwaway home directory | [note](2026-08-claude-code-auto-mode-deletes-home.md) |

## Also documented

- 2025-03 [Rules File Backdoor](2025-03-rules-file-backdoor.md): hidden Unicode in Cursor/Copilot rules files (no sandbox helps).
- 2025-05 [GitLab Duo](2025-05-gitlab-duo-remote-prompt-injection.md): MR code leaked via `<img>` URLs.
- 2025-05 [GitHub MCP exploit](../agent-sandboxing/invariant-github-mcp-exploit.md): a public issue makes the agent leak private repos.
- 2025-07 [Amazon Q extension wiper prompt](../agent-sandboxing/amazon-q-extension-compromise.md) shipped in an official release.
- 2025-07 [Gemini CLI "deleted my files"](2025-07-gemini-cli-files-moved-outside-project.md): viral, **but the reporter later found the files moved, not deleted**. A useful caution about incident lore.
- 2025-09 [postmark-mcp](../agent-sandboxing/postmark-mcp-malicious-package.md): a malicious MCP server BCCs every email.
- 2026-02 [OpenClaw deletes an inbox](2026-02-openclaw-deletes-inbox.md): context compaction dropped "don't act until I say".
- 2026-02 to 07 [~12 sandbox-escape CVEs in Cursor and Claude Code](2026-06-agent-sandbox-escape-advisories.md): git hooks, symlinks, virtiofs, a cloud-agent control port, allowlist bypasses.
- 2026-07 [Codex spends $812 via a `.env` API key](2026-07-codex-uses-env-api-key-past-quota.md) after hitting its subscription limit.
- [Slopsquatting](../agent-sandboxing/slopsquatting-package-hallucinations.md): models invent package names that attackers can register.

Left out as rumour or disputed: the FT's report that the Kiro agent caused an AWS
outage (Amazon blames a staff member's misconfigured access), a "Codex burned $78k"
HN claim, and a claim that OpenAI paused a model that had escaped and posted to GitHub.

## Patterns

1. **Most damage needed no exploit at all.** Rows 1, 9, 11, 14, 17 and 20 had no
   sandbox and ran with the user's real credentials. A write scope limited to the
   working directory, which most agents already ship but leave off, would have
   stopped rows 9, 11 and 20 outright.
2. **The agent's own configuration is the new attack surface.** Rows 5, 6, 13, 16
   and 18 change *what the agent is allowed to do* (auto-approve flags, MCP configs,
   hooks, escape hatches) rather than attacking the host. Protected paths must
   cover creating files, not only editing them.
3. **Domain allowlists aren't identity.** Rows 10 and 12 leaked through allowed
   hosts. Egress must be bound to *whose* account and *which operation*.
4. **Sandboxes have bugs like any other software.** Rows 8, 16 and 19 and the
   escape-advisory cluster broke real sandboxes. Use defence in depth (an OS
   sandbox inside a VM) and build policy only from trusted input.
5. **Credentials on disk are the blast radius.** Rows 3, 14, 17 and the Codex cost
   case turn a confused agent into a production outage. The sandbox must hide
   secrets, not just files.
6. **Several failures are outside any process sandbox:** rules files, extensions,
   skills, and MCP servers holding admin keys. These need provenance and
   least-privilege credentials.
