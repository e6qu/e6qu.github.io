# macOS and Windows: sandboxes, VMs, and lighter-than-VM options

Sources accessed 2026-11-22. One file per original source; `macos-*` and `windows-*` prefixes.

## Index — macOS

- [macos-sandbox-exec-man-pages.md](macos-sandbox-exec-man-pages.md): sandbox-exec(1), sandbox_init(3) and sandbox(7), all marked DEPRECATED, plus our local measurements of Seatbelt start-up cost, memory and visibility.
- [macos-blazakis-apple-sandbox-2011.md](macos-blazakis-apple-sandbox-2011.md): Blazakis, "The Apple Sandbox" (Black Hat DC 2011). Seatbelt is a TrustedBSD MAC policy module with SBPL compiled through TinyScheme.
- [macos-watson-decade-access-control-2013.md](macos-watson-decade-access-control-2013.md): Watson, CACM 2013. Traces the lineage from the TrustedBSD MAC Framework to the Leopard sandbox (Oct 2007), iOS and Mountain Lion's mandatory sandboxing.
- [macos-chromium-osx-sandboxing-design.md](macos-chromium-osx-sandboxing-design.md): Chromium's original macOS design built on `sandbox_init`, including the stated gaps (no limits on memory or threads).
- [macos-chromium-sandbox-mac-readme.md](macos-chromium-sandbox-mac-readme.md): Chromium's current Seatbelt design, which compiles a profile in the parent and applies it in the child per process type.
- [macos-news-sandboxing-mac-app-store-2011.md](macos-news-sandboxing-mac-app-store-2011.md): Apple, 2011-11-02. Mac App Store apps must be sandboxed from 2012-03-01.
- [macos-news-sandboxing-deadline-extended-2012.md](macos-news-sandboxing-deadline-extended-2012.md): Apple, 2012-02-21. The deadline moved to 2012-06-01.
- [macos-app-sandbox-docs.md](macos-app-sandbox-docs.md): App Sandbox reference. Confinement is driven by entitlements and is mandatory for the Mac App Store.
- [macos-protecting-user-data-app-sandbox.md](macos-protecting-user-data-app-sandbox.md): App Sandbox's forbidden operations, the per-app container directory, and helper tools inheriting the sandbox.
- [macos-hardened-runtime-docs.md](macos-hardened-runtime-docs.md): Hardened Runtime, which protects integrity (anti-injection) rather than confining the process.
- [macos-tcc-controlling-app-access-to-files.md](macos-tcc-controlling-app-access-to-files.md): TCC, the user-consent layer for files (macOS 10.15+).
- [macos-hypervisor-framework-docs.md](macos-hypervisor-framework-docs.md): Hypervisor.framework (10.10, 2014). A VM is a process and a vCPU is a thread.
- [macos-virtualization-framework-docs.md](macos-virtualization-framework-docs.md): Virtualization.framework (11.0, 2020), with virtio devices and a cooperative memory balloon.
- [macos-sla-virtualization-two-instances.md](macos-sla-virtualization-two-instances.md): the macOS licence allows at most two macOS VMs per Mac.
- [macos-apple-containerization-readme.md](macos-apple-containerization-readme.md): Apple's Containerization package. One lightweight VM per container, sub-second start, vminitd.
- [macos-apple-container-technical-overview.md](macos-apple-container-technical-overview.md): `container` architecture. Pages freed in a guest are not returned to macOS.
- [macos-apple-container-resource-usage.md](macos-apple-container-resource-usage.md): defaults of 1 GiB and 4 vCPUs per container VM, with overcommit allowed.
- [macos-wwdc25-meet-containerization.md](macos-wwdc25-meet-containerization.md): WWDC25 session 346, with a shell in "a few hundred milliseconds".
- [macos-wwdc26-container-machines.md](macos-wwdc26-container-machines.md): WWDC26 session 389 on persistent container machines, which are WSL-like.
- [macos-apple-container-machine-doc.md](macos-apple-container-machine-doc.md): Apple's warning that container machines give up most of their isolation ($HOME read-write, ssh-agent forwarded, all capabilities).
- [macos-orbstack-architecture.md](macos-orbstack-architecture.md): OrbStack runs one shared Linux VM, and its "machines" are containers on one kernel.
- [macos-orbstack-isolated-machines.md](macos-orbstack-isolated-machines.md): isolated machines drop the integrations but "aren't a full security boundary".
- [macos-orbstack-efficiency.md](macos-orbstack-efficiency.md): OrbStack claims about 0.1% idle CPU, on-demand memory that is returned to macOS, and "dozens of machines".
- [macos-lima-readme.md](macos-lima-readme.md): Lima runs one Linux VM per instance. Its v2.0 (2025-11-06) markets it as an AI-agent sandbox.
- [macos-lima-ai-agents-inside.md](macos-lima-ai-agents-inside.md): Lima's guidance on running agents inside a VM. The default template mounts `~` read-only.
- [macos-colima-readme.md](macos-colima-readme.md): Colima, which runs Docker, containerd or Incus in a VM managed by Lima.
- [macos-docker-desktop-vmm.md](macos-docker-desktop-vmm.md): Docker Desktop puts all containers in one Linux VM and lets you choose the VMM (Docker VMM, VZ or HyperKit).
- [macos-docker-sandboxes-launch-2026.md](macos-docker-sandboxes-launch-2026.md): Docker Sandboxes (2026-01-30) give each coding agent its own microVM on macOS and Windows.
- [macos-docker-sandboxes-microvms-2026.md](macos-docker-sandboxes-microvms-2026.md): Docker's custom VMM runs on HVF, WHP and KVM, with a private daemon and an egress proxy for each sandbox.
- [macos-tart-readme.md](macos-tart-readme.md): Tart runs macOS and Linux VMs on VZ for CI. Nested virtualization only works for Linux guests on M3/M4.
- [macos-utm-readme.md](macos-utm-readme.md): UTM is a QEMU/HVF/VZ desktop VM host and represents the full-VM end of the range.
- [macos-endpoint-security-docs.md](macos-endpoint-security-docs.md): Endpoint Security (10.15) provides system-wide AUTH and NOTIFY event hooks.
- [macos-network-extension-content-filter.md](macos-network-extension-content-filter.md): NE content filters can attribute each flow to the process that opened it, which allows per-process egress policy.
- [macos-darwin-containers-rund.md](macos-darwin-containers-rund.md): "Native" Darwin containers are chroot, host networking and process groups only. Darwin has no namespaces or cgroups.

## Index — Windows

- [windows-appcontainer-isolation.md](windows-appcontainer-isolation.md): AppContainer, a capability-based token sandbox (called LowBox before Windows 8).
- [windows-mandatory-integrity-control.md](windows-mandatory-integrity-control.md): integrity levels and no-write-up (Vista).
- [windows-job-objects.md](windows-job-objects.md): Job objects set limits on CPU, memory and process count and can kill a whole process tree. They are the closest Windows equivalent of cgroups.
- [windows-chromium-sandbox-design.md](windows-chromium-sandbox-design.md): Chromium on Windows combines a restricted token, a job, an alternate desktop, Untrusted integrity and AppContainer.
- [windows-win32-app-isolation-preview.md](windows-win32-app-isolation-preview.md): Win32 app isolation public preview (2023-06-14).
- [windows-msix-behind-the-scenes.md](windows-msix-behind-the-scenes.md): how packaged (MSIX) desktop apps are containerized, with filesystem and registry virtualization.
- [windows-sandbox-2018-blog.md](windows-sandbox-2018-blog.md): Windows Sandbox announcement (2018-12-18). Dynamic base image, shared code pages, about 100 MB on disk.
- [windows-sandbox-docs.md](windows-sandbox-docs.md): current Windows Sandbox docs, which allow only one instance at a time.
- [windows-container-isolation-modes.md](windows-container-isolation-modes.md): Windows containers can use process isolation (a shared kernel) or Hyper-V isolation.
- [windows-forshaw-who-contains-the-containers.md](windows-forshaw-who-contains-the-containers.md): Forshaw/Project Zero (2021) on server silos, four escapes, and why process isolation is not a security boundary.
- [windows-wsl1-pico-process-overview.md](windows-wsl1-pico-process-overview.md): WSL1 pico processes (2016), aimed at "greater density" than VMs.
- [windows-wsl2-announcement.md](windows-wsl2-announcement.md): WSL 2 (2019-05-06) moves to a lightweight utility VM running a real Linux kernel.
- [windows-wsl-compare-versions.md](windows-wsl-compare-versions.md): Comparison of WSL1 and WSL2. Under WSL2, distros run as containers inside one managed VM.
- [windows-securing-ai-agents-2025-blog.md](windows-securing-ai-agents-2025-blog.md): Microsoft (2025-10-16) on agent accounts and the agent workspace.
- [windows-experimental-agentic-features.md](windows-experimental-agentic-features.md): Agent workspace docs. Each agent gets a separate account and session, described as "more efficient than a full VM".
- [windows-platform-security-ai-agents-build-2026.md](windows-platform-security-ai-agents-build-2026.md): Build 2026 (2026-06-02) on Windows platform security for agents, including the MXC preview.
- [windows-mxc-repo.md](windows-mxc-repo.md): Microsoft Execution Containers SDK. Its default backend is an AppContainer process container with WFP egress filters; it uses Seatbelt on macOS and bubblewrap on Linux.
- [windows-mxc-learn-architecture.md](windows-mxc-learn-architecture.md): MXC containment models, from a process container up to session, WSL and VM backends.
- [windows-mxc-ga-blog-2026-10.md](windows-mxc-ga-blog-2026-10.md): MXC general availability (2026-10-07).
- [windows-codex-windows-sandbox-docs.md](windows-codex-windows-sandbox-docs.md): Codex's Windows sandbox modes (MXC, restricted token, sandbox users).
- [windows-codex-mxc-sandbox-readme.md](windows-codex-mxc-sandbox-readme.md): Codex's native MXC sandbox crate.

## Synthesis: lighter than a VM per agent

**macOS.** Darwin has no namespaces and no cgroups. A "native container" amounts to chroot plus a
process group with host networking (rund). That leaves two kinds of isolation:

1. **Seatbelt (SBPL via `sandbox-exec`/`sandbox_init`).** This is TrustedBSD-MAC policy applied per
   process (Leopard, 2007). It is officially deprecated but still used by Chromium and by agent tools.
   - *Filesystem:* strong, with fine-grained path rules.
   - *Network:* coarse. It can deny all traffic or allow only localhost. Per-domain policy needs a local
     proxy, or an entitled Network Extension filter that attributes flows to processes.
   - *Process visibility:* none. In our test a sandboxed process saw the same host process list.
   - *Resource limits:* none (Chromium's doc says so).
   - *Cost:* about 7 ms to start and about 1.2 MB RSS per trivial process in our measurement, so
     hundreds of agents per Mac are realistic.
   - It is also the only route to many *macOS-native* agents, because the licence caps macOS guests at
     two VMs.
2. **Hypervisor-based options.**
   - *One shared Linux VM* (OrbStack, Docker Desktop, Colima/Lima). This gives one VM-strength boundary
     between macOS and all agents, but agents share a Linux kernel. OrbStack says its isolated machines
     "aren't a full security boundary".
   - *A microVM per agent* (Apple `container`, Docker Sandboxes). Starts in "a few hundred
     milliseconds" with a default of 1 GiB per VM. Freed guest memory is not returned to macOS, so N
     agents cost roughly the sum of their peaks.
   - OrbStack's shared VM, by contrast, returns memory on demand and claims "dozens of machines".

**Windows.** Process-level options are richer than on macOS, because Windows has an access-check model
on every kernel object.
- *Confinement:* AppContainer, Low/Untrusted integrity levels and restricted tokens. Chromium combines
  them with a job object and an alternate desktop, which costs about 4 MB.
- *Resource limits:* job objects (a cgroup analogue).
- *Network:* per-AppContainer WFP filters.
- *Gaps:* objects without ACLs, and the attack surface of the shared kernel.
- *Server silos* (process-isolated containers) add namespace-like separation of the object manager and
  registry. Microsoft does not treat them as a security boundary, and Forshaw found escapes. Hyper-V
  isolation is the supported boundary.
- *Windows Sandbox* is light for a VM (dynamic base image, shared code pages, about 100 MB on disk) but
  runs one instance at a time, so it cannot provide density.

**New in 2025–26:** agent-specific, VM-less containment.
- Microsoft's agent workspace gives each agent its own account and session, described as "more
  efficient than a full VM". Agents can still read anything readable by all authenticated users.
- **MXC** (GA 2026-10-07) packages AppContainer, WFP egress, a proxy and a kill-on-close job as an SDK.
  Codex now uses it. The same SDK uses Seatbelt on macOS, which is the clearest sign that the industry's
  cross-platform "lighter option" is OS-native process sandboxing, with VMs as an opt-in upgrade.
- Docker went the other way, with a custom microVM per agent on HVF/WHP. It publishes no density numbers.

**Density estimate (ours).**
- Process sandboxes cost about the agent's own RSS, so in practice the limit is CPU and the LLM API,
  not isolation overhead.
- A microVM per agent at 1 GiB costs roughly 50–60 agents per 64 GB Mac before swapping.
- A shared VM is somewhere in between, at one VM's overhead plus container cost per agent.
- No vendor publishes measured per-sandbox memory figures for MXC, the agent workspace, Docker
  Sandboxes or Apple `container`.
