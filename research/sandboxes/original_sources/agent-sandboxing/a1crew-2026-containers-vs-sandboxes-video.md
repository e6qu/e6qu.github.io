---
title: "Containers vs Sandboxes: Where Should AI Agents Run?"
url: https://www.youtube.com/watch?v=4yghXAYhayI
authors: "Alex - a1crew" (YouTube channel; the narrator calls himself "a software engineer"; no real name given)
date: uploaded 2026-11-22; 11 min 54 s; narrated explainer with chapters, not a conference talk
accessed: 2026-11-22
kind: talk
---
Read from YouTube's auto-generated English captions and the video's metadata (description
and chapter list), so names are as heard ("Doker" = Docker, "clot"/"cloud code" = Claude /
Claude Code, "Enthropic" = Anthropic, "Wazi 0.2" = WASI 0.2, "CLA" = Clair, "effeial
runners" = ephemeral runners). The screen was not watched, so demo footage is not described.
Timestamps are from the caption file. 5.3k views on the day of upload.

Most of the script retells one Docker blog post almost sentence by sentence:
[docker-blog-2026-11-sandboxes-vs-containers.md](docker-blog-2026-11-sandboxes-vs-containers.md)
(Srini Sekaran and Oleg Selajev, 2026-11-05). Other material comes from Anthropic's
Claude Code sandboxing post ([anthropic-beyond-permission-prompts.md](anthropic-beyond-permission-prompts.md)),
the package-hallucination problem ([slopsquatting-package-hallucinations.md](slopsquatting-package-hallucinations.md)),
WASI 0.2 ([../wasm/wasi-0.2-launch-2024.md](../wasm/wasi-0.2-launch-2024.md)) and CI nested
virtualization ([../virtualization/github-hosted-runners-kvm.md](../virtualization/github-hosted-runners-kvm.md)).
The video cites none of these sources on screen or in its description.

## Summary
The argument has six steps:
1. A container is a process with its own view of files and network, on the host's shared kernel.
   It was built for code that behaves as configured. A coding agent is an "actor": it decides,
   probes, installs packages and acts on unreviewed text.
2. Two attacks follow. A mounted Docker socket gives the container the host's Docker daemon,
   which can mount host paths. "LLM-targeted typosquatting" means registering package names
   that models hallucinate; image scanners (Trivy, Clair) miss these because the package is
   fetched at runtime, not baked into the image.
3. The fix is Docker Sandboxes: a microVM per agent with its own kernel, file system, network
   and private Docker Engine. Outbound traffic goes through a host-side proxy that is deny by
   default and injects credentials, so the raw key never enters the VM.
4. A comparison with Claude Code's built-in sandbox (Seatbelt on macOS, bubblewrap on Linux,
   shared kernel, 84% fewer approval prompts). That suits a supervised laptop session; a
   microVM is for unattended "YOLO mode" and for running Docker inside.
5. Two complications: the "nested virtualization CI trap" (hosted CI runners supposedly can't
   run KVM) and WebAssembly as a "cheat code" (WASI 0.2 capabilities, sub-millisecond starts,
   but no standard Linux binaries).
6. How to choose: containers for code you control; a sandbox when the workload fetches or
   generates code at runtime, runs unattended, needs Docker, or reads input you didn't write.
   It closes with Docker's line, "Sandbox the agent, containerize the application it works on",
   and asks viewers to say whether they are "team microVMs or team WebAssembly".

## Key points
Each claim is checked against its primary source (details in the linked notes).

- **Docker socket (0:12–0:31, 2:05).** Correct in substance: Docker's docs say only trusted
  users should control the daemon, and a container given `/` as `/host` "can alter your host
  filesystem without any restriction" (https://docs.docker.com/engine/security/#docker-daemon-attack-surface).
  The opening "watch this" scene dramatises the demo in Docker's WeAreDevelopers keynote. Docker's
  post describes that demo as an agent reaching "a secrets file on the host with no zero-day
  involved". The demo itself was not checked: YouTube rate-limited the keynote's captions.
- **"Even Docker just admitted that containers are dead for AI" (0:40).** False. Docker's post
  says the opposite: containers "stay the right choice for packaged applications, CI jobs, and
  short-lived execution".
- **Cavage quote (1:52).** The video presents a quote from Docker's president. It comes from
  Docker's post, which paraphrases him rather than quoting: "containers are doing exactly the job
  they were designed to do, but we're asking them to do a different job".
- **LLM-targeted typosquatting (2:31–3:24).** The threat is real and measured: the USENIX Security
  2025 paper found 5.2% (commercial) to 21.7% (open) hallucinated package rates and 205,474 unique
  names. The specific example ("Claude 3.5 frequently hallucinates ... React DOM pars") is framed as
  hypothetical ("Say ..."). `react-dom-pars` does not exist on npm (registry 404, 2026-11-22).
  "Mine common LLM tokenization errors" and the Trivy and Clair claim have no cited source.
- **Docker Sandboxes architecture (3:27–4:59).** Matches Docker's post and docs: microVM, own
  kernel, private Docker Engine, sandboxes can't reach each other, host-side proxy deny by default,
  credentials injected so "the raw credential values never enter the VM". Two things are omitted.
  The default policy "include[s] broad wildcards" such as `*.googleapis.com`. In direct mode,
  git hooks, CI configs and build scripts the agent writes run later on the host: "There is
  no boundary between the agent's edits and your host filesystem."
- **"They boot in under a second" (5:18).** Unverified. Docker publishes no boot figure. Its
  product page says a sandbox "boots a kernel, so it does more work at start than a container does".
- **Claude Code sandbox (5:22–6:45).** Seatbelt on macOS, bubblewrap on Linux and the 84% figure match
  Anthropic's post (2025-10-20). "Anthropic just released" is wrong: the post is 13 months older
  than the video. On Docker access: Claude Code's docs say allowing the `docker.sock` Unix socket
  gives host access.
- **Nested virtualization CI trap (7:13–8:26).** Overstated. Docker's post says only that
  "running inside another VM requires nested virtualization". GitHub's 2-vCPU hosted Linux runners
  have had hardware-accelerated virtualization (KVM, after adding a udev rule) since 2024-04-02.
  GitHub does say arm64 macOS runners can't nest. No official GitLab.com statement was found
  either way. "Expensive bare metal" and "reverse tunnels" are unsourced.
- **Wasm (8:26–9:36).** WASI 0.2 (2024-01-25) does make a component's imports its capabilities,
  and instantiation can be microseconds (Wasmtime: ~5 µs for a large module). The limit is
  stated correctly: Wasm "cannot run every standard Linux binary". "Safer than a shared kernel"
  is unqualified. Wasmtime had 71 security advisories in 2026 after an LLM bug hunt
  ([../wasm/wasmtime-security-advisories.md](../wasm/wasmtime-security-advisories.md)).
- **Getting started (10:21–10:59).** `sbx run claude`, kits, and an environment file committed to
  the repo all match Docker's post. The post adds that "Kits are in early access and environment
  files are experimental".

## Excerpts
> "For 10 years, the container was the ultimate security boundary. But the moment you put an AI agent inside one, that same container becomes a weapon aimed directly at your host machine." (0:02)

> "It finds the mounted Docker sockets. Then it uses that socket to mount the host root file system. It just took over the developer's entire machine. No zero day exploit required." (0:24)

> "But a coding agent is not a predictable app. It is an actor. It makes decisions." (1:20)

> "If there is a gap in the configuration, the agent will find it." (2:05)

> "The container boundary is the shared host kernel. A sandbox boundary is the hardware hypervisor." (4:05)

> "The agent cannot leak what it cannot see." (4:59)

> "WASM is fast, but it does not run standard Linux binaries yet." (9:31)

> "Sandbox the agent, containerize the application it works on. This is the new standard." (11:29)

> "Let me know in the comments if you are on the team of microVMs or team of web assembly." (11:46)

## Relevance to the talk
The video tells the talk's own arc in 12 minutes, for a general developer audience, on the
day this note was written. It starts from "I thought sandbox was just about docker and VMs"
(containers are a boundary) and ends at "Practically, a sandbox is just about VMs (and
WebAssembly)". Its last question, "team microVMs or team WebAssembly", is the closing line
put as a choice. It is useful in three ways:

- **As evidence the industry converged.** The company that popularised containers now tells
  developers to put agents in microVMs, behind an egress proxy and a credential broker. That
  is the talk's "borrow the boundary" plus two of the four switches. It pairs with Docker's
  founder in 2013 (`hackernews/history-os-primitives/hn-5408002-docker-launch-2013.md`):
  "you probably don't want to run untrusted code ... inside a container".
- **As a ghost house.** Explainer content flattens the caveats the talk insists on: "host stays
  completely out of reach" (git hooks run later on the host, as in the World 6 escapes table),
  deny by default (broad default wildcards, as in the Cowork proxy), a CI trap that GitHub's
  docs contradict, and a "just released" that is 13 months old. Check the explainer, as you
  check the legend.
- **As the Wasm question.** It states the Wasm trade-off fairly (no Linux binaries), which is
  why the talk ends on "VMs (and WebAssembly)" and not on Wasm alone.

Caveats: a single-narrator channel with no named author, published the same day; claims are
reliable only where they repeat Docker's post.
