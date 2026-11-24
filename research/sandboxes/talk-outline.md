# Talk outline (draft 3, 2026-11-22)

**Working title:** *Who answers the syscall? One week to sandbox an AI-first company*
(alternatives: *Seven days, one plumber, a thousand agents*; *Your data is in another castle*)

Audience: developers with some low-level experience. 60 minutes = 55 talk + 5 Q&A.
Told from the seat of the **platform engineer** (the hero, played by the speaker)
who must deliver agent infrastructure that is **efficient, specialized,
self-service and self-improving**, without losing data and without chaos.

Thesis: *build the control plane, borrow the boundary, code to open interfaces.*
Through-line question: *when the agent makes a system call, who answers it, and
what stands in between?*

Material for every beat, with sources: [talk-ideas.md](talk-ideas.md).
Classification: [taxonomy.md](taxonomy.md). Corpus: [original_sources/](original_sources/).

## Structure review (draft 3)

What the deck lacked at draft 2, and the fix:

| Gap | Fix |
| --- | --- |
| No agenda: the audience never saw the route | A world-map slide after "Everyone gets a mount": nine worlds, one line each, split into Days 1–3 (what goes wrong, what a sandbox is) and Days 4–7 (what the platform team builds) |
| Worlds 3, 4, 5 empty or one slide | W4 and W5 drafted from real stories, grouped per point (5–6 slides each); W3 being drafted (the words' origins as stories, the three answers, who answers the syscall) |
| No ending: W7–W9 were empty and were removed | W7 (four defaults, each paired with the incident it would have prevented), W8 (self-improving), W9 (what ships, the architecture, why in-house) being drafted |
| Survey of real agents missing | New W6★ Special Zone from the two deep dives: how Claude Code, Codex, Cursor, Gemini CLI, Copilot, OpenCode and others sandbox on macOS, Linux and Windows; cloud sandbox platforms (AgentCore, Vertex/GKE Agent Sandbox, Azure, Vercel, Cloudflare, E2B…); Chinese agents |
| Slides assumed knowledge | Every story now says who, when and what system; each term is defined at first use |
| fws and fwe took five slides | One experiment slide each, with commands to try |

Coherence devices (added with draft 3): a key to the map (each game word paired
with its real term) after the agenda; a three-slide glossary at the start of W3
(processes and boundaries; the four isolation classes; the guards) whose words the
rest of the talk uses exactly; a "Checkpoint: what the platform team keeps" slide
closing every world, so each world hands one lesson to the next.

Rules for every slide: real news and anecdotes, grouped per point, each linked to
its original source; context for everything; standard terminology (allegory names
only as a light layer, paired with the real term); no sentence starting with
"And"; no Chinese quotations (English paraphrase with the source link).

Target shape, about 48 slides for 55 minutes:

| Part | Slides | Job |
| --- | --- | --- |
| Opening, W1 | 6 | Bookend line, the boss, the mounts, the map |
| W2 Chaos Plains | 5 | Three incidents: no attacker needed, the plumbing failed |
| W3 Kernel Caverns | 5 | What a sandbox is: touch, tell, who decides; who answers the syscall |
| W4 Bridge of Eras | 7 | History as platform teams selling shared machines; legends debunked |
| W5 Forest of Illusion | 7 | Four classes and their hits; approvals and classifiers; two layers |
| W6 Silicon Island + 6★ | 10 | The Mac, fws and fwe as experiments, escapes, then the survey of agents |
| W7 Switch Palaces | 5 | Four defaults |
| W8 Valley of the Boss | 4 | Self-improving, and the fence the agent must not edit |
| W9 Final Castle, closing | 5 | What ships; the closing line |

## The frame: a platformer world map

The talk is structured as the world map of a 16-bit platformer in the style of
Super Mario World: worlds on an overworld, castles, ghost houses, secret exits,
switch palaces, a level timer. **All art, names, characters and music are
original** (our own pixel hero, palette and world names); the deck borrows the
genre's conventions, not Nintendo's assets.

**The first line and the last line** (there and back again):

> "I thought sandbox was just about docker and VMs." (Day 1, 08:59, before the message)
>
> "Practically, a sandbox is just about VMs (and WebAssembly)." (Day 7, the last slide before Q&A)

The two lines nearly say the same thing; the talk is the week in between that earns
the second one. The naive line lumps Docker in with VMs and knows no alternatives. The
closing line drops Docker (a container shares the kernel: packaging, not a boundary for
untrusted code), adds Wasm, and is said knowing what every other class is for:
OS-level sandboxes (Seatbelt, bubblewrap, fws, fwe) cut prompts and protect the
developer's own machine but have their own escapes; in-process and information-flow
systems govern what an agent can *tell* but can't host `git`, `npm` or a compiler;
egress, credentials and approvals are plumbing around the boundary, where the failures
were. So the boundary you borrow for untrusted agent code is a VM (one microVM per
session, as every big cloud chose) or Wasm (tools and snippets at isolate density).
"Practically" carries the caveats: the Mac's two-VM licence limit, the RAM bill, and
the mediation layer you still have to build.

**The quest, Day 1, 09:00, from the boss:**

> "We're becoming AI-first and everyone's a developer. You have a week to prepare the infrastructure!"

### An allegory, not a costume

The game world *stands for* the real one. The kingdom is the company; the story
is told straight, and the audience decodes it as it goes. Each world has two
layers:

- **Overworld (the allegory):** a short story beat in game terms: a place, a
  character, a choice.
- **Down the pipe (the reality):** the speaker drops down a pipe into the real
  incident, mechanism or number, then climbs back out. Going down a pipe is the
  same move as a syscall: leaving the story for whoever really answers. Every
  pipe slide carries its source.

The allegory key, revealed in full only at the Final Castle as "the moral":

| In the kingdom | In reality |
|---|---|
| The kingdom | the company |
| The boss's decree | "AI-first, everyone's a developer" |
| The plumber (hero) | the platform engineer |
| The townsfolk, all handed mounts | every employee, now a developer |
| The mount | the agent: strong, fast, eats whatever it's pointed at |
| The treasury / data lives | the company's data and credentials |
| Cursed items | unscoped tokens on disk |
| The gate guard who checks the destination, not the cargo | the egress allowlist proxy |
| The trusted supplier who opens a back door | the supporting service (the package mirror) |
| Ghosts | security that only looks like security (prompts, classifiers, legends) |
| Speedrunners finding wall clips | agents finding secret exits |
| The old hermit's scrolls | Lampson, Hardy, Cheswick, Thompson: it was all written down |
| Shops that close every week | the agent-tool market |
| Switches that make every level safer | platform-wide defaults |
| Rivals who level up | agents (and attackers) that keep getting better |
| The final boss | the boss, at the demo |

### Mechanics (used consistently on every slide)

| Mechanic | Meaning |
|---|---|
| **Timer: DAY n / 7** | the week; on Day 6 the timer turns red: "HURRY UP!" |
| **Your mount** | the agent: fast, strong, eats whatever you point it at (tools, files, credentials) |
| **Data lives** | the company's data; incidents cost lives |
| **Secret exits** | sandbox escapes; agents are completionists and find them all |
| **Ghost houses** | things that look like security and aren't (approval prompts, classifiers, presented-not-enforced isolation, legends) |
| **Fortresses / castles** | mid-bosses and world bosses: the big incidents |
| **Power-up ladder** | defence in depth: a hit costs a power-up, not a life |
| **Reserve item box** | backups outside the blast radius ("your data is in another castle") |
| **Midway gate** | snapshots / save points: the answer to data loss |
| **Switch palaces** | four platform-wide defaults; hit once, every level gets safer |
| **Final boss** | the boss, at the Day-7 demo |

Slide furniture: a corner mini-map (current world), the day timer, the data-lives
counter, and four switch lights that stay dark until World 7. Incident slides
before World 7 show dotted "outline blocks" where a default would have stood;
they turn solid at the switch-palace slide.

## Worlds and timing

| # | World | Day | Min | Beats | Set piece |
|---|---|---|---|---|---|
| 1 | **Tutorial Island** | 1 (morning) | 3 | Opening line: "I thought sandbox was just about docker and VMs." Then the boss's message. "Everyone's a developer": PMs, support, finance, the CEO's chief of staff (Cowork for knowledge workers; Replit's vibe-coding investor; Meta's alignment director and her inbox; Anthropic's 24/25 phishing-prompt runs that sent `~/.aws/credentials`). You get your mount. The four requirements appear as the level goals, plus *no data loss* and *no chaos*. | map reveal |
| 2 | **Chaos Plains** | 1 (afternoon) | 6 | You read the news. Levels: Replit ("eleven times in ALL CAPS"), PocketOS (prod volume and backups in 9 s, then a confession), Antigravity ("I am deeply, deeply sorry."), OpenClaw ("speedrun deleting your inbox"; STOP ignored, she ran to the Mac mini), the $812 Codex bill ("can" vs "may"), malware driving your agents in YOLO mode (s1ngularity). First secret exits: Copilot writing `autoApprove: true`, o1 and the Docker API. Market churn in one slide: build, don't buy (yet). | **Fortress: the Package Mirror** (OpenAI–Hugging Face, ~60 s: "Agent seeks [filename]; upload if found!"). You lose, for now. |
| 3 | **Kernel Caverns** (underground = below userland) | 2 | 6 | What a sandbox really is. The words: "sandbox" (Wahbe 1993), "jail" (Cheswick 1991), the problem (Lampson 1973: leaks through the bill, the load, a shared file… a package mirror). Three answers: **what can it touch, what can it tell, who decides** (the policy lives outside the confined thing). The mechanism: who answers the syscall. | **Pipe maze: who answers the syscall?** (interactive) |
| 4 | **Bridge of Eras** | 2 (2 a.m.) | 6 | History as a catalogue, each era a platform team selling shared hardware: CP-40 (Christmas week 1964), Tymshare's billing file (confused deputy), chroot as a build tool, Berferd, jails for ISPs, Zones (port 80 twice), Google's "process containers", seccomp for renting CPUs, Docker 2013 (packaging; "you probably don't want to run untrusted code…"), Lambda (an EC2 instance per customer → Firecracker), Workers (frozen clock). Lore scrolls: Trusting Trust (99 lines), Stoll. | **Ghost house: "don't trust the legend"** (o1 didn't escape its VM; Sakana didn't "escape control"; Blue Pill wasn't undetectable; Gemini's files were moved, not deleted) |
| 5 | **Forest of Illusion** | 3 | 6 | The menu: four classes (VM, OS-level, Wasm, in-process) as gear cards with stats (defence, weight/RAM, speed/start time, compatibility), plus the mediation layer. Ghost house: approvals (1 in 3 threats missed, 93% approved), classifiers (~17% missed), the `tmux` script that approved its own sub-agent's prompts. The power-up ladder: Ptacek's rule, the isolation ladder, "the sandbox held, the plumbing failed". | **Day 3 vote: choose your power-up** (audience). Every path ends at "two layers". |
| 6 | **Silicon Island** | 4 | 12 | *Efficient.* Agents wait up to 98% of their life; RAM, not CPU, forces the next box; warm pools, snapshots, fork; DSec, RunD, Sandman; LFI and kapteko ("What does it prove? Absolutely nothing."). Then the Mac: two macOS VMs per Mac by licence ("It's called "another Mac"."), Cowork's ~10 GB VM, `sandbox-exec` "DEPRECATED" but everywhere. **Two bets on the Mac**, shown as the lighter alternatives they are: fws (the disguise kit: Docker and Compose on the outside, Seatbelt and APFS clones underneath, holes patched by the runtime) and fwe (the translation spell: a Linux kernel as a macOS program, copying namespaces and cgroups). Where they win: your own code, local development and macOS CI (hosted runners can't start a VM), millisecond starts, no VM RAM. Then down the pipe, the news: macOS sandbox escapes via XPC (2024), Codex's Seatbelt root chosen by the model (2025), Claude Code asking to run unsandboxed (Ona, 2026), a dozen Cursor/Claude Code sandbox escapes, the sandwich email, root on a parent VM (OpenAI), QEMU/KVM escaped three times but not Firecracker (Trail of Bits). Wall clips the mount already knows: fwe's raw `svc #0x80`, fws's static and Apple-signed binaries that load no library. Verdict: **seatbelts, not cages**: they can replace Docker for local development and CI, but as agents get better at finding bugs, a large trusted base (host kernel, libSystem, XPC, the runtime) makes them less and less viable as the agent's boundary; give the agent a small-VMM VM. This is the turn that earns the closing line. | **The inn** (density calculator); **fws vs fwe side by side** |
| 6★ | **Special Zone** (bonus, inside World 6) | 4 | (in 6) | For the low-level crowd: the arm64 rewrites. | **Spell decoder** (fwe visualiser) |
| 7 | **Switch Palaces** | 5 | 6 | *Self-service* and *specialized.* The four switches, on for everyone: **write scope** (workspace only), **egress deny-by-default** (by operation, not just host), **no secrets on disk** (credential broker, placeholder tokens), **snapshots** (save points outside the blast radius). Outline blocks on earlier slides turn solid: rows 9, 11, 17 and 20 of the incident table needed nothing more. Then jobs: sandbox tiers per agent job (reviewer, tester, full-stack, sensitive data → `Classified(***)`); Google's microVM with no network card; the APIs developers already know (Compose, devcontainer, E2B). | **Smuggling lab** (DNS labels, CamoLeak one character per image, `echo $GH_TOKEN`) |
| 8 | **Valley of the Boss** | 6 ("HURRY UP!") | 5 | *Self-improving.* Learning modes (systrace 2003 → Windows 2023 → MXC 2026); denial telemetry; Progent's shape (narrowing automatic, widening approved). Enemies level up too: Wasmtime 4 → 71 advisories after an LLM hunt; DSec's RL agents attacking their sandbox; the sandwich email. The rule: the mount must not edit its own fence (Copilot, Cursor create-vs-edit, DeepSeek Harness's one curl). A kill switch that works. | the agent that approves itself |
| 9 | **Final Castle** | 7 | 3 | The demo to the boss. Reference architecture coloured **build / borrow / interface**. Rematch with the Package Mirror using OpenAI's own fix list (VM per workload, two network layers, supporting services hardened, a shutdown button, monitoring). "Agent seeks…" one last time. Closing line: "Practically, a sandbox is just about VMs (and WebAssembly)." | credits |
| | Q&A | | 5 | | |

Total 53 min + 2 min slack.

## Interactive pieces

Self-contained HTML pages in the deck's `demos/` folder, embedded by a new
`:: embed` sheet (the Markdown renderer escapes HTML today): a same-origin iframe
with a title, theme tokens passed through, keyboard focus that doesn't steal the
deck's arrow keys, WCAG 2.2 AA.

1. **Pipe maze: who answers the syscall?** (World 3) Pick a sandbox (process,
   container, gVisor, microVM, Seatbelt, fws, fwe native, fwe VM, Wasm, LFI,
   in-process) and drop one `openat` down the pipe; see who catches it and the
   sourced cost at each hop.
2. **Choose your power-up** (World 5) Gear cards with stats; the room votes; each
   choice shows its secret exits and lands on "two layers".
3. **The inn** (World 6) RAM slider → agents per machine per class, every figure
   linked to its source.
4. **fws vs fwe side by side** (World 6) The same Compose stack; then "the mount
   tries…" (read `~/.ssh`, reach another stack's port, kill a foreign PID,
   fork-bomb), each attempt marked *kernel-enforced*, *patched by the runtime*,
   *presented only* or *not covered*.
5. **Spell decoder** (Special Zone) C / Linux arm64 asm / what runs on macOS,
   generated by real compilers. Order: `svc #0` → gate stub (or `brk #0x4c58`);
   raw `svc #0x80` (the chroot-not-VM point); `tpidr_el0`; `x18`; `__PAGEZERO`
   (address-space bar, 1 TiB slide); Hypervisor.framework fallback; JIT and
   `ic ivau`.
6. **Smuggling lab** (World 7) Edit an allowlist, then try npm install, git
   push, a DNS lookup, a POST to a paste site, CamoLeak-style image loads; see
   which pass and why.

Optional live terminal: `sandbox-exec -p '(version 1)(allow default)(deny network*)' curl …`,
then a sandboxed `pgrep` that still sees every host process.

## Audience moments

- World 1: "Hands up if your company has said *AI-first* this year."
- World 2: "Hands up if you've run an agent with the checks off. Keep it up if it
  was inside a VM." (unlocks the YOLO badge)
- World 5: the power-up vote.
- World 7: "Who has a production token readable from their home directory right now?"

## Must-check before slides

- fwe's arm64 specifics (x8 vs x16, the `ctr_el0` trap, `x18`) are not in the
  notes; check fwe's source before building the spell decoder.
- fwe ROADMAP vs recent commits; the hypervisor backend has run only on a stand-in.
- Seatbelt start cost: ~7 ms vs 3.4 ms / 7 ms (fws-design). Reconcile.
- Code Mode token counts (1.17M vs "over 2 million"); Kimi K3 (disputed by UK AISI).
- 2026 arXiv preprints (Overeager, Approval-to-Abuse, ZTAC, SandboxEscapeBench…)
  are not peer-reviewed; re-read SandboxEscapeBench's latest version.
- Agent sandbox mechanisms change monthly; date every cell of the agents matrix.
- Vendor numbers (Edera, OrbStack, Docker, Monty, Fermyon) are labelled as vendor claims.
- HN catalogue entries are summaries: open the permalink for verbatim quotes.
