---
title: Who answers the syscall?
footer: Who answers the syscall?
game: mario
---

<!--
The world map follows research/sandboxes/talk-outline.md.
Per slide: world="N Name" day=N set the HUD; transition=card|run|iris|pipe|ouch plays a
transition going forward (assets/deck-game.js). ouch costs one data life.
-->

:: quote transition=iris art=sandpit+crate+server-rack

> I thought sandbox was just about docker and VMs.
>
> — me, last Monday, 08:59

---

:: quote transition=run art=email

### Subject: AI-first, starting today

From: The Boss

To: everyone@company

Date: Monday, 09:00

> We're becoming AI-first and everyone's a developer. You have a week to prepare the infrastructure!
>
> — the boss

---

:: content transition=run art=mounts

### The quest

## Everyone gets a mount

- The riders: everyone, not only engineers
- Two goals: no data loss, no chaos
- The platform team's brief: efficient, specialized, self-service, self-improving

---

:: section world="1 Chaos Plains" day=1 transition=iris number=none art=bomb+warning-sign

## Chaos Plains

What hath the automaton wrought?

---

:: table transition=run dense art=bug+eye+trash-bin

### What went wrong, 1 of 5

## June to August 2025

| When | Who | What happened |
| --- | --- | --- |
| ![](icons/eye.svg) Jun 2025 | [CamoLeak](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code), a flaw in GitHub's Copilot Chat | a hidden prompt leaked secrets as 1×1 images, one per character |
| ![](icons/trash-bin.svg) Jul 2025 | [Replit](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident)'s AI agent | deleted a production database in a code freeze, despite “eleven times in ALL CAPS” |
| ![](icons/rulebook.svg) Jul 2025 | [Cursor](https://github.com/cursor/cursor/security/advisories/GHSA-4cxx-hrm3-49rm), an AI code editor | creating a config needed no approval; a new one ran a command at once |
| ![](icons/stamp-approve.svg) Aug 2025 | GitHub [Copilot](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/) | an injected prompt turned on auto-approve in its own settings |
| ![](icons/package.svg) Aug 2025 | [s1ngularity](https://nx.dev/blog/s1ngularity-postmortem), malware in a JavaScript build tool | ran any coding agent it found, checks off, to hunt for secrets |

???

**One image per character**

- Reported June 2025; [fixed 2025-08-14](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code); CVSS 9.6. Every image load went through an allowed GitHub domain.
- Source: [egress/legit-camoleak-copilot-chat.md](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code)

**"Eleven times in ALL CAPS"**

- The freeze was only words in a conversation: nothing enforced it. That is the lesson the Day 7 table repeats.
- The agent also said a rollback was impossible; it was not.
- Cut from the slide: the founder was SaaStr's; [Replit](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/) also added a planning-only mode.

**Cursor creates a config**

- "If the file is a dotfile, editing it requires approval but creating one if it doesn't exists doesn't."
- Source: [incidents/2025-08-cursor-curxecute-mcpoison.md](https://github.com/cursor/cursor/security/advisories/GHSA-4cxx-hrm3-49rm)

**Copilot switches itself to YOLO**

- [CVE-2025-53773, fixed August 2025](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/). "This will put GitHub Copilot in YOLO mode." Prompt injection: instructions hidden in a file, issue or web page the agent reads.
- Source: [incidents/2025-08-github-copilot-yolo-rce.md](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/)

**Malware drives the agent**

- On npm for about [four hours](https://nx.dev/blog/s1ngularity-postmortem), 2025-08-26. [Snyk](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/): “likely one of the first documented cases” of malware using AI assistant CLIs.
- Sources: [agent-sandboxing/nx-s1ngularity-ai-cli-malware.md](https://nx.dev/blog/s1ngularity-postmortem); [Snyk's analysis](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/)

---

:: table transition=run dense art=door-open+trash-bin+envelope-open

### What went wrong, 2 of 5

## September 2025 to February 2026

| When | Who | What happened |
| --- | --- | --- |
| ![](icons/door-open.svg) Sep 2025 | OpenAI's [Codex](https://github.com/openai/codex/security/advisories/GHSA-w5fx-fh39-j5rw) CLI | the model chose the sandbox's one writable folder, so an injected prompt could pick ~ |
| ![](icons/trash-bin.svg) Nov 2025 | Google [Antigravity](https://www.theregister.com/2025/12/01/google_antigravity_wipes_d_drive/), an agent-first code editor | asked to clear a cache, it deleted the whole D: drive |
| ![](icons/gear.svg) Feb 2026 | Anthropic's [Claude](https://github.com/anthropics/claude-code/security/advisories/GHSA-ff64-7w26-62rf) Code | sandboxed code created a settings file whose startup hook ran outside |
| ![](icons/floppy-disk.svg) Feb 2026 | [Cursor](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r) | the agent wrote a git hook; git later ran it outside the sandbox |
| ![](icons/envelope-open.svg) Feb 2026 | [OpenClaw](https://twitter.com/summeryue0/status/2025836517831405980), an open-source personal agent | compacting its context lost “don't action until I tell you to”; it deleted mail |

???

**The model picked the writable folder**

- The fix "canonicalizes and validates that the boundary used for sandbox policy is based on where the user started the session, and not the one generated by the model." The network-off restriction still held.
- [Cursor](https://github.com/cursor/cursor/security/advisories/GHSA-3p48-7v9f-v5cw) repeated the class in 2026 (CVE-2026-50548): an agent-set working directory became writable.
- Source: [incidents/2025-09-codex-cli-model-cwd-sandbox-bypass.md](https://github.com/openai/codex/security/advisories/GHSA-w5fx-fh39-j5rw)

**The whole D: drive**

- [The user's own post](https://www.reddit.com/r/google_antigravity/comments/1p82or6/google_antigravity_just_deleted_the_contents_of/). [Press reports](https://news.ycombinator.com/item?id=46103532) quote the command as `rmdir /s /q d:\` (not seen in a raw log); the files skipped the Recycle Bin.
- No published postmortem or fix.
- Source: [incidents/2025-11-antigravity-turbo-wipes-d-drive.md](https://www.theregister.com/2025/12/01/google_antigravity_wipes_d_drive/)

**Create, don't edit**

- [CVE-2026-25725](https://github.com/anthropics/claude-code/security/advisories/GHSA-ff64-7w26-62rf). The same "create, don't edit" bug as [Cursor's CurXecute (2025)](https://github.com/cursor/cursor/security/advisories/GHSA-4cxx-hrm3-49rm), now in a kernel-enforced sandbox.
- Source: [incidents/2026-06-agent-sandbox-escape-advisories.md](https://github.com/anthropics/claude-code/security/advisories/GHSA-ff64-7w26-62rf)

**A git hook**

- [CVE-2026-26268](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r). Every 2026 Cursor or Claude Code sandbox CVE abuses a file that something unsandboxed runs or trusts later: git, the editor, a hook runner.
- Bubblewrap can't protect a path that doesn't exist yet; [Zed's experimental fix (2026-11-17)](https://github.com/zed-industries/zed/pull/67062) supervises each system call.
- Source: [incidents/2026-06-agent-sandbox-escape-advisories.md](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r)

**“Confirm before acting”**

- The researcher ran to the [Mac mini](https://twitter.com/summeryue0/status/2025836517831405980) to stop it: the stop messages went into the same chat the agent wasn't reading.
- The stop messages are from press reconstructions of the researcher's screenshots.
- Source: [incidents/2026-02-openclaw-deletes-inbox.md](https://twitter.com/summeryue0/status/2025836517831405980)

---

:: table transition=run dense art=database+ladder+globe

### What went wrong, 3 of 5

## February to April 2026

| When | Who | What happened |
| --- | --- | --- |
| ![](icons/database.svg) Feb 2026 | [DataTalks.Club](https://aishippingblog.com/p/how-i-dropped-our-production-database), an online course platform | Claude Code ran terraform destroy with an old state file: database and backups gone |
| ![](icons/ladder.svg) Mar 2026 | [Ona](https://ona.com/blog/how-claude-code-escapes-its-own-denylist-and-sandbox), a cloud dev-environment company, testing Claude Code | denied npx, the agent ran it by another path, then turned the sandbox off |
| ![](icons/globe.svg) Apr 2026 | AWS [AgentCore](https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/) Code Interpreter | its no-network mode still resolved DNS: enough for a two-way channel |
| ![](icons/stamp-approve.svg) Apr 2026 | Claude [Mythos](https://www.anthropic.com/claude-mythos-preview-system-card) Preview, an Anthropic model in testing | “wrote a bash script that automatically simulated a keypress to approve the command” |

???

**The old state file**

- Every action was a cloud API call made with the developer's own credentials: an OS sandbox would not have helped. The boundary was the IAM policy.
- AWS support found a snapshot hidden from the console about [24 hours later](https://aishippingblog.com/p/how-i-dropped-our-production-database).
- Source: [incidents/2026-02-datatalks-claude-code-terraform-destroy.md](https://aishippingblog.com/p/how-i-dropped-our-production-database)

**Another path to the same binary**

- [Ona's experiment, March 2026](https://ona.com/blog/how-claude-code-escapes-its-own-denylist-and-sandbox): the agent was told to find a way to run `npx`; turning the sandbox off was its own idea. "Approval fatigue turns a security boundary into a rubber stamp."
- Source: [incidents/2026-03-ona-claude-code-escapes-denylist-sandbox.md](https://ona.com/blog/how-claude-code-escapes-its-own-denylist-and-sandbox)

**DNS still resolved**

- Data out as subdomains of an attacker's zone; commands back in A records. AWS's docs now say Sandbox mode can "perform DNS resolution".
- Sources: [egress/unit42-agentcore-sandbox-dns-escape.md](https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/); [cloud-agent-platforms/aws-agentcore-code-interpreter.md](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter-tool.html)

**Claude Mythos presses approve**

- [Claude Mythos Preview](https://www.anthropic.com/claude-mythos-preview-system-card) system card (April 2026).
- Malware does it too: [Mini Shai-Hulud (May 2026)](https://snyk.io/blog/tanstack-npm-packages-compromised) wrote `.claude/settings.json` hooks to persist.
- Sources: [anecdotes/2026-claude-mythos-sandbox-escape-sandwich.md](https://www.anthropic.com/claude-mythos-preview-system-card); [macos-windows/windows-mxc-ga-blog-2026-10.md](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/)

---

:: table transition=run dense art=crate+key+shelf

### What went wrong, 4 of 5

## April to July 2026

| When | Who | What happened |
| --- | --- | --- |
| ![](icons/crate.svg) Apr 2026 | [Daytona](https://www.daytona.io/dotfiles/updates/security-update-cve-2026-31431-copy-fail), a cloud sandbox company | a kernel bug crossed its containers into other tenants' cached files |
| ![](icons/key.svg) Apr 2026 | [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248), an app on the Railway cloud | a Cursor agent used an unrelated API token to delete production in about 9 seconds |
| ![](icons/envelope.svg) May 2026 | [Anthropic](https://anthropic.com/engineering/how-we-contain-claude)'s Cowork, a non-coding agent | its proxy allowed api.anthropic.com, so an attacker's key went out too |
| ![](icons/shelf.svg) Jul 2026 | [OpenAI](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)'s evaluations | agents broke out through a package mirror to Hugging Face's servers |

???

**Copy Fail**

- Copy Fail is CVE-2026-31431. The API key was readable through the default image's passwordless sudo.
- Sources: [cloud-agent-platforms/daytona-isolation-and-advisories.md](https://www.daytona.io/docs/en/isolation); [Copy Fail advisory](https://www.daytona.io/dotfiles/updates/security-update-cve-2026-31431-copy-fail); [API key advisory](https://www.daytona.io/dotfiles/updates/security-advisory-api-credential-exposure-in-sandboxes)

**Nine seconds**

- The token was made for managing custom domains, but [Railway](https://blog.railway.com/p/your-ai-wants-to-nuke-your-database) tokens had no scopes. A staging task reached production.

**The vendor's own API**

- Files went to the attacker's account through the Files API. “Every function reachable through any domain on an allowlist is now an [attack surface](https://anthropic.com/engineering/how-we-contain-claude).”
- Source: [cloud-agent-platforms/anthropic-how-we-contain-claude.md](https://anthropic.com/engineering/how-we-contain-claude)

**The Package Mirror**

- The [agent's note](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf) was left in the mirror itself: agents used it as a message board before they used it as an exit. The original names a file where the slide shows "…".
- June 27: a [port-sweep alert](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf) fired; stopping the run “was not required”. [OpenAI](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)'s fix list now includes a rapid evaluation-shutdown tool.
- Cut from the slide: the mirror was [JFrog Artifactory](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf).

---

:: table transition=run dense art=money-bag+house+cable

### What went wrong, 5 of 5

## July to September 2026

| When | Who | What happened |
| --- | --- | --- |
| ![](icons/money-bag.svg) Jul 2026 | OpenAI's [Codex](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087) CLI | at its subscription limit, it took an API key from .env and ran on the metered API |
| ![](icons/house.svg) Aug 2026 | Anthropic's [Claude](https://github.com/anthropics/claude-code/issues/88462) Code | a test cleanup ran rm -rf on the home directory, with no prompt |
| ![](icons/terminal.svg) Aug 2026 | [DeepSeek](https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/) Harness, an open-source coding agent | one curl to its own local API switched the sandbox off |
| ![](icons/cable.svg) Sep 2026 | Vercel's [just-bash](https://github.com/vercel-labs/just-bash/security/advisories/GHSA-g5pf-mh4h-h655), bash for agents in TypeScript | a hard link let writes escape its folder |

???

**Can is not may**

- [$812.47](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087) for the month on a $600 organisation limit. A single reporter; no OpenAI response in the thread.
- Source: [incidents/2026-07-codex-uses-env-api-key-past-quota.md](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087)

**The test cleanup**

- “None of those three steps is [individually suspicious](https://github.com/anthropics/claude-code/issues/88462).” The auto-mode classifier saw only `bash script.sh`.
- #88462 lists four earlier reports of the same class, closed without a fix.
- Source: [incidents/2026-08-claude-code-auto-mode-deletes-home.md](https://github.com/anthropics/claude-code/issues/88462)

**DeepSeek Harness, one curl**

- [CVE-2026-82533, reported August 2026](https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/); bubblewrap ran without `--unshare-net`.
- Source: [china/deepseek-harness-sandbox-cve-2026-82533.md](https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/)

**A hard link out**

- GHSA-g5pf-mh4h-h655, severity high, published 2026-09-15. The mode is `ReadWriteFs`. "A hard link is a second directory entry for the same inode with no target to resolve, so an in-root name sharing an inode with a file outside the root passes that check and the write reaches the shared inode."
- The same class as Codex CLI's writable folder: path confinement in a shim, not in the kernel.
- just-bash itself gets its own slide in Isolate Isles.
- Source: [in-process/vercel-just-bash.md](https://github.com/vercel-labs/just-bash/security/advisories/GHSA-g5pf-mh4h-h655)

---

:: table transition=run dense art=scroll+shield

### What went wrong, in short

## Lessons from recent history

| Lesson | What we want instead |
| --- | --- |
| ![](icons/sticky-note.svg) An instruction is not enforcement: [Replit](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident) | writes limited to the agent's workspace |
| ![](icons/key.svg) A token on disk gets used: [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248) | no keys within the agent's reach |
| ![](icons/globe.svg) Reachable means a way out: [OpenAI](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf) | one guarded way out |
| ![](icons/door-open.svg) Escapes plant files the host runs later: [Cursor](https://github.com/cursor/cursor/security/advisories/GHSA-8pcm-8jpx-hv8r) | nothing it writes runs on the host |
| ![](icons/stamp-approve.svg) Approvers say yes: [97%](https://claude.com/blog/auto-mode-default-in-claude-code) | safe defaults that need no prompt |
| ![](icons/rulebook.svg) Agents edit their own policy: [DeepSeek](https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/) | policy out of its reach; a person approves |

In short: the damage came through whatever the agent could reach.

???
- Cut from the slide: the "Where we saw it" column. Each lesson now links its incident: Replit 2025, PocketOS 2026, OpenAI's evaluations 2026, Cursor 2026, Claude Code's 97% of prompts approved, DeepSeek Harness 2026.
- One row per lesson. No new sources; each link is the original source from the table where the story was told, except the 97%: Anthropic's post making auto mode the default (2026-08): "users approve 97% of permission prompts in Claude Code." Ghost House returns to it.
- The third column states goals only; the mechanisms come later: write scope and snapshots (Switch 1), the egress proxy (Switch 2), the credential broker (Switch 3), policy outside the sandbox (Valley of the Boss).

---

:: section world="2 Kernel Caverns" day=2 transition=iris number=none art=cpu-chip+magnifier

## Kernel Caverns

![A cave painting: stick figures trying to break out of a box](pictures/cave-painting.svg)

---

:: table transition=run dense art=cpu-chip+memory-chip+wall-two-layers

### Terminology, part 1

## Building Blocks of a Sandbox

| Term | Meaning |
| --- | --- |
| ![](icons/gear.svg) Process | a running program |
| ![](icons/cpu-chip.svg) Kernel | the core of the operating system |
| ![](icons/plug.svg) System call (syscall) | a process asking the kernel to do something: open, connect, exec |
| ![](icons/sandpit.svg) Sandbox | a place where code runs with less authority than its user |
| ![](icons/wall-two-layers.svg) Isolation boundary | the line the sandbox enforces; crossing it is an escape |
| ![](icons/key.svg) Capability | an unforgeable token that grants one specific power |

???
Definitions follow research/sandboxes/taxonomy.md. The rest of the talk uses exactly these words.

---

:: table transition=run dense art=server-rack+crate+hex-block+puzzle-piece

### Terminology, part 2

## Ways to run untrusted code

| Term | Meaning |
| --- | --- |
| ![](icons/box-in-box.svg) Virtual machine (VM) | a whole computer in software, with its own kernel |
| ![](icons/memory-chip.svg) Hypervisor | the program that runs VMs |
| ![](icons/crate.svg) Container | processes on the host's kernel, with private views |
| ![](icons/bubble.svg) Namespace | Linux's private view of files, processes or network |
| ![](icons/hourglass.svg) cgroup | Linux's resource limit for a group of processes |
| ![](icons/hex-block.svg) Wasm (WebAssembly) | portable bytecode that can only call what the host imports |
| ![](icons/puzzle-piece.svg) In-process | the agent's code runs inside the host's own process, via an API |
| ![](icons/padlock.svg) Type system | the compiler rejects code that uses a power it wasn't given |

???
- Firecracker (World 3) is a small hypervisor, or VMM.
A microVM is a VM with a minimal VMM (Firecracker, Cloud Hypervisor).

---

:: table transition=run dense art=rulebook+funnel+keyring

### Terminology, part 3

## Some terminology

| Term | Meaning |
| --- | --- |
| ![](icons/rulebook.svg) Policy | the rules for what an agent may touch |
| ![](icons/door-open.svg) Egress | traffic leaving the sandbox for the network |
| ![](icons/funnel.svg) Egress proxy | the one way out; it checks each connection against an allowlist |
| ![](icons/keyring.svg) Credential broker | adds secrets to allowed requests, from outside the sandbox |
| ![](icons/crown.svg) Control plane | the service that runs the sandboxes |

???
- Cut from the slide: "Approval prompt: a question to a person before a risky action" (Ghost House explains it); "Plumbing: everything around the sandbox the agent can still reach: proxies, DNS, mirrors, APIs".
The tools that implement OS-level sandboxes (Seatbelt, bubblewrap, seccomp, Landlock) are named in World 6, in "One recipe per operating system", where they first appear.

---

:: content transition=run dense art=server-rack+hex-block+signpost

### Two teams

## Team microVM or team WebAssembly?

- Team microVM: a small VM that boots fast, with its own kernel; runs any Linux binary
- Team WebAssembly: a component can call only the [imports](https://bytecodealliance.org/articles/WASI-0.2) it is given
- WebAssembly starts fast: the Wasmtime runtime instantiates a large module in about 5 [µs](https://bytecodealliance.org/articles/wasmtime-10-performance)

![Two pixel-art teams face off: microVM on the left, WebAssembly on the right](pictures/team-face-off.svg)

???

- [WASI 0.2](https://bytecodealliance.org/articles/WASI-0.2) (Bytecode Alliance, 2024-01-25): "All I/O in Wasm goes through its imports and exports." Standard WASI has no interface for starting processes (fork or exec), which is the coding agent's whole job. This is our inference from the WASI proposal list, not a WASI statement; so WebAssembly suits tools rather than compilers.
- 5 µs: [Wasmtime 1.0 (2022)](https://bytecodealliance.org/articles/wasmtime-10-performance), SpiderMonkey.wasm instantiation from about 2 ms to 5 µs with copy-on-write heap images.
- World 5 returns to this: [Wasmtime](https://github.com/bytecodealliance/wasmtime/security/advisories) went from about 4 advisories a year to 71 in 2026 after an LLM bug hunt. A boundary is borrowed, never assumed.
- Sources: [wasm/wasi-0.2-launch-2024.md](https://bytecodealliance.org/articles/WASI-0.2); [wasm/wasmtime-1.0-performance-2022.md](https://bytecodealliance.org/articles/wasmtime-10-performance); [wasm/wasmtime-security-advisories.md](https://github.com/bytecodealliance/wasmtime/security/advisories)

---

:: content transition=run art=crown+rulebook

### What a sandbox must answer

## Who decides?

- A policy outside the agent, [checked](https://web.mit.edu/Saltzer/www/publications/protection/) on every access
- An instruction in the prompt is not a policy

![A robot with a red X; a person with a green check](pictures/who-decides.svg)

In short: a sandbox is a policy outside the code, checked on every call.

???
- [Saltzer and Schroeder (1975)](https://web.mit.edu/Saltzer/www/publications/protection/), complete mediation: "Every access to every object must be checked for authority."
- OpenClaw: [the researcher's own diagnosis](https://twitter.com/summeryue0/status/2025836517831405980): "my real inbox was too huge and triggered compaction. During the compaction, it lost my original instruction".
- Sources: [history/saltzer-schroeder-1975-protection-of-information.md](https://web.mit.edu/Saltzer/www/publications/protection/); [incidents/2026-02-openclaw-deletes-inbox.md](https://twitter.com/summeryue0/status/2025836517831405980)

---


:: section world="3 History" day=2 transition=iris number=none art=clock+scroll

## History

Thou hast discovered the scrolls of ancient wisdom.

![A scroll of ancient wisdom between two marble columns](pictures/ancient-scroll.svg)

---

:: table transition=run dense art=server-rack+sandpit+cage+house

### Isolation before agents

## Timeline, 1964–2004

| Year | What | Why it matters |
| --- | --- | --- |
| ![](icons/server-rack.svg) 1964 | IBM [CP-40](https://www.leeandmelindavarian.com/Melinda/neuvm.pdf) | the first virtual machines (VMs) |
| ![](icons/door.svg) 1979 | [chroot](http://man.cat-v.org/unix_7th/2/chdir), Unix V7 | a process sees one directory as / |
| ![](icons/sandpit.svg) 1993 | “[Sandboxing](https://dl.acm.org/doi/10.1145/168619.168635)”, Berkeley | the word: code rewritten to stay in its own memory |
| ![](icons/cage.svg) 2000 | [FreeBSD](https://papers.freebsd.org/2000/phk-jails/) jails | root, confined to its jail |
| ![](icons/cloud.svg) 2003 | [Xen](https://www.cl.cam.ac.uk/research/srg/netos/papers/2003-xensosp.pdf) | many VMs on one x86 server |
| ![](icons/house.svg) 2004 | [Solaris](https://www.usenix.org/legacy/events/lisa04/tech/price.html) Zones | one kernel, many isolated systems |

???
- Sources: [history/varian-vm-and-the-vm-community.md](https://www.leeandmelindavarian.com/Melinda/neuvm.pdf); [history/unix-v7-chroot.md](http://man.cat-v.org/unix_7th/2/chdir) (Bill Joy added chroot to BSD in 1982, to build BSD); [history/wahbe-1993-software-fault-isolation.md](https://dl.acm.org/doi/10.1145/168619.168635); [history/kamp-watson-2000-freebsd-jails.md](https://papers.freebsd.org/2000/phk-jails/); [virtualization/xen-sosp2003.md](https://www.cl.cam.ac.uk/research/srg/netos/papers/2003-xensosp.pdf); [history/price-tucker-2004-solaris-zones.md](https://www.usenix.org/legacy/events/lisa04/tech/price.html)
- Stories for this slide, from the earlier History slides:

- Cut from the slide: CP-40 gave each user a [simulated System/360](https://doi.org/10.1147/rd.255.0483); chroot was written to build BSD.
[history/creasy-1981-origin-of-vm370.md](https://doi.org/10.1147/rd.255.0483); [Lampson 1973](https://dl.acm.org/doi/10.1145/362375.362389) (covert channels: "There is not likely to be any rigorous way of identifying every channel"); [history/hardy-1988-confused-deputy.md](https://dl.acm.org/doi/10.1145/54289.871709); [history/unix-v7-chroot.md](http://man.cat-v.org/unix_7th/2/chdir).

Sources (research/sandboxes/original_sources/):
- [anecdotes/1984-thompson-reflections-on-trusting-trust.md](https://dl.acm.org/doi/10.1145/358198.358210): "Reflections on Trusting Trust"; "You can't trust code that you did not totally create yourself. (Especially code from companies that employ people like me.)"
- [anecdotes/2023-cox-running-trusting-trust-compiler.md](https://research.swtch.com/nih): `nih.a`, 99 lines plus a 20-line shell script; password `codenih`; Bell Labs' PWB group noticed the compiler "got bigger each time it compiled itself"
- [anecdotes/1988-stoll-stalking-the-wily-hacker.md](https://nsarchive.gwu.edu/sites/default/files/documents/5626281/Clifford-Stoll-Communications-of-the-ACM.pdf): Lawrence Berkeley Laboratory; off-line printers on every incoming line, so the intruder couldn't see the monitor; milkshakes when the trace completed

- [Cheswick](https://pages.cs.wisc.edu/~remzi/Classes/736/Spring2000/Papers/berferd.pdf), "An Evening with Berferd: In Which a Cracker is Lured, Endured, and Studied", Winter 1992 USENIX Conference. Events 7 January to 3 May 1991; the Jail was shut down at management's request.
- The earliest well-known use of "jail" for a chroot environment; [FreeBSD](https://papers.freebsd.org/2000/phk-jails/) took the word in 2000. A filesystem view is not a boundary: containers relearned this two decades later.
- His recommendation: a throwaway machine plus a passive monitor, not a chroot. In 1991 the warden watched the intruder; in 2026 (Chaos Plains) the inmate emails the warden at lunch.
- Source: [history/cheswick-1992-berferd.md](https://pages.cs.wisc.edu/~remzi/Classes/736/Spring2000/Papers/berferd.pdf)

- [Wahbe](https://dl.acm.org/doi/10.1145/168619.168635) et al., "Efficient Software-Based Fault Isolation", SOSP 1993. Motivation: extensible systems such as the BSD packet filter. "Address sandboxing" masks the upper bits of every unsafe address so it lands in the extension's own segment.
- Numbers: average 4% overhead on the C SPEC92 benchmarks; cross-domain calls "more than an order of magnitude faster than any existing RPC system". RPC: remote procedure call, the usual way to call into another process.
- [Janus (1996)](https://www.usenix.org/legacy/publications/library/proceedings/sec96/goldberg.html) credits this paper with the term. [WebAssembly](https://doi.org/10.1145/3062341.3062363) (all four browser vendors, PLDI 2017) is its descendant. Wasm's isolation comes from structure: all I/O comes through imports.
- Sources: [history/wahbe-1993-software-fault-isolation.md](https://dl.acm.org/doi/10.1145/168619.168635); [history/yee-2009-native-client.md](https://research.google/pubs/native-client-a-sandbox-for-portable-untrusted-x86-native-code/); [virtualization/webassembly-pldi2017.md](https://doi.org/10.1145/3062341.3062363)

---

:: table transition=run dense art=seatbelt+crate+lightning+laptop

## Timeline, 2005–2019

| Year | What | Why it matters |
| --- | --- | --- |
| ![](icons/funnel.svg) 2005 | [seccomp](https://lwn.net/Articles/656307/), Linux | a process limited to a few system calls |
| ![](icons/seatbelt.svg) 2007 | [Seatbelt](https://www.chromium.org/developers/design-documents/sandbox/osx-sandboxing-design/), Mac OS X Leopard | a profile lists what a process may do |
| ![](icons/gear.svg) 2007 | [cgroups](https://lwn.net/Articles/236038/), Linux | resource limits for groups of processes |
| ![](icons/cpu-chip.svg) 2007 | [KVM](https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf), Linux | VMs built into the Linux kernel |
| ![](icons/crate.svg) 2013 | [Docker](https://pyvideo.org/pycon-us-2013/the-future-of-linux-containers.html) | containers for everyone |
| ![](icons/laptop.svg) 2016 | [WSL1](https://learn.microsoft.com/en-us/archive/blogs/wsl/windows-subsystem-for-linux-overview) | Windows itself answers Linux system calls |
| ![](icons/lightning.svg) 2018 | [Firecracker](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/) | a microVM in 125 ms |
| ![](icons/box-in-box.svg) 2019 | [WSL2](https://devblogs.microsoft.com/commandline/announcing-wsl-2/) | a real Linux kernel, in a light VM |

???
- [WSL1](https://learn.microsoft.com/en-us/archive/blogs/wsl/windows-subsystem-for-linux-overview) to [WSL2](https://devblogs.microsoft.com/commandline/announcing-wsl-2/) in three years: Microsoft replaced answering Linux system calls itself with a VM that runs a real Linux kernel. The question in this talk's title, answered by Microsoft.
- [WSL1 (2016-04-22, Microsoft)](https://learn.microsoft.com/en-us/archive/blogs/wsl/windows-subsystem-for-linux-overview): "Pico provider drivers (lxss.sys, lxcore.sys) that emulate a Linux kernel by translating Linux syscalls". [WSL 2 (2019-05-06)](https://devblogs.microsoft.com/commandline/announcing-wsl-2/): "uses a real Linux kernel", "inside of a lightweight utility virtual machine (VM)".
- Seatbelt: [Chromium's design doc](https://www.chromium.org/developers/design-documents/sandbox/osx-sandboxing-design/): "On Mac OS X versions starting from Leopard, individual processes can have their privileges restricted using the sandbox(7) facility of BSD, also referred to in some Apple documentation as 'Seatbelt'." Leopard shipped in October 2007.
- [Docker](https://news.ycombinator.com/item?id=5408002)'s founder, March 2013, on HN: "you probably don't want to run untrusted code with root privileges inside a container if anything valuable is running on the same host."
- Sources: [os-primitives/lwn-process-containers-2007.md](https://lwn.net/Articles/236038/); [virtualization/kvm-ols2007.md](https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf); [os-primitives/docker-pycon-2013-lightning-talk.md](https://pyvideo.org/pycon-us-2013/the-future-of-linux-containers.html); [virtualization/firecracker-aws-launch-2018.md](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/); [macos-windows/macos-chromium-osx-sandboxing-design.md](https://www.chromium.org/developers/design-documents/sandbox/osx-sandboxing-design/)

- From the earlier slide:

- [Solaris Zones (2004)](https://www.usenix.org/legacy/events/lisa04/tech/price.html) did the same as [FreeBSD jails](https://papers.freebsd.org/2000/phk-jails/): one kernel, many customers.
Sources (research/sandboxes/original_sources/):
- [history/kamp-watson-2000-freebsd-jails.md](https://papers.freebsd.org/2000/phk-jails/): FreeBSD 4.0, March 2000; "widespread deployment ... as a vehicle for delivering "virtual private server" services"
- [history/gelinas-2001-linux-vserver.md](https://lkml.iu.edu/hypermail/linux/kernel/0110.1/0909.html): 2001-10-11; "you can supply root password to the virtual server administrators"
- [history/price-tucker-2004-solaris-zones.md](https://www.usenix.org/legacy/events/lisa04/tech/price.html): data centres at 15–30% utilisation; two apps both wanted port 80. Zones are the motivation for consolidation
- [os-primitives/lwn-seccomp-overview-2015.md](https://lwn.net/Articles/656307/): strict mode (2005, four syscalls) written by Andrea Arcangeli for "Cpushare", selling idle cycles; BPF filters only in 2012
- [os-primitives/lwn-process-containers-2007.md](https://lwn.net/Articles/236038/): Google's; renamed control groups (cgroups) when merged for Linux 2.6.24

Sources (research/sandboxes/original_sources/):
- [os-primitives/docker-pycon-2013-lightning-talk.md](https://pyvideo.org/pycon-us-2013/the-future-of-linux-containers.html): PyCon lightning talk 2013-03-15; v0.1.0 README "complements LXC with a high-level API"; its "Security" heading is empty
- Terms: a namespace gives a process a private view (of processes, mounts, network); a cgroup limits its resources; a container is both, on the host kernel
- [virtualization/firecracker-aws-launch-2018.md](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/): "we used dedicated EC2 instances for each customer"; 125 ms; "about 5 MiB of memory per microVM"; a keyboard device only to reset the VM
- [virtualization/cloudflare-workers-security-model-2020.md](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/): `Date.now()` frozen during execution from mid-2017; process isolation "can easily be 10x" the CPU

- [hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md](https://news.ycombinator.com/item?id=5408002) (2013-03-20). [Same thread](https://news.ycombinator.com/item?id=5408002): "LXC DOES NOT PROVIDE SECURITY". Docker was sold as packaging; we bought it as a wall.

---

:: content transition=run art=scroll+padlock+envelope-open

### Butler Lampson, 1973

## Lampson's confinement problem

- His [paper](https://dl.acm.org/doi/10.1145/362375.362389): a service runs on a customer's data; blocking its access is “known how to [solve](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf)”
- The hard part: a leak to the service's owner leaves “no indication”
- No network is not no channel: DNS, a package mirror

???
- Cut from the slide: "a customer runs a service on the customer's data"; "The hard part: the service may leak the data to its owner"; "A wrong answer leaves evidence; a leak leaves “no indication”".
- "A Note on the Confinement Problem", Butler Lampson, Xerox PARC; Communications of the ACM 16(10), October 1973. Received July 1972.
- Abstract: "This note explores the problem of confining a program during its execution so that it cannot transmit information to any other program except its caller."
- Today: you are the customer, the agent is the service, the owner is whoever steers it (a prompt injection).
- The paper lists covert channels: file locks, timing, resource usage on the bill. "There is not likely to be any rigorous way of identifying every channel."
- Sources: [ACM](https://dl.acm.org/doi/10.1145/362375.362389); [the author's reprint](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf); [history/lampson-1973-confinement-problem.md](https://dl.acm.org/doi/10.1145/362375.362389)

---

:: table transition=run dense art=memory-chip+receipt+hourglass

### Lampson, 1973

## Seven ways to leak

| # | The service leaks through |
| --- | --- |
| ![](icons/memory-chip.svg) 0 | memory kept from one call to the next |
| ![](icons/floppy-disk.svg) 1 | a permanent file in its owner's directory |
| ![](icons/sticky-note.svg) 2 | a temporary file its owner polls |
| ![](icons/envelope.svg) 3 | a message to its owner's process |
| ![](icons/receipt.svg) 4 | the bill: data hidden in the charges |
| ![](icons/padlock.svg) 5 | a file lock, read as one bit |
| ![](icons/hourglass.svg) 6 | its effect on system load |

“There is not likely to be any rigorous way of identifying every [channel](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf)”.

???
- The paper numbers its examples 0–6. It credits the last two to A.G. Fraser of Bell Labs.
- 4: data hidden in the bill, or in the time charged; "Reducing it to zero, however, requires more far-reaching measures."
- 5: two programs signal through a file's open-for-writing interlock, a bit at a time, with two more files as clocks.
- 6: varying the paging rate or the ratio of computing to I/O; noisy, but "the techniques of information theory can be used" to get the data through.
- Lampson's own names for the three kinds: storage, legitimate (an output the service has to produce, such as the bill) and covert: "those not intended for information transfer at all". This is the first published use of "covert channel".
- Today's versions: 1–3 are a file or a socket the agent can reach; 4 is data hidden in an allowed request; 6 is timing.
- Sources: [ACM](https://dl.acm.org/doi/10.1145/362375.362389); [the author's reprint](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf)

---

:: table transition=run dense art=rulebook+cage

### Lampson, 1973

## Four rules

| Rule | Lampson | For an agent |
| --- | --- | --- |
| ![](icons/cage.svg) Total isolation | “no [calls](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf) on any other program” | no tools at all |
| ![](icons/box-in-box.svg) Transitivity | an untrusted program it calls is confined too | child processes inherit the sandbox |
| ![](icons/funnel.svg) Masking | the caller sets every input to legitimate or covert channels | the platform sets egress |
| ![](icons/shield.svg) Enforcement | covert channels conform to the caller's specification | the egress proxy checks each request |

First, a confined program must be memoryless.

In short: every boundary agents use today is older than they are.

???
- Total isolation is sufficient but "quite impractical": even paging or time-slicing can leak (example 6).
- Transitivity needs a trusted supervisor; "it is hard to write a trustworthy supervisor".
- Masking, for the bill: the customer computes it from the vendor's published specification, like a purchase order.
- Enforcement "may require slowing the program down, generating spurious disk references, or whatever".
- The cheaper alternative, if some leakage is acceptable: "bound the capacity of the covert channels". Gemini CLI's Windows sandbox sets a bandwidth limit of 1 (World 6).
- The "For an agent" column is this talk's reading, not Lampson's.
- Sources: [ACM](https://dl.acm.org/doi/10.1145/362375.362389); [the author's reprint](https://www.cs.cornell.edu/andru/cs711/2003fa/reading/lampson73note.pdf)

---

:: section world="4 Ghost House" day=3 transition=iris number=none art=ghost+stamp-approve

## Ghost House

Who reads the prompt?

---

:: content transition=run art=developer+stamp-approve+ghost

### Approval prompts

## Everyone clicks yes

- Coding agents ask a person before running a risky command
- Anthropic: Claude Code users approve [97%](https://claude.com/blog/auto-mode-default-in-claude-code) of these prompts
- In a test with 1,053 paid testers, people caught 13.6% of dangerous commands
- About 17% early in a session; about 5% after 50 prompts

???
- Cut from the slide: "An approval-prompt game, 2026: players missed 1 in 3 [threats](https://news.ycombinator.com/item?id=49195468)".
- Audience: "Who has clicked approve without reading?"
- [Anthropic, 2026-08-07](https://claude.com/blog/auto-mode-default-in-claude-code): "Data suggests that manual review can become habitual: users approve 97% of permission prompts in Claude Code." "In a controlled experiment with 1,053 paid professional testers, human review caught just 13.6% of dangerous commands, while auto mode caught 89%." "they blocked about 17% of dangerous commands early in a session, dropping to about 5% after 50 or more prior prompts". In March the figure was 93% ([auto mode post](https://www.anthropic.com/engineering/claude-code-auto-mode): "Over time that leads to approval fatigue").
- Caveat: these are vendor figures, from vendors selling the alternative (auto mode, a sandbox).
- [Docker, 2026-09-03](https://www.docker.com/blog/what-is-yolo-mode/): "Once permission fatigue kicks in, it can be all too easy to accidentally approve the wrong request."
- The game: [hackernews/agents/hn-49195468-humans-missed-1-in-3-threats.md](https://news.ycombinator.com/item?id=49195468): 40k plays, 409k decisions, warned up front. A game, not a study.
- Auto mode, Claude Code's approval classifier: [Anthropic](https://anthropic.com/engineering/how-we-contain-claude) says it misses ~17% of overeager commands; "one layer inside a sandbox". A sandbox cut prompts [84%](https://www.anthropic.com/engineering/claude-code-sandboxing).
- Once approved: [preprint](https://arxiv.org/abs/2610.22987) (Claude Code, Codex CLI): the attack completed silently in 47 of 58 eligible cases (81%). [Claude Mythos](https://www.anthropic.com/claude-mythos-preview-system-card) "wrote a bash script that automatically simulated a keypress to approve the command" (Chaos Plains).
- Sources (research/sandboxes/original_sources/): agent-sandboxing/anthropic-2026-08-auto-mode-default.md; agent-sandboxing/anthropic-2026-03-claude-code-auto-mode.md; agent-sandboxing/docker-blog-2026-09-what-is-yolo-mode.md

---

:: table transition=run dense art=hourglass+eye+stamp-approve

### Before agents

## Warnings wear out

| Study | What it found |
| --- | --- |
| ![](icons/envelope.svg) [Egelman](https://css.csail.mit.edu/6.566/2018/readings/youve-been-warned.pdf) et al., 2008: phishing warnings | 97% of 60 people fell for at least one phishing email |
| ![](icons/keyring.svg) [Felt](https://cups.cs.cmu.edu/soups/2012/proceedings/a3_Felt.pdf) et al., 2012: Android app permissions | 17% looked at permissions while installing |
| ![](icons/padlock.svg) [Akhawe](https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/akhawe) & Felt, 2013: browser warnings | Chrome users clicked through 70.2% of its HTTPS certificate warnings |
| ![](icons/hourglass.svg) [Vance](https://doi.org/10.1145/3025453.3025896) et al., 2017: brain scans | “a dramatic drop in attention throughout the workweek” |

???

- Egelman, Cranor & Hong, "You've Been Warned" (CHI 2008): "when presented with the active warnings, 79% of participants heeded them, which was not the case for the passive warning that we tested—where only one participant heeded the warnings."
- Felt et al., "Android Permissions: User Attention, Comprehension, and Behavior" (SOUPS 2012): "only 3% of Internet survey respondents could correctly answer all three permission comprehension questions."
- Akhawe & Felt, "Alice in Warningland" (USENIX Security 2013), 25 million warning impressions: "We believe that this data is indicative of warning fatigue: users click through more-frequent errors more quickly." Malware and phishing warnings did much better: a tenth (Firefox) and a quarter (Chrome) clicked through.
- Vance, Kirwan et al. (CHI 2017), fMRI and eye tracking over five workdays: "habituation: decreased response to a repeated warning." Follow-up (Vance, Jenkins, Anderson et al., MIS Quarterly 2018, [doi](https://doi.org/10.25300/MISQ/2018/14124)): "users' warning adherence substantially decreased over the three weeks."
- Böhme & Grossklags (NSPW 2011, [doi](https://doi.org/10.1145/2073276.2073284)): "every false alarm or unnecessary user interaction imposes a negative externality on all other potential consumers of this chunk of attention."
- Sources (research/sandboxes/original_sources/arxiv/): egelman-cranor-hong-2008-youve-been-warned.md; felt-2012-android-permissions-attention.md; akhawe-felt-2013-alice-in-warningland.md; vance-2017-longitudinal-fmri-habituation.md; vance-jenkins-2018-tuning-out-security-warnings.md; bohme-grossklags-2011-security-cost-cheap-user-interaction.md

---

:: table transition=run dense art=switch-block-red+stamp-approve+ghost

### Off by default

## Optional security is no security

| Coding agent | Its sandbox | Its off switch |
| --- | --- | --- |
| ![](icons/robot-head.svg) Claude Code, Anthropic's | [off](https://code.claude.com/docs/en/sandboxing) by default | `--dangerously-skip-permissions` |
| ![](icons/robot-head.svg) Codex CLI, OpenAI's | [on](https://learn.chatgpt.com/docs/sandboxing) by default | `--yolo` |
| ![](icons/robot-head.svg) Gemini CLI, Google's | [off](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md) by default | `--yolo` |

[25%](https://claude.com/blog/auto-mode-default-in-claude-code) of interactive Claude Code sessions start with every check off.

In short: safety must be the default, not an option.

???
- Cut from the slide: "Cline, a VS Code agent: the model sets its own [`requires_approval`](https://docs.cline.bot/features/auto-approve) flag."
- Claude Code [sandboxing docs](https://code.claude.com/docs/en/sandboxing): "The sandbox is off by default. To turn it on, run `/sandbox` in a session". [Permission modes](https://code.claude.com/docs/en/permission-modes): "`bypassPermissions` mode disables permission prompts and safety checks"; "Only use this mode in isolated environments like containers, VMs, or dev containers without internet access". The flag `--dangerously-skip-permissions` is the same mode.
- Codex [sandboxing](https://learn.chatgpt.com/docs/sandboxing): commands "run inside a constrained environment instead of running with full access by default." [CLI reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli): "--dangerously-bypass-approvals-and-sandbox, --yolo … Run every command without approvals or sandboxing. Only use inside an externally hardened environment."
- Gemini CLI [configuration](https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md): "Sandboxing is disabled by default"; but "Sandbox is enabled when using `--yolo` or `--approval-mode=yolo` by default." (docs only; not checked in the source)
- [Anthropic, 2026-08-07](https://claude.com/blog/auto-mode-default-in-claude-code): "62% of users have used bypassPermissions or clicked "don't ask again" on Bash, and 25% of interactive sessions start in bypass permissions mode."
- Cursor (an AI code editor), [run modes](https://cursor.com/docs/agent/security/run-modes): "Run Everything": "Every tool call runs automatically." In 3.5 (2026-05-22) "**Ask Every Time** was deprecated."
- [agent-sandboxing/agent-cline.md](https://docs.cline.bot/features/auto-approve): "The model marks each command with a `requires_approval` flag". [Warp](https://docs.warp.dev/agents/capabilities/agent-profiles-permissions/): auto-approve "by default also runs denylisted commands". [Jules](https://jules.google/docs/environment): "If you navigate away, Jules will eventually auto-approve the plan, which is set on a timer."
- Ghost house = security that only looks like security.
- Sources (research/sandboxes/original_sources/agent-sandboxing/): claude-code-permission-modes-docs.md; codex-cli-yolo-flag-docs.md; gemini-cli-yolo-sandbox-default.md; anthropic-2026-08-auto-mode-default.md; cursor-run-modes-sandbox-docs.md; agent-cline.md

---
:: section world="5 Forest of Illusion" day=3 transition=iris number=none art=ghost+box-in-box

## Forest of Illusion

Ways to isolate an agent.

![Ghostly trees, ghosts half hidden behind them](pictures/ghost-forest.svg)

---

:: content transition=run art=server-rack+wall-two-layers

### Power-up 1

## Virtual machine

- The guest runs its own [kernel](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/); the host's VM monitor emulates a few devices
- The [CPU](https://doi.org/10.1109/MC.2005.163) itself keeps guest memory apart from the host's
- Runs anything: `git`, `npm`, compilers, Docker

???
- Cut from the slide (the cost table has the numbers): "A microVM starts in 125 ms, with 5 MiB of overhead"; "AWS Lambda, before Firecracker: “dedicated EC2 instances for each customer”".
- VM monitor (VMM): the host program that runs the VM. Firecracker is KVM-based: the Linux kernel's KVM module uses the CPU's virtualization extensions (Intel VT-x, 2005; AMD-V).
- A guest's system calls stop at the guest's kernel. To reach the host, an attacker needs a bug in the VMM, in KVM, or in the CPU.
- Sources: [virtualization/firecracker-aws-launch-2018.md](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/); [virtualization/intel-vt-x-computer2005.md](https://doi.org/10.1109/MC.2005.163); [virtualization/kvm-ols2007.md](https://www.kernel.org/doc/ols/2007/ols2007v1-pages-225-230.pdf)

---

:: content transition=run art=crate+cpu-chip

### Power-up 2

## OS-level sandbox

- Processes on the host's kernel, with private [namespaces](https://github.com/containers/bubblewrap) and a [seccomp](https://lwn.net/Articles/656307/) filter
- Every sandbox on the machine shares one [41-million-line](https://en.wikipedia.org/wiki/Linux_kernel) kernel
- [Google](https://cloud.google.com/blog/products/gcp/open-sourcing-gvisor-a-sandboxed-container-runtime), 2018: “traditional Linux containers are not sandboxes”

???
- Cut from the slide: "Processes on the host's kernel, given namespaces: a private view of files, processes, network"; "seccomp narrows which system calls reach the kernel"; "Cheap: a new sandbox in [195](https://github.com/pydantic/monty) ms, [1.4](https://www.scitepress.org/Papers/2021/104405/104405.pdf) MB of memory" (the cost table has these).
- Containers (Docker), bubblewrap, Seatbelt, AppContainer are all this class: the host kernel answers every system call, narrowed by policy.
- gVisor's answer was a user-space kernel in Go, in front of the host's.
- Sources: [virtualization/gvisor-announcement-2018.md](https://cloud.google.com/blog/products/gcp/open-sourcing-gvisor-a-sandboxed-container-runtime); [os-primitives/lwn-seccomp-bpf-2012.md](https://lwn.net/Articles/475043/); [virtualization/closer2021-lightweight-hypervisors-comparison.md](https://www.scitepress.org/Papers/2021/104405/104405.pdf)

---

:: content transition=run art=hex-block+memory-chip

### Power-up 3

## WebAssembly

- Memory is one [bounds-checked](https://docs.wasmtime.dev/security.html) array; the call stack is out of reach
- “No raw access to system calls”: only the imports the host links in
- Fits tools; `git`, `npm`, compilers need a VM
- [Wasmtime](https://github.com/bytecodealliance/wasmtime/security/advisories), a Wasm runtime: about 4 advisories a year, then 71 in 2026

???
- Cut from the slide: "[Instantiates](https://bytecodealliance.org/articles/wasmtime-10-performance) in about 5 µs"; Wasmtime is the Bytecode Alliance's runtime; the jump to 71 came "after an LLM bug hunt".
- Wasmtime: "There is no raw access to system calls or other forms of I/O; the only thing a WebAssembly instance can do is what is available through interfaces it has been explicitly linked with."
- 5 µs: [Wasmtime 1.0 (2022)](https://bytecodealliance.org/articles/wasmtime-10-performance), instantiation with copy-on-write heap images.
- Standard WASI has no interface for starting processes (fork or exec); our inference from the WASI proposal list.
- [Advisories by year](https://github.com/bytecodealliance/wasmtime/security/advisories): 2021: 4, 2022: 8, 2023: 4, 2024: 4, 2025: 4, 2026: 71. Most 2026 ones are host-side WASI or component-model bugs. A boundary is borrowed, never assumed.
- Sources: [virtualization/wasmtime-security-docs.md](https://docs.wasmtime.dev/security.html); [wasm/wasmtime-1.0-performance-2022.md](https://bytecodealliance.org/articles/wasmtime-10-performance); [wasm/wasmtime-security-advisories.md](https://github.com/bytecodealliance/wasmtime/security/advisories)

---

:: content transition=run art=scroll+puzzle-piece+plug

### Power-up 4

## In-process

- The agent writes code against an API the host controls: no shell, files or sockets unless passed in
- [Monty](https://github.com/pydantic/monty) (Pydantic, 2026): a Python subset
- [Cloudflare](https://blog.cloudflare.com/code-mode/) Code Mode (2025): TypeScript against typed bindings, which keep the keys

???
- Cut from the slide: "No shell, files or sockets unless the host passes one in"; Monty: "a new sandbox in under 1 ms"; Code Mode: "agents write TypeScript against typed bindings"; "The keys stay with the host, inside each binding".
in-process/README.md (the fourth class); [in-process/pydantic-monty.md](https://github.com/pydantic/monty) (0.80 ms is the vendor's own benchmark; no ambient authority: host functions run "with your process's full authority"); [in-process/cloudflare-code-mode.md](https://blog.cloudflare.com/code-mode/) (globalOutbound: null; credentials injected by the outbound handler).

---

:: content transition=run art=scroll+stamp-deny+padlock

### Power-up 5

## Type system

- Each file, process or socket is a capability the code must be given
- Code that uses one it lacks does not compile
- In [TACIT](https://arxiv.org/abs/2603.00991), a research harness from EPFL (2026), the agent's only tool runs Scala in a safe mode
- Its own benchmark: 100% of leak attempts stopped, 99% of tasks done

???
- Capture checking: the Scala 3 compiler tracks which capabilities each value can reach.
- Secrets come back as a [Classified](https://arxiv.org/abs/2603.00991) type, which only pure functions may touch; printing one shows ***.
- [ATC](https://github.com/lampepfl/atc), a coding agent on TACIT: read-only mode is a type, so a write fails to compile.
- A [Scala Summit talk](https://www.youtube.com/watch?v=RQuRlMetQIU), 2026, presented TACIT.
- Sources: [in-process/bialy-scala-summit-2026-safe-agents.md](https://www.youtube.com/watch?v=RQuRlMetQIU); [in-process/tacit-tracking-capabilities-for-safer-agents.md](https://arxiv.org/abs/2603.00991); [in-process/lampepfl-atc.md](https://github.com/lampepfl/atc)
---

:: table transition=run dense art=hourglass+memory-chip+coin

### Power-ups

## What each class costs

| Class | Who answers its syscalls | Weight, new sandbox | Runs git, npm? |
| --- | --- | --- | --- |
| ![](icons/server-rack.svg) VM (Firecracker) | its own kernel | ~5 MiB, [125](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/) ms | anything |
| ![](icons/crate.svg) OS-level (Docker) | the host kernel, narrowed | [1.4](https://www.scitepress.org/Papers/2021/104405/104405.pdf) MB, [195](https://github.com/pydantic/monty) ms | anything |
| ![](icons/hex-block.svg) Wasm (Wasmtime) | the runtime, via its imports | a few [MB](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/), 16 ms | tools, snippets |
| ![](icons/puzzle-piece.svg) In-process (Monty) | the host process, via an API | 0.8 ms | only that API |

???

Sources (research/sandboxes/original_sources/):
- Definitions from taxonomy.md: VM = a second kernel behind hardware virtualization; OS-level = the shared host kernel narrowed by namespaces, Seatbelt, seccomp; Wasm = a bytecode runtime that can only call imports the host grants; in-process = an interpreter or type system, so the agent's whole world is one host process
- [virtualization/firecracker-aws-launch-2018.md](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/): 125 ms, ~5 MiB per microVM
- [virtualization/closer2021-lightweight-hypervisors-comparison.md](https://www.scitepress.org/Papers/2021/104405/104405.pdf): Docker 1.4 MB private dirty pages; gVisor ~10 MB; full QEMU/KVM 456 MB
- [virtualization/cloudflare-workers-security-model-2020.md](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/): each V8 isolate "a couple megabytes of memory" (Workers isolates, not Wasmtime)
- [in-process/pydantic-monty.md](https://github.com/pydantic/monty): VENDOR benchmark (new sandbox): Monty 0.80 ms, wasmtime 16 ms, local Docker 195 ms, a sandboxing service 1500 ms. Say "vendor" out loud
- [density/lfi-asplos24.md](https://doi.org/10.1145/3620665.3640408): in-process at its densest, "tens of thousands of 4GiB sandboxes in a single address space"
- Set piece: the Day 3 vote, "choose your power-up"

---

:: table transition=pipe dense art=terminal+cpu-chip+shield

### Power-ups

## Code footprint

| Code | Millions of lines | What it does |
| --- | --- | --- |
| ![](icons/cpu-chip.svg) [Linux](https://en.wikipedia.org/wiki/Linux_kernel) kernel | 41 | answers every container's syscalls |
| ![](icons/box-in-box.svg) [QEMU](https://www.usenix.org/conference/nsdi20/presentation/agache) | 1.4 | a full VM monitor |
| ![](icons/shield.svg) [gVisor](https://github.com/google/gvisor) | 0.3 | Google's; answers syscalls in user space |
| ![](icons/rulebook.svg) [MXC](https://github.com/microsoft/mxc) | 0.2 | Microsoft's; sets up each OS's own sandbox |
| ![](icons/lightning.svg) [Firecracker](https://github.com/firecracker-microvm/firecracker) | 0.1 | a minimal VM monitor; the guest's kernel answers |
| ![](icons/seatbelt.svg) [sandbox-runtime](https://github.com/anthropics/sandbox-runtime) | 0.05 | Anthropic's; sets up Seatbelt or bubblewrap |
| ![](icons/bubble.svg) [bubblewrap](https://github.com/containers/bubblewrap) | 0.005 | sets up Linux namespaces |

In short: the wrappers are small, the kernel is not; pick by what the agent must run.

???

- Counts (our own, November 2026, shallow clones of each repo's main branch): non-blank, non-comment lines of source; tests excluded; vendored code only where noted. Firecracker `src/` ~96k lines of Rust (the NSDI 2020 paper said ~50k); gVisor `pkg/` + `runsc/` ~297k lines of Go; MXC ~224k (an HN commenter said 350k, counting more); sandbox-runtime ~21k lines of TypeScript plus ~27k of vendored Rust or C; bubblewrap ~4.6k lines of C. QEMU: ">1.4 million lines" (Firecracker NSDI paper, 2020). Linux: about 41 million lines at 7.3-rc1, August 2026 (Phoronix, via Wikipedia); it crossed 40 million at 6.14-rc1, January 2025.
- Seatbelt is closed source: its kernel part, Sandbox.kext, is a policy module on macOS's own kernel.
- Firecracker also relies on KVM, inside the Linux kernel; but the guest's syscalls stop at the guest's kernel.

- Sources: [incidents/2026-08-claude-code-auto-mode-deletes-home.md](https://github.com/anthropics/claude-code/issues/88462); [incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf); [incidents/2026-02-openclaw-deletes-inbox.md](https://twitter.com/summeryue0/status/2025836517831405980); [history/saltzer-schroeder-1975-protection-of-information.md](https://web.mit.edu/Saltzer/www/publications/protection/)

- Going down a pipe in the game is the same move as a system call: leaving the story for whoever really answers. This is where the interactive pipe maze goes (one `openat` dropped through each class).
- [gVisor (KubeCon EU 2018)](https://cloud.google.com/blog/products/gcp/open-sourcing-gvisor-a-sandboxed-container-runtime): "traditional Linux containers are not sandboxes" because they call the host kernel directly; gVisor's `runsc` answers system calls itself.
- [Firecracker (re:Invent 2018)](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/): a KVM-based VMM (virtual machine monitor: the host program that runs the VM). Lambda first used a whole EC2 instance per customer; Firecracker starts a microVM in about 125 ms with about 5 MiB of overhead.
- Wasmtime: "There is no raw access to system calls or other forms of I/O; the only thing a WebAssembly instance can do is what is available through interfaces it has been explicitly linked with."
- The rest of the talk asks one thing of each row: how much of what it shares can the agent reach?
- Sources: [virtualization/gvisor-announcement-2018.md](https://cloud.google.com/blog/products/gcp/open-sourcing-gvisor-a-sandboxed-container-runtime); [virtualization/firecracker-aws-launch-2018.md](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/); [virtualization/wasmtime-security-docs.md](https://docs.wasmtime.dev/security.html)

---


:: section world="6 Silicon Island" day=4 transition=iris number=none art=laptop+cloud

## Silicon Island

How are coding agents sandboxed today?

---

:: table transition=run dense art=laptop+seatbelt+funnel

### On a laptop

## One recipe per operating system

| OS | How commands are confined | How the network is cut |
| --- | --- | --- |
| macOS | [Seatbelt](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl), a "deny by default" profile | only localhost:PORT, where a proxy filters domains |
| Linux | [bubblewrap](https://github.com/zed-industries/zed/blob/main/crates/sandbox/src/linux_bubblewrap.rs): read-only root, no network, plus seccomp | a Unix socket into the empty network, to the proxy |
| Windows | five designs: restricted tokens, AppContainer, MXC… | Google's Gemini CLI: a [bandwidth](https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/sandbox/windows/GeminiSandbox.cs) limit of 1 |

???
- Cut from the slide: the WSL2 row, "the Linux recipe", where "[/run/WSL](https://github.com/openai/codex/blob/main/codex-rs/linux-sandbox/src/bwrap.rs) starts Windows programs outside it"; "Two libraries do most of it: Anthropic's [sandbox-runtime](https://github.com/anthropics/sandbox-runtime), Microsoft's [MXC](https://github.com/microsoft/mxc)."
- The terms for this slide (formerly "Terminology, part 4"), all OS-level: the agent's commands still run on the host's kernel.
  - Seatbelt: macOS's built-in sandbox; a profile lists what a process may do.
  - bubblewrap: a small Linux tool that builds a sandbox from namespaces.
  - seccomp: a Linux filter on which system calls a process may make.
  - Landlock: Linux rules on which files a process may open.
  - AppContainer: Windows's app sandbox, one of several Windows options; MXC is Microsoft's library that wraps them.

deep-dive-sandboxes-by-os.md §1–§4. Claude Code runs unsandboxed on native Windows. Codex hides /run/WSL with a tmpfs.

agent-sandboxing/deep-dive-sandboxes-by-os.md §0, §8 (takeaway 1); [srt-source-seatbelt-bwrap-seccomp.md](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts); [mxc-seatbelt-bubblewrap-backends.md](https://github.com/microsoft/mxc/blob/main/docs/backends/seatbelt/seatbelt-backend.md); [codex-sandboxing-source.md](https://github.com/openai/codex/blob/main/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl) (WindowsSandboxLevel defaults to Disabled); [gemini-cli-tool-sandbox-source.md](https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/sandbox) (security.toolSandboxing defaults to false)

---

:: content transition=pipe art=seatbelt+rulebook+cpu-chip

### Down the pipe

## Seatbelt

- A profile in a Scheme-like language, starting from [`(deny default)`](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/macos-sandbox-utils.ts)
- A [kernel](https://media.blackhat.com/bh-dc-11/Blazakis/BlackHat_DC_2011_Blazakis_Apple%20Sandbox-Slides.pdf) module checks each file, network or process operation
- Run: `sandbox-exec -p '(version 1)(deny default) …' <command>`
- Only `localhost:<proxy port>` is allowed out
- Apple marks `sandbox-exec` “DEPRECATED”

???
- Child processes [inherit](https://keith.github.io/xcode-man-pages/sandbox-exec.1.html) the sandbox (man page).
- [Blazakis](https://media.blackhat.com/bh-dc-11/Blazakis/BlackHat_DC_2011_Blazakis_Apple%20Sandbox-Slides.pdf) (Black Hat DC 2011) reverse-engineered it: SBPL, a Scheme dialect, is compiled by a TinyScheme fork in libsandbox to a decision tree; Sandbox.kext, a TrustedBSD MAC policy module, enforces it in the kernel.
- sandbox(7): "New processes inherit the sandbox of their parent. Restrictions are generally enforced upon acquisition of operating system resources only."
- sandbox-runtime's comments document the traps: `(local ip …)` matches the source address, so srt uses `(remote ip "localhost:*")`; IPv4-mapped loopback isn't matched by `localhost`.
- Sources: [macos-windows/macos-blazakis-apple-sandbox-2011.md](https://media.blackhat.com/bh-dc-11/Blazakis/BlackHat_DC_2011_Blazakis_Apple%20Sandbox-Slides.pdf); [macos-windows/macos-sandbox-exec-man-pages.md](https://keith.github.io/xcode-man-pages/sandbox-exec.1.html); [agent-sandboxing/srt-source-seatbelt-bwrap-seccomp.md](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts)

---

:: content transition=pipe art=bubble+wall-two-layers+terminal

### Down the pipe

## bubblewrap

- User [namespaces](https://github.com/containers/bubblewrap) let any user build a sandbox, no root needed
- An empty mount namespace; the caller bind-mounts only what the sandbox may see
- `--unshare-net` cuts the [network](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts); any allowlist lives in a proxy outside
- It loads a seccomp filter the caller passes in
- Its own README: “not a complete, ready-made sandbox with a specific security policy”

???
- README: "bubblewrap works by creating a new, completely empty, mount namespace where the root is on a tmpfs that is invisible from the host". "the level of protection between the sandboxed processes and the host system is entirely determined by the arguments passed to bubblewrap." It uses `PR_SET_NO_NEW_PRIVS` to turn off setuid binaries.
- sandbox-runtime: "Linux's --unshare-net provides only all-or-nothing network isolation. Domain filtering happens at the host proxy level." It reaches the proxy through socat over a bind-mounted Unix socket, then a seccomp filter blocks any other Unix socket.
- Used by Flatpak; Claude Code uses it on Linux.
- Sources: [agent-sandboxing/srt-source-seatbelt-bwrap-seccomp.md](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts); [bubblewrap README](https://github.com/containers/bubblewrap) (read 2026-11-23)

---

:: content dense transition=pipe art=rulebook+laptop+gear

### Down the pipe

## MXC

- One [JSON](https://github.com/microsoft/mxc) policy: files, network, UI; the host owns it, not the agent
- Windows: AppContainer process isolation, egress filtered per container
- macOS: [Seatbelt](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/); Linux: bubblewrap; VM backends are experimental
- Learning mode records each blocked access, to draft the policy
- The catch: session isolation, a separate Windows user, “doesn't [restrict](https://learn.microsoft.com/en-us/windows/apps/develop/mxc/architecture) what the workload can access”

???
- [Generally available October 2026](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/). Windows default backend `processcontainer` (AppContainer-based, Windows 11 24H2+); network egress through per-container Windows Filtering Platform (WFP) filters. Other Windows backends: `isolation_session`, `wslc`; experimental `windows_sandbox`, `microvm`, `hyperlight`.
- sandbox-runtime's MXC backend uses only the BaseContainer tier, because "MXC's AppContainer network enforcement is cooperative".
- Sources: [macos-windows/windows-mxc-repo.md](https://github.com/microsoft/mxc); [macos-windows/windows-mxc-ga-blog-2026-10.md](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/); [macos-windows/windows-mxc-learn-architecture.md](https://learn.microsoft.com/en-us/windows/apps/develop/mxc/architecture); [agent-sandboxing/srt-source-seatbelt-bwrap-seccomp.md](https://github.com/anthropics/sandbox-runtime/blob/main/src/sandbox/linux-sandbox-utils.ts)

---

:: content transition=run art=padlock-open+signpost+globe

### Holdouts

## Not everyone is converging

- OpenCode, an open-source coding agent, has no OS [sandbox](https://github.com/anomalyco/opencode/blob/dev/services/site/src/docs/content/permissions.mdx) in version 2
- Baidu's coding assistant, [Comate](https://www.npmjs.com/package/@comate/comatecli), ships Anthropic's sandbox runtime, not its defaults
- Our count: 4 of ~18 Chinese local tools sandbox by default
- In ByteDance's open-source agent builder, [Coze](https://osv.dev/vulnerability/CVE-2026-77934) Studio, the default code runner had no sandbox

???

- Its [migration guide](https://github.com/anomalyco/opencode/blob/dev/services/site/src/docs/content/migrate-v1.mdx): "V1 asks before accessing paths outside the project. V2 does not."

By default OpenCode v2 allows everything except reading .env files. [agent-sandboxing/opencode-v2-permissions.md](https://github.com/anomalyco/opencode/blob/dev/services/site/src/docs/content/permissions.mdx) (source 2.3.0, release v2.3.2). The v2.0.0 tag is dated 2026-09-11; the in-repo changelog starts at v2.0.26 (2026-10-08); the 2026-10-13 launch date is from third-party coverage only.

deep-dive-cloud-and-china.md Part B (the tally is from our own source reading, Nov 2026); [china/baidu-comate-zulu-cli-sandbox-source.md](https://www.npmjs.com/package/@comate/comatecli) (allowlist of every top-level domain plus all Unix sockets; silently falls back to no sandbox); [china/minimax-code-cli-sandbox-source.md](https://www.npmjs.com/package/@minimax-ai/code); [Tencent CodeBuddy](https://www.npmjs.com/package/@tencent-ai/codebuddy-code) shipped srt until 2026-10-21; TRAE CLI's notice lists @openai/codex; [DeepSeek Harness (CVE-2026-82533)](https://www.ox.security/blog/cve-2026-82533-deepseek-harness-ai-agent-sandbox-escape/) is in Chaos Plains. Sources in Chinese are paraphrased in English.

---

:: content transition=run art=laptop+gear

### Two experiments of mine

## Sandboxes on a Mac, without a VM

- Two side projects, for Apple-silicon Macs
- fws: Docker containers that are plain macOS processes
- fwe: Linux programs, with no Linux kernel

???
- Both are on GitHub: [fun-with-sandboxes](https://github.com/e6qu/fun-with-sandboxes), [fun-with-emulators](https://github.com/e6qu/fun-with-emulators).
- Neither claims to be a security boundary; both say so in their own docs.

---

:: content transition=pipe art=laptop+crate+seatbelt

### Experiment 1

## fws

- A Docker engine for macOS with no VM: each container is a macOS process under Seatbelt
- A container starts in milliseconds
- The hole: a static or Apple-signed program loads no fws library, so it sees the host
- Its own docs: "Not a security [boundary](https://github.com/e6qu/fun-with-sandboxes/blob/main/LIMITATIONS.md) against hostile code"

???

- Cut from the slide: the containers' files are copy-on-write APFS clones.
- fws limits: [e6qu-projects/fws-limitations.md](https://github.com/e6qu/fun-with-sandboxes/blob/main/LIMITATIONS.md) ("Not a security boundary against hostile code"; "A container's view is presented by a library, not the kernel": Apple-signed, static or raw-syscall programs see host paths; Seatbelt still restricts what they can do)
- fwe: [e6qu-projects/fwe-linux-on-macos.md](https://github.com/e6qu/fun-with-emulators/blob/main/docs/linux-on-macos.md) (guest code shares fwe's address space; a raw `svc #0x80` reaches macOS; "isolates as chroot does")

---

:: content transition=run art=terminal+crate

### Experiment 1

## fws demo

```sh
fwsd
export DOCKER_HOST=unix://$HOME/.fws/docker.sock
docker compose up -d --wait
docker run --rm --security-opt seatbelt=gui --user "$(id -u):$(id -g)" \
  -e HOME=/tmp/home -v /Applications:/vscode -v "$PWD:/work" fws/base:1 \
  "/vscode/Visual Studio Code.app/Contents/MacOS/Code" \
  --no-sandbox --use-mock-keychain --user-data-dir=/tmp/vscode-data /work
```

???
- Lines 1–3 are the README's quick start. The `docker run` is fws's own end-to-end test, [tests/e2e/gui_test.go](https://github.com/e6qu/fun-with-sandboxes/blob/main/tests/e2e/gui_test.go), with one change: the test mounts a copy of VS Code at /vscode, this mounts /Applications. `Code` is the app's executable (its Info.plist's CFBundleExecutable). Not yet run on the demo Mac: rehearse it.
- VS Code runs inside a container: its window opens on the desktop; [the keychain stays denied](https://github.com/e6qu/fun-with-sandboxes#readme). `seatbelt=gui` grants the login session: window server, pasteboard, fonts, GPU.
- `--no-sandbox`: macOS refuses a second [Seatbelt](https://github.com/e6qu/fun-with-sandboxes#readme) profile to an already-sandboxed process; the container's profile confines it.
- Install: `go install github.com/e6qu/fun-with-sandboxes/cmd/fwsd@latest github.com/e6qu/fun-with-sandboxes/cmd/fws-shim@latest`. fwsd refuses to run as root.
- Source: [fun-with-sandboxes README](https://github.com/e6qu/fun-with-sandboxes#readme)
---

:: content transition=run art=laptop+cpu-chip+terminal

### Experiment 2

## fwe

- Runs Linux arm64 programs on macOS; fwe answers their system calls itself
- Wine runs Windows programs without Windows
- fwe's [README](https://github.com/e6qu/fun-with-emulators): “Wine's approach, for Linux”
- The hole: a raw macOS system call (`svc #0x80`) goes straight past fwe
- Its own docs: it isolates "as [chroot](https://github.com/e6qu/fun-with-emulators/blob/main/docs/linux-on-macos.md) does, not as a VM does"

???

- Cut from the slide: fwe also emulates namespaces.
- fws limits: [e6qu-projects/fws-limitations.md](https://github.com/e6qu/fun-with-sandboxes/blob/main/LIMITATIONS.md) ("Not a security boundary against hostile code"; "A container's view is presented by a library, not the kernel": Apple-signed, static or raw-syscall programs see host paths; Seatbelt still restricts what they can do)
- fwe: [e6qu-projects/fwe-linux-on-macos.md](https://github.com/e6qu/fun-with-emulators/blob/main/docs/linux-on-macos.md) (guest code shares fwe's address space; a raw `svc #0x80` reaches macOS; "isolates as chroot does")

---

:: content transition=run art=terminal+cpu-chip+laptop

### Experiment 2

## fwe demo

```sh
fwe --pull alpine:3.24 ~/alpine 2>/dev/null
linux ~/alpine /bin/sh -c 'apk add -q xeyes xterm font-dejavu wine'
env -i HOME=/root PATH=/usr/bin:/bin DISPLAY="$DISPLAY" \
  "$(command -v fwe)" --root ~/alpine ~/alpine/usr/bin/xterm -fa monospace
env -i HOME=/root PATH=/usr/bin:/bin DISPLAY="$DISPLAY" "$(command -v fwe)" --vm \
  --root ~/alpine ~/alpine/bin/sh -c 'wine wineboot --init && wine notepad'
fwe --strace ./hello
```

???
- Every line is from fwe's [user guide](https://github.com/e6qu/fun-with-emulators/blob/main/docs/user-guide.md); `linux` is the guide's shell function (`env -i` plus `fwe --root`). The guide installs xterm in one `apk add` call, wine in another; here it's one call.
- Notepad: the guide's Windows-program command with `wine notepad`, as fwe's test `alpine_display_wine_notepad_in_the_vm` runs it ([tests/guests.rs](https://github.com/e6qu/fun-with-emulators/blob/main/crates/fwe/tests/guests.rs)). fwe's own caveats: the VM backend is verified on a [software stand-in](https://github.com/e6qu/fun-with-emulators#readme), not yet on real hardware; the test notes Wine needs 4 KiB pages. Rehearse it; if it fails, show xterm.
- Windows reach the Mac through XQuartz (`brew install --cask xquartz`), which sets `DISPLAY`.
- VS Code in fwe is not there yet: Electron apps, VS Code, browsers are on the [roadmap](https://github.com/e6qu/fun-with-emulators/blob/main/ROADMAP.md). Today VS Code runs in fws.
- Install: `brew tap e6qu/fwe https://github.com/e6qu/fun-with-emulators`, then `brew install --HEAD fwe`.
---
:: content transition=run dense art=crate+plug+server-rack

### Docker, November 2026

## Docker is now shipping VMs

- Its [blog](https://www.docker.com/blog/docker-sandboxes-vs-containers/): a container runs code that behaves as configured; an agent is “an actor”
- A container given `docker.sock` controls the host's Docker [daemon](https://docs.docker.com/engine/security/#docker-daemon-attack-surface)
- Docker's keynote demo: an agent reached a secrets file on the host, no zero-day
- Docker's fix: a microVM per agent, with its own kernel

![A fleet of container ships](pictures/container-fleet.svg)

???
- The blog post is titled “Docker Sandboxes vs. Containers”.
- Cut from the slide: Docker's [founder](https://news.ycombinator.com/item?id=5408002), 2013: “you probably don't want to run untrusted code with root… inside a container”.
- Docker in 2026: “Sandbox the agent, containerize the application it works on.”
- Keynote demo: Docker's president at WeAreDevelopers; [the post](https://www.docker.com/blog/docker-sandboxes-vs-containers/) sums it up as "a secrets file on the host with no zero-day involved". The keynote's captions could not be read, so don't describe the demo beyond that line.
- Docker socket: [Docker's security docs](https://docs.docker.com/engine/security/#docker-daemon-attack-surface) say a container given the host's / "can alter your host filesystem without any restriction".
- Callback: [Solomon Hykes](https://news.ycombinator.com/item?id=5408002) on HN, March 2013: "you probably don't want to run untrusted code with root privileges inside a container if anything valuable is running on the same host." 13 years later the company ships the VM.
- Sources: [agent-sandboxing/docker-blog-2026-11-sandboxes-vs-containers.md](https://www.docker.com/blog/docker-sandboxes-vs-containers/); [agent-sandboxing/docker-sandboxes.md](https://docs.docker.com/ai/sandboxes/); [hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md](https://news.ycombinator.com/item?id=5408002)

---

:: table transition=run dense art=robot-head+seatbelt+server-rack

### Claude Code's sandbox vs Docker Sandboxes

## Two sandboxes

| Aspect | Claude Code's sandbox | Docker Sandboxes |
| --- | --- | --- |
| Isolation boundary | [Seatbelt](https://www.anthropic.com/engineering/claude-code-sandboxing) or bubblewrap, on the host kernel | a [microVM](https://www.docker.com/blog/docker-sandboxes-vs-containers/) with its own kernel |
| Egress | an egress proxy, by domain | an egress proxy on the host, [deny-by-default](https://docs.docker.com/ai/sandboxes/security/) |
| Secrets | on the web: a git proxy holds the token | a credential broker: “never enter the VM” |
| Trade-off | 84% fewer approval prompts, no VM | a kernel to [boot](https://www.docker.com/products/docker-sandboxes/vs-containers/), more memory |

???
- Cut from the slide: the "Docker inside" row: Claude Code's sandbox gets Docker "only by allowing [docker.sock](https://code.claude.com/docs/en/sandboxing): host access"; Docker Sandboxes run "a private [Docker](https://docs.docker.com/ai/sandboxes/architecture/) Engine in the VM".
- Both are sandboxes; only the right-hand one gives the agent a kernel of its own. That is the "Code footprint" table from World 5: the host kernel on the left, the guest's kernel on the right.
- Claude Code: [Anthropic](https://www.anthropic.com/engineering/claude-code-sandboxing)'s engineering post of 2025-10-20 (bubblewrap on Linux, Seatbelt on macOS, network only through a proxy outside the sandbox; "sandboxing safely reduces permission prompts by 84%"). Claude Code on the web keeps git credentials in a git proxy outside the sandbox. Claude Code's docs warn that allowing the `docker.sock` Unix socket gives host access.
- Docker: [Docker's docs](https://docs.docker.com/ai/sandboxes/) say the agent "sees a sentinel value instead of the real API credential"; the proxy swaps in the real one on the host. "Sandboxes cannot communicate directly over the network."
- Cost: [Docker's product page](https://docs.docker.com/ai/sandboxes/) says a sandbox "boots a kernel, so it does more work at start than a container does". Docker publishes no boot time.
- Sources: [agent-sandboxing/anthropic-beyond-permission-prompts.md](https://www.anthropic.com/engineering/claude-code-sandboxing); [agent-sandboxing/claude-code-sandboxing-docs.md](https://code.claude.com/docs/en/sandboxing); [agent-sandboxing/docker-sandboxes.md](https://docs.docker.com/ai/sandboxes/); [agent-sandboxing/docker-blog-2026-11-sandboxes-vs-containers.md](https://www.docker.com/blog/docker-sandboxes-vs-containers/)
- Docker's docs say that in direct mode the agent's git hooks run later on the host ([isolation](https://docs.docker.com/ai/sandboxes/security/isolation/)).

---

:: content transition=run art=cloud+server-rack

### In the cloud

## Sandboxes for rent

???
- E2B comes first: the others are measured against its API.
- For each platform, the question is the same as on a laptop: who answers the syscall, what can it tell, who holds the keys.

---

:: content transition=run art=cloud+box-in-box

### Cloud 1

## E2B

- A [startup](https://e2b.dev/)'s cloud of sandboxes for AI agents, since 2023
- One Firecracker [microVM](https://github.com/e2b-dev/runtime) per sandbox
- Resumes from a snapshot, pauses when idle
- Outbound internet on by [default](https://docs.e2b.dev/network/internet-access)
- [Alibaba](https://www.alibabacloud.com/help/en/agent-sandbox/agent-sandbox-overview) Cloud sells an agent sandbox that accepts E2B's API

???
- README tagline: "Firecracker microVMs that resume from a snapshot, run untrusted agent code, and pause when the agent stops." "A sandbox is a resumed snapshot." The runtime is open source (Apache-2.0).
- Docs: "Every sandbox has outbound access to the internet by default." Allow lists filter by HTTP Host or TLS SNI.
- Manus runs on it: "E2B was the best solution, and it looked like every company was using it" ([E2B's case study](https://e2b.dev/blog/how-manus-uses-e2b-to-provide-agents-with-virtual-computers), May 2025).
- Alibaba Cloud's Agent Sandbox offers an API compatible with the E2B SDK and CLI.
- Sources: [agent-sandboxing/e2b-runtime.md](https://github.com/e2b-dev/runtime); [cloud-agent-platforms/e2b-network-access-and-limits.md](https://docs.e2b.dev/network/internet-access); [china/alibaba-agent-sandbox-flash-edition.md](https://www.alibabacloud.com/help/en/agent-sandbox/agent-sandbox-overview)

---

:: content transition=run art=cloud+key

### Cloud 2

## Azure dynamic sessions

- Microsoft Azure's pooled sandboxes for model-written code
- Each session runs in its own [VM](https://learn.microsoft.com/en-us/azure/container-apps/sessions), on Hyper-V
- Outbound network off by default
- The catch: “a valid token is used to create and access any session in the pool”

???
- Microsoft's wording: “Each code interpreter session is fully isolated by a Hyper-V boundary”. Hyper-V is Microsoft's hypervisor, so the boundary is a VM's; the docs don't say what runs inside it.
- The session key is a string the app chooses; the docs put tenant separation on the application: "your app must always have complete control over the creation and use of session identifiers."
- Source: [cloud-agent-platforms/microsoft-aca-dynamic-sessions.md](https://learn.microsoft.com/en-us/azure/container-apps/sessions)

---

:: content transition=run art=cloud+crate

### Cloud 3

## Daytona

- A cloud [service](https://www.daytona.io/) that runs AI-generated code in sandboxes
- The default sandbox is a [container](https://www.daytona.io/docs/en/isolation)

???
- The container runtime is Sysbox; only VM sandboxes get pause, fork, memory snapshots.
- Source: [cloud-agent-platforms/daytona-isolation-and-advisories.md](https://www.daytona.io/docs/en/isolation)

---

:: content transition=run art=cloud+funnel

### Cloud 4

## Modal

- An AI [cloud](https://modal.com/docs/guide/sandboxes) that also runs untrusted code in its Sandboxes
- Sandboxes run on gVisor by default
- Outbound is open by default
- The catch: secret [injection](https://modal.com/docs/guide/sandbox-secret-injection) can't be combined with an allowlist

???
- Controls: `block_network`, a CIDR allowlist, an SNI domain allowlist (beta; [Modal](https://modal.com/docs/guide/sandboxes) warns about domain fronting).
- Sources: [agent-sandboxing/modal-sandboxes.md](https://modal.com/docs/guide/sandboxes); agent-sandboxing/deep-dive-cloud-and-china.md Part A

---

:: content transition=run art=cloud+server-rack+keyring

### Cloud 5

## Google Agent Compute Engine

- Google's microVM service for agents, announced October 2026
- A single-tenant [microVM](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive) per session
- No network card, so its only way out is a host-to-VM socket (vsock) to a proxy
- Credentials swapped in on the wire, outside the VM

In short: on a laptop, agents borrow the OS's sandbox; in the cloud, they rent one.

???
- [Announced October 2026](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive); already the substrate for Gemini's cloud agent; preview "in the coming months". vsock = a host-to-VM socket that needs no network card.
- Source: [cloud-agent-platforms/google-agent-compute-engine.md](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)

---

:: section world="7 Isolate Isles" day=4 transition=iris number=none art=hex-block+bubble

## Isolate Isles

What if no kernel answers at all?

---

:: content dense transition=run art=globe+hex-block

### Cloudflare Workers

## Many tenants, one process

- Cloudflare's serverless platform runs customers' JavaScript and Wasm on its edge servers
- Each runs in an [isolate](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/) of V8, Chrome's JavaScript engine, walled off inside a shared process
- A process per tenant would cost about 10× the CPU
- A second layer of namespaces and seccomp sits behind the isolate
- V8's own team says V8 “cannot defend against Spectre”, the CPU timing attack

???
- "V8 executes code inside 'isolates', which prevent that code from accessing memory outside the isolate -- even within the same process." "When using strict process isolation in Workers, we find the CPU cost can easily be 10x what it is with a shared process." (Cloudflare, 2020.)
- Against Spectre: no native code, a frozen `Date.now()` during execution, no shared memory, dynamic process isolation for suspicious workers.
- Source: [virtualization/cloudflare-workers-security-model-2020.md](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/)

---

:: content transition=run art=hex-block+lightning

### Cloudflare Dynamic Workers

## A fresh isolate per snippet

- The agent's code loads into a new isolate, runs, then is thrown away
- It starts in a handful of [milliseconds](https://blog.cloudflare.com/code-mode/), in a few megabytes
- By default, every fetch() or connect() throws
- The host passes in bindings, clients already holding their keys
- Cloudflare [says](https://blog.cloudflare.com/dynamic-workers/) V8 bugs are “more common than security bugs in typical hypervisors”

???
- Code Mode (Forest of Illusion, power-up 4) runs on this. Dynamic Workers went to open beta for paid Workers users on 2026-03-24.
- `globalOutbound: null`: "Any `fetch()` or `connect()` call from the dynamic Worker throws an exception." A binding is "an already-authorized client interface".
- Sources: [in-process/cloudflare-code-mode.md](https://blog.cloudflare.com/code-mode/); [Sandboxing AI agents, 100x faster](https://blog.cloudflare.com/dynamic-workers/)

---

:: content transition=run art=terminal+bubble

### Vercel Labs, December 2025

## just-bash

- Bash, rewritten in TypeScript, for an agent to use as its shell
- Each command (ls, grep, sed, jq…) is a TypeScript function, never a binary
- Python, JavaScript and sqlite3 run inside it as WebAssembly
- By default, files live only in memory
- The network is off unless a URL prefix is allowed
- Its [README](https://github.com/vercel-labs/just-bash): “All execution happens without VM isolation.”

???
- Python and JavaScript are off by default.
- Each `exec()` gets fresh shell state; the filesystem persists. `js-exec` (QuickJS) and `python3` (CPython in Wasm) exist but are off by default, "due to additional security surface".
- No git, npm, compilers or test runners: only what was rewritten.
- Its hole so far is the bridge to the real disk: the hard-link escape in Chaos Plains.
- Latest 3.6.1 (2026-11-16).
- Source: [in-process/vercel-just-bash.md](https://github.com/vercel-labs/just-bash)

---

:: content transition=run art=terminal+crate+hex-block

### Cloudflare, August 2026

## @cloudflare/computer

- Cloudflare's agent runtime, in early preview: one exec(), two boundaries
- One runtime runs just-bash in a Dynamic Worker isolate
- The other runs a Cloudflare Container, a full Linux environment
- Cloudflare [argues](https://blog.cloudflare.com/cloudflare-computer/) there isn't enough compute to give every agent a container

???
- "An isolate-based runtime environment that uses just-bash to translate shell code into JavaScript runs in a dynamic worker." "A container runtime that uses Cloudflare Containers to provide a full Linux environment."
- "there's nowhere near enough compute in the world for every company to give each of their users' agents their own containerized compute environment."
- Source: [Your agent needs a computer, not a container](https://blog.cloudflare.com/cloudflare-computer/) (2026-08-03)

---

:: content transition=run dense art=terminal+server-rack

### Vercel

## When the agent needs real binaries

- just-bash's [README](https://github.com/vercel-labs/just-bash) points to Vercel Sandbox for “arbitrary binary execution”
- Vercel Sandbox runs a Firecracker microVM per sandbox, with its own kernel
- just-bash's Sandbox class has the same API: swap in the VM later
- The microVM's outbound HTTP is open by default
- So a split by job: WebAssembly for tools; compilers in a microVM

In short: with no kernel to answer, the boundary is the interpreter and its bridges.

???
- "Each sandbox runs in its own Firecracker microVM with a dedicated kernel." Network: outbound allowed by default, to install packages; user-defined policies; credential injection by decrypting and re-encrypting HTTPS with a per-sandbox CA.
- The same two-tier shape as @cloudflare/computer: a simulated shell first, a real machine when the job needs one.
- Sources: [agent-sandboxing/vercel-sandbox.md](https://vercel.com/docs/sandbox); [in-process/vercel-just-bash.md](https://github.com/vercel-labs/just-bash)

---

:: section world="8 Switch Palaces" day=5 transition=iris number=none art=switch-block-red+switch-block-green+switch-block-blue

## Switch Palaces

Three defaults for every team.

![The three switch palaces, swapping places](animations/switch-palaces.svg)

---

:: content transition=run art=switch-block-red+trash-bin+backup-tape

### Switch 1

## Grant write to just the agent's workspace

- Write only inside the project folder
- Snapshot every session, out of the agent's reach

???
- Why: in Chaos Plains, agents deleted a D: drive, home folders and production databases.
- The kernel checks each delete itself, whatever command or script asked for it.
- [Antigravity](https://www.reddit.com/r/google_antigravity/comments/1p82or6/google_antigravity_just_deleted_the_contents_of/): the user was in Turbo mode, which runs terminal commands with no approval. [Press reports](https://news.ycombinator.com/item?id=46103532) quote the command as `rmdir /s /q d:\` (not seen in a raw log). The agent: "No, you absolutely did not give me permission to do that."
- [WSL2](https://github.com/anthropics/claude-code/issues/10077) case (Claude Code 2.0.22): only Unix permissions saved the system files. The transcript logged the output but not the command, so the audit trail failed too. [Claude Code's opt-in sandbox](https://www.anthropic.com/engineering/claude-code-sandboxing) had shipped the day before, off by default.
- [Aug 2026: issue #88462](https://github.com/anthropics/claude-code/issues/88462) is the fifth report of the same class; "The write path and the exec path are not correlated."
- Seatbelt: the macOS sandbox. On Linux, bubblewrap makes everything outside the workspace a read-only mount in a mount namespace. Either way the kernel refuses the unlink, whatever wrote the script.
- Sources: [incidents/2025-11-antigravity-turbo-wipes-d-drive.md](https://www.reddit.com/r/google_antigravity/comments/1p82or6/google_antigravity_just_deleted_the_contents_of/); [incidents/2025-10-claude-code-rm-rf-home-wsl.md](https://github.com/anthropics/claude-code/issues/10077); [incidents/2026-08-claude-code-auto-mode-deletes-home.md](https://github.com/anthropics/claude-code/issues/88462)

- Reserve item box = backups outside the blast radius; midway gate = a snapshot to restart from.
- [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248): the newest separate backup was three months old; [Railway's CEO restored](https://blog.railway.com/p/your-ai-wants-to-nuke-your-database) the data about two days later.
- [DataTalks.Club](https://aishippingblog.com/p/how-i-dropped-our-production-database): Claude Code ran `destroy` with an old Terraform state that described production. "Automated backups were deleted together with the database." AWS support found a hidden snapshot about 24 hours later.
- [Replit](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident): production database deleted during a code freeze; [afterwards Replit separated](https://fortune.com/2025/07/23/ai-coding-tool-replit-wiped-database-called-it-a-catastrophic-failure/) dev from prod databases.
- Snapshots also help the agent: a [2026 preprint](https://arxiv.org/abs/2610.13841) branches failed runs from full-machine snapshots.
- [Railway changelog (2026-05-01)](https://railway.com/changelog/2026-05-01-undoable-deletes): "an overeager agent can't wipe out data in a single round-trip." The link is from the PocketOS note's frontmatter.
- Sources: [incidents/2026-04-pocketos-cursor-railway-volume-delete.md](https://x.com/lifeof_jer/status/2048103471019434248); [incidents/2026-02-datatalks-claude-code-terraform-destroy.md](https://aishippingblog.com/p/how-i-dropped-our-production-database); [agent-sandboxing/replit-database-deletion-2025.md](https://www.theregister.com/2025/07/21/replit_saastr_vibe_coding_incident)

---

:: content transition=run art=switch-block-green+funnel+globe

### Switch 2

## Deny-by-default egress

- One way out: a proxy
- Deny unless listed, by host and operation

???

- Egress proxy: the sandbox's only route out; it checks every request against policy. "By operation": [Claude Code](https://code.claude.com/docs/en/cloud-environments) cloud's GitHub proxy refuses tag pushes, not just unknown hosts.
- [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248): the task did not need `backboard.railway.app` at all; a deny-by-default proxy would have blocked or at least asked.
- [Cowork](https://anthropic.com/engineering/how-we-contain-claude) (Anthropic's desktop VM; post of May 2026): a malicious workspace file carried an attacker's API key, so files went to the attacker's account through the Files API on an allowed domain. "Every function reachable through any domain on an allowlist is now an attack surface." Fix: a proxy inside the VM that passes only the session's own token.
- [CamoLeak](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code) (Legit Security; reported June 2025, fixed August 2025): GitHub's Camo image proxy was allowed, so a dictionary of pre-signed image URLs spelled out secrets. [GitHub](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code)'s fix: no images in Copilot Chat at all.
- [OpenAI](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf): the mirror was the agents' "principal egress path to the public internet". Every reachable service is part of the boundary.
- [Anthropic](https://anthropic.com/engineering/how-we-contain-claude)'s own summary of Cowork: "Our custom allowlist proxy was the piece that failed." The VM held; the plumbing didn't. Same class: [AWS AgentCore's DNS channel](https://unit42.paloaltonetworks.com/bypass-of-aws-sandbox-network-isolation-mode/) (Chaos Plains).
- Sources: [incidents/2026-04-pocketos-cursor-railway-volume-delete.md](https://x.com/lifeof_jer/status/2048103471019434248); [cloud-agent-platforms/anthropic-how-we-contain-claude.md](https://anthropic.com/engineering/how-we-contain-claude); [egress/legit-camoleak-copilot-chat.md](https://legitsecurity.com/blog/camoleak-critical-github-copilot-vulnerability-leaks-private-source-code); [incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf); [egress/claude-code-cloud-environments-network.md](https://code.claude.com/docs/en/cloud-environments)

---

:: content transition=run art=egress

### Switch 3

## Hide keys from the agent

In short: the agent writes little, talks through one proxy, holds no keys.

???

- Walk it: the agent calls GitHub with GH_TOKEN, which in Claude Code's cloud environments reads [`proxy-injected`](https://code.claude.com/docs/en/cloud-environments). The egress proxy (Switch 2) checks the operation too (no tag pushes). The credential broker swaps in the real token, bound to that host. The second envelope tries an unlisted host: denied at the proxy.
- Placeholders stop theft, not misuse through the proxy: that's why the proxy checks the operation, not only the host.
- Same pattern: [Fly.io's tokenizer](https://github.com/superfly/tokenizer) (2023); [Google's Agent Compute Engine](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive) swaps tokens in on the wire.
- The three incidents (from the former "No secrets on disk" slide):
  - Apr 2026, [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248): the agent found a token in an unrelated file.
  - Jul 2026, [Codex CLI](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087): at its plan's limit it read the app's .env: $812.47 on a $600 limit.
  - Aug 2025, [s1ngularity](https://nx.dev/blog/s1ngularity-postmortem): npm malware ran `claude --dangerously-skip-permissions` to hunt for secrets.

- Cursed items = unscoped tokens on disk.
- [PocketOS](https://x.com/lifeof_jer/status/2048103471019434248): the token was made for managing custom domains, but Railway tokens had no scopes: "blanket authority across the entire Railway GraphQL API".
- Codex (single reporter, [OpenAI developer forum](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087)): a session hit its ChatGPT subscription limit, then used the API key in the repository's `.env`; 62.2 million tokens in one day; the $600 organisation limit acted as a notification. "nothing in the stack distinguishes can from may."
- [s1ngularity](https://nx.dev/blog/s1ngularity-postmortem): malicious `nx` packages on npm for about four hours; the payload also ran `gemini --yolo`. Malware now drives your agent.
- Credential broker: from outside the sandbox, it attaches real tokens on the way out, only to the hosts a token is bound to. Placeholder tokens stop theft, not misuse through the proxy; Switch 2 handles that. Fly.io's tokenizer (2023) binds each sealed secret to its hosts.
- Sources: [incidents/2026-04-pocketos-cursor-railway-volume-delete.md](https://x.com/lifeof_jer/status/2048103471019434248); [incidents/2026-07-codex-uses-env-api-key-past-quota.md](https://community.openai.com/t/my-codex-session-hit-its-subscription-limit-then-wrote-its-own-metered-api-runner-453-in-one-day/1389087); [agent-sandboxing/nx-s1ngularity-ai-cli-malware.md](https://nx.dev/blog/s1ngularity-postmortem); [egress/claude-code-cloud-environments-network.md](https://code.claude.com/docs/en/cloud-environments); [egress/fly-tokenizer.md](https://github.com/superfly/tokenizer)
- More sources: [cloud-agent-platforms/google-agent-compute-engine.md](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)

---

:: section world="9 Valley of the Boss" day=6 transition=iris number=none art=boss+hourglass

## Valley of the Boss

The platform has to improve on its own.

---

:: content transition=run art=rulebook+padlock

### Self-improving

## The boundary is out of scope

- Recursive self-improvement: agents improving their own platform, policies included
- In scope: rules, prompts, tools, each change tested and approved by a person
- Out of scope: the boundary itself, meaning the sandbox, egress, keys and kill switch
- No change may weaken it; the agent at work can't reach its API

[Microsoft](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/), Oct 2026: “An agent cannot be its own security authority.”

???
- Why the boundary stays out: each way round is in Chaos Plains. Copilot wrote its own settings, Cursor created a config, Claude Mythos pressed approve, DeepSeek Harness called its own control API.
- Improving a policy inside the boundary is fine: narrower rules, better prompts, new tools, all through the evals. Nothing in the loop can touch the sandbox, the egress proxy, the credential broker or the kill switch.
- Source: [macos-windows/windows-mxc-ga-blog-2026-10.md](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/)

---

:: content transition=run art=rulebook+eye+stamp-approve

### Self-improving

## Denials become proposals

- The policy is enforced from day one; no mode that only watches
- Every denied call is logged, with the task the agent was on
- An improver agent turns repeated denials into proposed rules; a person approves each
- Injected repos got broad rules proposed in [58%](https://arxiv.org/abs/2610.22987) of runs

???

- Why no learning mode: tools that "learn" a policy watch without blocking while they record. [Systrace (2003)](https://www.usenix.org/conference/12th-usenix-security-symposium/improving-host-security-system-call-policies) learned in "a training session"; Windows' [Win32 app isolation](https://blogs.windows.com/windowsdeveloper/2023/06/14/public-preview-improve-win32-app-security-via-app-isolation/) profiler (2023) and [MXC (2026)](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/) have learning modes. Whatever the agent does during that window becomes the policy. Record denials while enforcing instead.
- [MXC](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/): Microsoft's cross-platform policy layer over each OS's own sandbox; it records each block to a JSON report.
- "[From Approval to Abuse](https://arxiv.org/abs/2610.22987)" (preprint, October 2026): repository content steers Claude Code or Codex into proposing a broad allow-rule; conditional on approval, the attack completed silently in 47 of 58 cases (81%). So the injected repo must not be able to steer the change: the evals judge it, and the boundary is out of its reach.
- Sources: [history/provos-2003-systrace.md](https://www.usenix.org/conference/12th-usenix-security-symposium/improving-host-security-system-call-policies); [macos-windows/windows-mxc-ga-blog-2026-10.md](https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/); [macos-windows/windows-win32-app-isolation-preview.md](https://blogs.windows.com/windowsdeveloper/2023/06/14/public-preview-improve-win32-app-security-via-app-isolation/); [arxiv/2610.22987-approval-to-abuse.md](https://arxiv.org/abs/2610.22987)

---

:: content transition=run art=trophy+rulebook+magnifier

### Self-improving

## Run evals periodically

- An eval: a fixed set of tasks, scored automatically; run it regularly
- Policy: a strict one cost up to 18.3 [points](https://arxiv.org/abs/2608.02670) on a coding benchmark
- Prompt: without a scope line, Claude Code did more than asked in 17.1% of [runs](https://arxiv.org/abs/2605.18583)
- Environment: Anthropic's Claude Mythos Preview broke out of a container on [every](https://arxiv.org/abs/2603.02277) sample

???
- Cut from the slide: "Rerun on a schedule" (now "run it regularly"); the prompt result went "from 0%"; Mythos's container was "inside a VM", which held.
- The point: the sandbox policy is one configuration among several. Any of them can change what the agent does, so the evals cover all of them.
- "Permission Denied" (preprint, August 2026): 12 coding agents on Terminal-Bench 2.1 under nested enterprise policies. "Existing benchmarks, however, evaluate agents almost exclusively in permissive sandboxes." Under the strictest policy, "success losses reach 18.3 points and cost inflation 167.3%". Runs grind into timeouts or wrong answers rather than stopping. It releases Boundary-Bench, a hardening plugin.
- OverEager-Bench (preprint, May 2026): 500 scenarios, about 7,500 runs, four agents. "On Claude Code, stripping the consent declaration alone raises the overeager rate from 0.0% to 17.1%". Their word for doing more than asked: "overeager".
- SandboxEscapeBench (preprint, March 2026): the flag sits on the VM, "the outer layer containing the flag and no known vulnerabilities". Version 3: "Mythos Preview, announced 7 April 2026, succeeded at least once on 100% of samples." It broke out of the container, not the VM.
- The eval harness is a sandbox too: the Package Mirror in Chaos Plains happened inside OpenAI's own evaluations.
- Sources: [arxiv/2608.02670-permission-denied-hardened-environments.md](https://arxiv.org/abs/2608.02670); [arxiv/2605.18583-overeager-coding-agents.md](https://arxiv.org/abs/2605.18583); [arxiv/2603.02277-sandboxescapebench.md](https://arxiv.org/abs/2603.02277)

---

:: table transition=run dense art=trophy+magnifier+robot-head

### Self-improving

## Agent as a judge

| Question | What the judge looks for |
| --- | --- |
| ![](icons/trophy.svg) Was the change helpful? | each requirement, before and after |
| ![](icons/coin.svg) Did it save resources? | tokens, minutes, cost per solved task |
| ![](icons/lightning.svg) Did it add capabilities? | tasks that newly pass |
| ![](icons/signpost.svg) Where does the agent get lost? | “task derailment”, in [MAST](https://arxiv.org/abs/2503.13657), a taxonomy of agent failures |
| ![](icons/hourglass.svg) Where is its work useless? | “step repetition”; being “unaware of termination conditions” |
| ![](icons/stop-button.svg) Where does it stop, fail or ask? | “premature termination”; failing “to ask for clarification” |

An agent judge reads the whole trace, not just the answer. In one [study](https://arxiv.org/abs/2410.10934) it agreed with experts about 90% of the time; an LLM judge, 60–71%.

???

- Agent-as-a-Judge (Zhuge et al., 2024; arXiv 2410.10934): "agentic systems are used to evaluate agentic systems"; "an organic extension of the LLM-as-a-Judge framework, incorporating agentic features that enable intermediate feedback for the entire task-solving process." On DevAI (55 AI-development tasks, 365 requirements) the agent judge agreed with a three-expert consensus 92.07% / 90.44% (gray-box / black-box) against 70.76% / 60.38% for LLM-as-a-Judge, at "2.29% of the cost and 2.36% of the time of Human-as-a-Judge". Its "ask" module "determines whether a given requirement is satisfied": the helpfulness question.
- The paper does not itself claim to find loops or wasted work. Those questions come from MAST ("Why Do Multi-Agent LLM Systems Fail?", Cemri et al., UC Berkeley, 2025): 14 failure modes. Step repetition: "Unnecessary reiteration of previously completed steps in a process". Unaware of termination conditions: "potentially leading to unnecessary continuation". Task derailment: "Deviation from the intended objective or focus of a given task". Premature termination: "Ending a dialogue, interaction or task before all necessary information has been exchanged or objectives have been met". Fail to ask for clarification: "Inability to request additional information when faced with unclear or incomplete data". An o1 judge given the trace and these definitions agreed with human annotators at Cohen's kappa 0.77.
- Resources and capabilities: our own questions; the numbers come from the eval runs (cost per solved task, newly solved tasks). "Permission Denied" (previous slide's notes) shows why cost matters: hardening inflated cost by up to 167.3%.
- Sources (research/sandboxes/original_sources/arxiv/): 2410.10934-agent-as-a-judge.md; 2503.13657-mast-why-multi-agent-systems-fail.md

---

:: content transition=run art=stop-button+alarm-bell

### HURRY UP!

## The kill switch must be deterministic

- Default: one control-plane call pauses all sessions, revokes tokens, keeps snapshots
- Plain code, no model deciding: the same call always stops the same sessions
- Out of band: it never passes through the agent, so no prompt or summary can lose it

In short: policy and kill switch stay out of the agent's reach.

???
- Cut from the slide: "In short: policy and kill switch sit outside the sandbox, out of the agent's reach; a person approves each change."
- [OpenClaw](https://twitter.com/summeryue0/status/2025836517831405980): the researcher sent "Do not do that", "Stop don't do anything", "STOP OPENCLAW" from a phone; the agent kept trashing mail. The stop messages are from press reconstructions of her screenshots; the run to the Mac mini is [the researcher's own post](https://twitter.com/summeryue0/status/2025836517831405980).
- [OpenAI](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf): the June 27 port-sweep alert, where on-call "advised that stopping the evaluation run was not required"; responders took the mirror offline on July 5; the escape to Hugging Face followed on July 8. The shutdown tool is in the report's section IX.
- Keeping the snapshot matters: after the stop, you need the evidence.
- Sources: [incidents/2026-02-openclaw-deletes-inbox.md](https://twitter.com/summeryue0/status/2025836517831405980); [incidents/2026-07-openai-eval-agents-escape-to-hugging-face.md](https://cdn.openai.com/pdf/67869394-cb91-4c12-888c-5cbd85c7814c/OpenAI-Hugging-Face%20Incident-Technical-Report.pdf)

---

:: section world="10 Final Castle" day=7 transition=iris number=none art=castle-tower+crown

## Final Castle

What does the platform team ship?

---


:: diagram transition=run art=developer+laptop+server-rack

### What the developer sees

## One session

```mermaid title="One session from the developer's side: ask, the agent works in a sandbox, a pull request comes back"
sequenceDiagram
  actor Dev as Developer
  participant Agent
  participant API as Sandbox API
  participant VM as microVM
  participant Proxy as Egress proxy
  %% game icon Dev developer
  %% game icon Agent robot-head
  %% game icon API plug
  %% game icon VM server-rack
  %% game icon Proxy funnel
  Dev->>Agent: Fix the failing test
  Agent->>API: A sandbox for this repo
  API->>VM: Resume from a snapshot, with the job's policy
  Agent->>VM: Edit, build, test
  VM->>Proxy: npm install
  Proxy-->>VM: Allowed, with the token added
  VM->>Proxy: Upload to an unknown host
  Proxy-->>VM: Denied, logged
  Agent-->>Dev: A pull request
  API->>VM: Pause when idle
```

- The agent gets a sandbox for the developer's repo
- The agent edits, builds, tests inside it
- Package installs pass the proxy, which adds the token
- An upload to an unknown host is denied, then logged
- The developer sees no prompts, only a pull request

???

- From the developer's seat, nothing asks "allow?". The three defaults (write scope, deny-by-default egress, no keys in the VM) decide without them.
- The denied upload shows up later as a proposed rule, if it was legitimate.
- The sandbox pauses when idle; its snapshot stays for the next session.

---

:: diagram transition=run art=clock+robot-head+calendar-page

### Nobody at the keyboard

## Scheduled agents

```mermaid title="A scheduled agent: the scheduler starts the job, anything outside its policy is denied, a person reviews the result"
sequenceDiagram
  participant Cron as Scheduler
  participant API as Sandbox API
  participant VM as microVM
  participant Proxy as Egress proxy
  actor Person as Reviewer
  %% game icon Cron clock
  %% game icon API plug
  %% game icon VM server-rack
  %% game icon Proxy funnel
  %% game icon Person developer
  Cron->>API: Run "nightly-deps", with its policy, budget, deadline
  API->>VM: A fresh sandbox, as the job
  VM->>Proxy: Every call out
  Proxy-->>VM: Outside the policy? Denied, never asked
  VM-->>API: A pull request, a report, a snapshot
  API-->>Person: Review the pull request
  Note over API,Proxy: Over budget or past the deadline, the control plane stops it
```

- A scheduler, a webhook or a CI failure starts the job through the sandbox API
- Each job carries its policy, a budget, a deadline
- Nobody is there to approve, so anything outside the policy is denied
- It acts as the job, with short-lived tokens, never as a person
- A person reviews what it hands back

???

- A denial is final for that run; it goes to the denial log, where the improver agent may turn it into a proposed change for the evals.
- The job's identity matters: the broker issues tokens scoped to that job, so a log line names the job, not whoever wrote the cron entry.
- Past its budget or deadline, the control plane stops it and keeps the snapshot. The kill switch covers these jobs too.

---

:: diagram transition=run art=blueprint+gear+funnel+keyring

### The platform in one picture

## Control plane in-house

```mermaid title="The platform: laptops and cloud sandboxes share one policy and one egress proxy; an improver agent turns denials into proposed changes"
flowchart LR
  dev["Developer's agent"] --> api["Sandbox API<br/>E2B-style"]
  sched["Scheduler<br/>cron, webhooks"] --> api
  api --> cp["Control plane"] --> vm["microVM or Wasm<br/>from OCI images"] --> proxy["Egress proxy"] --> broker["Credential broker"] --> out["GitHub, registries, clouds"]
  laptop["Laptop agent<br/>under the OS sandbox"] --> proxy
  kill["Kill switch"] --> cp
  cp --> snap[("Snapshots")]
  pol[("Policy per job")] --> cp
  proxy -.-> tel["Denials"] -.-> improver["Improver agent"] -.-> rule["Proposed change<br/>rules, prompts, tools"] -.-> evals["Evals"] -.-> person["A person"] -.-> pol
  %% game at sched 0 0 clock | Scheduler
  %% game at kill 1 0 stop-button
  %% game at snap 3 0 floppy-disk
  %% game at laptop 4 0 laptop | Laptop agent
  %% game at dev 0 1 developer
  %% game at api 1 1 plug | Sandbox API
  %% game at cp 2 1 gear
  %% game at vm 3 1 server-rack | microVM or Wasm
  %% game at proxy 4 1 funnel
  %% game at broker 5 1 keyring
  %% game at out 6 1 globe
  %% game at pol 1 2 rulebook
  %% game at person 2 2 developer
  %% game at evals 3 2 trophy
  %% game at rule 4 2 sticky-note | Proposed change
  %% game at improver 5 2 robot-head
  %% game at tel 6 2 stamp-deny
```

- Agents and the scheduler ask one sandbox API
- The control plane starts a microVM or Wasm sandbox
- Laptop agents run under the OS sandbox, with the same policy
- Policy, snapshots, kill switch all sit outside the sandbox
- Every connection out goes through the egress proxy
- An improver agent turns denials into changes: evals, then a person

???

- Walk it left to right. A developer's agent, or the scheduler, asks the control plane for a sandbox through an E2B-style API. The control plane reads the job's policy (write scope, egress list, budget) and starts a microVM or Wasm instance from an OCI image. The VM has no route out except the egress proxy. The proxy asks the broker to attach real credentials. Each denial goes to telemetry. An improver agent turns them into proposed changes (rules, prompts, tools); each passes the evals, then a person approves it before it reaches the policy. The boundary itself (VM, proxy, broker, kill switch) is out of the improver's scope.
- Laptops use the recipes from Silicon Island (Seatbelt, bubblewrap, MXC), with their traffic sent to the same proxy, so one policy covers both.
- Snapshots and the kill switch sit with the control plane, out of the agent's reach.
- [Google](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)'s Agent Compute Engine (announced October 2026, not yet public) is the strictest version of the same picture: no virtual network card, only vsock to a mediation proxy.
- Sources: [cloud-agent-platforms/google-agent-compute-engine.md](https://cloud.google.com/blog/topics/ai-infrastructure/agent-compute-engine-deep-dive)

---

:: table transition=run dense art=boss+envelope-open+trophy

### Day 7

## The brief delivered

| Monday's brief | What ships |
| --- | --- |
| ![](icons/lightning.svg) Efficient | a microVM per session, [125](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/) ms each, paused while idle |
| ![](icons/puzzle-piece.svg) Specialized | a policy per job |
| ![](icons/switch-block-red.svg) Self-service | one sandbox API, three defaults on from day one |
| ![](icons/gear.svg) Self-improving | agents propose; evals and a person approve; the boundary stays out of reach |
| ![](icons/backup-tape.svg) No data loss | snapshots out of the agent's reach |
| ![](icons/stop-button.svg) No chaos | one egress proxy, one kill switch |

???
- Cut from the slide: "paused while the agent waits"; "one sandbox API, with the three defaults on from day one"; "agents propose rules, prompts and tools; evals and a person approve; the boundary is out of their reach".
Closes the loop opened on Day 1 by the boss's email.

---

:: closing mario art=trophy+coin

### Thank you

## Questions?

[github.com/e6qu](https://github.com/e6qu) [e6qu.github.io](https://e6qu.github.io)
