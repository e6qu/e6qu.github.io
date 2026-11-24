# Agent sandboxing — original sources

Sandboxes for coding agents (local and hosted), and the threat-model writing
and incidents that explain why they look the way they do. All sources read
2026-11-22.

## Index

### Local agent sandboxes
- [anthropic-sandbox-runtime.md](anthropic-sandbox-runtime.md) — Anthropic `srt` repo: Seatbelt / bubblewrap+seccomp / Windows user+WFP, host HTTP+SOCKS proxy with domain allowlists, credential masking, long list of limitations.
- [anthropic-beyond-permission-prompts.md](anthropic-beyond-permission-prompts.md) — Anthropic engineering post (2025-10-20): sandboxing cut permission prompts by 84%; git credential proxy for Claude Code on the web.
- [claude-code-sandboxing-docs.md](claude-code-sandboxing-docs.md) — Claude Code sandbox docs: modes, defaults, unsandboxed-retry escape hatch, what runs outside the sandbox.
- [openai-inside-the-codex-sandbox.md](openai-inside-the-codex-sandbox.md) — OpenAI post (2026-11-18): native per-OS sandboxes + shared network proxy; DNS only after approval; Windows via MXC.
- [openai-codex-windows-sandbox.md](openai-codex-windows-sandbox.md) — OpenAI post (2026-05-13): why AppContainer/Windows Sandbox/MIC didn't fit; sandbox users + firewall + restricted tokens.
- [openai-codex-linux-sandbox-readme.md](openai-codex-linux-sandbox-readme.md) — Codex Linux helper README: Landlock → bubblewrap migration, seccomp blocks `io_uring`, proxy bridging.
- [openai-codex-sandbox-docs.md](openai-codex-sandbox-docs.md) — Codex docs: sandbox modes vs approval policies; "The sandbox reduces approval fatigue."
- [gemini-cli-sandbox.md](gemini-cli-sandbox.md) — Gemini CLI: Seatbelt profiles, Docker/Podman, gVisor, LXC, Windows low-integrity; default flipped from `(allow default)` to `(deny default)` in 2026.
- [cursor-agent-sandboxing.md](cursor-agent-sandboxing.md) — Cursor post (2026-02-18): macOS options compared, Seatbelt chosen; Landlock+seccomp on Linux; WSL2 on Windows; 40% fewer stops.
- [github-copilot-agent-firewall.md](github-copilot-agent-firewall.md) — Copilot cloud agent: Actions runner/cloud sandbox with default egress allowlist; MCP servers and setup steps not covered.
- [docker-sandboxes.md](docker-sandboxes.md) — Docker Sandboxes (`sbx`): microVM per agent with private Docker daemon, deny-by-default proxy, credential injection; git-hook caveat.
- [docker-blog-2026-11-sandboxes-vs-containers.md](docker-blog-2026-11-sandboxes-vs-containers.md) — Docker blog (2026-11-05): a container is the wrong boundary for an agent ("an actor"); docker.sock hands over the host daemon; "Sandbox the agent, containerize the application it works on."
- [a1crew-2026-containers-vs-sandboxes-video.md](a1crew-2026-containers-vs-sandboxes-video.md) — YouTube explainer (2026-11-22, 12 min) retelling Docker's post, plus Claude Code's sandbox, nested-virtualization CI and Wasm; claims checked ("containers are dead", "under a second" and the CI trap don't hold).
- [dagger-container-use.md](dagger-container-use.md) — container-use MCP server: container + git branch per agent for parallel work.
- [microsandbox.md](microsandbox.md) — microsandbox: embeddable libkrun microVMs (<100 ms boot), host allowlists, secrets bound to hosts.
- [apple-container-agent-sandboxes.md](apple-container-agent-sandboxes.md) — Apple `container` (VM per container, macOS 26) as used by Mastra's AppleContainerSandbox.

### Deep dive: how each agent sandboxes, per OS (2026-11-22)
- [deep-dive-sandboxes-by-os.md](deep-dive-sandboxes-by-os.md) — Source-level report covering macOS, Linux, Windows native and WSL: exact Seatbelt/bwrap/seccomp/Windows mechanisms per agent, network plumbing (socat / relay / slirp4netns), a seccomp comparison table, cloud agents, known escapes by mechanism, slide takeaways, and corrections to the matrix.
- [srt-source-seatbelt-bwrap-seccomp.md](srt-source-seatbelt-bwrap-seccomp.md) — srt v0.0.83 source: generated `(deny default)` profile, bwrap argv + two socat hops, `apply-seccomp` (AF_UNIX/VSOCK, io_uring, ns/mount syscalls), srt-win and the opt-in MXC backend.
- [codex-sandboxing-source.md](codex-sandboxing-source.md) — Codex source: the four `.sbpl` files, `-DWRITABLE_ROOT` params, protected `.git/.agents/.codex/.aws`, per-mode seccomp rules, `/run/WSL` masking, Windows backend selection (default Disabled, MXC opt-in).
- [zed-sandbox-crates.md](zed-sandbox-crates.md) — Zed `sandbox` crate (Seatbelt, non-setuid bwrap + launcher seccomp, WSL helper) and the experimental seccomp-unotify `sandbox_linux` design (2026-11-17).
- [mxc-seatbelt-bubblewrap-backends.md](mxc-seatbelt-bubblewrap-backends.md) — MXC on macOS (`sandbox_init()` between fork and exec) and Linux (bwrap `--seccomp FD`, slirp4netns + in-namespace iptables), used by Copilot CLI and VS Code.
- [gemini-cli-tool-sandbox-source.md](gemini-cli-tool-sandbox-source.md) — Gemini CLI tool sandbox: `(import "system.sb")`, `bwrap --unshare-all` + ptrace-only BPF, and Windows restricted token + Low IL + job-object bandwidth throttle; `toolSandboxing` defaults to false.
- [cursor-run-modes-sandbox-docs.md](cursor-run-modes-sandbox-docs.md) — Cursor docs: Seatbelt; Landlock v3 + seccomp with bubblewrap fallback; WSL2 on Windows; sandbox.json network policy; protected-path list; Auto-review default.
- [opencode-v2-permissions.md](opencode-v2-permissions.md) — OpenCode 2 (Oct 2026): still no OS sandbox; new ordered `permissions` rules; `external_directory` now allowed by default (V1 asked).
- Companion: [deep-dive-cloud-and-china.md](deep-dive-cloud-and-china.md) — Cloud sandbox platforms (AgentCore, Google, Azure, Vercel, Cloudflare, E2B, Modal, Daytona, Sprites, Runloop, Morph: isolation unit, lifecycle, egress, credentials, authz, pricing) and Chinese coding agents per OS (Qoder, TRAE, CodeBuddy, Comate, Kimi, ZCode, DeepSeek Harness, MiniMax, MiMo …) plus their clouds; known bypasses; slide takeaways.

### Survey: top coding agents (2026-11-22)
- [top-coding-agents-matrix.md](top-coding-agents-matrix.md) — Matrix of ~30 coding agents (runs where, per-OS isolation, FS/network policy, approval model), with tally (14/23 local agents ship an OS sandbox, 4 on by default, 8 none), observations and doc links.
- Per-agent notes: [agent-google-antigravity.md](agent-google-antigravity.md), [agent-github-copilot-cli.md](agent-github-copilot-cli.md), [agent-vscode-copilot-agent-mode.md](agent-vscode-copilot-agent-mode.md), [agent-windsurf.md](agent-windsurf.md) (now Devin Desktop/Local), [agent-devin.md](agent-devin.md), [agent-kiro.md](agent-kiro.md) (incl. ex-Amazon Q CLI), [agent-zed.md](agent-zed.md), [agent-jetbrains-junie.md](agent-jetbrains-junie.md), [agent-factory-droid.md](agent-factory-droid.md), [agent-kilo-code.md](agent-kilo-code.md), [agent-qwen-code.md](agent-qwen-code.md), [agent-openhands.md](agent-openhands.md), [agent-cline.md](agent-cline.md), [agent-opencode.md](agent-opencode.md), [agent-goose.md](agent-goose.md), [agent-crush.md](agent-crush.md), [agent-warp.md](agent-warp.md), [agent-augment.md](agent-augment.md), [agent-amp.md](agent-amp.md), [agent-aider.md](agent-aider.md), [agent-jules.md](agent-jules.md), [agent-replit.md](agent-replit.md), [agent-browser-app-builders.md](agent-browser-app-builders.md) (Bolt.new, Lovable), [agent-roo-code.md](agent-roo-code.md) (retired), [agent-continue.md](agent-continue.md) (frozen).

### Optional controls and approval fatigue (added 2026-11-23)
- [anthropic-2026-03-claude-code-auto-mode.md](anthropic-2026-03-claude-code-auto-mode.md) — Anthropic engineering (2026-03-25): approval fatigue named; users accept 93% of prompts; the escape is `--dangerously-skip-permissions`; classifier misses 17% of real overeager actions.
- [anthropic-2026-08-auto-mode-default.md](anthropic-2026-08-auto-mode-default.md) — Anthropic (2026-08-07): 97% of prompts approved; 25% of interactive sessions start in bypass mode; testers caught 13.6% of a swapped-in dangerous command, ~17% early in a session falling to ~5% after 50 prompts.
- [claude-code-permission-modes-docs.md](claude-code-permission-modes-docs.md) — Claude Code docs: `bypassPermissions` = `--dangerously-skip-permissions`, "Isolated containers and VMs only"; "The sandbox is off by default."
- [codex-cli-yolo-flag-docs.md](codex-cli-yolo-flag-docs.md) — Codex CLI reference: `--dangerously-bypass-approvals-and-sandbox`, alias `--yolo`; sandbox on by default; `--not-so-yolo`.
- [gemini-cli-yolo-sandbox-default.md](gemini-cli-yolo-sandbox-default.md) — Gemini CLI docs: "Sandboxing is disabled by default"; `--yolo` auto-approves all and (per docs) turns the sandbox on; `toolSandboxing` default false.
- [docker-blog-2026-09-what-is-yolo-mode.md](docker-blog-2026-09-what-is-yolo-mode.md) — Docker (2026-09-03): why developers turn approvals off ("Prompt fatigue"); "Once permission fatigue kicks in…"; Docker's tutorial starts Claude Code with skip-permissions inside its sandbox.
- Cursor: see the 2026-11-23 addendum in [cursor-run-modes-sandbox-docs.md](cursor-run-modes-sandbox-docs.md) (Run Everything; "Ask Every Time" deprecated in 3.5).
- Classic warning-fatigue papers are in [../arxiv/README.md](../arxiv/README.md), section 6.

### Hosted agent sandboxes
- [e2b-runtime.md](e2b-runtime.md) — E2B runtime: Firecracker, snapshot-restore via userfaultfd, pause/resume, fork ×100, SNI-inspecting egress firewall.
- [modal-sandboxes.md](modal-sandboxes.md) — Modal: gVisor by default (VM optional), 5 min–24 h lifetime, CIDR/SNI egress allowlists with fronting caveat.
- [vercel-sandbox.md](vercel-sandbox.md) — Vercel Sandbox: Firecracker, persistent by default, TLS-terminating firewall injects credentials, Active-CPU billing.
- [cloudflare-sandbox-sdk.md](cloudflare-sandbox-sdk.md) — Cloudflare Sandbox SDK: microVM containers via Durable Objects, or V8-isolate Dynamic Workers.
- [daytona-sandboxes.md](daytona-sandboxes.md) — Daytona: <90 ms sandboxes, fork/archive lifecycle, tiered egress, "essential services".
- [flyio-sprites-code-and-let-live.md](flyio-sprites-code-and-let-live.md) — Fly.io Sprites (2026-01-09): durable Firecracker machines with ~1 s checkpoint/restore; "The age of sandboxes is over."
- [openai-codex-cloud-internet-access.md](openai-codex-cloud-internet-access.md) — Codex cloud: networked setup phase, offline agent phase, allowlist presets, proxy-substituted secrets.
- [anthropic-managed-agents-environments.md](anthropic-managed-agents-environments.md) — Claude Managed Agents environments: container per session, limited vs unrestricted networking, "granted by host, not by operation".
- [anthropic-code-execution-tool.md](anthropic-code-execution-tool.md) — Claude code execution tool: air-gapped container, 5 GiB/1 CPU, checkpointed after 5 min idle, 30-day expiry.
- [openai-code-interpreter.md](openai-code-interpreter.md) — OpenAI Code Interpreter: sandboxed VM container, 20-minute idle expiry, 1–64 GB tiers.

### Threat models
- [willison-lethal-trifecta.md](willison-lethal-trifecta.md) — Simon Willison (2025-06-16): private data + untrusted content + external communication = exfiltration.
- [willison-living-dangerously.md](willison-living-dangerously.md) — Simon Willison (2025-10-22): YOLO mode's value and risk; "The only solution that's credible is to run coding agents in a sandbox."
- [owasp-llm-top10-2025.md](owasp-llm-top10-2025.md) — OWASP LLM Top 10 2025, esp. LLM06 Excessive Agency.
- [owasp-agentic-top10-2026.md](owasp-agentic-top10-2026.md) — OWASP Top 10 for Agentic Applications (2025-12-09), esp. ASI05 Unexpected Code Execution.
- [trailofbits-vms-wont-contain-agents.md](trailofbits-vms-wont-contain-agents.md) — Trail of Bits, 2026-08: a preview cyber model escaped a QEMU/KVM VM three times through QEMU, libslirp and host-kernel bugs (not the hardware boundary); recommends minimal VMMs (Firecracker), fresh environments, least privilege, monitoring.

### Incidents and supply chain
- [replit-database-deletion-2025.md](replit-database-deletion-2025.md) — Replit agent deleted a production database during a code freeze (July 2025).
- [invariant-github-mcp-exploit.md](invariant-github-mcp-exploit.md) — GitHub MCP "toxic agent flow": issue injection leaks private repos via a PR (2025-05-26).
- [embracethered-claude-code-dns-exfil.md](embracethered-claude-code-dns-exfil.md) — CVE-2025-55284: Claude Code exfiltration via auto-allowed `ping`/DNS (2025-08-11).
- [nx-s1ngularity-ai-cli-malware.md](nx-s1ngularity-ai-cli-malware.md) — Nx npm compromise (2025-08-26) whose payload ran `claude --dangerously-skip-permissions`, `gemini --yolo`, `q --trust-all-tools`.
- [amazon-q-extension-compromise.md](amazon-q-extension-compromise.md) — AWS-2025-015: malicious code shipped in Amazon Q VS Code extension 1.84.0 (July 2025).
- [postmark-mcp-malicious-package.md](postmark-mcp-malicious-package.md) — First widely reported malicious MCP server: BCC backdoor in `postmark-mcp` 1.0.16 (Sept 2025).
- [slopsquatting-package-hallucinations.md](slopsquatting-package-hallucinations.md) — USENIX Security 2025 paper: 5.2–21.7% of LLM-recommended packages don't exist; 205,474 unique names.

## Comparison of agent sandboxes

"FS" = filesystem policy; "Net" = default network policy. Mechanisms as documented on the date accessed; several products changed mechanism within the last year.

| Sandbox | macOS | Linux | Windows | FS policy (default) | Net policy (default) | Runs where |
|---|---|---|---|---|---|---|
| Anthropic srt / Claude Code | Seatbelt (`sandbox-exec`, generated profile) | bubblewrap (netns removed) + seccomp (blocks `AF_UNIX`) + socat bridge | srt: alpha, dedicated user + WFP + ACLs, or MXC; Claude Code: native Windows unsandboxed (WSL2 ok) | Read most of disk; write CWD + temp; mandatory deny on rc files, `.git/hooks`, `.mcp.json`, `.claude` | Deny all; host HTTP+SOCKS proxy with domain allowlist; prompt on new domain; optional TLS-terminate for credential masking | Local process tree |
| OpenAI Codex CLI | Seatbelt SBPL, `(deny default)` | bubblewrap + seccomp + `no_new_privs` (Landlock = legacy) | Was: sandbox users + firewall + restricted token (admin setup); now MXC | `workspace-write`: write workspace, `.git`/`.codex` read-only; broad reads | Disabled; optional proxy with domain allow/deny, DNS after approval | Local process tree |
| Gemini CLI | Seatbelt profiles (default `permissive-open`) | Docker/Podman, gVisor `runsc`, LXC; bwrap in tool sandboxing | Low-integrity labels via `icacls` | Write project dir; broad reads (default profile) | Default profile: **open**; `-proxied` profiles via proxy | Local process / container |
| Cursor | Seatbelt | Landlock + seccomp (overlay FS) | Linux sandbox in WSL2 | Workspace; `.cursorignore` files hidden; `.git/hooks`, `.vscode` protected | Restricted; internet is main escalation request | Local process tree |
| Docker Sandboxes | microVM (hypervisor not named) | microVM | microVM | Workspace passthrough (direct) or clone/mountless | Deny-by-default host proxy, some broad defaults; credential injection | Local or Docker cloud |
| microsandbox | libkrun microVM (Apple silicon) | libkrun/KVM | WHP | Guest FS + mounts | Per-host allowlist; host-bound secrets | Local, embedded |
| Apple `container` (e.g. Mastra) | VM per container (macOS 26) | — | — | Bind mounts | Configurable network attachment | Local |
| GitHub Copilot cloud agent | — | Actions runner / cloud sandbox | — | Repo checkout in runner | Firewall + recommended allowlist (MCP servers, setup steps exempt) | GitHub-hosted |
| Codex cloud | — | Per-task VM/container | — | Repo + install-script state, kept ≤7 days | Setup phase online; agent phase **off**, allowlist presets, GET-only option | OpenAI-hosted |
| Claude Managed Agents | — | Fresh Linux container per session | — | Session-private FS | `limited` (allowed_hosts) or `unrestricted` (API default if omitted) | Anthropic-hosted or self-hosted |
| E2B | — | Firecracker microVM | — | Snapshot CoW rootfs; pause/resume/fork | nftables + SNI/Host allow/deny lists | E2B cloud or self-host |
| Modal | — | gVisor (default) or VM | — | Container FS + snapshots | Outbound **open**; block / CIDR / SNI-domain allowlists | Modal cloud |
| Vercel Sandbox | — | Firecracker microVM | — | Persistent by default, snapshots, Drives | Outbound **open**; firewall policies; TLS-terminating credential injection | Vercel cloud |
| Cloudflare Sandbox | — | microVM container (or V8 isolate) | — | Container FS, R2 mounts | Controlled from the Worker | Cloudflare edge |
| Daytona | — | Container by default (VM types available; mechanism not stated) | (Windows sandboxes offered) | Persistent, fork/archive | Tier-dependent; CIDR + domain allowlists | Daytona cloud |
| Fly.io Sprites | — | Firecracker microVM | — | Durable disk, ~1 s checkpoint/restore | DNS-based allow/deny rules | Fly.io cloud |
| Claude code execution tool | — | Linux container | — | Ephemeral-ish, checkpointed, 30-day expiry | **No network** | Anthropic-hosted |

## Synthesis: what is new about sandboxing coding agents

Classic sandboxes contain a program whose needs are known in advance: a renderer, a daemon, a tenant's function. A coding agent is the opposite — a general-purpose shell user whose next command is chosen at runtime by a model that reads attacker-controllable text (the repository, issues, web pages, dependency READMEs). Willison's lethal trifecta names the consequence: an agent with private data, untrusted input and any outbound channel can be steered into exfiltration, and no model-side guardrail is reliable enough to be the boundary ("Model behavior is not a security control").

The mechanisms themselves are not new. Every local agent reuses old primitives — Seatbelt (deprecated, undocumented, yet used by Anthropic, OpenAI, Google and Cursor alike), bubblewrap/namespaces, seccomp-BPF, Landlock — and hosted offerings reuse Firecracker, gVisor and microVMs built for serverless. What is new is where the policy lives and what it must express:

1. **Network egress is the centre of the design.** Agents need package registries, git hosts and model APIs, so "no network" is unusable and "all network" is the exfiltration leg. Everyone converged on a userspace proxy with domain allowlists — and every vendor documents the same holes: allowlisted `github.com` permits `git push`; SNI/Host matching permits domain fronting; DNS lookups leak data (CVE-2025-55284); access is "granted by host, not by operation".
2. **Credentials must stay outside.** The repeated pattern is placeholder-inside, real-secret-injected-at-the-proxy (srt mask mode, Docker Sandboxes, Vercel, Codex cloud network secrets, microsandbox, Anthropic's git proxy). Replit and the GitHub-MCP exploit show the failure when real credentials sit within the agent's reach.
3. **The workspace is a return channel.** Writes to `.git/hooks`, shell rc files, `.vscode`, `.mcp.json`, `package.json` scripts execute later *outside* the sandbox; mandatory deny lists exist in srt, Codex and Cursor for this reason.
4. **Human-in-the-loop does not scale.** Prompts produce approval fatigue; sandboxes are sold as prompt reducers (84% fewer for Claude Code, 40% fewer stops for Cursor), with escalation requests, classifier/"auto-review" approvers, and model-readable denial reasons replacing many prompts — while YOLO flags remain a click away and were used by the Nx malware.
5. **State, density and forking.** Agents run for hours or days, mostly idle, many in parallel: hence pause/resume, ~1 s checkpoints, fork-a-live-VM, branch-per-agent, active-CPU billing and per-agent Linux users.
6. **The supply chain runs inside.** Agents install packages autonomously (and hallucinate names), and MCP servers and extensions are themselves untrusted code — often running outside the agent's sandbox.
