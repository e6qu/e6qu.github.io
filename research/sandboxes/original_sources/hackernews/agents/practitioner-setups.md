# Practitioner sandbox setups described on Hacker News

How HN commenters say they *actually* run coding agents (Claude Code, Codex, Gemini CLI, opencode, pi, Cursor…), 2024 to Nov 2026. Each entry links to the comment.

**Method.** About 100 comment-search queries on the HN Algolia API (`tags=comment`, 2024+) with setup words ("dangerously-skip-permissions docker", "bubblewrap claude", "lima agent", "separate user", "i run claude"…), plus all comments in the ~60 threads fetched for notes. That gave 11,549 comments. A filter kept first-person sentences ("I/we run/use…") that name a setup and an agent, which left 767 sentences. Each was read by hand: 399 entries from 330 distinct commenters remain. Entries are grouped by the setup each comment describes; one commenter can appear in several groups, but the tally counts each commenter once, at their strongest layer.

**Bias warning.** The sample comes from searches for sandbox words, so it over-represents people who sandbox. As a control, in the general *"Ask HN: What's your current AI agentic setup?"* thread ([50366117](https://news.ycombinator.com/item?id=50366117), Nov 2026, 411 top-level answers) only about 12% of answers mention any container, VM or sandbox, and only about 4% a remote box. Read the tally below as "what people who think about this choose", not as "what most users do".

## Rough tally (one primary setup per commenter, N = 330)

| Primary setup | Commenters | Share |
|---|---|---|
| Remote VPS / cloud VM (Hetzner, exe.dev, Sprites, EC2, Linode…) | 27 | 8% |
| Vendor cloud agent or hosted sandbox (Claude Code web, E2B, Amika…) | 6 | 2% |
| Dedicated physical machine (spare laptop, Mac mini, mini-PC, separate subnet) | 6 | 2% |
| Full VM (Vagrant/VirtualBox, Lima, QEMU/KVM, libvirt, Incus VMs, Proxmox, UTM, Parallels, Hyper-V, WSL, OrbStack machines) | 87 | 26% |
| Docker Sandboxes (`sbx`, microVM per session) | 10 | 3% |
| Other microVMs (Firecracker, Kata, Cloud Hypervisor, smolvm, SlicerVM) | 8 | 2% |
| Apple `container` (VM per container) | 2 | 1% |
| Docker / Podman / k8s container (incl. rootless, gVisor runtime, wrappers such as yoloai, jai, container-use) | 82 | 25% |
| Dev containers (VS Code / devcontainer CLI / DevPod, often Anthropic's reference `.devcontainer`) | 21 | 6% |
| LXC / LXD / Incus system containers | 5 | 2% |
| bubblewrap wrappers (incl. Anthropic `srt` on Linux) | 23 | 7% |
| Firejail | 5 | 2% |
| macOS `sandbox-exec` / Seatbelt profiles (Agent Safehouse, sandfence, custom hooks) | 8 | 2% |
| Landlock-based tools (nono, greywall) | 3 | 1% |
| The agent's built-in sandbox or an unnamed "my own sandbox" (`/sandbox`, `srt`, Leash, fence) | 11 | 3% |
| Separate Unix/macOS user account (SandVault, per-project users) | 7 | 2% |
| YOLO / skip-permissions on the real machine (relying on git, backups, luck) | 11 | 3% |
| No YOLO: approve commands or refuse to run agents locally | 5 | 2% |
| Snapshots / worktrees as the only protection | 2 | 1% |
| Nix devshell scoping (tools, not security) | 1 | 0% |

Grouped:

- **Off the machine**: 39 (12%)
- **Hardware virtualisation on the dev machine**: 107 (32%)
- **Shared-kernel containers**: 108 (33%)
- **Process sandboxes on the host OS**: 57 (17%)
- **No isolation**: 19 (6%)

Observations:
- **VMs and containers are tied at the top.** VM users often explain why: "docker is not a completely reliable sandbox", "running claude in container… feels a bit weak", "you are sharing kernel with the sandboxed agent". Container users answer that VMs are heavy and break Docker-in-Docker workflows.
- **Very few rely only on the vendor's built-in sandbox.** People who name `/sandbox`, `srt` or Codex `workspace-write` are a small minority. Several explicitly prefer an *external* wrapper the harness cannot turn off ("Something other than the fox", "a bubblewrap instance… that the agentic harness cannot disable by it's own choice").
- **Most of the sample runs YOLO.** Isolation is described as what makes YOLO acceptable. Bare YOLO on the real machine, defended by git and backups, is about 3% of this sample but much more common in unprimed threads (see the bias warning).
- **Off-machine is the third pattern:** cheap VPSes, exe.dev, Sprites, a Mac mini, or a spare laptop ("just give it a laptop").
- **Credentials and network are the next frontier:** a growing minority mention egress proxies, dummy keys swapped by a gateway, per-repo deploy keys, VLANs and Tailscale ACLs.

## Catalogue

### Off the machine

#### Remote VPS / cloud VM (Hetzner, exe.dev, Sprites, EC2, Linode…) — 27 entries

- 2025-08-12 · [franze](https://news.ycombinator.com/item?id=44881982) — Claude Code on a Hetzner server, auto-continue loop
- 2025-12-19 · [andai](https://news.ycombinator.com/item?id=46331521) — gave Claude root on a $3 VPS
- 2026-01-01 · [jes5199](https://news.ycombinator.com/item?id=46452791) — Claude Code in tmux on a VPS
- 2026-01-06 · [runjake](https://news.ycombinator.com/item?id=46519037) — $5 Linode VPS
- 2026-01-08 · [joshrw](https://news.ycombinator.com/item?id=46539905) — prefers a VPS over an old laptop
- 2026-01-11 · [skybrian](https://news.ycombinator.com/item?id=46572500) — dev environment in a cloud VM from now on (exe.dev)
- 2026-01-12 · [tawman](https://news.ycombinator.com/item?id=46595490) — VPS with Claude (Hostinger)
- 2026-01-20 · [zhoujianfu](https://news.ycombinator.com/item?id=46699242) — dangerously-skip-permissions, every project in its own VPS
- 2026-02-02 · [jarredkenny](https://news.ycombinator.com/item?id=46850948) — 4 agents across MacBook, home server and EC2 fleet
- 2026-02-24 · [rubslopes](https://news.ycombinator.com/item?id=47143299) — VPS + SSH + Tailscale, CC from phone
- 2026-03-02 · [game_the0ry](https://news.ycombinator.com/item?id=47219203) — no agents on personal devices any more, only a VPS
- 2026-03-21 · [knocte](https://news.ycombinator.com/item?id=47466046) — Pi agent on a small VPS "so that I don't need to do sandboxing shenanigans"
- 2026-04-04 · [RIMR](https://news.ycombinator.com/item?id=47637551) — VPS behind restrictive security group, Tailscale-only, no tailnet access
- 2026-04-20 · [ymolodtsov](https://news.ycombinator.com/item?id=47832610) — OpenClaw on a $4 VPS with read-only access to most accounts
- 2026-05-04 · [rapind](https://news.ycombinator.com/item?id=48013784) — VPS with no other credentials so it can skip permissions
- 2026-05-12 · [whodidntante](https://news.ycombinator.com/item?id=48114470) — remote VS Code via Crostini on Beelink boxes and Hetzner servers
- 2026-05-28 · [jMyles](https://news.ycombinator.com/item?id=48313608) — always --dangerously-skip-permissions, on a VPS
- 2026-05-28 · [madarco](https://news.ycombinator.com/item?id=48305330) — agentbox teleports project to a Hetzner VPS, parallel agents
- 2026-06-04 · [maCDzP](https://news.ycombinator.com/item?id=48402474) — CC on a VPS, /rc from mobile
- 2026-06-12 · [nihakue](https://news.ycombinator.com/item?id=48508743) — Fly.io Sprites template: logged in, ttyd + tmux, CC from phone
- 2026-06-25 · [dukevannori](https://news.ycombinator.com/item?id=48673701) — agents on a 5-euro VPS
- 2026-07-03 · [realrocker](https://news.ycombinator.com/item?id=48780148) — claude cli/tmux on a Hetzner box via remote control
- 2026-07-21 · [nzoschke](https://news.ycombinator.com/item?id=48998365) — exe.dev + Hetzner "Agent Computer"
- 2026-07-29 · [sebderhy](https://news.ycombinator.com/item?id=49097326) — coding agents almost exclusively on a VPS
- 2026-08-28 · [nameless912](https://news.ycombinator.com/item?id=49477413) — Hermes agent on a DigitalOcean VM, Tailscale-only
- 2026-10-01 · [ritzaco](https://news.ycombinator.com/item?id=49926391) — pi on a VPS
- 2026-11-05 · [__alexs](https://news.ycombinator.com/item?id=50376348) — CC on its own VPS

#### Vendor cloud agent or hosted sandbox (Claude Code web, E2B, Amika…) — 6 entries

- 2025-10-22 · [mritchie712](https://news.ycombinator.com/item?id=45671294) — product agent given an E2B sandbox
- 2026-03-23 · [simonw](https://news.ycombinator.com/item?id=47490523) — Claude Code for web (containers on Anthropic servers) plus laptop (simonw)
- 2026-04-13 · [dbmikus](https://news.ycombinator.com/item?id=47751420) — Amika cloud sandboxes, claude --dangerously-skip-permissions (vendor)
- 2026-06-04 · [nab](https://news.ycombinator.com/item?id=48405047) — Firecracker VMs in E2B (vendor)
- 2026-07-03 · [just-tom](https://news.ycombinator.com/item?id=48772037) — opencode sessions on E2B sandboxes from a prompt
- 2026-11-06 · [marcduck](https://news.ycombinator.com/item?id=50397875) — Claude Code cloud sessions

#### Dedicated physical machine (spare laptop, Mac mini, mini-PC, separate subnet) — 8 entries

- 2025-12-21 · [JohnCClarke](https://news.ycombinator.com/item?id=46345890) — giving Claude a separate laptop
- 2026-03-28 · [andai](https://news.ycombinator.com/item?id=47551658) — separate user, but best is "just give it a laptop"
- 2026-03-30 · [rimunroe](https://news.ycombinator.com/item?id=47569890) — dedicated machine with no access to own accounts/data
- 2026-03-31 · [joozio](https://news.ycombinator.com/item?id=47590377) — CC agent 24/7 on a Mac Mini
- 2026-06-29 · [andai](https://news.ycombinator.com/item?id=48724905) — yolo for half a year by giving agents their own laptop/user
- 2026-08-17 · [geye1234](https://news.ycombinator.com/item?id=49331093) — separate machine on its own physical subnet
- 2026-08-28 · [denysvitali](https://news.ycombinator.com/item?id=49477598) — claude/codex as root only on a separate machine pruned afterwards (kernel dev)
- 2026-10-12 · [stillpointlab](https://news.ycombinator.com/item?id=50061261) — Mac mini personal, Linux box for agents with near free rein

### Hardware virtualisation on the dev machine

#### Full VM (Vagrant/VirtualBox, Lima, QEMU/KVM, libvirt, Incus VMs, Proxmox, UTM, Parallels, Hyper-V, WSL, OrbStack machines) — 105 entries

- 2025-03-09 · [macrolime](https://news.ycombinator.com/item?id=43312425) — Cursor over Remote-SSH into a VM, snapshots before risky steps
- 2025-05-27 · [serf](https://news.ycombinator.com/item?id=44107482) — Cursor and its agents in a snapshotted VM
- 2025-07-03 · [dist-epoch](https://news.ycombinator.com/item?id=44455688) — VM as sandbox so it can't delete host files
- 2025-10-20 · [fny](https://news.ycombinator.com/item?id=45648303) — --yolo on an isolated VM across projects
- 2025-12-15 · [spott](https://news.ycombinator.com/item?id=46269452) — Proxmox homelab VMs; wants yolo minus git push --force
- 2026-01-01 · [jillesvangurp](https://news.ycombinator.com/item?id=46452576) — QEMU VM for Codex CLI in --yolo; code in/out via ssh git
- 2026-01-05 · [nl](https://news.ycombinator.com/item?id=46493839) — minimal remote VM (Oracle free tier); agent operates on remote files
- 2026-01-12 · [AlexCoventry](https://news.ycombinator.com/item?id=46595252) — VirtualBox VM "since docker is not a completely reliable sandbox"
- 2026-01-15 · [nl](https://news.ycombinator.com/item?id=46625902) — disposable VM, let it go
- 2026-01-20 · [anp](https://news.ycombinator.com/item?id=46693358) — YOLO only inside an isolated, manually built VM
- 2026-01-20 · [jillesvangurp](https://news.ycombinator.com/item?id=46693395) — QEMU VM for Codex --yolo; looking at Lima
- 2026-01-20 · [letmetweakit](https://news.ycombinator.com/item?id=46691273) — Proxmox VM, snapshots to reset
- 2026-01-20 · [embedding-shape](https://news.ycombinator.com/item?id=46698762) — runs everything in VMs since npm/pypi malware
- 2026-01-20 · [embedding-shape](https://news.ycombinator.com/item?id=46697388) — snapshot -> tiny VM -> agent -> snapshot -> diff, per change
- 2026-01-22 · [rcarmo](https://news.ycombinator.com/item?id=46716389) — agentbox: VM with a dedicated container per project (rcarmo)
- 2026-01-29 · [alsetmusic](https://news.ycombinator.com/item?id=46804011) — Lume macOS VMs to sandbox Claude
- 2026-02-02 · [vardalab](https://news.ycombinator.com/item?id=46863453) — Claude/Codex in a Proxmox VM in tmux, yolo, backed up by Proxmox Backup Server
- 2026-02-02 · [logicallee](https://news.ycombinator.com/item?id=46862005) — Claude in a VM told to plough through difficulties
- 2026-02-07 · [0x696C6961](https://news.ycombinator.com/item?id=46922809) — agents as root in a VM; MCP outside the VM holds secrets
- 2026-02-09 · [nickzana](https://news.ycombinator.com/item?id=46940294) — VM on desktop, checks progress
- 2026-02-27 · [stephen_cagle](https://news.ycombinator.com/item?id=47186611) — KVM/QEMU VM per project, pull_from_vm / push_to_vm scripts
- 2026-03-02 · [hirvi74](https://news.ycombinator.com/item?id=47221036) — CC in an image, mounts only the needed directory into the VM
- 2026-03-08 · [hirvi74](https://news.ycombinator.com/item?id=47301601) — headless Lima VMs with VZ
- 2026-03-08 · [PufPufPuf](https://news.ycombinator.com/item?id=47301485) — Lima VM as VS Code remote workspace for yolo agents
- 2026-03-09 · [sersi](https://news.ycombinator.com/item?id=47307529) — VM for Claude Code for control
- 2026-03-28 · [digikata](https://news.ycombinator.com/item?id=47553262) — Docker daemon inside a Linux VM
- 2026-03-28 · [sersi](https://news.ycombinator.com/item?id=47551736) — unconstrained in a VM without LAN access; rebuilt twice
- 2026-03-28 · [vardalab](https://news.ycombinator.com/item?id=47550924) — backups + VM managing homelab infra
- 2026-03-30 · [jaboostin](https://news.ycombinator.com/item?id=47576124) — home VM: CC in screen under systemd, Cloudflare tunnel, Discord control
- 2026-04-01 · [saadn92](https://news.ycombinator.com/item?id=47604127) — multiple CC agents in parallel on a remote VM
- 2026-04-05 · [dcre](https://news.ycombinator.com/item?id=47646659) — ready to try CC in a VM "so I can go full YOLO"
- 2026-04-11 · [Twirrim](https://news.ycombinator.com/item?id=47726381) — agent in a VM; host MCP exposes only approved commands
- 2026-04-16 · [gpjt](https://news.ycombinator.com/item?id=47799367) — Proxmox VM
- 2026-04-21 · [michaellee8](https://news.ycombinator.com/item?id=47847557) — isolated VM for Claude/Codex full auto
- 2026-04-23 · [TacticalCoder](https://news.ycombinator.com/item?id=47882851) — Claude Code CLI in a VM on a server, via SSH
- 2026-04-23 · [gommm](https://news.ycombinator.com/item?id=47872610) — "I just run CC in a VM"
- 2026-04-27 · [matheusmoreira](https://news.ycombinator.com/item?id=47917129) — firejail then own VM orchestration (virtdev) per project
- 2026-04-30 · [data-ottawa](https://news.ycombinator.com/item?id=47963724) — NixOS QEMU VM for openclaw
- 2026-05-07 · [sowbug](https://news.ycombinator.com/item?id=48053376) — VSCode, CC and opencode in the VM
- 2026-05-07 · [tim-projects](https://news.ycombinator.com/item?id=48048797) — Linux VM dev with chattr read-only folders
- 2026-05-24 · [matheusmoreira](https://news.ycombinator.com/item?id=48260230) — "Now I only ever run Claude Code inside virtual machines"
- 2026-05-28 · [sudosteph](https://news.ycombinator.com/item?id=48314114) — OrbStack VM + Tailscale for agents
- 2026-05-31 · [MicrosoftShill](https://news.ycombinator.com/item?id=48342840) — VM for agents
- 2026-06-01 · [anygivnthursday](https://news.ycombinator.com/item?id=48351391) — Claude in its own QEMU VM; git access only when ssh key unlocked
- 2026-06-01 · [ulrikrasmussen](https://news.ycombinator.com/item?id=48354404) — Claude in a VirtualBox VM managed by Vagrant
- 2026-06-02 · [bradleyy](https://news.ycombinator.com/item?id=48364421) — VM with --yolo, small tasks and stop conditions
- 2026-06-04 · [vbezhenar](https://news.ycombinator.com/item?id=48395632) — QEMU VM; container "feels a bit weak"
- 2026-06-05 · [benatkin](https://news.ycombinator.com/item?id=48407267) — podman in Lima, two layers
- 2026-06-10 · [bostik](https://news.ycombinator.com/item?id=48481141) — Claude Code CLI inside a VM for >90% of needs
- 2026-06-10 · [electroly](https://news.ycombinator.com/item?id=48483892) — Claude Desktop inside a Hyper-V VM
- 2026-06-10 · [sudosteph](https://news.ycombinator.com/item?id=48482731) — local VM-centric agent setup for 3 months
- 2026-06-12 · [ulrikrasmussen](https://news.ycombinator.com/item?id=48500853) — Vagrant VirtualBox VM, root inside, nothing private to exfiltrate
- 2026-06-13 · [IronWolve](https://news.ycombinator.com/item?id=48522144) — WSL Linux VM
- 2026-06-25 · [antiloper](https://news.ycombinator.com/item?id=48671811) — VM with headless Wayland compositor
- 2026-07-01 · [SwellJoe](https://news.ycombinator.com/item?id=48752442) — headless VMs so --dangerously-skip-permissions is fine
- 2026-07-01 · [SwellJoe](https://news.ycombinator.com/item?id=48754185) — VMs or containers (sometimes nested); per-repo GitHub deploy keys
- 2026-07-02 · [thih9](https://news.ycombinator.com/item?id=48766590) — "This is why I run Claude Code in a VM"
- 2026-07-02 · [28304283409234](https://news.ycombinator.com/item?id=48763992) — hardened VM on hardened Linux in a separated basement network
- 2026-07-08 · [nekusar](https://news.ycombinator.com/item?id=48831482) — NanoClaw in a container on a VM on Proxmox
- 2026-07-13 · [Twirrim](https://news.ycombinator.com/item?id=48894867) — Lima VMs
- 2026-07-13 · [Twirrim](https://news.ycombinator.com/item?id=48897359) — tool not in agent VM; host MCP wrapper exposes safe subset
- 2026-07-13 · [28304283409234](https://news.ycombinator.com/item?id=48894440) — Vagrant on a separate machine in a separate network
- 2026-07-13 · [JeremyNT](https://news.ycombinator.com/item?id=48896017) — incus VMs since agents got shell access
- 2026-07-15 · [rmunn](https://news.ycombinator.com/item?id=48917841) — CC in a VM with cloned open-source repos, no credentials; used to reset daily
- 2026-07-15 · [magimas](https://news.ycombinator.com/item?id=48919564) — pi agent in Lima with only project folder mounted + .env guard extension
- 2026-07-19 · [apitman](https://news.ycombinator.com/item?id=48969405) — agents in a VM
- 2026-07-20 · [TZubiri](https://news.ycombinator.com/item?id=48983243) — opencode behind a VM and its own user since release
- 2026-07-20 · [thomasjb](https://news.ycombinator.com/item?id=48978978) — agents only in a VM
- 2026-07-21 · [JeremyNT](https://news.ycombinator.com/item?id=48991829) — incus-dev-vm.sh per-project VM wrapper
- 2026-08-06 · [Aurornis](https://news.ycombinator.com/item?id=49197125) — remote SSH into a VM, "I and many others"
- 2026-08-10 · [krzyk](https://news.ycombinator.com/item?id=49239694) — yolo in a VM: "if I need to babysit I might as well do it myself"
- 2026-08-10 · [ThomasGlanzmann](https://news.ycombinator.com/item?id=49239687) — throwaway VM, production system or lab system depending on task
- 2026-08-10 · [matheusmoreira](https://news.ycombinator.com/item?id=49240595) — skip all permissions inside an isolated VM
- 2026-08-10 · [mikedelfino](https://news.ycombinator.com/item?id=49244174) — full Linux VM with GUI on Linux host
- 2026-08-10 · [geoka9](https://news.ycombinator.com/item?id=49248531) — Incus VMs, rebuilt after every session
- 2026-08-10 · [sparsesignal](https://news.ycombinator.com/item?id=49240877) — hardened QEMU/KVM VM per project; nftables blocks guest->host
- 2026-08-13 · [vineyardmike](https://news.ycombinator.com/item?id=49283129) — macOS VM for certain tasks
- 2026-08-22 · [sejje](https://news.ycombinator.com/item?id=49395675) — put it in a VM
- 2026-08-25 · [bearjaws](https://news.ycombinator.com/item?id=49434773) — VM per project; moved off laptop
- 2026-08-28 · [vollbrecht](https://news.ycombinator.com/item?id=49477706) — Zed connecting into the VM
- 2026-08-28 · [api](https://news.ycombinator.com/item?id=49477533) — VMs (Parallels on macOS, Proxmox at home), agent as a user in the VM, only the work tree mounted
- 2026-08-28 · [jbstack](https://news.ycombinator.com/item?id=49477497) — VM per project + nix shell tools; only project folder shared
- 2026-08-31 · [cma](https://news.ycombinator.com/item?id=49512831) — golden-image VMs; gitolite allows only non-destructive pushes to agent/ branches
- 2026-09-03 · [ravenstine](https://news.ycombinator.com/item?id=49553166) — not full YOLO, but highly controlled VMs
- 2026-09-05 · [twohearted](https://news.ycombinator.com/item?id=49577085) — codex --yolo in a container/VM
- 2026-09-18 · [adunsulag](https://news.ycombinator.com/item?id=49749364) — sandbox inside a VM, outbound network restricted, secrets never inside
- 2026-09-21 · [Sohcahtoa82](https://news.ycombinator.com/item?id=49790575) — Codex in a VM with only dev necessities
- 2026-09-30 · [mmulqueen](https://news.ycombinator.com/item?id=49910556) — per-project VMs, very limited egress, restrictive mounts
- 2026-10-01 · [aliasxneo](https://news.ycombinator.com/item?id=49926602) — homelab Linux VM spawns all agent sessions
- 2026-10-02 · [api](https://news.ycombinator.com/item?id=49933064) — harnesses from US companies only in a VM
- 2026-10-03 · [PeanutOS](https://news.ycombinator.com/item?id=49940426) — Lima, exposing only a repository
- 2026-10-06 · [icedchai](https://news.ycombinator.com/item?id=49985336) — CC on a headless VM over SSH
- 2026-10-09 · [ketzu](https://news.ycombinator.com/item?id=50019654) — on-demand VM on PC
- 2026-10-20 · [spacephysics](https://news.ycombinator.com/item?id=50164831) — CC in its own VM on a restricted VLAN; Infisical for secrets; one-way SSH
- 2026-10-22 · [walrus01](https://news.ycombinator.com/item?id=50201460) — opencode in its own KVM VM with LVM volumes on headless server
- 2026-10-30 · [darkwi11ow](https://news.ycombinator.com/item?id=50303234) — agentic tools only in a QEMU VM without production access
- 2026-11-02 · [sergsoares](https://news.ycombinator.com/item?id=50339724) — OrbStack isolated machines
- 2026-11-03 · [dangero](https://news.ycombinator.com/item?id=50358611) — screenshares into per-project VM on a secondary MacBook Air
- 2026-11-05 · [smoe](https://news.ycombinator.com/item?id=50380156) — Incus disposable VMs from base image per project, yolo inside
- 2026-11-05 · [mnahkies](https://news.ycombinator.com/item?id=50376357) — libvirt per-project VMs with CoW golden images
- 2026-11-06 · [skwee357](https://news.ycombinator.com/item?id=50391245) — everything inside Lima VMs; CC + herdr across 5-7 worktrees
- 2026-11-06 · [allen-munsch](https://news.ycombinator.com/item?id=50387654) — QEMU VM with virtiofs share + ssh
- 2026-11-08 · [eastbound](https://news.ycombinator.com/item?id=50411113) — VM without git/maven binaries
- 2026-11-09 · [2ero_wf](https://news.ycombinator.com/item?id=50429130) — "i just give agent a VM"
- 2026-11-10 · [crossroadsguy](https://news.ycombinator.com/item?id=50435598) — sandbox-exec not enough; "anything short of a vm or container" unacceptable

#### Docker Sandboxes (`sbx`, microVM per session) — 10 entries

- 2026-01-31 · [ArickVigas](https://news.ycombinator.com/item?id=46836340) — Hetzner + Docker sandbox + UFW + fail2ban for friends
- 2026-02-25 · [ramoz](https://news.ycombinator.com/item?id=47155628) — Mac Mini + Docker Sandbox, not on laptop with work access
- 2026-02-25 · [mikodin](https://news.ycombinator.com/item?id=47154835) — docker-sandbox with access to one unhosted git repo
- 2026-03-18 · [marcus_holmes](https://news.ycombinator.com/item?id=47420868) — Docker Sandbox because of dangerously-skip-permissions
- 2026-04-26 · [AlexCoventry](https://news.ycombinator.com/item?id=47914517) — "easily violated docker sandbox" with weak restrictions for NVIDIA nsight
- 2026-07-13 · [ghjnut](https://news.ycombinator.com/item?id=48899891) — docker sandbox auto-mounting cwd
- 2026-09-20 · [DubiousPusher](https://news.ycombinator.com/item?id=49780836) — moved to Docker Sandboxes
- 2026-10-12 · [sainishiva](https://news.ycombinator.com/item?id=50053994) — NanoCrew: each agent run in its own Docker sandbox + approval gates (vendor)
- 2026-10-21 · [aregsar](https://news.ycombinator.com/item?id=50181915) — Docker Sandboxes sbx microVM
- 2026-11-05 · [thefunnyman](https://news.ycombinator.com/item?id=50374090) — Docker Sandbox microVM under Windows for yolo

#### Other microVMs (Firecracker, Kata, Cloud Hypervisor, smolvm, SlicerVM) — 8 entries

- 2026-02-04 · [sibellavia](https://news.ycombinator.com/item?id=46883048) — local microVM with CC/Codex preinstalled
- 2026-02-17 · [buremba](https://news.ycombinator.com/item?id=47042912) — Kata (Firecracker) on Kubernetes + domain allow/block proxy
- 2026-05-28 · [benjamincburns](https://news.ycombinator.com/item?id=48305218) — devcontainers on Kata + Cloud Hypervisor docker runtime
- 2026-08-11 · [brettpro](https://news.ycombinator.com/item?id=49254012) — Incus + smolvm, full VM for desktop apps
- 2026-09-30 · [cookiengineer](https://news.ycombinator.com/item?id=49904958) — Firecracker + systemd non-admin user + seccomp on top
- 2026-09-30 · [Normal_gaussian](https://news.ycombinator.com/item?id=49914558) — SlicerVM Firecracker microVMs locally
- 2026-11-08 · [vedst](https://news.ycombinator.com/item?id=50412976) — random code straight into a microVM
- 2026-11-18 · [nsarrazin](https://news.ycombinator.com/item?id=50553324) — coding agents in sandboxed microVMs after audit

#### Apple `container` (VM per container) — 3 entries

- 2025-07-13 · [mkagenius](https://news.ycombinator.com/item?id=44548596) — Apple container for shell commands with OS-level isolation
- 2026-03-13 · [hirvi74](https://news.ycombinator.com/item?id=47367597) — Apple container on macOS, Podman elsewhere
- 2026-05-07 · [hirvi74](https://news.ycombinator.com/item?id=48054912) — Apple Container for Claude Code, Node, Java

### Shared-kernel containers

#### Docker / Podman / k8s container (incl. rootless, gVisor runtime, wrappers such as yoloai, jai, container-use) — 101 entries

- 2025-05-16 · [mr_mitm](https://news.ycombinator.com/item?id=44002663) — Claude Code in a podman container
- 2025-06-12 · [SV_BubbleTime](https://news.ycombinator.com/item?id=44262625) — Claude Code in a container
- 2025-07-13 · [sothatsit](https://news.ycombinator.com/item?id=44547765) — script copies working dir into a container, CC opens a PR or writes a plan
- 2025-07-13 · [hboon](https://news.ycombinator.com/item?id=44549802) — claude-docker wrapper run in project root
- 2025-07-15 · [christophilus](https://news.ycombinator.com/item?id=44569879) — whole stack (CC, Neovim, Postgres) inside Docker
- 2025-07-23 · [jeswin](https://news.ycombinator.com/item?id=44655690) — always runs agents inside a docker sandbox
- 2025-07-28 · [christophilus](https://news.ycombinator.com/item?id=44714054) — several CC containers, one active at a time
- 2025-08-11 · [newtwilly](https://news.ycombinator.com/item?id=44867021) — docker compose setup with Claude installed
- 2025-08-25 · [gardnr](https://news.ycombinator.com/item?id=45010358) — "Most people I know run in yolo mode in a docker container"
- 2025-08-26 · [thrown-0825](https://news.ycombinator.com/item?id=45023319) — containerised, but agent keeps not understanding it's in a container
- 2025-08-27 · [hft](https://news.ycombinator.com/item?id=45044725) — container with only a mounted volume from dev machine (gist)
- 2025-08-27 · [cowpig](https://news.ycombinator.com/item?id=45039319) — CLI that spins up containers with local dir as volume
- 2025-09-10 · [throwaway6977](https://news.ycombinator.com/item?id=45197282) — Docker image with xfce + VS Code so Codex can run full-access
- 2025-09-15 · [lvl155](https://news.ycombinator.com/item?id=45254570) — all agents in barebones short-lived containers
- 2025-09-29 · [thundergolfer](https://news.ycombinator.com/item?id=45417443) — Greptile: agent process in locked-down rootless podman (vendor)
- 2025-09-30 · [bakies](https://news.ycombinator.com/item?id=45426952) — containers rather than letting Claude use the laptop
- 2025-10-08 · [kanjun](https://news.ycombinator.com/item?id=45519549) — containers so agents can YOLO and not interfere (Imbue Sculptor, vendor)
- 2025-11-11 · [psidium](https://news.ycombinator.com/item?id=45885397) — iptables firewall allowlisting IPs at container start, after Anthropic devcontainer docs
- 2025-12-01 · [cube2222](https://news.ycombinator.com/item?id=46104914) — docker container when running --dangerously-skip-permissions
- 2025-12-03 · [cube2222](https://news.ycombinator.com/item?id=46141428) — background agent in a docker container in a jj workspace
- 2025-12-18 · [kordlessagain](https://news.ycombinator.com/item?id=46319114) — "Danger mode" but in a container without sensitive env vars
- 2025-12-19 · [adzicg](https://news.ycombinator.com/item?id=46331367) — team runs CC inside the project's Docker dev setup
- 2025-12-24 · [mbourmaud](https://news.ycombinator.com/item?id=46374333) — multiple CC instances in containers, full autonomy, queen/drone orchestration
- 2025-12-27 · [jomcgi](https://news.ycombinator.com/item?id=46400692) — opencode sessions as pods in homelab k8s cluster, bypass permissions, restrict pods
- 2025-12-30 · [Porygon](https://news.ycombinator.com/item?id=46430706) — Docker with mount nested inside repo so Claude can't touch git hooks
- 2025-12-30 · [onetimer1](https://news.ycombinator.com/item?id=46439451) — Windsurf and Claude in unprivileged podman, minimal mounts
- 2025-12-30 · [ivankra](https://news.ycombinator.com/item?id=46430610) — bash alias for throwaway rootless podman with bind-mounted cwd
- 2025-12-30 · [raphinou](https://news.ycombinator.com/item?id=46430769) — always runs agents in a container with source dir mounted
- 2026-01-01 · [embedding-shape](https://news.ycombinator.com/item?id=46450207) — podman with only the project mounted
- 2026-01-05 · [bakies](https://news.ycombinator.com/item?id=46502414) — claude in a container with --dangerously-skip-permissions
- 2026-01-07 · [mewpmewp2](https://news.ycombinator.com/item?id=46529915) — CC/Codex in Docker containers in tmux, auth JSON copied in
- 2026-01-12 · [mtlynch](https://news.ycombinator.com/item?id=46593583) — rootless + slirp4netns so container can't reach LAN
- 2026-01-12 · [delijati](https://news.ycombinator.com/item?id=46594595) — OpenCode in Docker
- 2026-01-13 · [gogasca](https://news.ycombinator.com/item?id=46596757) — Docker with gVisor runtime + terminado
- 2026-01-14 · [christophilus](https://news.ycombinator.com/item?id=46621288) — agents in containers holding only things he's happy to obliterate
- 2026-01-15 · [brendoncarroll](https://news.ycombinator.com/item?id=46633822) — mount only the working dir into a container
- 2026-01-15 · [raphinou](https://news.ycombinator.com/item?id=46629227) — all agents in Docker with code mounted
- 2026-01-15 · [rcarmo](https://news.ycombinator.com/item?id=46629414) — docker compose file for agents
- 2026-01-16 · [waynenilsen](https://news.ycombinator.com/item?id=46649700) — single container with postgres/redis alongside the agent
- 2026-01-20 · [dpforesi](https://news.ycombinator.com/item?id=46686427) — unrestricted agents only inside Docker
- 2026-01-21 · [rubenflamshep](https://news.ycombinator.com/item?id=46700961) — dockerised git worktrees to skip permissions
- 2026-01-30 · [benatkin](https://news.ycombinator.com/item?id=46827023) — runs agents in a container against prompt injection
- 2026-02-02 · [justkez](https://news.ycombinator.com/item?id=46859631) — wouldn't run Codex without Docker
- 2026-02-03 · [johnsmith1840](https://news.ycombinator.com/item?id=46874277) — containers with dummy API key; requests proxied out and swapped off-box
- 2026-02-06 · [apitman](https://news.ycombinator.com/item?id=46909791) — agents with full permissions in per-stack containers
- 2026-02-17 · [vzaliva](https://news.ycombinator.com/item?id=47042768) — claude code and codex in podman
- 2026-02-19 · [rsdza](https://news.ycombinator.com/item?id=47074280) — autonomous agents in Docker with sleep/wake cycles
- 2026-03-02 · [nvllsvm](https://news.ycombinator.com/item?id=47212995) — docker compose: credential container + Claude container that executes commands over ssh
- 2026-03-12 · [binwiederhier](https://news.ycombinator.com/item?id=47345119) — Dockerfile + script: workspace only plus GitHub/Jira tokens, then --dangerously-skip-permissions
- 2026-03-15 · [finaard](https://news.ycombinator.com/item?id=47387949) — local Qwen coder in yolo mode in a container, left a week
- 2026-03-28 · [jmogly](https://news.ycombinator.com/item?id=47554097) — agents in containers
- 2026-03-30 · [lambda](https://news.ycombinator.com/item?id=47579056) — pi agent (no command sandboxing, always yolo) in a strictly limited container
- 2026-03-30 · [mazieres](https://news.ycombinator.com/item?id=47569499) — jai: assistants installed only inside containers (mazieres)
- 2026-04-08 · [teekert](https://news.ycombinator.com/item?id=47686758) — CC in a container with only pwd mounted; worries about nix-shell -p nmap
- 2026-04-08 · [lukebyear](https://news.ycombinator.com/item?id=47686963) — Docker (OrbStack) sandboxing with papercuts, moved on
- 2026-04-13 · [arjie](https://news.ycombinator.com/item?id=47747585) — systemd-managed podman containers
- 2026-04-22 · [teekert](https://news.ycombinator.com/item?id=47868293) — Claude or opencode in a container with only a mounted folder
- 2026-04-23 · [sahil-shubham](https://news.ycombinator.com/item?id=47873440) — agents inside sandboxes running docker compose for previews
- 2026-04-27 · [ericd](https://news.ycombinator.com/item?id=47923472) — docker container mounting only cwd, no creds other than dev infra
- 2026-05-03 · [bauerd](https://news.ycombinator.com/item?id=47995246) — single-node k3d cluster per MacBook with Kubernetes Agent Sandbox
- 2026-05-23 · [freakynit](https://news.ycombinator.com/item?id=48245378) — yolo mode in a container
- 2026-05-29 · [christophilus](https://news.ycombinator.com/item?id=48321258) — CC in a container (sees it's root)
- 2026-06-01 · [fzxu22](https://news.ycombinator.com/item?id=48353906) — coding agents only in containers with limited host access
- 2026-06-04 · [resonious](https://news.ycombinator.com/item?id=48397728) — agent in Docker driven via Telegram
- 2026-06-15 · [suprjami](https://news.ycombinator.com/item?id=48535299) — rootless Podman for a Claude user
- 2026-06-16 · [ptx](https://news.ycombinator.com/item?id=48560425) — every Pi session in Docker, bash-only
- 2026-06-30 · [AdieuToLogic](https://news.ycombinator.com/item?id=48727065) — jail/container as best practice
- 2026-07-01 · [InsideOutSanta](https://news.ycombinator.com/item?id=48753348) — OpenCode and CC in Docker with a subset of the code base
- 2026-07-02 · [raphinou](https://news.ycombinator.com/item?id=48757473) — bash scripts to run agents in containers
- 2026-07-09 · [tompark](https://news.ycombinator.com/item?id=48844928) — custom harness in podman run by non-sudoer system account
- 2026-07-13 · [james_marks](https://news.ycombinator.com/item?id=48894919) — CC inside Docker as control plane, YOLO inside
- 2026-07-30 · [skeledrew](https://news.ycombinator.com/item?id=49111936) — delegated agents in worktrees contained by jai
- 2026-08-03 · [kantord](https://news.ycombinator.com/item?id=49159193) — tiling WM workspace per task, each with container + worktree
- 2026-08-05 · [newtwilly](https://news.ycombinator.com/item?id=49182870) — sandbox without docker access; wants allowlisted docker commands
- 2026-08-07 · [dgunay](https://news.ycombinator.com/item?id=49206517) — remuda: agents in tmux directly in docker containers
- 2026-08-10 · [steve_taylor](https://news.ycombinator.com/item?id=49239365) — --dangerously-skip-permissions in Docker for a month
- 2026-08-10 · [foo42](https://news.ycombinator.com/item?id=49239963) — yolo in docker; codebase mounted, reference code read-only
- 2026-08-10 · [jsiepkes](https://news.ycombinator.com/item?id=49239455) — ai-pod: Claude in Podman
- 2026-08-11 · [jbverschoor](https://news.ycombinator.com/item?id=49254582) — container-shell daily
- 2026-08-11 · [jmox](https://news.ycombinator.com/item?id=49265819) — egress proxy podman container (https to allowed domains only)
- 2026-08-13 · [embedding-shape](https://news.ycombinator.com/item?id=49283667) — Codex in a container since release
- 2026-08-14 · [krzyk](https://news.ycombinator.com/item?id=49295239) — codex yolo in docker
- 2026-08-28 · [julianlam](https://news.ycombinator.com/item?id=49481164) — pi agent in podman
- 2026-08-30 · [kodoman](https://news.ycombinator.com/item?id=49502682) — "I think everyone is running these things in at least a container"
- 2026-08-31 · [teekert](https://news.ycombinator.com/item?id=49507275) — put agents in containers after CC made edits in plan mode via a bash script
- 2026-09-07 · [RicDan](https://news.ycombinator.com/item?id=49595216) — dedicated pi.dev Docker image per task
- 2026-09-12 · [boppo1](https://news.ycombinator.com/item?id=49672229) — agents in a docker container
- 2026-09-13 · [aarondong](https://news.ycombinator.com/item?id=49681110) — CC in a container with auto mode and limited web access
- 2026-09-21 · [srcreigh](https://news.ycombinator.com/item?id=49781555) — homelab agent containers stopped while waiting for approval/CI
- 2026-09-21 · [christophilus](https://news.ycombinator.com/item?id=49782547) — git worktrees inside a single container
- 2026-09-23 · [jeena](https://news.ycombinator.com/item?id=49810576) — pi.dev in agent-container; Firefox via MCP when needed
- 2026-10-12 · [entropie](https://news.ycombinator.com/item?id=50062074) — NixOS wrapper running Codex CLI in Docker
- 2026-10-13 · [crossroadsguy](https://news.ycombinator.com/item?id=50067105) — won't run an agent outside a container on the Mac
- 2026-10-16 · [verdverm](https://news.ycombinator.com/item?id=50124552) — containers for agents in CI
- 2026-10-19 · [simlevesque](https://news.ycombinator.com/item?id=50152891) — Claude container with zero auth tokens; gateway container injects tokens
- 2026-10-22 · [fennecbutt](https://news.ycombinator.com/item?id=50200857) — iron proxy for credentials, considered Docker sandbox
- 2026-10-30 · [airhangerf15](https://news.ycombinator.com/item?id=50302307) — script mounting cwd into a container with build tools
- 2026-11-05 · [einhard](https://news.ycombinator.com/item?id=50374806) — OpenCode in podman
- 2026-11-06 · [evertheylen](https://news.ycombinator.com/item?id=50398261) — probox podman containers
- 2026-11-08 · [kstenerud](https://news.ycombinator.com/item?id=50410284) — never uses an agent outside yoloai (author)
- 2026-11-17 · [jazzypants](https://news.ycombinator.com/item?id=50527569) — harness in a container, doesn't worry about permissions

#### Dev containers (VS Code / devcontainer CLI / DevPod, often Anthropic's reference `.devcontainer`) — 23 entries

- 2025-05-15 · [CGamesPlay](https://news.ycombinator.com/item?id=44000369) — devcontainer + git + backups, manual approval of commands
- 2025-07-13 · [ubj](https://news.ycombinator.com/item?id=44547997) — DevPod-managed Docker dev containers for Claude Code
- 2025-07-26 · [T0Bi](https://news.ycombinator.com/item?id=44692510) — Anthropic's reference .devcontainer from the claude-code repo
- 2025-08-06 · [bicx](https://news.ycombinator.com/item?id=44811989) — yolo mode in a dev container instead of approving tool calls
- 2025-08-11 · [bicx](https://news.ycombinator.com/item?id=44864671) — Cursor + CC in integrated terminal, dev container, yolo
- 2025-08-14 · [adastra22](https://news.ycombinator.com/item?id=44897993) — minimal sandboxed devcontainer to run --dangerously-skip-permissions
- 2025-10-16 · [adastra22](https://news.ycombinator.com/item?id=45601280) — devcontainer with all tools, YOLO with some safety
- 2025-10-16 · [hkt](https://news.ycombinator.com/item?id=45609530) — Claude Code only in a dev container, mindful of lethal trifecta
- 2026-01-15 · [avsm](https://news.ycombinator.com/item?id=46637979) — cron job has Claude rewrite the devcontainer Dockerfile from its own sessions (avsm)
- 2026-01-17 · [foobar10000](https://news.ycombinator.com/item?id=46661713) — dev container + ZFS 1-minute auto-snapshots as root
- 2026-01-20 · [molson8472](https://news.ycombinator.com/item?id=46694641) — CC in devcontainer with limited mounts, for blast radius of prompt injection
- 2026-01-20 · [odie5533](https://news.ycombinator.com/item?id=46693661) — dev containers as in Claude Code docs
- 2026-03-10 · [simlevesque](https://news.ycombinator.com/item?id=47327794) — devcontainers in every project with Claude Code
- 2026-03-19 · [crabmusket](https://news.ycombinator.com/item?id=47432942) — CC inside VS Code devcontainers
- 2026-03-28 · [overfeed](https://news.ycombinator.com/item?id=47551635) — local dev containers: worst case deletes its working copy; no home dir, tokens or sudo
- 2026-05-12 · [stuaxo](https://news.ycombinator.com/item?id=48103325) — devcontainers usually
- 2026-06-01 · [rectang](https://news.ycombinator.com/item?id=48363784) — VS Code dev containers on Podman on a Mac
- 2026-06-28 · [mbid](https://news.ycombinator.com/item?id=48707230) — NVIDIA rumpelpod: orchestrate agents in remote/secure devcontainers
- 2026-07-27 · [jbvlkt](https://news.ycombinator.com/item?id=49075530) — agents only in dev containers
- 2026-08-10 · [croemer](https://news.ycombinator.com/item?id=49240101) — --dangerously-skip-permissions in devcontainers, volumes hold auth tokens
- 2026-08-10 · [cvak](https://news.ycombinator.com/item?id=49242121) — reuses claude-code .devcontainer
- 2026-10-23 · [LawrenceKerr](https://news.ycombinator.com/item?id=50206252) — skip-permissions in dev container, rebuilt 10x/day to update firewall allowlist
- 2026-10-24 · [brabel](https://news.ycombinator.com/item?id=50221061) — CC app over SSH to a devcontainer

#### LXC / LXD / Incus system containers — 6 entries

- 2026-01-11 · [obsoleetorr](https://news.ycombinator.com/item?id=46571542) — LXC container per agent, cloud-init installs agents and repos
- 2026-01-21 · [dist-epoch](https://news.ycombinator.com/item?id=46709003) — LXC containers inside a VM rather than Docker
- 2026-04-25 · [jvican](https://news.ycombinator.com/item?id=47898451) — IncusOS homelab
- 2026-05-28 · [zackify](https://news.ycombinator.com/item?id=48310712) — LXD containers, TUI toggles network to only Anthropic/OpenAI; pi always on bypass
- 2026-08-10 · [pbasista](https://news.ycombinator.com/item?id=49241876) — Incus Linux containers for Claude
- 2026-10-12 · [h4kunamata](https://news.ycombinator.com/item?id=50064021) — Proxmox LXC containers via Ansible

### Process sandboxes on the host OS

#### bubblewrap wrappers (incl. Anthropic `srt` on Linux) — 29 entries

- 2025-07-13 · [anuramat](https://news.ycombinator.com/item?id=44549930) — bubblewrap script: CWD + claude dirs + XDG data RW, rest RO
- 2025-09-30 · [akashakya](https://news.ycombinator.com/item?id=45429787) — bwrap script for a minimal Claude sandbox
- 2025-09-30 · [globular-toast](https://news.ycombinator.com/item?id=45422463) — bubblewrap sandbox (blog post)
- 2025-12-01 · [gausswho](https://news.ycombinator.com/item?id=46107119) — bubblewrap for command-line executables
- 2026-01-12 · [globular-toast](https://news.ycombinator.com/item?id=46594474) — sandboxed Claude Code from day one (bubblewrap blog)
- 2026-02-07 · [globular-toast](https://news.ycombinator.com/item?id=46922009) — bubblewrap sandboxes since agents first came out
- 2026-02-24 · [l332mn](https://news.ycombinator.com/item?id=47133637) — bubblewrap to projects folder, free rein inside
- 2026-02-25 · [downsplat](https://news.ycombinator.com/item?id=47155822) — bubblewrap wrapper so it can't read $HOME or ssh keys
- 2026-03-01 · [webstrand](https://news.ycombinator.com/item?id=47209229) — bwrap + syd for filtering
- 2026-03-21 · [l72](https://news.ycombinator.com/item?id=47466528) — bubblewrap
- 2026-03-30 · [bastard_op](https://news.ycombinator.com/item?id=47577026) — claude-code in srt or a direct bwrap sandbox
- 2026-04-06 · [loveparade](https://news.ycombinator.com/item?id=47655582) — simple bwrap around the agent process instead of the CLI's built-in sandbox
- 2026-06-04 · [saghm](https://news.ycombinator.com/item?id=48394220) — shell helper: bubblewrap with rw only to cwd
- 2026-06-05 · [h45x1](https://news.ycombinator.com/item?id=48409085) — Bash bubblewrap script rather than trusting built-in sandbox on work machine
- 2026-06-12 · [Majromax](https://news.ycombinator.com/item?id=48503902) — agent inside bubblewrap
- 2026-07-09 · [kennykartman](https://news.ycombinator.com/item?id=48851740) — bubblewrap (different user might be enough)
- 2026-07-13 · [SwellJoe](https://news.ycombinator.com/item?id=48895820) — flar: bubblewraps agent + config + project, replaced VMs (SwellJoe)
- 2026-07-15 · [lionkor](https://news.ycombinator.com/item?id=48917661) — sandbox-here (bubblewrap wrapper), --docker when needed
- 2026-07-20 · [ekidd](https://news.ycombinator.com/item?id=48979150) — pi-agent in custom bwrap sandbox with internet proxy
- 2026-08-10 · [frumiousirc](https://news.ycombinator.com/item?id=49242120) — bubblewrap script with config profiles
- 2026-08-10 · [SwellJoe](https://news.ycombinator.com/item?id=49239442) — tool to bubblewrap any agent in its YOLO mode
- 2026-08-14 · [glitchcrab](https://news.ycombinator.com/item?id=49302243) — bubblewrap script limiting Claude
- 2026-10-02 · [lionkor](https://news.ycombinator.com/item?id=49930880) — sbh bubblewrap wrapper, --net/--docker flags per run
- 2026-10-09 · [gandreani](https://news.ycombinator.com/item?id=50019575) — bubblewrap; strace whack-a-mole for each new harness
- 2026-11-05 · [jbvlkt](https://news.ycombinator.com/item?id=50377284) — claude and codex inside bubblewrap
- 2026-11-05 · [f53d](https://news.ycombinator.com/item?id=50383403) — CC/Pi inside a bubblewrap instance the harness cannot disable
- 2026-11-08 · [dsp_person](https://news.ycombinator.com/item?id=50415488) — custom bwrap scripts isolating per-project VS Code + Claude extension
- 2026-11-08 · [pmontra](https://news.ycombinator.com/item?id=50411152) — bwrap instead of Docker to avoid layered FS cost
- 2026-11-17 · [regexorcist](https://news.ycombinator.com/item?id=50529245) — opencode inside bwrap atop other layers

#### Firejail — 6 entries

- 2026-01-01 · [aussieguy1234](https://news.ycombinator.com/item?id=46450313) — Firejail around VS Code for Kilo Code agents
- 2026-02-01 · [mikenew](https://news.ycombinator.com/item?id=46842890) — opencode in firejail-isolated containers
- 2026-03-27 · [matheusmoreira](https://news.ycombinator.com/item?id=47545715) — simple firejail script
- 2026-04-27 · [sfink](https://news.ycombinator.com/item?id=47916644) — fairly restrictive firejail
- 2026-06-18 · [fidelramos](https://news.ycombinator.com/item?id=48582711) — firejail around Opencode
- 2026-10-01 · [Luker88](https://news.ycombinator.com/item?id=49918997) — one firejail per project, all permissions allowed

#### macOS `sandbox-exec` / Seatbelt profiles (Agent Safehouse, sandfence, custom hooks) — 9 entries

- 2026-03-01 · [blakec](https://news.ycombinator.com/item?id=47203782) — 84 hooks; ~100-line Seatbelt profile on every Bash call denies ~/.ssh, ~/.aws, .env
- 2026-03-09 · [e1g](https://news.ycombinator.com/item?id=47306251) — agent-safehouse: own sandbox-exec profiles across all agents, avoiding srt's Node dependency (e1g)
- 2026-03-28 · [vorticalbox](https://news.ycombinator.com/item?id=47552825) — agent-safehouse bash wrapper around sandbox-exec
- 2026-06-13 · [sheremetyev](https://news.ycombinator.com/item?id=48519736) — native macOS sandbox via sandfence script (Claude/Codex)
- 2026-07-17 · [mdavid626](https://news.ycombinator.com/item?id=48951493) — CC on Mac with sandbox-exec
- 2026-07-20 · [lucideer](https://news.ycombinator.com/item?id=48979646) — sandbox-exec and VMs; independent of integrated sandboxing
- 2026-10-11 · [crossroadsguy](https://news.ycombinator.com/item?id=50043910) — moved to sandbox-exec (safehouse), now trying lightweight container/VM
- 2026-10-21 · [isityettime](https://news.ycombinator.com/item?id=50187187) — Nono (macOS on the sandbox-exec foundation)
- 2026-11-03 · [justauserid](https://news.ycombinator.com/item?id=50347942) — Pi, OpenCode, Claude, Codex, agy controlled by sandbox-exec

#### Landlock-based tools (nono, greywall) — 5 entries

- 2026-04-04 · [txprog](https://news.ycombinator.com/item?id=47635785) — greywall: Landlock + seccomp + eBPF on Linux, sandbox-exec on macOS
- 2026-05-08 · [isityettime](https://news.ycombinator.com/item?id=48069814) — nono (OS-level sandbox) with rollbacks; write access only to project
- 2026-05-30 · [isityettime](https://news.ycombinator.com/item?id=48336118) — OS-level sandboxing tool (nono) vs harness or hypervisor sandboxing
- 2026-06-06 · [jpeeler](https://news.ycombinator.com/item?id=48424303) — herde supervisor + nono sandboxing
- 2026-07-20 · [awinter-py](https://news.ycombinator.com/item?id=48978910) — nono.sh; "a lot of power users are using sandbox + YOLO mode because approval prompts slow them down"

#### The agent's built-in sandbox or an unnamed "my own sandbox" (`/sandbox`, `srt`, Leash, fence) — 14 entries

- 2025-12-17 · [shortlived](https://news.ycombinator.com/item?id=46297700) — Claude Code /sandbox plus --dangerously-skip-permissions
- 2025-12-27 · [languid-photic](https://news.ycombinator.com/item?id=46402650) — Claude/Codex/Gemini in sandboxed YOLO mode; logged bypass attempts (forged npm tarball hashes, `|| true`)
- 2025-12-28 · [throwayaw84330](https://news.ycombinator.com/item?id=46407392) — longregen/claude-sandbox wrapper
- 2026-01-13 · [kachapopopow](https://news.ycombinator.com/item?id=46596412) — put Claude Code in a sandbox first thing
- 2026-01-26 · [whinvik](https://news.ycombinator.com/item?id=46769116) — fence (centralised sandbox) so all CLIs can run in YOLO
- 2026-02-03 · [bigwheels](https://news.ycombinator.com/item?id=46877382) — Leash (StrongDM) for sandboxing agents
- 2026-03-13 · [kstenerud](https://news.ycombinator.com/item?id=47361142) — bare Claude even with /sandbox "feels like a browser without an ad blocker"; uses yoloai (author)
- 2026-04-16 · [pxc](https://news.ycombinator.com/item?id=47794968) — experimenting with skip-permissions flags through external sandboxing tools
- 2026-08-10 · [bsdz](https://news.ycombinator.com/item?id=49240329) — Anthropic srt for small projects
- 2026-08-10 · [DanielHB](https://news.ycombinator.com/item?id=49242345) — Claude Code built-in /sandbox with config
- 2026-08-10 · [globular-toast](https://news.ycombinator.com/item?id=49240562) — never run an agent outside a sandbox; "either using their own sandbox, or doesn't care"
- 2026-08-10 · [rusch](https://news.ycombinator.com/item?id=49248959) — one sandbox per repo
- 2026-08-19 · [christophilus](https://news.ycombinator.com/item?id=49355833) — yolo in own sandbox
- 2026-11-08 · [Kim_Bruning](https://news.ycombinator.com/item?id=50410009) — months of --dangerously-skip-permissions in sandboxes, expecting to replace one now and then

#### Separate Unix/macOS user account (SandVault, per-project users) — 14 entries

- 2025-11-24 · [netcoyote](https://news.ycombinator.com/item?id=46029150) — SandVault (low-priv macOS user) and ClodPod (macOS VM)
- 2025-12-27 · [solresol](https://news.ycombinator.com/item?id=46401603) — separate Linux user (no sudo) per project, each logged into CC/Codex
- 2025-12-27 · [netcoyote](https://news.ycombinator.com/item?id=46400151) — SandVault low-privilege macOS account used more than ClodPod VM because easier
- 2025-12-28 · [jacob019](https://news.ycombinator.com/item?id=46407507) — unprivileged user namespaces + overlay, tarball of edits turned into a diff, with --dangerously-skip-permissions
- 2026-02-28 · [andai](https://news.ycombinator.com/item?id=47200271) — runs agents as an `agent` Unix user, or a separate machine
- 2026-03-10 · [andai](https://news.ycombinator.com/item?id=47318622) — agents as a separate Linux user
- 2026-04-08 · [nickdothutton](https://news.ycombinator.com/item?id=47686724) — separate non-sudo user per project, ssh + tmux; VM for Windows
- 2026-04-21 · [andai](https://news.ycombinator.com/item?id=47852695) — unprivileged Linux user, ideally a separate machine
- 2026-06-20 · [teekert](https://news.ycombinator.com/item?id=48607246) — org policy: containers or a new scoped Linux user for AI work
- 2026-06-28 · [quotemstr](https://news.ycombinator.com/item?id=48711573) — wants restricted version of own user context, not a separate machine
- 2026-07-09 · [gregwebs](https://news.ycombinator.com/item?id=48853397) — agent as a different user plus CC/Codex built-in sandbox
- 2026-08-07 · [gregwebs](https://news.ycombinator.com/item?id=49209306) — separate user for defense in depth
- 2026-10-30 · [cube00](https://news.ycombinator.com/item?id=50302800) — separate user account for blast radius
- 2026-11-06 · [mnahkies](https://news.ycombinator.com/item?id=50398518) — dedicated agent users on self-hosted Gitea, branch protection

### No isolation

#### YOLO / skip-permissions on the real machine (relying on git, backups, luck) — 17 entries

- 2025-07-13 · [ed_mercer](https://news.ycombinator.com/item?id=44549300) — --dangerously-skip-permissions all day, no issue
- 2025-08-09 · [simonw](https://news.ycombinator.com/item?id=44850534) — Claude Code, Copilot Agent, Codex CLI in YOLO mode, aware of prompt-injection risk
- 2025-09-30 · [simonw](https://news.ycombinator.com/item?id=45427324) — YOLO mode sometimes, "crossing my fingers"
- 2025-10-29 · [vidarh](https://news.ycombinator.com/item?id=45749743) — CC in background near-constantly with --dangerously-skip-permissions
- 2026-01-09 · [square_usual](https://news.ycombinator.com/item?id=46555443) — --dangerously-skip-permissions with a verification script
- 2026-01-31 · [iagooar](https://news.ycombinator.com/item?id=46838944) — "guilty of running it in YOLO mode without sandboxing more often than I would like to admit"
- 2026-02-03 · [thomasfromcdnjs](https://news.ycombinator.com/item?id=46869235) — loves claude --dangerously-skip-permissions, finds Codex asks every command
- 2026-02-04 · [dev3o](https://news.ycombinator.com/item?id=46886112) — runs --dangerously-skip-permissions, built supply-chain protection
- 2026-02-19 · [embedding-shape](https://news.ycombinator.com/item?id=47076977) — codex --dangerously-bypass-approvals-and-sandbox; approving each change "would destroy the entire point"
- 2026-03-27 · [Fishkins](https://news.ycombinator.com/item?id=47548214) — "I'm sure most folks run Claude without isolation or sandboxing"
- 2026-04-07 · [acuozzo](https://news.ycombinator.com/item?id=47679164) — claude --dangerously-skip-permissions and codex equivalent
- 2026-05-03 · [isityettime](https://news.ycombinator.com/item?id=48001609) — "I can just use YOLO modes and not sweat it" (after mitigations)
- 2026-07-09 · [azuanrb](https://news.ycombinator.com/item?id=48852847) — yolo mode since inception with Claude then Codex
- 2026-07-11 · [gabriel-uribe](https://news.ycombinator.com/item?id=48873321) — 9+ months unsandboxed, relies on backups and cloud
- 2026-08-10 · [ramoz](https://news.ycombinator.com/item?id=49239477) — both in yolo mode, no incident
- 2026-08-26 · [embedding-shape](https://news.ycombinator.com/item?id=49446523) — codex --sandbox danger-full-access
- 2026-11-07 · [faradaycage314](https://news.ycombinator.com/item?id=50407937) — always --dangerously-skip-permissions, in a repo, revert changes

#### No YOLO: approve commands or refuse to run agents locally — 5 entries

- 2025-12-27 · [yomismoaqui](https://news.ycombinator.com/item?id=46401117) — no sandbox, no YOLO; approves commands the first time
- 2026-02-28 · [Human-Cabbage](https://news.ycombinator.com/item?id=47189104) — containerised commands, no --dangerously-skip-permissions; may add a dedicated VM
- 2026-04-13 · [antoineMoPa](https://news.ycombinator.com/item?id=47753938) — won't run --dangerously-skip-permissions
- 2026-07-22 · [pseufaux](https://news.ycombinator.com/item?id=49006030) — hesitates to run yolo agents on own machine
- 2026-08-10 · [shelled](https://news.ycombinator.com/item?id=49240995) — rejects /sandbox as defeating the purpose

#### Snapshots / worktrees as the only protection — 2 entries

- 2026-04-27 · [himata4113](https://news.ycombinator.com/item?id=47920592) — agents en masse on DB snapshots; they deleted the DB a dozen times
- 2026-06-29 · [nicoty](https://news.ycombinator.com/item?id=48716330) — separate git worktrees per agent

#### Nix devshell scoping (tools, not security) — 1 entries

- 2025-12-22 · [__MatrixMan__](https://news.ycombinator.com/item?id=46356653) — launch CC in a Nix flake devshell (tool scoping, not security)

