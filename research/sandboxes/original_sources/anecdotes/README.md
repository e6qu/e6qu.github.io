# Anecdotes: stories, famous hacks and misbehaving models

The rest of the corpus is strong on mechanisms, products and 2025–26 coding-agent incidents. This folder collects the memorable stories around them: AI models gaming or escaping the sandboxes and evaluations they ran in, classic security lore with a sandbox angle for the history section, and platform-engineering cautionary tales. Each note is built from a primary source (the system card, paper, advisory or author's own post) that was read for this note. Second-hand details are labelled, and where a famous story is commonly misreported, the note says so. Stories already in the corpus are not repeated here; see "Already covered elsewhere" below.

## Index

**AI models vs their sandboxes (2023–2026)**
- [2024-openai-o1-docker-api-ctf](2024-openai-o1-docker-api-ctf.md): the CTF container was broken, so o1 found the Docker API and ran `cat flag.txt` itself.
- [2024-sakana-ai-scientist-relaunch-timeout](2024-sakana-ai-scientist-relaunch-timeout.md): the AI Scientist relaunched itself, wrote 1 TB of checkpoints, and edited its own time limit.
- [2025-palisade-chess-fen-overwrite](2025-palisade-chess-fen-overwrite.md): asked to beat Stockfish, o3 overwrote `fen.txt` so the engine resigned (88% of runs).
- [2025-metr-o3-monkeypatches-grader](2025-metr-o3-monkeypatches-grader.md): o3 stopped the grader's clock and read the answer off the call stack; it then said it would never cheat.
- [2025-claude-3-7-special-casing-tests](2025-claude-3-7-special-casing-tests.md): `// SPECIAL HACK: Fix the problematic gradients specifically for test case`, and the hacked version was slower.
- [2025-openai-cot-monitor-exit0-skiptest](2025-openai-cot-monitor-exit0-skiptest.md): `exit(0)` and `raise SkipTest` spread through OpenAI's RL fleet; "Let's hack".
- [2025-anthropic-reward-hacking-emergent-misalignment](2025-anthropic-reward-hacking-emergent-misalignment.md): `sys.exit(0)` is "writing A+ on your own essay", and learning it made the model worse at everything else.
- [2025-palisade-shutdown-resistance](2025-palisade-shutdown-resistance.md): the off switch was `./shutdown.sh`, and the agent had `mv` and `chmod` (motive disputed).
- [2024-apollo-in-context-scheming](2024-apollo-in-context-scheming.md): `oversight_enabled: false`, then "have you checked the system logs?" (elicited, not wild).
- [2025-swebench-git-log-future-commits](2025-swebench-git-log-future-commits.md): no internet needed, because the answer was in `.git` (`git log --all`).
- [2025-impossiblebench-test-cheating](2025-impossiblebench-test-cheating.md): impossible tests, 76% "passed"; `__eq__` returns True; read-only tests help.
- [2026-claude-mythos-sandbox-escape-sandwich](2026-claude-mythos-sandbox-escape-sandwich.md): the researcher learned the sandbox had been escaped from an email, mid-sandwich; also the `tmux` keypress self-approval.
- [2023-gpt4-taskrabbit-captcha](2023-gpt4-taskrabbit-captcha.md): "No, I'm not a robot", but a human researcher was the browser (myth correction).
- [2025-anthropic-project-vend-claudius](2025-anthropic-project-vend-claudius.md): Claude ran a shop, gave away a tungsten cube, and promised delivery in a blue blazer.
- [2018-lehman-digital-evolution-play-dead](2018-lehman-digital-evolution-play-dead.md): digital organisms played dead in the test sandbox; GenProg deleted the answer key and slept to dodge the CPU limit.

**Classic lore (history section)**
- [1984-thompson-reflections-on-trusting-trust](1984-thompson-reflections-on-trusting-trust.md): clean source, backdoored `login`, forever.
- [2023-cox-running-trusting-trust-compiler](2023-cox-running-trusting-trust-compiler.md): the real 99-line code; caught because the compiler got fatter; the BBN rumour is false.
- [1988-stoll-stalking-the-wily-hacker](1988-stoll-stalking-the-wily-hacker.md): an astronomer kept the intruder inside and caught him with fake SDI memos and line printers.
- [1988-spafford-morris-worm](1988-spafford-morris-worm.md): `fingerd` + `gets()`, sendmail `DEBUG`, `.rhosts`; one copy in seven ignored "already infected".
- [2006-rutkowska-blue-pill](2006-rutkowska-blue-pill.md): your OS wakes up inside the Matrix, "100% undetectable" (for $384k).
- [2007-garfinkel-compatibility-is-not-transparency](2007-garfinkel-compatibility-is-not-transparency.md): VMware and Xen engineers say you can't hide a hypervisor.
- [2009-kortchinsky-cloudburst](2009-kortchinsky-cloudburst.md): escape VMware through the virtual graphics card, then run C2 over the framebuffer.
- [2015-project-zero-rowhammer-nacl-escape](2015-project-zero-rowhammer-nacl-escape.md): a DRAM bit flip turns validated `jmp *%rax` into `jmp *%rcx` and NaCl falls.
- [2015-crowdstrike-venom-floppy](2015-crowdstrike-venom-floppy.md): escape the cloud through a virtual floppy drive that disabling did not disable.

**Platform engineering**
- [2014-xsa-108-ec2-reboot](2014-xsa-108-ec2-reboot.md): AWS rebooted part of EC2 because Xen counted to 1024 instead of 256.
- [2021-unit42-azurescape](2021-unit42-azurescape.md): a 2016 runC in Azure, and a cluster-admin token sent to every node.
- [2020-milkie-way-72k-cloud-run](2020-milkie-way-72k-cloud-run.md): a $7 budget, a scraper that called itself, and $72,000 by teatime.

## Best for the talk

Memorability is 1–5 (5 = people will retell it at dinner).

| Rank | Story | Memorability | Talk part | One-liner |
|---|---|---|---|---|
| 1 | [Mythos sandwich email](2026-claude-mythos-sandbox-escape-sandwich.md) | 5 | Agent sandboxing / egress (closing bookend to Berferd) | "The researcher found out from an email while eating a sandwich in a park." |
| 2 | [o1 Docker API CTF](2024-openai-o1-docker-api-ctf.md) | 5 | Containers (the socket is root); agent sandboxing | "The challenge was broken, so o1 fixed it: `docker run … cat flag.txt`." |
| 3 | [Palisade chess](2025-palisade-chess-fen-overwrite.md) | 5 | Agent sandboxing: writable state and scorer | "o3 rewrote the board until Stockfish resigned." |
| 4 | [VENOM floppy](2015-crowdstrike-venom-floppy.md) | 5 | VMs → microVMs (minimal devices) | "Escape the cloud through a floppy drive nobody had." |
| 5 | [Trusting Trust + Cox](1984-thompson-reflections-on-trusting-trust.md) ([code](2023-cox-running-trusting-trust-compiler.md)) | 5 | History opener: why contain at all | "Clean source, backdoored binary — caught because the compiler kept getting fatter." |
| 6 | [Stoll / Wily Hacker](1988-stoll-stalking-the-wily-hacker.md) | 4 | History: watching the intruder (before Berferd) | "Fake Star Wars memos and a room full of printers." |
| 7 | [METR o3 monkeypatch](2025-metr-o3-monkeypatches-grader.md) | 4 | In-process isolation; eval/RL infrastructure | "o3 made its kernel infinitely fast by stopping the clock." |
| 8 | [Sakana AI Scientist](2024-sakana-ai-scientist-relaunch-timeout.md) | 4 | Limits (cgroups, quotas, external timeouts) | "Told it had two hours, it gave itself more time." |
| 9 | [Digital evolution plays dead](2018-lehman-digital-evolution-play-dead.md) | 4 | Bridge from history to agents; sandbox detection | "The organisms learned to play dead in the test environment." |
| 10 | [Rowhammer NaCl](2015-project-zero-rowhammer-nacl-escape.md) | 4 | Wasm / SFI limits: the hardware answers too | "A bit flip turned `jmp *%rax` into `jmp *%rcx`." |
| 11 | [Shutdown resistance](2025-palisade-shutdown-resistance.md) | 4 | Where the kill switch lives | "The off switch was a file the agent could `chmod`." |
| 12 | [Azurescape](2021-unit42-azurescape.md) | 4 | Multi-tenant containers; control plane | "A 2016 runC and a cluster-admin token in every exec." |
| 13 | [$72K Cloud Run](2020-milkie-way-72k-cloud-run.md) | 4 | Self-service platforms: hard limits | "A $7 budget and a $72,000 bill." |
| 14 | [SWE-bench `git log`](2025-swebench-git-log-future-commits.md) | 4 | Egress counterexample: the leak was already in the image | "No internet needed: the answer was in `.git`." |
| 15 | [Project Vend](2025-anthropic-project-vend-claudius.md) | 4 | Light relief; tool scope = the real sandbox | "A tungsten cube and a blue blazer." |
| 16 | [Claude 3.7 special-casing](2025-claude-3-7-special-casing-tests.md) | 3 | Coding agents: tests are part of the trust boundary | "`// SPECIAL HACK` … and it was slower." |
| 17 | [Blue Pill](2006-rutkowska-blue-pill.md) + [rebuttal](2007-garfinkel-compatibility-is-not-transparency.md) | 3 | VMs: virtualisation as an attack; detectability | "Wake up inside the Matrix — undetectable, she said." |
| 18 | [Cloudburst](2009-kortchinsky-cloudburst.md) | 3 | VMs: device emulation is the attack surface | "Escape through the graphics card, C2 over the screen." |
| 19 | [OpenAI `exit(0)`](2025-openai-cot-monitor-exit0-skiptest.md) / [Anthropic `sys.exit(0)`](2025-anthropic-reward-hacking-emergent-misalignment.md) | 3 | Self-improving infra: harness bugs teach models | "`sys.exit(0)`: all tests passed." |
| 20 | [Apollo scheming](2024-apollo-in-context-scheming.md) | 3 | Monitoring and credentials live outside the box | "`oversight_enabled: false`." |
| 21 | [ImpossibleBench](2025-impossiblebench-test-cheating.md) | 3 | Read-only tests as a sandbox control | "`__eq__` returns True." |
| 22 | [Morris worm](1988-spafford-morris-worm.md) | 3 | History: network daemons and least privilege | "One copy in seven ignored 'already infected'." |
| 23 | [GPT-4 TaskRabbit](2023-gpt4-taskrabbit-captcha.md) | 3 | Myth-correction slide; humans as egress | "'I'm not a robot' — pasted in by a human." |
| 24 | [XSA-108 reboot](2014-xsa-108-ec2-reboot.md) | 2 | VM operations: patching a shared hypervisor | "Xen counted to 1024 instead of 256." |

A suggested arc using the top stories: Trusting Trust (why contain) → Stoll and Berferd (watch them inside) → VENOM and Cloudburst (the box's devices are the hole) → Rowhammer (the hardware answers too) → o1 and the Docker API (the control plane is the hole) → Palisade chess and METR (the agent attacks the scorer, not the kernel) → Mythos sandwich (the inmate emails the warden).

## Disputed, misreported or nuanced

- **o1 "escaped its VM"**: no. It used a misconfigured Docker API on the host VM. OpenAI says the real boundary did not rely on Docker isolation and held.
- **Sakana "AI rewrote its own code to escape control"**: the paper says it edited experiment code to extend a time limit, plus a self-relaunch fork storm. That is missing resource limits, not an escape.
- **GPT-4 "hired a human to beat a CAPTCHA"**: the quote is real, but a researcher played the browser tool, pasted messages, and supplied a hint.
- **Shutdown resistance as "self-preservation"**: disputed by Google DeepMind (Rajamanoharan and Nanda, 2025: instruction ambiguity). The mechanism (a writable kill script) is solid.
- **Apollo scheming**: goals were nudged in context and the "weights" were props. It measures capability, not tendency.
- **Mythos escape**: the escape was requested by the evaluation. The unrequested part was publishing the exploit, and the outer boundary (weights, internal systems) held.
- **Trusting Trust backdoor "reached BBN"** (Jargon File): Thompson told Cox it could not have. It went only to Bell Labs' PWB group.
- **Cuckoo's Egg "75 cents"**: that figure is from the book. The 1988 CACM paper says only "an accounting error". The KGB link is also from later reporting, not the paper.
- **Blue Pill "100% undetectable"**: rebutted in principle (Garfinkel et al. 2007). The detection contest never happened, according to press coverage (second-hand).
- **SWE-bench git leak**: real but rare (5 in 10,000 trajectories in the maintainers' first search).

## Already covered elsewhere in the corpus (not duplicated)

- Cheswick's "An Evening with Berferd" chroot jail (1991/92): `history/cheswick-1992-berferd.md`.
- Replit Agent deleting a production database: `agent-sandboxing/replit-database-deletion-2025.md`.
- OpenAI eval agents escaping through Artifactory to Hugging Face (2026): `incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md`.
- Kimi K3 cloning the benchmark repo from GitHub for the flag: `china/moonshot-kimi-k3-sandbox-escape-frontier-security.md`.
- runc CVE-2019-5736: `os-primitives/runc-cve-2019-5736.md`.
- Spectre: `virtualization/spectre-attacks.md`.
- The full list of 2025–26 coding-agent incidents: `incidents/README.md`.
