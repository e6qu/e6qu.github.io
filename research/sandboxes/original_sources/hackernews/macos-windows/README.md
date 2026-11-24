# Hacker News: macOS and Windows sandboxing, and why VMs dominate the desktop

Mined 2026-11-22 from the HN Algolia API. The raw, exhaustive list (533 stories with 20 or more points plus 44
low-point primary sources, grouped by subtopic, newest first) is in [index.md](index.md). The 25 most useful
threads have a note each (kind: discussion). Quotes are verbatim and short, each linked to its comment. Commenter
identities (for example "Apple engineer") are as stated in the thread and flagged where unverified.

**fws/fwe on HN:** never posted, never mentioned in any story or comment. The only e6qu repository on HN is
`e6qu/sclaude` ("Show HN: Bash sandbox script for Claude and codex CLI", 2026-09-15, 1 point, 0 comments,
https://news.ycombinator.com/item?id=49710493).

## Notes

macOS: Seatbelt and the App Sandbox
- [hn-47301085-agent-safehouse.md](hn-47301085-agent-safehouse.md): Agent Safehouse (823 pts). `sandbox-exec` for local agents; the missing overlay/CoW filesystem; deprecation debate.
- [hn-47101200-sandbox-exec-little-known-tool.md](hn-47101200-sandbox-exec-little-known-tool.md): How Seatbelt, SBPL (TinyScheme), App Sandbox and entitlements fit together; who depends on `sandbox-exec`.
- [hn-31973232-app-sandboxing-via-sandbox-exec.md](hn-31973232-app-sandboxing-via-sandbox-exec.md): 2022. What "deprecated" means; early CI/build-system use.
- [hn-42084588-macos-sandbox-escapes.md](hn-42084588-macos-sandbox-escapes.md): XPC-service sandbox escapes; the attack surface is what the sandbox can still talk to.
- [hn-16350277-sandboxed-apps-record-screen.md](hn-16350277-sandboxed-apps-record-screen.md): A sandboxed app could capture the screen; how TCC complements Seatbelt.
- [hn-3191021-mac-app-sandbox-makes-me-sad.md](hn-3191021-mac-app-sandbox-makes-me-sad.md): 2011 Mac App Store sandbox mandate; which apps cannot fit.
- [hn-10655853-leaving-the-mac-app-store.md](hn-10655853-leaving-the-mac-app-store.md): Sketch leaves the MAS (884 pts); sandboxing as an adoption barrier.

macOS: containers, VMs, density
- [hn-37655477-macos-containers-v0-0-1.md](hn-37655477-macos-containers-v0-0-1.md): Native Darwin "containers" by chroot, which needs SIP off; no namespaces in XNU.
- [hn-44229348-apple-containerization.md](hn-44229348-apple-containerization.md): Apple Containerization (WWDC 2025). One microVM per container, sub-second start, memory not returned.
- [hn-48469658-macos-container-machines.md](hn-48469658-macos-container-machines.md): Container machines (1269 pts). OrbStack's dynamic memory; "why not WSL1?"; "Darwin jails".
- [hn-47733971-beating-2-vm-limit.md](hn-47733971-beating-2-vm-limit.md): The licence's two-macOS-guest limit and Mac mini farms.
- [hn-41421846-orbstack.md](hn-41421846-orbstack.md): OrbStack's shared-VM security model; why Mac VMs never give memory back.
- [hn-28369570-docker-desktop-no-longer-free.md](hn-28369570-docker-desktop-no-longer-free.md): Docker Desktop licensing (2021) and what Docker Desktop really is: a VM plus glue.
- [hn-34098367-docker-on-macos-slow.md](hn-34098367-docker-on-macos-slow.md): Bind-mount I/O across the VM boundary; VirtioFS numbers.
- [hn-18765184-noah-linux-on-macos.md](hn-18765184-noah-linux-on-macos.md): Noah, Linux ELF on macOS through Hypervisor.framework syscall trapping (fwe prior art).

Coding agents on the desktop
- [hn-47218288-cowork-10gb-vm-bundle.md](hn-47218288-cowork-10gb-vm-bundle.md): Claude Cowork's VM. An Anthropic engineer explains why they chose a VM over Seatbelt.
- [hn-48479452-claude-desktop-hyper-v-vm.md](hn-48479452-claude-desktop-hyper-v-vm.md): The same design on Windows (Hyper-V/HCS); users notice the gigabytes.
- [hn-50016489-mxc.md](hn-50016489-mxc.md): Microsoft Execution Containers. AppContainer/bubblewrap/Seatbelt behind one policy; "still sharing the host kernel".
- [hn-45959795-windows-11-agent-workspace.md](hn-45959795-windows-11-agent-workspace.md): Windows agent workspace, which isolates agents by account and session rather than VM.

Windows
- [hn-18713436-windows-sandbox.md](hn-18713436-windows-sandbox.md): Windows Sandbox (2018), a Hyper-V disposable VM; MSIX as the app-level alternative.
- [hn-36059982-win32-app-isolation.md](hn-36059982-win32-app-isolation.md): Win32 App Isolation, AppContainer for classic apps, and the packaging friction.
- [hn-25154300-wsl-lost-potential.md](hn-25154300-wsl-lost-potential.md): The WSL1 post-mortem: dentry cache/NTFS, feature treadmill, a WSL PM's reply.
- [hn-44031385-wsl-open-source.md](hn-44031385-wsl-open-source.md): WSL open-sourced (1613 pts); WSL1 vs WSL2 in daily use (9P, >100x `git status`, memory).
- [hn-23241040-wsl2-lightweight-vm-pm.md](hn-23241040-wsl2-lightweight-vm-pm.md): A Microsoft PM on WSL2's utility VM: sparse, <2 s boot, distros as containers on one kernel.

Analogies
- [hn-47113527-linuxulator.md](hn-47113527-linuxulator.md): FreeBSD's in-kernel Linux ABI, best used inside a jail.

## Synthesis

On HN, desktop sandboxing splits into two camps that rarely meet. One camp wants **native, VM-free
confinement**. On macOS that means Seatbelt via `sandbox-exec`, which has been "deprecated" for a decade but is
load-bearing for Chrome, Homebrew, Bazel, Nix, Claude Code and Codex. Agent Safehouse (823 points) shows the
demand. Practitioners also say exactly what Seatbelt lacks: filesystem namespacing (writes that are allowed but
discarded), overlay or bind mounts, PID and network views, domain-level egress control, and stable,
documented profiles. Escapes come through reachable XPC services rather than the policy engine. On Windows the
native primitive is richer (AppContainer, job objects), but it was tied to MSIX packaging until MXC and the
non-admin AppContainer support that arrived in 2026.

The other camp, which includes nearly every vendor, **ships a VM**. Docker Desktop, OrbStack, Colima, Lima,
Podman machine, Apple `container`, WSL2, Windows Sandbox and Claude Cowork are all hypervisor-backed. Anthropic's
stated reason is "hard guarantees at the boundary". Users pay for it in gigabytes of disk, RAM that macOS VMs
never return (OrbStack's developer calls this the root problem and is alone in fixing it), I/O across the VM
boundary, and, for macOS guests, a licence cap of two VMs per Mac. That cap is why "Darwin jails" come up again
and again.

WSL is the natural experiment. WSL1's pico-process syscall layer was loved for sharing files, processes and
memory with Windows. Per its critics and its PMs, it lost on NTFS/dentry-cache semantics and the Linux feature
treadmill, and WSL2's VM won on compatibility. HN commenters keep asking why macOS has no WSL1. The usual answer
is that Linux's ABI is small and stable, so it is feasible, but nobody has shipped it beyond Noah. That is the gap
fwe (WSL1-style Linux ABI) and fws (Seatbelt + APFS clones behind Docker APIs) aim at. Neither has been posted to
HN.

## Best quotes for slides

1. "Hard guarantees at the boundary: Other sandboxing solutions exist, but for a few reasons, none of them satisfy as much and allow us to make similarly sound guarantees about what Claude will be able to do and not to." (felixrieseberg, Anthropic, on why Cowork runs in a VM, https://news.ycombinator.com/item?id=47220118)
2. "The main issue I want to solve is unexpected writes to arbitrary paths should be allowed but ultimately discarded. macOS simply doesn't offer a way to namespace the filesystem in that way." (xyzzy_plugh, https://news.ycombinator.com/item?id=47302477)
3. "Still deprecated. Still in use by everyone." (selridge, on `sandbox-exec`, https://news.ycombinator.com/item?id=47102070)
4. "The root of the problem is that VM memory is allocated on demand, but never freed after it's used for the first time. In other words, once used, it can never be released." (kdrag0n, OrbStack developer, https://news.ycombinator.com/item?id=34720219)
5. "Imagine buying a mac studio with 500+ GB of memory and being limited to 2 vms." (moondev, https://news.ycombinator.com/item?id=47734844)
6. "Still scared that people will filling whole rooms of Mac Minis if you allow them to have multiple macOS containers and not only up to two fat VMs per machine?" (qalmakka, https://news.ycombinator.com/item?id=48472006)
7. "The bottom line is WSLv1 design SUCKED precisely because it tried to cross-breed 2 extremely complex semantically incompatible systems." (ralph87, https://news.ycombinator.com/item?id=25154556)
8. "Linux is one of the few OSes where this kind of approach really makes sense, since it's open source and has a small, very well-defined, stable ABI that you can implement and everything should \"just work\"." (saagarjha, on WSL1-style layers, https://news.ycombinator.com/item?id=25159862)
