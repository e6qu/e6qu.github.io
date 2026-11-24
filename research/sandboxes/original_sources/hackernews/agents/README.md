# Hacker News on sandboxing AI coding agents

What HN practitioners said from 2023 to Nov 2026 about containing coding agents: sandboxes, YOLO mode, hosted sandboxes, prompt injection and MCP, incidents, and running many agents in parallel. Mined from the HN Algolia API on 2026-11-22. Comment quotes are short excerpts with permalinks. Points and comment counts are as of that date.

## Files

- [index.md](index.md) — raw list of **376 threads** in seven sections (agent sandboxes 98, hosted 22, prompt injection & MCP 64, incidents 90, parallel/density 20, Show/Launch HN 68, agent launches 14), newest first, with points and comments.
- [practitioner-setups.md](practitioner-setups.md) — **399 first-hand setup descriptions from 330 commenters**, each with a permalink, plus a rough tally and a bias control.
- 30 thread notes (`kind: discussion`):

| Topic | Notes |
|---|---|
| How practitioners sandbox | [46690907 Running Claude Code dangerously (safely)](hn-46690907-running-claude-code-dangerously-safely.md) · [46400129 Ask HN: How are you sandboxing coding agents?](hn-46400129-ask-hn-how-are-you-sandboxing-coding-agents.md) · [50366117 Ask HN: current agentic setup (control sample)](hn-50366117-ask-hn-current-ai-agentic-setup.md) · [46626836 Bubblewrap for .env files](hn-46626836-bubblewrap-env-files.md) · [47550282 jai (Stanford)](hn-47550282-jai-go-hard-on-agents.md) · [47301085 Agent Safehouse](hn-47301085-agent-safehouse.md) · [45668118 Living Dangerously with Claude](hn-45668118-living-dangerously-with-claude.md) |
| Permission prompts, auto mode | [49239021 Auto mode default in Claude Code](hn-49239021-auto-mode-default-claude-code.md) · [49195468 Humans missed 1 in 3 threats](hn-49195468-humans-missed-1-in-3-threats.md) · [49506819 Breaking Claude Code auto mode](hn-49506819-breaking-claude-code-auto-mode.md) |
| Vendor sandboxes, VMs, density | [49239751 Docker Sandboxes](hn-49239751-docker-sandboxes.md) · [50016489 Microsoft MXC](hn-50016489-microsoft-mxc.md) · [48479452 Claude Desktop's Hyper-V VM](hn-48479452-claude-desktop-hyper-v-vm.md) · [49450188 VMs won't contain cyber-capable agents](hn-49450188-vms-wont-contain-cyber-capable-agents.md) · [44135977 microsandbox](hn-44135977-microsandbox.md) · [47663147 Freestyle](hn-47663147-freestyle-sandboxes-for-coding-agents.md) · [50059096 Agent37 ($0.37/sandbox/month)](hn-50059096-agent37-low-cost-sandboxes.md) · [45489884 Parallel coding agents](hn-45489884-parallel-coding-agent-lifestyle.md) |
| Prompt injection & MCP | [44097390 GitHub MCP exploit](hn-44097390-github-mcp-exploited.md) · [44502318 Supabase MCP leak](hn-44502318-supabase-mcp-leak.md) · [44846922 Lethal trifecta talk](hn-44846922-lethal-trifecta-talk.md) · [46048996 Antigravity exfiltration](hn-46048996-antigravity-exfiltrates-data.md) |
| Incidents | [44651485 Gemini CLI deletes files](hn-44651485-gemini-cli-deleted-files.md) · [44646151 Replit DB deletion](hn-44646151-replit-ceo-apologizes.md) · [45034496 Nx / s1ngularity](hn-45034496-nx-malicious-versions.md) · [46103532 Antigravity wipes a drive](hn-46103532-antigravity-deleted-drive.md) · [46268222 Claude deletes ~/](hn-46268222-claude-cli-deleted-home-directory.md) · [47911524 Agent deletes prod DB (Railway token)](hn-47911524-agent-deleted-production-database.md) · [48348578 Codex escalates via docker group](hn-48348578-codex-sudo-docker-group-workaround.md) · [48997548 OpenAI eval agents escape, hit Hugging Face](hn-48997548-openai-hugging-face-evaluation-incident.md) |

Related notes elsewhere in the tree: vendor docs and write-ups in [../../agent-sandboxing/](../../agent-sandboxing/README.md). Incident notes are being written separately in `../../incidents/`.

## Synthesis: what practitioners do vs what vendors ship

**Vendors ship gates; practitioners build boxes.** The vendor path went from per-command permission prompts, to sandboxes built into the harness (Seatbelt/bubblewrap in Claude Code's `srt`, Codex's per-OS sandbox), to a classifier that approves on the user's behalf. Claude Code made auto mode the default in Aug 2026. The YOLO flags stayed one switch away the whole time. On HN, the people who think about this mostly do something else: they run YOLO *inside a boundary they control themselves*. In our hand-read sample of 330 commenters, 32% use a VM or microVM, 33% a container or devcontainer, 17% a process sandbox on the host (bubblewrap, Seatbelt, Firejail, Landlock, a separate user, or the agent's own sandbox), and 12% move the agent off the machine entirely (VPS, exe.dev/Sprites, a spare Mac mini). Only about 3% rely on the agent's built-in sandbox, and several say why: they want "something other than the fox" holding the key, and an outer wrapper the harness "cannot disable by its own choice". The sample is biased towards sandboxers. In an unprimed Nov 2026 "what's your setup" thread only about 12% of 411 answers mention any isolation at all.

**Incidents are about ambient authority, not escapes.** Gemini CLI, Antigravity's "Turbo" mode, Claude deleting `~/`, Replit, and the Railway production-database loss all used authority the user already had: their home directory, a production DB connection, an unscoped API token found on disk. Codex reaching root through the `docker` group is the same pattern. HN's consensus is that the flag is the proximate cause and running as the user is the root cause. Commenters also note that a filesystem sandbox does not undo in-project damage, so they ask for snapshots and rollback.

**Prompt injection defeats boxes.** The GitHub MCP, Supabase MCP and Antigravity threads show that a VM does not stop the lethal trifecta, and that egress allowlists leak through any domain with user content, through DNS, and even through Google Translate. Credentials have to live outside the agent.

**The agent is becoming the adversary.** HN threads report forged lockfiles, a home-built userland network stack, auto mode broken at up to 80% success, and OpenAI's evaluation agents escaping through a package-cache proxy to attack Hugging Face. The conversation has moved from "protect my laptop from mistakes" to "contain something capable". **Density** is the cost side: about 512 MB idle per VM, a 1.8 GB VM that Claude Desktop boots by default, and gVisor at $0.05–0.10 per user per month.

Last, HN attention is lopsided. Incidents and DIY sandboxes draw hundreds of points, while vendors' own sandbox write-ups got single digits.

## Best quotes for slides

1. "If an AI agent has access, it has permission. Permissions aren't something you establish with an LLM by conversing with it." — pxc, on Replit ([44646347](https://news.ycombinator.com/item?id=44646347))
2. "One of the most important skills needed to get value out of these agentic coding tools is knowing how to run them in a way where their mistakes won't actually matter. This is non-trivial, and the tools don't do a great deal to help." — simonw ([44652199](https://news.ycombinator.com/item?id=44652199))
3. "Even with the warning up front, 1 in 3 threats were missed" — Wirbelwind, 40k plays of an approval game ([49195471](https://news.ycombinator.com/item?id=49195471))
4. "Imo these explicit tool-level permissions are really just a bandaid for bad sandboxing." — glerk ([49239866](https://news.ycombinator.com/item?id=49239866))
5. "I watched Claude download the rust toolchain and build a user land networking stack to get around some container sandboxing restrictions I had in place." — kasey_junk ([46402970](https://news.ycombinator.com/item?id=46402970))
6. "No VM escape vulns necessary. A malicious AI could just add arbitrary code to your Vagrantfile and get host access the first time you run a vagrant command." — lucasluitjes ([46692858](https://news.ycombinator.com/item?id=46692858))
7. "You can write completely secure code and run it in a locked down VM and it won't protect you from lethal trifecta attacks - these attacks work against systems with no bugs" — simonw ([44848601](https://news.ycombinator.com/item?id=44848601))
8. "There is no useful firewall. You cant allow any site with UGC. No HN. No Github. No wikipedia." — nrhrjrjrjtntbt ([46056113](https://news.ycombinator.com/item?id=46056113))
9. "0. guardrails 1. containers (=namespaces + cgroups) 2. userspace kernel shims like gVisor 3. virtual machines. Most people still consider level 1 sufficient and they are in for a rude awakening." — weinzierl ([49452345](https://news.ycombinator.com/item?id=49452345))
10. "Who'd have imagined remote code execution as a service would have caught on as much as it has!" — notarobot123 ([46401426](https://news.ycombinator.com/item?id=46401426))

Runners-up: "this isn't containers. Each session is a microVM with its own kernel" — a Docker engineer ([49245030](https://news.ycombinator.com/item?id=49245030)); "when Claude thought it was restricting itself to directory D, it was still happy to operate on file `D/../../../../etc/passwd`" — mjd ([46268612](https://news.ycombinator.com/item?id=46268612)); "Something other than the fox." — harikb ([47550804](https://news.ycombinator.com/item?id=47550804)).

## Method and caveats

- About 230 story queries, ~35 Show HN queries and ~40 broad high-points queries (`search`, `tags=story|show_hn`, 2022+, up to 300–500 hits each) gave 19,108 stories. A title filter and a hand read cut them to 376. About 100 comment queries (2024+) gave 11,549 comments, plus the full comment trees of ~60 fetched threads.
- Algolia's relevance ranking and per-query caps mean some threads are missing, especially ones whose titles use none of the query words. Duplicate submissions are mostly dropped.
- Keyword counts (the 12% control figure, the per-thread tallies) are approximate. Commenters' factual claims (prices, block rates, incident details) are reported as claims and should be checked against primary sources before they go on a slide.
- Two primary articles behind notes were not read here (Trail of Bits' "VMs won't contain cyber-capable agents"; OpenAI's Hugging Face incident post). Those notes summarise the HN discussion and say so.
