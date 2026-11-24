---
title: "Profiles & Permissions" (Warp docs)
url: https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/
authors: Warp
date: living document; read 2026-11-22 (via docs.warp.dev llms-txt bundles and /retrieve endpoint)
accessed: 2026-11-22
kind: docs
---

## Summary
Warp is current. It markets itself as an "agentic development environment" and its client is now open source (AGPL-3.0, github.com/warpdotdev/warp). Its local agent (in the Warp terminal app and the standalone Warp Agent CLI, `warp`) runs as a local process and executes commands in your own shell. **No OS-level sandbox is documented for the local agent**: control comes from per-profile autonomy settings (Agent Decides / Always ask / Always allow / Never), a regex command allowlist and denylist, and MCP allow/deny lists. "Run until completion" / auto-approve is the YOLO switch, and by default it also bypasses the denylist. Cloud agents (the Automation Platform, formerly "Oz", now run through Warp Factories) execute in Warp-hosted isolated Docker containers on GCP, in macOS VMs, or on self-hosted runners. Their outbound network is unrestricted unless a factory declares `networkPolicy`.

## Key points
- Product status: current. The docs cover the Warp terminal, local agents, the Warp Agent CLI, the Automation Platform (cloud agents) and Warp Factories. The `oz` CLI is "a supported legacy interface", and new multi-stage workflows should use Factories (https://docs.warp.dev/agents/cli/oz-cli/agent-profiles/). The client repo is AGPL-3.0 (master f8223cef2d, pushed 2026-11-21).
- Runs: the local agent runs in the terminal app or the `warp` Agent CLI on your machine. Cloud agents run on Warp-hosted sandboxes or a self-hosted runner (`oz-agent-worker`) that executes tasks in Docker, a Kubernetes Job, or directly on the host (https://docs.warp.dev/factories/self-hosting/).
- Isolation (local): none documented on macOS, Linux or Windows. Commands run as the user in the user's shell. Computer Use is "only available in Warp's sandboxed cloud environments, not in local interactive terminal sessions". A GitHub feature request, "Add Sandbox Mode Feature" (warpdotdev/warp#12560), is still open. The client source contains an `sbx`-managed Docker-sandbox shell starter (`crates/warp_terminal/src/local_tty/docker_sandbox.rs`), but user docs do not describe it as a shipped feature, so treat it as undocumented.
- Isolation (cloud): Warp-hosted Linux runners "execute the agent in a fresh Docker container" (default image `warpdotdev/dev-base:latest`), on GCP, and the container runs as a non-root user by default. These runners can also run Docker and KVM VMs inside, which implies a VM-backed host, but the exact virtualization layer is not documented. macOS runners run in "a fresh VM on Apple Silicon". Environments are ephemeral (https://docs.warp.dev/factories/runners/, https://docs.warp.dev/enterprise/enterprise-features/architecture-and-deployment/).
- Filesystem: local, the user's full access. Oz/CLI agent profiles add "directory allowlists and denylists", which are tool-level checks. The details are not spelled out on the pages read. Cloud runs see only the container or VM.
- Network: local, unrestricted, although `curl` and `wget` are on the default command denylist so they prompt first. Cloud: "If neither scope declares a policy, outbound access is unrestricted". A factory's `networkPolicy` (`allowedHosts`, `deniedHosts`, `extends: warp/package-registries@1.0.0`) blocks everything else except platform services (https://docs.warp.dev/factories/factory-as-code/#networkpolicy). The enforcement mechanism is not described.
- Approvals: each Agent Profile sets autonomy per action type (apply code diffs, read files, create plans, execute commands, interact with running commands, ask questions) to Agent Decides, Always ask, Always allow or Never. The command allowlist (regex) is empty by default, and allowlisted commands "always auto-execute, even if they are not read-only". The default command denylist includes `wget`, `curl`, `rm` and `eval`, and it beats both the allowlist and Agent Decides. MCP servers have their own allowlist and denylist. In the Agent CLI, shell, file edits, reads and MCP default to `agent_decides` (file edits always show a diff), while typing into a running command and launching child agents always ask (https://docs.warp.dev/agents/cli/permissions-and-profiles/).
- YOLO: "Run until completion" / auto-approve (`Cmd+Shift+I` or `Ctrl+Shift+I`, `/auto-approve`, `warp --auto-approve`) is described as "the purest form of 'YOLO' mode" and by default also runs denylisted commands. Turn that off with "Allow auto-approve to bypass command denylist" or `auto_approve_bypasses_command_denylist = false`. The Oz CLI's default profile is "broadly permissive".
- Enterprise: Admin Panel denylist rules "always require approval and are never bypassed", even under auto-approve. The enterprise security overview lists "Docker Sandboxes" (process isolation, resource limits, outbound network restrictions) for agent execution, in the cloud context (https://docs.warp.dev/enterprise/security-and-compliance/security-overview/).

## Excerpts
> "*Run until completion* is the purest form of 'YOLO' mode: the Agent proceeds without asking for confirmation, and by default it also runs commands that match your command denylist." (Profiles & Permissions, Run until completion)

> "Commands in the allowlist will always auto-execute, even if they are not read-only operations." (Profiles & Permissions, Command allowlist)

> "Warp-hosted Linux runners execute the agent in a fresh Docker container." (Runners for Warp Factories, Operating systems)

> "If neither scope declares a policy, outbound access is unrestricted." (factory.yaml, networkPolicy)

## Relevance to the talk
Warp is a terminal-native agent where the "sandbox" is just your shell: local safety is regex allow/deny lists and per-action autonomy dials, and the documented YOLO mode skips the denylist by default. Real isolation comes only from moving to the cloud (Docker on GCP, macOS VMs), and even there egress is open unless you write a `networkPolicy`. That makes Warp a good counterpoint to the Seatbelt/bubblewrap camp, and an example of "admin-enforced denylist" as the only non-bypassable local control.
