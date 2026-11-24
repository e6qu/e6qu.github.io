# A taxonomy of sandboxing strategies (draft, 2026-11-22)

Four classes, ordered by **what the confined code is given**:

| Class | The agent gets… | The boundary is enforced by | Who answers the agent's syscalls |
|---|---|---|---|
| **1. VM** | a whole machine (its own kernel) | the CPU's virtualization hardware plus a VMM | a guest kernel; the VMM and host handle device exits |
| **2. OS-level** | the real host OS, minus some things | the host kernel (namespaces, MAC, syscall filters) | the host kernel, or a user-space kernel in front of it |
| **3. Wasm** (and managed-runtime isolates) | an abstract machine plus the imports the host grants | the runtime's validation and code generation (bounds checks, no raw pointers) | nothing directly: the code can only call host-provided imports (WASI, bindings) |
| **4. In-process** | only an API: the agent's whole world is one host process | the host process (types, capabilities, an interpreter, SFI rewriting, flow tracking) | the host process itself; no syscall is reached except through its API |

Moving down the table: **compatibility falls** (from any binary to only the
operations the API defines), **density rises** (from hundreds of MB to bytes per
instance), **control gets finer** (from "which files and hosts" down to "which value
may flow where"), and **the boundary moves from hardware into software you must
trust** (a kernel, then a JIT, then a verifier or type checker).

A fifth thing is **not a class but an orthogonal layer**: *mediation* — approval
prompts, classifiers (auto mode), rule engines (Cedar/Dogwood), egress proxies and
domain allowlists, credential brokers. It sits on top of any class. Most agent
products today are an OS-level sandbox plus mediation.

---

## 1. VM: a second kernel behind hardware virtualization

| Sub-type | Examples | Agent use | Notes |
|---|---|---|---|
| Full VM | QEMU/KVM, Hyper-V, VMware; macOS Virtualization.framework (Lima, Tart, UTM) | "I run Claude Code in a VM" (26% of HN practitioners); Claude Cowork (10 GB VM bundle on macOS), Claude Desktop (1.8 GB Hyper-V VM on Windows) | `virtualization/`, `macos-windows/`, `hackernews/agents/practitioner-setups.md` |
| microVM | Firecracker, Cloud Hypervisor, crosvm, libkrun; Apple `container` (one VM per container) | E2B, Vercel Sandbox, Fly Sprites, Docker Sandboxes, microsandbox, AWS Lambda MicroVMs per agent session | `virtualization/firecracker-nsdi2020.md`, `agent-sandboxing/` |
| Container in a VM | Kata Containers, Firecracker-containerd | hosted sandboxes | `virtualization/kata-containers-architecture.md` |
| Shared VM | Docker Desktop, OrbStack, Colima, WSL2 (one Linux VM, many containers) | devcontainers on Mac and Windows | the VM isolates the host; containers inside share one kernel |
| Kernel-less VM per process | fwe's Hypervisor.framework backend, Hyperlight, Nanvix user VMs | — | `e6qu-projects/fwe-hypervisor.md`, `density/nanvix-…` |

- **Cost:** Firecracker under 5 MB of overhead and ~125 ms to user code; a full
  QEMU VM ~456 MB and ~8.8 s (CLOSER 2021); Apple `container` 1 GiB by default,
  with memory not returned to macOS.
- **Limits:** macOS licenses only 2 macOS guest VMs per Mac.
- **How it fails:** not through the hardware boundary but through the software
  around it: emulated devices, the network stack (libslirp) and host kernel bugs.
  Trail of Bits escaped QEMU/KVM three times (`agent-sandboxing/trailofbits-…`);
  OpenAI's evaluation agents broke out through a helper service, the package mirror
  (`incidents/2026-07-openai-…`). Microarchitectural leaks remain
  (`arxiv/2311.15999`).
- **What it gives agents:** total compatibility (git, compilers, Docker inside).
- **What it doesn't:** it says nothing about data flows or egress. The lethal
  trifecta goes straight through a VM unless egress is mediated.

## 2. OS-level: one shared host kernel, narrowed

| Sub-type | Examples | Agent use |
|---|---|---|
| Namespaced containers, jails, zones | chroot → FreeBSD jails, Solaris Zones, OpenVZ, LXC, Docker/runc, Podman; Windows process-isolated containers (silos) | devcontainers, container-use, Gemini CLI Docker, OpenHands; 25% of HN practitioners |
| Process self-confinement | seccomp-bpf, Landlock, pledge/unveil, Capsicum; macOS Seatbelt; Windows AppContainer + job objects + integrity levels | Claude Code / srt, Codex CLI, Cursor, Zed, Antigravity, Copilot CLI, Factory, Kilo (14 of 23 agents ship one; 4 on by default) |
| Wrappers built from those | bubblewrap, Firejail, nsjail, minijail, systemd sandboxing; Microsoft MXC (AppContainer, Seatbelt or bubblewrap behind one SDK) | srt and Codex use bubblewrap on Linux; Copilot CLI, VS Code, Factory and Codex on Windows use MXC |
| Identity and MAC | separate Unix user, SELinux/AppArmor, Windows agent workspace (an account per agent) | "separate user" setups; Windows agent workspace |
| User-space kernel in front of the host | gVisor (Sentry), WSL1 (pico processes), **fwe native backend** (Linux ABI on macOS), Noah | Modal (gVisor), Gemini CLI's gVisor option |
| Packaging over native isolation | Docker in 2013 over LXC; **fws** (Docker/Compose API over Seatbelt plus APFS clones, with the gaps patched in its runtime) | — |

- **Cost:** a Docker container ~1.4 MB, gVisor ~10 MB (CLOSER 2021). Seatbelt adds
  ~7 ms per launch and no memory; fws ~5.6 ms per start, and an idle container costs
  nothing. A minimal Linux process is ~70 KB of kernel state
  (`density/kapteko-10-million-codex-clis.md`).
- **How it fails:** the shared kernel. 60% of kCTF exploits used io_uring; 44% of
  exploits needed unprivileged user namespaces; runc CVE-2019-5736; about a dozen
  CVEs in Cursor and Claude Code's own sandboxes in 2026. Policy is built from
  untrusted input (Codex CVE-2025-59532), and escape hatches exist ("retry
  unsandboxed", Ona). There is a perennial "containers aren't a boundary" consensus
  on HN.
- **Per OS:** Linux has the full set. macOS has only Seatbelt (deprecated, no
  namespaces, no cgroups, no process hiding). Windows has AppContainer plus job
  objects, while Microsoft says silos are not a security boundary.
- **For agents:** compatible (real shell, real tools), cheap and dense. Control
  stops at files, processes and hosts. Egress needs a proxy, and data-flow control
  is impossible at this level.

## 3. Wasm: an abstract machine with capability imports
Sources: `original_sources/wasm/README.md` (27 notes), plus `virtualization/`.

| Sub-type | Examples | Agent use |
|---|---|---|
| Server-side runtimes | Wasmtime, WasmEdge, Wasmer (+WASIX fork/exec), Spin, wasmCloud, Fastly; Hyperlight-Wasm (Wasmtime in an OS-less micro-VM, 1–2 ms) | Wasmer markets "sandboxes for AI agents" |
| Component-model capability tools | WASI 0.2/0.3 components (imports are the capabilities); Microsoft Wassette (components as MCP tools, deny-by-default) | MCP tools; "cannot prevent prompt injection" |
| Managed-runtime isolates | V8 isolates (Cloudflare Workers, Dynamic Worker Loader), Deno | Cloudflare sandboxes, Code Mode |
| Language runtimes compiled to Wasm | Pyodide: mcp-run-python, langchain-sandbox (both archived in 2026), Cloudflare Python Workers | generated-snippet interpreters; abandoned for general use ("no safe way", Pydantic) |
| Browser-as-sandbox, Linux in Wasm | StackBlitz WebContainers (Bolt.new), BrowserPod, CheerpX/WebVM, v86, container2wasm | Bolt.new; client-side agents |

- **Cost (vendor figures):** Wasmtime instantiation in ~5 µs; Lucet under 50 µs and
  a few KB; Fermyon 5,000+ apps per node; Cloudflare isolates a few ms and a few MB,
  with 10,000+ tenants per machine (kentonv) and process-per-tenant ~10× the cost.
  Pyodide cold start ~10 s, or ~1 s with snapshots.
- **2026 signal:** Wasmtime published **71 advisories in 2026** (5 critical, 4 high)
  against 4–8 a year before, after an LLM-assisted bug hunt. Most were in host
  (WASI and component-model) code.
- **How it fails:** the memory sandbox is considered sound, but the host interface
  (WASI, imports, bindings) and the JIT are the attack surface. Spectre breaks
  confidentiality within a process (V8 team, `virtualization/spectre-is-here-to-stay-2019.md`).
- **For agents:** portable and dense, with capabilities by construction. But no
  fork/exec, no native binaries and no arbitrary package managers, so it suits
  tools and generated snippets, not a whole coding environment (WebContainers
  being the partial exception).

## 4. In-process: the agent's whole world is one host process
Sources: `original_sources/in-process/README.md` (23 notes), plus LFI in `density/`.

The agent never touches the OS. Every effect is a call into an API the host
defines, so the host can govern not only *which resources* but *which values flow
where*.

| Sub-type | Examples | Guarantee | Cost |
|---|---|---|---|
| Software fault isolation on native code | Wahbe et al. (1993) → NaCl (2009) → **LFI** (ASPLOS 2024, now an LLVM target); kapteko 10M Codex CLIs / 15M servers | memory and control-flow confinement checked by a small verifier; 64Ki sandboxes per address space; 22 ns runtime calls vs 129 ns for a Linux syscall and ~12 µs for gVisor | recompile; the runtime must reimplement the OS surface; Spectre |
| Language capabilities and types | **Safe Scala + TACIT (arXiv 2603.00991) + ATC + CapybaraClaw** (EPFL/VirtusLab, 2026); object capabilities (E, Joe-E, Caja, SES/Endo), Safe Haskell; Java SecurityManager (deprecated by JEP 411, which says to "use containers and hypervisors") | no ambient authority; effects only via capabilities in types; `Classified[T]` only through pure functions. TACIT: 100% security on its own benchmark | one language; no bash; any `exec`'d git/npm runs outside the guarantee; trusts the compiler, JVM and tamed libraries. TACIT issue #15 (1-bit leak, open); Caja had 25 advisories and was archived; SES has 2 CVEs |
| Restricted interpreters for agent code | smolagents LocalPythonExecutor, Pydantic Monty, Pyodide runners (mcp-run-python, langchain-sandbox), CaMeL's interpreter | the interpreter has no file, network or process primitives | language subset, no pip. smolagents CVE-2025-5120 / -9959 / CVE-2026-4963 (unpatched); mcp-run-python archived after a JS-bridge escape (CVE-2026-25905) |
| Simulated environments | Vercel just-bash (bash in TypeScript over a virtual FS); kapteko-style runtimes | the "shell" and "files" are data structures | only as complete as the simulation; a hard-link escape (GHSA-g5pf-mh4h-h655) |
| Code against typed bindings in an isolate | Cloudflare Code Mode / Dynamic Workers (`globalOutbound: null`) | bindings are the only way out | JS/TS only; V8 bugs and Spectre (straddles class 3) |
| Information-flow and dual-LLM runtimes, policy at the tool boundary | CaMeL (DeepMind), FIDES (Microsoft), OpenAPPA/APPA (arXiv 2607.24625); Cedar and Dogwood (AWS, temporal) as access-control-only baselines; Progent and others in `arxiv/` | labels (audience × trust) or capabilities on data decide which tool calls may run | 2–3× tokens; hand-written policies; monotone taint gives ~35–45% task completion without "remedies"; Dogwood's caller-supplied session IDs reset limits |

- **For agents:** the only class that can enforce "this value may go only there",
  which is the actual lethal-trifecta problem. The price is compatibility: a coding
  agent needs `git`, compilers, package managers and test runners, none of which an
  API-only world offers. Hence hybrids, such as Cloudflare Code Mode (code against
  typed bindings, inside an isolate) and TACIT used as an MCP server beside an OS
  sandbox.

---

## The mediation layer (on top of any class)

| Control | Examples | Limit | Sources |
|---|---|---|---|
| Approval prompts | every agent's ask mode | fatigue; poisoned repos get broad allow-rules approved (58% proposed → 81% completed) | `arxiv/2610.22987`, `hackernews/agents/` |
| Classifiers | Claude Code auto mode, Codex auto-review, Cursor auto-review | probabilistic ("rarely pass 95%"); auto mode deleted `$HOME` twice | `incidents/2026-08-…`, `in-process/bialy-…` |
| Rule engines at the tool boundary | Cedar, Dogwood (AgentCore Policy), AgentCore Gateway | stateless; caller-supplied session IDs; works only if every call goes through it | `in-process/`, `cloud-agent-platforms/aws-agentcore-gateway-…` |
| Egress proxies and allowlists | srt, Codex, Docker Sandboxes, Copilot firewall, every cloud | granted *by host, not by operation*: attacker-writable allowed hosts, attacker keys on allowed APIs, fronting, DNS, ECH | `egress/README.md` |
| Credential brokers | placeholder inside, real secret swapped at the proxy (Anthropic, OpenAI, Google, Azure, Vercel, Cloudflare, Fly tokenizer) | stops key theft, not data exfiltration | `egress/`, `cloud-agent-platforms/` |
| Identity- and operation-bound egress | Smokescreen per-role ACLs, Codex method/path hooks, GCP VPC-SC, Claude Code's GitHub proxy, Google ACE (no vNIC, vsock broker) | needs TLS interception or per-API proxies; rare outside clouds | `egress/`, `cloud-agent-platforms/google-agent-compute-engine.md` |

Anthropic's own verdict on its products: "The hypervisor, seccomp, and gVisor
across our products have been dependable. Our custom allowlist proxy was the
piece that failed." (`cloud-agent-platforms/anthropic-how-we-contain-claude.md`)

---

## Where our projects sit
- **fws:** OS-level process self-confinement (Seatbelt) plus APFS copy-on-write,
  packaged behind the Docker/Compose API, with the remaining holes (process
  visibility, ports, limits) patched by its runtime. Docker-2013 logic on macOS.
- **fwe:** a user-space Linux kernel (like gVisor or WSL1) that re-creates Linux's
  container primitives (namespaces, cgroups, seccomp, Landlock) on macOS.
  - Its *native* backend is technically in-process: guest code runs inside the
    `fwe` process with rewritten `svc`, `tpidr_el0` and `x18`, but with **no**
    memory confinement, hence its own "isolates as chroot does".
  - Its *VM* backend is a kernel-less VM per process (class 1).
  - Its goal of gVisor on fwe inside Seatbelt would layer classes 1, 2 and 2 again.

## Layering is the norm
Real deployments combine classes:
- gVisor (user-space kernel) on KVM;
- Kata (container in a VM);
- srt (OS-level sandbox plus egress proxy mediation);
- Docker Sandboxes (microVM plus proxy plus credential injection);
- Cloudflare (isolates, plus a process per suspicious tenant);
- TACIT (in-process types) intended to run beside OS sandboxing.

The talk's thesis can be stated as: **classes 1–2 decide what the agent can
*touch*; only class 4 (and partly 3) can decide what the agent can *tell*.**
