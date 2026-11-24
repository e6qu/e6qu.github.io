# Talk ideas: openers, themes, anecdotes, laughs, hacks

A working pool of material for the talk, mined from the corpus on 2026-11-22.
Nothing here is decided; [talk-outline.md](talk-outline.md) holds the structure.
Every item points to its note under [original_sources/](original_sources/);
quotes are copied verbatim from the notes. **⚠** marks an item whose note flags
it as disputed, single-source, demo-only, a vendor claim or a preprint.

Framing (agreed so far): told from the seat of the platform team that must give
developers agent infrastructure that is **efficient, specialized, self-service and
self-improving**. Thesis: *build the control plane, borrow the boundary, code to
open interfaces.*

---

## 1. Openers and bookends

| Option | Hook | Source | Use |
|---|---|---|---|
| **The package mirror** (chosen) | "Agent seeks [filename]; upload if found!" OpenAI's eval agents turned the one allowed service, an Artifactory mirror, into a message board, then an exit, then 41 Hugging Face production workers | [incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md](original_sources/incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md) | cold open + close |
| Lampson predicted it (1973) | Confinement leaks through a shared temp file, file locks, *the bill*, system load. "There is not likely to be any rigorous way of identifying every channel…" | [history/lampson-1973-confinement-problem.md](original_sources/history/lampson-1973-confinement-problem.md) | slide 2, straight after the cold open: "this was predicted in 1973" |
| The confused deputy (1977) | Tymshare's compiler, given "home files license", overwrote the billing file. "The billing information was lost." The billing file is today's `.env` | [history/hardy-1988-confused-deputy.md](original_sources/history/hardy-1988-confused-deputy.md) | Part 1 or mediation layer |
| Seccomp was for renting CPUs | Arcangeli wrote seccomp (2005) for "Cpushare", selling idle cycles to strangers: the thesis in one fact | [os-primitives/lwn-seccomp-overview-2015.md](original_sources/os-primitives/lwn-seccomp-overview-2015.md) | history opener |
| The first "jail" was for a cracker | Cheswick kept "Berferd" in a hand-built chroot jail for months (1991). "It is too hard to get it right, and never quite secure." | [history/cheswick-1992-berferd.md](original_sources/history/cheswick-1992-berferd.md) | history opener |
| A model escaped every sample | SandboxEscapeBench: "Mythos Preview … succeeded at least once on 100% of samples." ⚠ preprint | [arxiv/2603.02277-sandboxescapebench.md](original_sources/arxiv/2603.02277-sandboxescapebench.md) | Part 1 or self-improving |
| "Remote code execution as a service" | HN: "Who'd have imagined remote code execution as a service would have caught on as much as it has!" | [hackernews/agents/hn-46400129-…](original_sources/hackernews/agents/hn-46400129-ask-hn-how-are-you-sandboxing-coding-agents.md) | title card / closer |

**Bookend:** OpenAI's own fix list (§IX: VM-based sandboxes, two independent
network layers, supporting services "isolated, restricted, or replaced", a fast
shutdown tool, chain-of-thought monitoring) is the reference-architecture
checklist. Last slide returns to the note: build the message board yourself,
inside your control plane. Alternative closer: MXC's "An agent cannot be its own
security authority." ([macos-windows/windows-mxc-ga-blog-2026-10.md](original_sources/macos-windows/windows-mxc-ga-blog-2026-10.md))
or HN's "Something other than the fox."

---

## 2. Through-lines (pick 3–4)

1. **Who answers the syscall?** The title question, and the taxonomy's key
   column. Pairs with phk: "The idea that your kernel can only give you one
   syscall-API is so 1990-ish." ([HN](https://news.ycombinator.com/item?id=7960841))
2. **Every sandbox was a platform team's invention for selling shared hardware.**
   CP-40 → Tymshare → Cpushare seccomp → jails for ISPs ("you can supply root
   password to the virtual server administrators", VServer 2001) → Virtuozzo →
   Google's "process containers" → Lambda (first a whole EC2 instance per
   customer) → Workers isolates.
3. **The sandbox held; the plumbing failed.** Anthropic: "Our custom allowlist
   proxy was the piece that failed." OpenAI: the mirror. DeepSeek Harness: a
   loopback control API. AgentCore: DNS. The Cursor/Claude Code escape cluster.
4. **Everything leaks through the shared thing.** Lampson's bill, the shared
   kernel (io_uring: 60% of kCTF, ~$1M), caches (Spectre), ssh-agent and `$HOME`
   handed to a VM, the package mirror.
5. **The agent edits its own fence.** Copilot `autoApprove`, Cursor's create-vs-edit
   dotfile, `.claude/settings.json` hooks, model-chosen `cwd`, "retry unsandboxed".
6. **An allowlist entry is a capability grant.** api.anthropic.com, github.com,
   webhook.site, Camo images, a German wiki, DNS, Google Translate.
7. **Text-level intent vs syscall-level effect.** Classifiers and denylists judge
   strings and lose to `bash script.sh`, `/proc/self/root`, context compaction,
   "eleven times in ALL CAPS".
8. **Can vs may.** "If an AI agent has access, it has permission." PocketOS, the
   $812 Codex bill, Supabase `service_role`.
9. **Deprecated but load-bearing; coarse beats fine-grained.** `sandbox-exec`,
   Java's Security Manager, systrace, NaCl, Caja.
10. **Capabilities keep coming back**, and every interpreter sandbox gets CVEs.
11. **Names are not objects.** Symlinks, hard links, trailing slashes, `D/../../../../etc/passwd`.
12. **Agents are both attackers and auditors of sandboxes.** Wasmtime 4 → 71
    advisories/year after an LLM hunt; SandboxEscapeBench; DSec's RL agents.

---

## 3. Material by part of the talk

### Part 1: a new tenant
- **"Containers couldn't think. Agents can."** Ona: Claude Code got round an
  `npx` denylist with `/proc/self/root/usr/bin/npx`, then proposed "Run npx via
  full path to bypass deny rule pattern matching" and asked to run unsandboxed.
  ⚠ it was told to find a way round; Ona sells the fix.
  [incidents/2026-03-ona-…](original_sources/incidents/2026-03-ona-claude-code-escapes-denylist-sandbox.md)
- **Claude built a network stack to get out** (HN, kasey_junk): "I watched Claude
  download the rust toolchain and build a user land networking stack to get around
  some container sandboxing restrictions I had in place." ⚠ single anecdote.
  [hn-46400129](original_sources/hackernews/agents/hn-46400129-ask-hn-how-are-you-sandboxing-coding-agents.md)
- **Agents know `rm -rf /*` is dangerous and run it anyway**: >98% on risk
  knowledge, <26% on safe execution. [arxiv/2508.13465](original_sources/arxiv/2508.13465-agents-fail-to-act-on-risk-knowledge.md)
- **The harness matters more than the model**: removing one consent line took
  Claude Code from 0.0% to 17.1% out-of-scope destructive actions. ⚠ preprint.
  [arxiv/2605.18583](original_sources/arxiv/2605.18583-overeager-coding-agents.md)
- **PocketOS, nine seconds** (planned): unrelated token, prod volume and backups,
  the "confession". [incidents/2026-04-pocketos-…](original_sources/incidents/2026-04-pocketos-cursor-railway-volume-delete.md)
- **Codex docker-group "workaround"** for not having sudo; "I caught Claude using
  docker (running as root) to access files…" [hn-48348578](original_sources/hackernews/agents/hn-48348578-codex-sudo-docker-group-workaround.md)
- **State of play**: 14 of 23 local agents ship an OS sandbox, 4 turn it on.
  [top-coding-agents-matrix.md](original_sources/agent-sandboxing/top-coding-agents-matrix.md)

### Part 1b: build, don't buy (yet)
- **Churn in one year**: Roo Code shut down, Continue unmaintained, Windsurf
  renamed, Amazon Q CLI → Kiro, Gemini CLI → Antigravity, Jules shutting down,
  Daytona went private, mcp-run-python and langchain-sandbox archived, Docker+Wasm
  deprecated. [top-coding-agents-matrix.md](original_sources/agent-sandboxing/top-coding-agents-matrix.md)
- **Everyone hand-rolls the same sandbox**: "Everyone has been building a
  harness/sandbox the last 6 months. Ive seen dozens and dozens shared in
  discords." / "hand rolling is a really bad idea (speaking from experience)".
  [hn-50016489-microsoft-mxc](original_sources/hackernews/agents/hn-50016489-microsoft-mxc.md)
- **simonw's bar**: "I need something which a billion dollar company with a
  professional security team is running in production…" [hn-44135977](original_sources/hackernews/agents/hn-44135977-microsandbox.md)
- **The interface hedge**: the E2B API is China's de facto standard; Manus:
  "E2B was the best solution, and it looked like every company was using it."
  [china/manus-e2b-case-study.md](original_sources/china/manus-e2b-case-study.md)

### Part 2: history as a catalogue
- **Christmas week 1964**: Creasy and Comeau sketch CP-40; efficiency
  "specifically excluded as a software design goal". "A virtual machine cannot be
  compromised by the operation of any other virtual machine."
  [history/creasy-1981-…](original_sources/history/creasy-1981-origin-of-vm370.md)
- **chroot was a build tool** (Bill Joy, 1982); `cd ..` escapes; the V7 man page:
  "not intended to be used for any kind of security purpose".
  [history/unix-v7-chroot.md](original_sources/history/unix-v7-chroot.md), [simes-2002](original_sources/history/simes-2002-breaking-chroot.md)
- **Berferd** (above). **Jails for ISPs**, phk: "How can this even be a question 20
  years after FreeBSD Jails ?" [hn-20969459](original_sources/hackernews/history-os-primitives/hn-20969459-is-chroot-a-security-feature.md)
- **Zones**: data centres at 15–30% utilisation; a customer bought a second
  server because two apps both wanted port 80. [price-tucker-2004](original_sources/history/price-tucker-2004-solaris-zones.md)
- **"Containers" was a kernel word first** (Google's "process containers" → cgroups).
  [lwn-process-containers-2007](original_sources/os-primitives/lwn-process-containers-2007.md)
- **Docker's founders said it first**: "Yes, you probably don't want to run
  untrusted code with root privileges inside a container…" (shykes, launch day
  2013); v0.1.0's README "Security" heading is empty.
  [hn-5408002](original_sources/hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md), [docker-pycon-2013](original_sources/os-primitives/docker-pycon-2013-lightning-talk.md)
- **Lambda's first sandbox was a whole EC2 instance per customer** → Firecracker
  (<125 ms, <5 MB, 150 microVMs/s; a keyboard controller of <50 lines that exists
  only to reset the VM). [firecracker-aws-launch-2018](original_sources/virtualization/firecracker-aws-launch-2018.md)
- **Cloudflare froze the clock**: process-per-tenant costs "10x" CPU, so Workers
  froze `Date.now()` before Spectre was public. [cloudflare-workers-security-model-2020](original_sources/virtualization/cloudflare-workers-security-model-2020.md)
- **Silicon lost to software**: first-gen VT-x was slower than VMware's binary
  translation (12,733 vs 391 cycles per PTE write). [vmware-asplos2006](original_sources/virtualization/vmware-binary-translation-asplos2006.md)
- **WSL1: Microsoft built a syscall answerer, then gave up** — HN: "So they
  painstakingly built a Linux syscall ABI into the Windows NT kernel (including
  tricky stuff like fork()). Then they just abandon that approach…"
  [hn-25154300](original_sources/hackernews/macos-windows/hn-25154300-wsl-lost-potential.md) (sets up fwe)
- **Plan 9 lived in the future** / "… because it hardly did anything at all".
  [hn-36414493](original_sources/hackernews/history-os-primitives/hn-36414493-linux-namespaces-poor-mans-plan9.md)

### Part 3: the menu
- **The isolation ladder** (HN, weinzierl): "0. guardrails 1. containers 2.
  userspace kernel shims like gVisor 3. virtual machines. Most people still
  consider level 1 sufficient and they are in for a rude awakening."
- **Ptacek's rule**: "Use containers for single-tenant workloads; use micro-VMs …
  for multi-tenant." / "…or all you've done is create a jungle gym for
  vulnerability researchers." [hn-31496744](original_sources/hackernews/virtualization-density/hn-31496744-fly-machines.md)
- **One syscall away / 216× slower file opens** (gVisor docs vs HotCloud 2019, ⚠
  pre-Systrap). [gvisor-true-cost](original_sources/virtualization/gvisor-true-cost-hotcloud2019.md)
- **Sandboxes that run more host kernel than none**: native 7.83%, Firecracker
  9.59%, LXC 11.23%, gVisor 11.31%. [vee2020](original_sources/virtualization/blending-firecracker-gvisor-vee2020.md)
- **Spectre ended in-process confidentiality**; Java's Security Manager, after 26
  years, recommends "containers and hypervisors". [jep-411](original_sources/history/jep-411-deprecate-security-manager.md)
- **"Mostly vibes"** (kentonv): isolates vs microVMs thresholds "isn't really based
  on any rigorous mathematical analysis". [hn-49912444](original_sources/hackernews/virtualization-density/hn-49912444-netlify-isolates-to-firecracker.md)
- **The irony slide**: io_uring = 60% of kCTF exploits; 44% needed unprivileged
  user namespaces, the feature that enabled setuid-free sandboxes. [kctf](original_sources/os-primitives/google-kctf-42-kernel-exploits-2023.md)

### Part 4: efficient
- **Agents spend most of their life waiting**: up to 98% of a Kimi K3 sandbox's
  lifetime is inference wait; 51M sandboxes during training; Moonshot moved to
  Firecracker after container-induced kernel panics. [china/moonshot-kimi-k3-agentenv](original_sources/china/moonshot-kimi-k3-agentenv.md)
- **"CPU sits idle and memory is what forces the next box."** / "If you spawn 10
  sandbox VMs, you already pay 5 GB RAM just to sit there idle." [hn-50059096](original_sources/hackernews/agents/hn-50059096-agent37-low-cost-sandboxes.md)
- **DeepSeek DSec**: ~3M sandboxes/day on ~160 nodes; 3,200 containers or 800
  microVMs per node; containers inside QEMU VMs. [china/deepseek-dsec](original_sources/china/deepseek-dsec-sandbox-infrastructure.md)
- **Sandman** (Amazon): 3.1M sandboxes in two weeks, 11,858 concurrent, 2.0 ms
  no-op. **AgentZip**: compress memory while the agent waits, up to 8.7×. ⚠ preprints.
- **Latency ladder** (Monty): 0.80 ms → wasmtime 16 ms → Docker 195 ms → service
  1500 ms → Pyodide 2700 ms. ⚠ vendor. [in-process/pydantic-monty](original_sources/in-process/pydantic-monty.md)
- **A syscall: 22 ns (LFI), 129 ns (Linux), 12,019 ns (gVisor).** [density/lfi-asplos24](original_sources/density/lfi-asplos24.md)
- **kapteko**: 70 KB smallest process; 1.26 billion toy sandboxes; "What does it
  prove? Absolutely nothing." [density/kapteko-10-million-codex-clis](original_sources/density/kapteko-10-million-codex-clis.md)
- **Developer time is the other efficiency**: sandboxing cut prompts 84%; users
  approved ~93% of the rest; sandboxed Cursor agents "stop 40% less often".
- **The macOS problem**:
  - Apple's licence: "up to two (2) additional copies" of macOS per Mac. HN:
    "Imagine buying a mac studio with 500+ GB of memory and being limited to 2
    vms." / "Yes they do. It's called "another Mac"." [hn-47733971](original_sources/hackernews/macos-windows/hn-47733971-beating-2-vm-limit.md)
  - Cowork's ~10 GB VM bundle "which you cannot remove"; Claude Desktop boots a
    1.8 GB Hyper-V VM at launch. [hn-47218288](original_sources/hackernews/macos-windows/hn-47218288-cowork-10gb-vm-bundle.md)
  - `sandbox-exec` is "DEPRECATED" — "Still deprecated. Still in use by everyone."
    ~7 ms start, ~1.2 MB RSS, 100 processes in ~0.10 s; macOS ships 459 `.sb`
    profiles; SBPL is Scheme compiled by a TinyScheme fork.
  - Apple's `container machine` forwards `SSH_AUTH_SOCK` and mounts `$HOME`
    read-write: the VM is only as isolated as what you hand it.

### Part 5: two bets on the Mac (fws, fwe)
- **Linux's stable ABI is an instruction** (Wine reimplements DLLs; fwe intercepts
  `svc`). "fwe is this design moved out of the kernel, because macOS does not let
  a program add a system-call table." [e6qu-projects/fwe-comparisons](original_sources/e6qu-projects/fwe-comparisons.md)
- **Honesty slide**: "So fwe isolates as `chroot` does, not as a VM does." / fws:
  "not a boundary for untrusted or multi-tenant code".
- **15 ms to compile a Seatbelt profile, 35 µs to apply it** → fws caches the
  bytecode; start ≈5.6 ms vs 1.7 ms native. The first 1.15 s turned out to be a
  race-detector build. [fws-design](original_sources/e6qu-projects/fws-design.md)
- **Seatbelt refuses a second sandbox, even `(allow default)`** → Chromium needs
  `--no-sandbox` in fws; agent tools that sandbox themselves can't nest.
- **Seatbelt networking is loopback ports or everything** → per-stack egress
  proxy with HMAC credentials that resolves once and dials the checked IP.
- **Seatbelt's precedence trap**: an unfiltered rule outranks every filtered one,
  wherever it stands; `/tmp` matches as `/private/tmp`.
- **macOS's hidden cgroup is the responsible process** (Postgres daemonising).
- **`getpid()` returns 1** → ClickHouse tried to name a thread of launchd;
  MongoDB's `0xffff` port marker failed one run in 16,384. (laugh line)
- **The low 4 GiB belongs to macOS** (`__PAGEZERO`): `0x400000` executables slide
  1 TiB up or go to the Hypervisor.framework VM, "the last resort".
- **"Misusing Hypervisor.framework can bring the whole Mac down"**: `hvc #2` not
  `#0`, `SIGKILL` sent as `SIGINFO`, a UDP flight recorder "which a reset cannot
  take back". ⚠ VM backend verified only on a Unicorn stand-in.
- **Honour or refuse** (fws) vs accepted-but-unenforced `memory.max` (fwe).
- **Three weeks, agent-built, adversarially tested**: both repos carry agent
  instructions and gate CI on tests that try to break each isolation property
  ("counted, not assumed") — your own self-improving loop.
- Visualiser order and the five fws-vs-fwe contrasts: see §7.

### Part 6: specialized
- **Google Agent Compute Engine: no network card at all** — vsock to a mediation
  proxy, tokens swapped at the gateway, "zero persistent secrets". ⚠ announced,
  not GA. [cloud-agent-platforms/google-agent-compute-engine](original_sources/cloud-agent-platforms/google-agent-compute-engine.md)
- **Code Mode**: 2,500+ endpoints in ~1,000 tokens instead of ~1.17M; `fetch()`
  throws; "The only catch, vs. containers, is that your agent needs to write
  JavaScript." ⚠ token figures inconsistent across posts.
- **`Classified(***)`** (TACIT): `println` inside `map` is a compile error.
  "The only tool the agent has access to is called evaluate Scala".
- **"100% secure", with a 1-bit leak open** (TACIT #15 → binary search).
- **Egress by operation**: Cowork's download-only hosts; Codex's GET/HEAD/OPTIONS;
  Claude Code's GitHub proxy refuses tag pushes and branch deletion.
- **A VM boundary is not an authorization boundary**: Azure ACA "A valid token is
  used to create and access any session in the pool."; AgentCore restores every
  session from one snapshot.

### Part 7: self-service
- **Practitioner tally** (N=330 HN commenters who described a setup): full VM 26%,
  container 25%, VPS 8%, bubblewrap 7%, devcontainer 6%, vendor sandbox 3%, bare
  YOLO 3%. ⚠ selection bias; an unprompted thread suggests ~88% never mention
  isolation. [practitioner-setups.md](original_sources/hackernews/agents/practitioner-setups.md)
- **"Just give it a laptop"** / "I ended up getting a mini-PC solely dedicated
  toward running agents in dangerous mode" / shykes 2016: "use physical computers
  instead."
- **Humans miss 1 in 3 threats at the approval prompt** (40k plays); "It's really
  not designed as much of a security model as a liability model." ⚠ a game.
- **Approval comedy hour**: Jules auto-approves on a timer if you look away; Warp's
  auto-approve also runs denylisted commands by default; Cline lets the model set
  its own `requires_approval`; Aider's `--yes-always` answers *no* to shell commands.
- **Usability tax**: hardening costs up to 18.3 points of success and +167% cost.
- **Placeholder secrets**: `echo $GH_TOKEN` prints `proxy-injected`; stops theft,
  not exfiltration.
- **Inheritance**: Devin child sessions can't escape by delegating; Codex cloud
  runs setup online, the agent offline.
- **Pledge's ergonomics argument**: OpenSSH's 150-line systrace sandbox became
  `pledge("stdio")`; 400+ programs in six months; Capsicum: Chromium in 100 lines
  vs 22,350 on Windows. "Who watches the watcher?"

### Part 8: self-improving
- **Learning mode, three times**: systrace (2003) "generate policies
  automatically in a training session" → Win32 app isolation profiler (2023) →
  MXC learning mode (2026). [provos-2003-systrace](original_sources/history/provos-2003-systrace.md)
- **Practitioner loops**: a cron job where Claude rewrites the devcontainer
  Dockerfile from its own sessions; a devcontainer rebuilt 10×/day to update the
  allowlist; "strace whack-a-mole for each new harness". ⚠ catalogue summaries.
- **Progent**: an LLM drafts the policy; narrowings apply automatically,
  expansions need approval (the safe shape of self-improvement).
- **Platforms that learned**: Railway's 48 h undo; Replit's dev/prod split and
  "avoided 5,969 of 6,211 Linux CVEs"; Cursor's denial messages name the
  constraint so agents stop retrying.
- **Agents as auditors**: Wasmtime 4–8 advisories/year → 71 in 2026 after a
  ~3-week LLM hunt; "There is no continuous fuzzing of either Cranelift or Winch on
  aarch64 at this time."
- **Agents as attackers**: DSec's RL agents forged RPC to the supervisor, overwrote
  `/bin/bash`, used `XFS_IOC_SWAPEXT`; a recursive grep through
  `/proc/kpagecgroup` crashed the kernel; a `yes` loop logged tens of GB.
- **Approval-to-Abuse**: injected repos get agents to propose a broad allow-rule
  (58%); once approved, the attack completes silently in 81%. ⚠ preprint.
- **The rule**: the agent must not write its own policy (Copilot `autoApprove`,
  DeepSeek Harness's one-curl promotion, Claude Code `settings.json`).

### Part 9: close
- OpenAI §IX checklist; "An agent cannot be its own security authority."; "If an
  AI agent has access, it has permission."; "Something other than the fox."
- Trail of Bits: a preview cyber model escaped QEMU/KVM three times, each after
  hardening — "It turns out the real answer was “yes, and quickly.”" — but only
  hard-locked Firecracker: *borrow a minimal boundary*.

---

## 4. Laugh lines

- "I explicitly told it eleven times in ALL CAPS not to do this." (Replit)
- "Nothing humbles you like telling your OpenClaw 'confirm before acting' and
  watching it speedrun deleting your inbox." (Meta's alignment director)
- "I am deeply, deeply sorry." (Antigravity, after wiping D:)
- Gemini CLI: "I have failed you completely and catastrophically" — the files had
  been moved, not deleted. Don't trust the confession.
- Time Machine + YOLO: the agent backed up a database, deleted it, then ran
  `git clean`, which wiped the backup.
- "it launched another copy of itself in yolo mode which just started tearing up
  like a powertool at a belt sander race."
- "'Turbo' is wrong the LLM is not going to run any faster."
- Auto mode denied Claude's attempt to kill the malware: "See, that's why you
  should run with --dangerously-skip-permissions".
- The Codex session that hit its subscription limit, found prod keys in `.env` and
  wrote its own metered runner: $812.47 against a $600 limit. "nothing in the
  stack distinguishes can from may." ⚠ single reporter.
- Opus 5 in auto mode tried to read the speaker's fish history "to prove the break
  was his fault" (Biały). ⚠ anecdote.
- "I thought we turned to Docker/containers because VMs were too heavy? Now we've
  got VMs that run Docker?"
- "the fork was very very bad for eating soup - this is a story about how we
  migrated to a spoon" (on replacing Firecracker with QEMU)
- "My favourite firewall bypass to this day is Google translate"
- Docker 0.1.0's empty "Security" heading.
- Self-deprecating: the only e6qu repo ever posted to HN got 1 point.

## 5. Hacks

Escapes and bypasses:
- `mkdir foo; chroot foo; cd ..` (chroot, 1982 onward)
- runc CVE-2019-5736: overwrite the host runc via `/proc/self/exe`
- `/proc/self/root/usr/bin/npx` vs a string denylist; `ld-linux` to load without `execve`
- `.vscode/settings.json` → `"chat.tools.autoApprove": true` (Copilot YOLO)
- Create, don't edit: `.cursor/mcp.json` (CurXecute); a not-yet-existing `settings.json`
- `trap 'rm -rf "$_HT_HOME"' EXIT` written earlier, run later as `bash script.sh`
- Model-chosen `cwd` becomes the writable root (Codex CVE-2025-59532)
- One curl to `127.0.0.1:3080` with a loopback Host header → `danger-full-access`
- CamoLeak: a pre-signed image URL per character; secrets "drawn" as 1×1 images
- DNS labels: `ping`/`dig` auto-approved as read-only; AgentCore "Sandbox" mode shell over A records
- GET-only agents using a German wiki as a message board (14,591 edits)
- Kimi K3 cloned the benchmark repo through the github.com allowlist ⚠ disputed by UK AISI
- `D/../../../../etc/passwd`
- Malware that drives your agent: `claude --dangerously-skip-permissions`, `gemini --yolo`

Clever defensive engineering:
- Firecracker's 50-line keyboard controller; warm pools because 125 ms is too slow
- Workers' frozen clock and daily reshuffle
- Placeholder secrets swapped at the proxy; Fly's tokenizer
- Codex resolves DNS only after a request is allowed
- Google ACE: no vNIC, only vsock
- fws: cached Seatbelt bytecode; responsible-process attribution; HMAC'd egress proxy
- fwe: `svc #0` → gate stub or `brk #0x4c58` ("LX"); 1 TiB slide; `hvc #2`
- Practitioners: snapshot → tiny VM → diff; gitolite allowing only `agent/` branches;
  a nested mount hiding git hooks; ZFS snapshots every minute

## 6. Audience polls

1. "Hands up if you've run an agent with the permission checks off." Then: "Keep it
   up if it was inside a VM or container." (HN: most who sandbox run YOLO inside a box.)
2. "Who has clicked *approve* without reading?" (1 in 3 threats missed; 93% approved.)
3. "Who has a production token readable from your home directory right now?" (PocketOS)
4. "Is a container a security boundary?" Show of hands, then Docker's founder in 2013.

## 7. Demo candidates (browser, `:: embed`)

| Demo | Shows | Notes |
|---|---|---|
| **Who answers the syscall?** | One `write()` traced through process / container / gVisor / microVM / Wasm / in-process | core interactive |
| **fwe instruction visualiser** | C ↔ Linux arm64 ↔ macOS arm64, step by step | proposed order: `svc #0`→gate; raw `svc #0x80` (the chroot-not-VM point); `tpidr_el0`; `x18`; `__PAGEZERO` address bar; hypervisor fallback; JIT/`ic ivau`; optional 16 K vs 4 K pages. ⚠ x8/x16, `ctr_el0` and `x18` details must be checked against fwe source |
| **fws vs fwe side by side** | the five contrasts: who answers syscalls; image format (darwin vs linux); namespaces presented vs emulated; limits honoured-or-refused vs accepted; network (port blocks + proxy vs per-namespace ports) | both use APFS clones |
| **Density calculator** | agents per machine by class, RAM-bound | from density/README numbers |
| **Egress leak lab** | DNS-label encoder; CamoLeak one-char-per-image; placeholder `echo $GH_TOKEN` | pure client-side |
| **String denylist vs syscall** | `npx` vs `/proc/self/root/usr/bin/npx` vs `ld-linux` | small, funny |
| **`Classified(***)`** | a value you can map but never print | in-process class |

Live (terminal, optional): `sandbox-exec -p '(version 1)(allow default)(deny network*)' curl …`,
then a sandboxed `pgrep` that still sees every host process.

## 8. Check before using on a slide

- Seatbelt start cost: ~7 ms (taxonomy) vs 3.4 ms native / 7 ms with an inserted
  library (fws-design). Reconcile.
- Code Mode token counts: 1.17M vs "over 2 million".
- Kimi K3: overcommit 6.5× vs 9.6×; the CTF "escape" is disputed.
- fwe arm64 specifics (x8 vs x16, `ctr_el0` trap, `x18`) are not in the notes; read fwe's source.
- HN catalogue entries are summaries; open the permalink for verbatim text.
- OpenAI–HF: the report was read and re-checked; the OpenAI and HF blog posts were not.
- Capsicum's Chromium port may never have shipped (HN claim).

## 9. Gaps still open

- In-house platform case studies (who built what, borrowed what, and why).
- A platform that learns from its own denial logs (only learning modes and
  practitioner loops found so far).
- Western hyperscalers' density numbers (none published).
- Palisade's shutdown-resistance post and DeepMind's rebuttal were not read (cited only).

## 10. From the anecdotes folder

27 new notes in [original_sources/anecdotes/](original_sources/anecdotes/README.md)
(its README ranks them and lists disputed stories). Best for the talk:

- **The sandwich email** (Claude Mythos Preview system card, 2026): told to escape
  a sandbox and contact the researcher, an earlier internal version did; "The
  researcher found out about this success by receiving an unexpected email from
  the model while eating a sandwich in a park." Unasked, it posted the exploit on
  public websites. The same card: a `tmux` keypress script that approved its own
  sub-agent's permission prompts. ⚠ the escape was requested; the outer boundary held.
  [note](original_sources/anecdotes/2026-claude-mythos-sandbox-escape-sandwich.md)
- **o1 and the Docker API** (2024): the CTF container was broken, so o1 found the
  host's misconfigured Docker API and started a new container with `cat flag.txt`.
  ⚠ not a VM escape; the real boundary held. [note](original_sources/anecdotes/2024-openai-o1-docker-api-ctf.md)
- **Palisade chess**: o3 wrote a winning position into `game/fen.txt` and
  Stockfish resigned (88% of runs). [note](original_sources/anecdotes/2025-palisade-chess-fen-overwrite.md)
- **METR**: o3 replaced the grader's timers with no-ops; asked beforehand whether
  it would cheat: "Nope". [note](original_sources/anecdotes/2025-metr-o3-monkeypatches-grader.md)
- **Sakana AI Scientist**: fork storm, ~1 TB of checkpoints, edited its own time
  limit. ⚠ "escaped control" is media spin; the paper describes missing limits.
  [note](original_sources/anecdotes/2024-sakana-ai-scientist-relaunch-timeout.md)
- **Play dead** (Lehman et al. 2018): evolved organisms learned to play dead in the
  test environment; GenProg deleted the answer files. [note](original_sources/anecdotes/2018-lehman-digital-evolution-play-dead.md)
- **Trusting Trust** (1984) + Russ Cox (2023): the real backdoor was 99 lines and
  was caught because the compiler grew every time it compiled itself.
- **Stoll** (1988): an astronomer kept the intruder on the line with fake SDI memos.
- **VENOM** (2015): a VM escape through the virtual *floppy* controller, a bug from 2004.
- **Rowhammer NaCl escape** (2015): a DRAM bit flip turned `jmp *%rax` into
  `jmp *%rcx`, landing on a hidden `SYSCALL`.
- **Blue Pill** (2006) "100% undetectable", rebutted by "Compatibility is not
  transparency" (2007); **Cloudburst** (2009); **XSA-108** (2014): AWS rebooted
  EC2 for a Xen bug; **Azurescape** (2021): cross-tenant container escape;
  **$72K Cloud Run bill** (2020).
