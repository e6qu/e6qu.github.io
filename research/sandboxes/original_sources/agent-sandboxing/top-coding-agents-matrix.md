# How the top coding agents sandbox (as of 2026-11-22)

One row per agent, compiled from the per-agent notes in this directory. All sources were read on 2026-11-22 from vendor docs, repos or engineering posts. The "As of" column gives the doc/release the row reflects. Agent names link to the vendor's own sandbox, security or permissions page. The source-note column links to our note.

Conventions:
- **Bold** in the OS columns marks an OS sandbox that is **on by default**. "opt-in" means it ships but you must turn it on.
- "none" means there is no OS-level isolation: commands run as the user and only the agent's own approval rules or prompts stand in the way.
- "tool-level" means the agent checks paths or commands itself (string or path matching), with no OS enforcement.
- "—" means not applicable (cloud-only product).

## Local agents (run on the developer's machine)

| Agent | Vendor | Runs | macOS | Linux | Windows | FS policy | Network policy | Approval model | As of | Source note |
|---|---|---|---|---|---|---|---|---|---|---|
| [Claude Code](https://code.claude.com/docs/en/sandboxing) | Anthropic | Local CLI/IDE | Seatbelt, opt-in (`/sandbox`) | bubblewrap + seccomp, opt-in | Native: unsandboxed; WSL2: bwrap | Write CWD + temp; broad reads; rc files, `.git/hooks`, `.mcp.json` always denied | Closed; proxy + domain allowlist, prompt on new host | Permission modes incl. `auto` classifier; `--dangerously-skip-permissions` | Docs read 2026-11-22 (v2.1.284) | [claude-code-sandboxing-docs.md](claude-code-sandboxing-docs.md) |
| [OpenAI Codex CLI](https://learn.chatgpt.com/docs/sandboxing) | OpenAI | Local CLI/IDE/app | **Seatbelt** | **bubblewrap + seccomp** | **Native (MXC)** | `workspace-write`: workspace rw, `.git`/`.codex` ro | Closed; optional proxy with domain allow/deny | `on-request` / `never`; `auto_review` reviewer agent; `danger-full-access` | Post 2026-11-18; docs read 2026-11-22 | [openai-codex-sandbox-docs.md](openai-codex-sandbox-docs.md), [openai-inside-the-codex-sandbox.md](openai-inside-the-codex-sandbox.md) |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md) (consumer access ended 2026-06-18) | Google | Local CLI | Seatbelt profiles, opt-in (`-s`) | Docker/Podman, gVisor, LXC, opt-in | Low-integrity labels, opt-in | Default profile: write project, broad reads | Default profile **open**; `-proxied` profiles | `default` / `auto_edit` / `yolo` (`--yolo`) | Repo main 2026-11-22 | [gemini-cli-sandbox.md](gemini-cli-sandbox.md) |
| [Google Antigravity](https://antigravity.google/docs/sandbox/) (App + `agy` CLI) | Google | Local app/CLI | **Seatbelt** (App; CLI via `auto` mode) | **Kernel namespaces** (tool not named) | **AppContainer** (CLI, Win 11 24H2+) | Project rw; `~/.ssh`, `.env` blocked; unmounted paths invisible | Closed; `read_url` domains join allowlist | Request Review / Default / Auto (AI check) / Turbo (no sandbox); `--dangerously-skip-permissions` | Living docs read 2026-11-22 | [agent-google-antigravity.md](agent-google-antigravity.md) |
| [Cursor](https://cursor.com/docs/agent/security/run-modes) (IDE + CLI) | Anysphere | Local IDE/CLI | **Seatbelt** | **Landlock + seccomp** (kernel 6.2+) | WSL2 Linux sandbox (per blog) | Workspace rw; reads system-wide by default; `.git/hooks`, `.vscode` protected | Closed; `sandbox.json` + built-in defaults allowlist | Auto-review (default: sandbox + LLM classifier) / Allowlist / Run Everything | Run-modes page read 2026-11-22; blog 2026-02-18 | [cursor-agent-sandboxing.md](cursor-agent-sandboxing.md) |
| [GitHub Copilot CLI](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes) | GitHub | Local CLI; `--cloud` = hosted VM | Seatbelt via MXC, opt-in | bubblewrap via MXC, opt-in | Native via MXC, opt-in | Sandbox: cwd rw, repo ro; else heuristic tool-level path checks | Sandbox: outbound open, local closed; host rules via proxy | `--allow-tool`/`--deny-tool`; `--allow-all-tools`; `--yolo` | Changelog 1.0.114 (2026-11-18) | [agent-github-copilot-cli.md](agent-github-copilot-cli.md) |
| [VS Code Copilot agent mode](https://code.visualstudio.com/docs/agents/run/agent-sandboxing) | Microsoft / GitHub | Local agent-host process | MXC / srt, opt-in | bubblewrap, opt-in | Win 11, experimental, opt-in | cwd rw; dev-tool caches; rw/ro/deny path lists | Sandbox: outbound **open** by default, local closed | `chat.tools.terminal.autoApprove` rules; Manual / Assisted / Allow all | Docs dated 2026-11-18 | [agent-vscode-copilot-agent-mode.md](agent-vscode-copilot-agent-mode.md) |
| [Devin Desktop / Devin Local](https://docs.devin.ai/cli/sandbox) (ex-Windsurf Cascade) | Cognition | Local IDE/CLI | OS sandbox, opt-in (mechanism not named) | bubblewrap + socat, opt-in | Not supported | Sandboxed: workspace + `Write()` grants, OS-enforced | **Open** by default; opt-in domain filter ("unstable") | Normal / Accept Edits / Smart / Bypass / Autonomous (sandboxed) / Plan | Docs read 2026-11-22 (renamed 2026-06-02) | [agent-windsurf.md](agent-windsurf.md) |
| [Kiro](https://kiro.dev/docs/sandbox/) (IDE + CLI; ex-Amazon Q Developer CLI) | AWS | Local IDE/CLI; Kiro Web in cloud | Seatbelt, opt-in | bubblewrap + socat, opt-in | Native (admin setup, not named), opt-in | Follows `fs_read`/`fs_write` rules; tool-level otherwise | Sandbox: `DEFAULT_BLOCKED` via proxy | `permissions.yaml` deny>ask>allow; `--trust-all-tools`; `/autonomous` forces sandbox | Docs read 2026-11-22 (IDE 1.3+, CLI 2.31+) | [agent-kiro.md](agent-kiro.md) |
| [Zed Agent](https://zed.dev/docs/ai/sandboxing) | Zed Industries | Local, in editor | **Seatbelt** | **bubblewrap** (unsandboxed if missing) | WSL only; native unsandboxed | Write project + tmp; `.git` never writable | Closed; per-host proxy grants | `tool_permissions` default `confirm`; regex allow/deny; `"default": "allow"` = YOLO | v1.29.3 (2026-11-22) | [agent-zed.md](agent-zed.md) |
| [JetBrains Junie](https://junie.jetbrains.com/docs/junie-cli.html) (IDE + CLI) | JetBrains | Local IDE/CLI | CLI: srt, opt-in (EAP); IDE: none | CLI: srt/bwrap, opt-in; IDE: none | none | Sandbox: writes project/tmp/caches | **Open** by default; optional `allowedDomains` | Approvals + Action Allowlist; Brave mode (`--brave`) | Docs updated 2026-11-21 | [agent-jetbrains-junie.md](agent-jetbrains-junie.md) |
| [Factory Droid](https://docs.factory.com/autonomy-and-safety/sandbox) | Factory | Local CLI/app; `droid exec`; cloud | Seatbelt, opt-in | bubblewrap + seccomp, opt-in | MXC native or WSL2, opt-in | Sandbox: reads ok, writes CWD + `allowWrite` | Sandbox: deny-all + `allowedDomains` via proxy | Autonomy Off/Low/Med/High; `--auto`; `--skip-permissions-unsafe` | Docs read 2026-11-22 | [agent-factory-droid.md](agent-factory-droid.md) |
| [Kilo Code](https://kilo.ai/docs/getting-started/settings/sandboxing) (ext + CLI, opencode fork) | Kilo | Local ext/CLI; Cloud Agent | Seatbelt, opt-in | bubblewrap + seccomp, opt-in | Not supported | Sandbox: writes workspace, `.git` ro, reads unrestricted | Sandbox: deny + SNI-checking proxy allowlist | allow/ask/deny globs in `kilo.jsonc`; CLI `--auto` | v7.8.32 (2026-11-20) | [agent-kilo-code.md](agent-kilo-code.md) |
| [Qwen Code](https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/) (Gemini CLI fork) | Alibaba (Qwen) | Local CLI | Seatbelt, opt-in (`permissive-open`) | bwrap / partial Landlock tool sandbox, or Docker, opt-in | Docker/Podman, opt-in | Writes project; broad reads | Default profile **open**; closed/proxied profiles | plan / default / auto-edit / auto (classifier) / yolo | v0.28.4 (2026-11-22) | [agent-qwen-code.md](agent-qwen-code.md) |
| [OpenHands](https://docs.openhands.dev/openhands/usage/agent-canvas/backend-setup/docker-execution) | OpenHands (All Hands AI) | Local host by default; Cloud = K8s pods | none (Docker opt-in) | none (Docker opt-in, `--cap-drop ALL`) | none (Docker via WSL2) | Host user's full access; Docker: `/workspace` mount | Not restricted | Confirmation mode **off** by default; LLM risk analyzer | v1.43.0 (2026-11-22) | [agent-openhands.md](agent-openhands.md) |
| [Cline](https://docs.cline.bot/features/auto-approve) (ext + CLI) | Cline | Local ext/CLI; Cloud Agents | none | none | none | Tool-level; `.clineignore` "not a security boundary" | none | Per-category auto-approve; YOLO toggle; CLI `--auto-approve` **defaults true** | v4.1.27 (2026-11-21) | [agent-cline.md](agent-cline.md) |
| [opencode](https://opencode.ai/docs/permissions) | Anomaly (ex-SST) | Local CLI + server | none | none | none | Default allow all, incl. outside project; asks for `.env` | none | allow/ask/deny rules (default mostly allow); `run --auto` | v2.3.2 (2026-11-22) | [agent-opencode.md](agent-opencode.md) |
| [goose](https://goose-docs.ai/docs/guides/managing-tools/goose-permissions) | AAIF / Linux Foundation (ex-Block) | Local app/CLI | none (opt-in Seatbelt removed) | none | none | No boundary | none | `GOOSE_MODE` **auto** (default) / approve / smart_approve | v1.60.2 (2026-11-22) | [agent-goose.md](agent-goose.md) |
| [Crush](https://github.com/charmbracelet/crush#allowing-tools) | Charm | Local CLI (built-in Go shell) | none | none | none | Prompt for reads outside cwd (tool-level) | none; `curl`/`wget`/`ssh` blocked by name | Prompt by default; `allowed_tools`; `-y` / `-yy` | v0.102.0 (2026-11-22) | [agent-crush.md](agent-crush.md) |
| [Warp](https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/) | Warp | Local terminal; cloud agents in Docker | none | none (cloud: Docker) | none | Profile dir allow/deny (tool-level) | none locally | Per-action Agent Decides / Ask / Allow; regex allow/denylist; auto-approve bypasses user denylist | Docs read 2026-11-22 | [agent-warp.md](agent-warp.md) |
| [Augment (Auggie)](https://docs.augmentcode.com/cli/permissions) | Augment Code | Local CLI/IDE; Cosmos cloud | none | none (cloud: container/VM) | none | User's full access; tool rules (not enforced in IDE ext.) | none locally | `toolPermissions` allow/deny/ask-user/webhook | Docs read 2026-11-22 | [agent-augment.md](agent-augment.md) |
| [Amp](https://ampcode.com/docs/tools#permissions) | Amp Inc. (ex-Sourcegraph) | Local CLI; cloud "orbs" (E2B microVMs) | none | none (orbs: microVM) | none | User's full access | none locally; orb egress open | **No prompts by default** since 2026-05-06; policy plugins | Docs read 2026-11-22 | [agent-amp.md](agent-amp.md) |
| [Aider](https://aider.chat/docs/config/options.html) (dormant since 2026-05) | Aider-AI | Local CLI | none (Docker image optional) | none | none | Edits chat files, auto-commits; asks for others | none | Every shell command needs a yes; `--yes-always` declines commands | 0.86.2 (2026-02-12) | [agent-aider.md](agent-aider.md) |

## Cloud and browser agents (the whole environment is the sandbox)

| Agent | Vendor | Runs | macOS | Linux | Windows | FS policy | Network policy | Approval model | As of | Source note |
|---|---|---|---|---|---|---|---|---|---|---|
| [Codex cloud](https://learn.chatgpt.com/docs/cloud/internet-access) | OpenAI | Per-task VM | — | VM | — | Repo + setup state, kept ≤ 7 days | Setup online; agent phase **off**; allowlist presets; GET-only option | Autonomous; PR review | Docs read 2026-11-22 | [openai-codex-cloud-internet-access.md](openai-codex-cloud-internet-access.md) |
| [GitHub Copilot cloud agent](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall) | GitHub | Actions runner / cloud sandbox | — | Runner VM | — | Repo checkout | Firewall + recommended allowlist (MCP servers, setup steps exempt) | Autonomous; PR review | Docs read 2026-11-22 | [github-copilot-agent-firewall.md](github-copilot-agent-firewall.md) |
| [Devin](https://docs.devin.ai/product-guides/security-profiles) | Cognition | VM per session | — | VM (hypervisor not documented) | — | Whole VM; secrets as env vars | **Open** by default; Security Profile allowlist | Autonomous; no per-command approval documented | Docs read 2026-11-22 | [agent-devin.md](agent-devin.md) |
| [Jules](https://jules.google/docs/environment) (shuts down 2026-12-31) | Google | VM per task | — | VM (tech not documented) | — | Whole VM | **Open**; no allowlist documented | Plan approval (UI auto-approves on a timer) | Docs read 2026-11-22 | [agent-jules.md](agent-jules.md) |
| [Replit Agent](https://docs.replit.com/build/code/security) | Replit | Cloud microVM | — | microVM (hypervisor not named) | — | Project; dev DB rw, prod DB read-only replica | **Open**; package firewall; git creds held by proxy | No per-command approval documented; checkpoints | Docs read 2026-11-22 | [agent-replit.md](agent-replit.md) |
| [Bolt.new](https://bolt.new/platform/security) / [Lovable](https://docs.lovable.dev/features/projects/preview) | StackBlitz / Lovable | Browser WebContainer / cloud sandbox | — | Browser sandbox / not documented (Modal per 2025 case study) | — | Virtual FS / project sandbox | Not documented | Plan modes; version history | Docs read 2026-11-22 | [agent-browser-app-builders.md](agent-browser-app-builders.md) |

Cloud modes of local agents are also documented in their notes: Amp orbs (E2B microVMs, egress open), Kiro Web (managed sandbox, "approves every action by default"), Copilot CLI `--cloud`, Warp cloud agents (Docker on GCP), Factory Droid Computers, Augment Cosmos, OpenHands Cloud (K8s pods), Cline Cloud Agents, Kilo Cloud Agent (Cloudflare containers).

## Retired or frozen in the last year (dropped from the table)

| Agent | Status | Source note |
|---|---|---|
| [Roo Code](https://roocodeinc.github.io/Roo-Code/features/auto-approving-actions) | Shut down 2026-05-15; repo archived. It had no OS sandbox, only `allowedCommands`/`deniedCommands` and `.rooignore` | [agent-roo-code.md](agent-roo-code.md) |
| [Continue](https://docs.continue.dev/cli/tool-permissions) | Final 2.0.0 (2026-06-19), "no longer maintained"; acquired by Cursor. It had no OS sandbox, only tool policies | [agent-continue.md](agent-continue.md) |
| Windsurf Cascade | Renamed Devin Desktop 2026-06-02; Cascade replaced by Devin Local (row above) | [agent-windsurf.md](agent-windsurf.md) |
| Amazon Q Developer CLI | Became Kiro CLI 2025-11-24 (row above) | [agent-kiro.md](agent-kiro.md) |
| Gemini CLI (consumer) | Replaced by Antigravity CLI for consumer accounts 2026-06-18; enterprise and paid-API users keep it ([Google blog, 2026-05-19](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)) | [gemini-cli-sandbox.md](gemini-cli-sandbox.md) |

## Tally (23 current local agents)

| Posture | Count | Agents |
|---|---|---|
| OS sandbox **on by default** | 4 | Codex CLI, Cursor, Zed Agent, Google Antigravity |
| OS sandbox shipped but **opt-in** | 10 | Claude Code, Gemini CLI, Copilot CLI, VS Code agent mode, Devin Local, Kiro, Junie (CLI only, EAP), Factory Droid, Kilo Code, Qwen Code |
| Container only, opt-in (no native OS sandbox) | 1 | OpenHands (Docker; was the default in the legacy launcher) |
| **None: approval prompts or rules only** | 8 | Cline, opencode, goose, Crush, Warp, Augment, Amp (not even prompts by default), Aider |

So 14 of 23 ship an OS sandbox, but only 4 turn it on by default. In the default configuration, **19 of 23 run the agent's shell commands as the user with no OS boundary**. All 6 cloud and browser agents isolate the whole environment in a VM, microVM, container or browser sandbox. Only 2 of those, Codex cloud and Copilot cloud agent, restrict egress by default; Devin, Jules and Replit document open egress, and Bolt and Lovable don't document it.

## Observations (slide candidates)

1. **One recipe, everywhere.** Every local OS sandbox is Seatbelt on macOS, bubblewrap or Landlock plus seccomp on Linux, and a userspace egress proxy with a domain allowlist. Almost all arrived in 2026. Vendors increasingly reuse rather than build: Junie CLI and VS Code's first terminal sandbox use Anthropic's `srt`, and Copilot CLI, VS Code and Factory (on Windows) use Microsoft's MXC, which Codex now also uses on Windows.
2. **Shipped is not the same as on.** Only Codex, Cursor, Zed and Antigravity sandbox by default. Everyone else leaves it opt-in, and 8 of the top agents (Cline, opencode, goose, Amp and others) have no OS sandbox at all, with docs that say so. The default control is still a prompt or a string-matching allowlist.
3. **Prompts are being automated away, not removed.** Classifier or "AI check" approvers are now common: Cursor Auto-review, Claude Code `auto`, Codex `auto_review`, Antigravity Auto, Qwen `auto`, Devin Smart, Copilot Assisted. Some tools go straight to YOLO by default: Amp since 2026-05, Cline CLI's `--auto-approve` defaulting to true, and goose's default `auto` mode.
4. **"Sandboxed" does not mean "offline".** Network defaults split. Claude Code, Codex, Cursor, Zed, Kiro, Kilo, Factory and Antigravity are closed with an allowlist. VS Code, Copilot CLI, Junie, Devin Local and the Gemini/Qwen Seatbelt default are open. Most cloud agents (Devin, Jules, Replit, Amp orbs) also ship with open egress, so the exfiltration leg of the lethal trifecta stays open.
5. **Windows and the edges are the gaps.** Native Windows is sandboxed only by Codex, Copilot CLI/VS Code, Factory (all via MXC), Antigravity (AppContainer), Kiro and Gemini CLI. The others fall back to WSL2 or run unsandboxed. Even where a sandbox exists it covers only the agent's shell. MCP servers, language servers, git hooks and IDE tasks run the agent's output later outside it, which the Zed, Claude Code and Kilo docs each say explicitly.

## Links: each agent's sandbox, security or permissions documentation

- Claude Code: https://code.claude.com/docs/en/sandboxing
- OpenAI Codex CLI: https://learn.chatgpt.com/docs/sandboxing
- OpenAI Codex cloud: https://learn.chatgpt.com/docs/cloud/internet-access
- Gemini CLI: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/sandbox.md (retirement: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- Google Antigravity: https://antigravity.google/docs/sandbox/
- Cursor: https://cursor.com/docs/agent/security/run-modes (engineering post: https://cursor.com/blog/agent-sandboxing)
- GitHub Copilot CLI: https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes
- VS Code Copilot agent mode: https://code.visualstudio.com/docs/agents/run/agent-sandboxing
- GitHub Copilot cloud agent: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/customize-the-agent-firewall
- Devin Desktop / Devin Local (ex-Windsurf): https://docs.devin.ai/cli/sandbox (permissions: https://docs.devin.ai/cli/reference/permissions)
- Devin (cloud): https://docs.devin.ai/product-guides/security-profiles
- Kiro (incl. ex-Amazon Q Developer CLI): https://kiro.dev/docs/sandbox/
- Zed Agent: https://zed.dev/docs/ai/sandboxing (permissions: https://zed.dev/docs/ai/tool-permissions)
- JetBrains Junie: https://junie.jetbrains.com/docs/junie-cli.html
- Factory Droid: https://docs.factory.com/autonomy-and-safety/sandbox
- Kilo Code: https://kilo.ai/docs/getting-started/settings/sandboxing
- Qwen Code: https://qwenlm.github.io/qwen-code-docs/en/users/features/sandbox/
- OpenHands: https://docs.openhands.dev/openhands/usage/agent-canvas/backend-setup/docker-execution
- Cline: https://docs.cline.bot/features/auto-approve
- opencode: https://opencode.ai/docs/permissions
- goose: https://goose-docs.ai/docs/guides/managing-tools/goose-permissions
- Crush: https://github.com/charmbracelet/crush#allowing-tools
- Warp: https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/
- Augment (Auggie): https://docs.augmentcode.com/cli/permissions
- Amp: https://ampcode.com/docs/tools#permissions
- Aider: https://aider.chat/docs/config/options.html
- Jules: https://jules.google/docs/environment
- Replit Agent: https://docs.replit.com/build/code/security
- Bolt.new: https://bolt.new/platform/security
- Lovable: https://docs.lovable.dev/features/projects/preview
- Roo Code (retired): https://roocodeinc.github.io/Roo-Code/features/auto-approving-actions
- Continue (frozen): https://docs.continue.dev/cli/tool-permissions
