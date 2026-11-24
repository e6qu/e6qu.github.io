# Hacker News — sandboxing history and OS isolation primitives

What Hacker News said, 2008–2026, about chroot, jails, zones, capability
systems, NaCl, Linux namespaces, cgroups, seccomp, Landlock, pledge, LSMs,
sandbox tools, Docker and its escapes, and io_uring. Collected 2026-11-22
through the HN Algolia API. The full list of 1,048 stories is in
[index.md](index.md); the 22 notes below cover the most significant
threads. Each note is `kind: discussion`, with 5–7 comment excerpts and
permalinks. Quotes from people who built the systems are marked with
their role.

## Notes

Origins and the 2013–2014 Docker debate
- [hn-5408002-docker-launch-2013.md](hn-5408002-docker-launch-2013.md) — Docker's first HN thread (2013-03-20, 273 points): Hykes on day one says don't run untrusted root code in containers; dotCloud ran vserver → OpenVZ (2009) → LXC.
- [hn-6252182-containers-docker-how-secure-2013.md](hn-6252182-containers-docker-how-secure-2013.md) — first "are containers a security boundary?" argument (2013): Petazzoni asks for an LXC exploit; mjg59, justincormack, Cantrill reply.
- [hn-7909622-docker-shocker-breakout-2014.md](hn-7909622-docker-shocker-breakout-2014.md) — the first public Docker escape (shocker.c, `CAP_DAC_READ_SEARCH`, 2014); Hykes: Docker is not yet a sandbox for uid 0.
- [hn-8682525-coreos-rocket-2014.md](hn-8682525-coreos-rocket-2014.md) — CoreOS Rocket (902 points): no root daemon; Hykes' lineage lxc → Docker → rkt; Varda on why real isolation breaks compatibility.

Shared-kernel isolation: designed vs. assembled
- [hn-9257130-joyent-triton-lx-zones-2015.md](hn-9257130-joyent-triton-lx-zones-2015.md) — Triton/LX zones; Cantrill's record on zones vs. Linux namespaces and OpenVZ.
- [hn-13982620-containers-zones-jails-vms.md](hn-13982620-containers-zones-jails-vms.md) — Frazelle's post (714 points): jail/zone = one ID in the process table; Linux container = assembled parts.
- [hn-29649066-freebsd-jails.md](hn-29649066-freebsd-jails.md) — jails thread with Kamp (2014, 2026) and Percival (2008) on the record; Ptacek: as safe as modern Docker, same shared kernel.
- [hn-20969459-is-chroot-a-security-feature.md](hn-20969459-is-chroot-a-security-feature.md) — runc maintainer's working chroot escape (2019), `pivot_root`, Kamp's one-liner, fds as capabilities.
- [hn-36414493-linux-namespaces-poor-mans-plan9.md](hn-36414493-linux-namespaces-poor-mans-plan9.md) — Plan 9 lineage of namespaces; why Linux needs one namespace type per resource.

Escapes and the "not a security boundary" verdict
- [hn-16030107-docker-escape-waitid.md](hn-16030107-docker-escape-waitid.md) — `waitid()` CVE-2017-5123: no hardening layer helps when the bug is in a core syscall.
- [hn-13398249-docker-0day-stopped-by-selinux.md](hn-13398249-docker-0day-stopped-by-selinux.md) — runc CVE-2016-9962, Red Hat vs. Docker over how far SELinux mitigated it; why admins turn SELinux off.
- [hn-19135701-runc-cve-2019-5736.md](hn-19135701-runc-cve-2019-5736.md) — runc host-binary overwrite; Sarai (runc) calls running without user namespaces "negligence".
- [hn-30556188-cgroups-cve-2022-0492.md](hn-30556188-cgroups-cve-2022-0492.md) — cgroup v1 `release_agent` escape; Ptacek on the "fabled security powers" of zones and jails.
- [hn-27480496-containers-are-tents.md](hn-27480496-containers-are-tents.md) — "containers are tents"; Ptacek's shared-kernel position collected 2021–2026.

Kernel primitives
- [hn-21812641-unprivileged-user-namespaces.md](hn-21812641-unprivileged-user-namespaces.md) — user namespaces as sandbox enabler and top privesc path; Ubuntu's AppArmor gate and its 2025 bypasses.
- [hn-38000824-server-side-sandboxing-seccomp.md](hn-38000824-server-side-sandboxing-seccomp.md) — Figma's nsjail + seccomp; Unangst on why tracing syscalls is not enough.
- [hn-30605356-io-uring-exploit.md](hn-30605356-io-uring-exploit.md) — io_uring LPE write-up, Google's kCTF data, and how io_uring sidesteps seccomp.
- [hn-43445662-landrun-landlock.md](hn-43445662-landrun-landlock.md) — Landlock via landrun (518 points); Salaün (Landlock author) on seccomp vs. Landlock vs. pledge; xz's sabotaged Landlock check.
- [hn-32096801-porting-pledge-to-linux.md](hn-32096801-porting-pledge-to-linux.md) — Tunney's pledge on seccomp; Noack (Landlock) on why pledge ports stall; the 2015 tame() thread.

Capabilities, SFI and app sandboxes
- [hn-43452185-sel4-introduction.md](hn-43452185-sel4-introduction.md) — seL4's proof and a specification bug; microkernels vs. namespaces; Norm Hardy on KeyKOS; Varda's capability history.
- [hn-14448404-goodbye-pnacl-hello-webassembly.md](hn-14448404-goodbye-pnacl-hello-webassembly.md) — NaCl from launch (2008, Ptacek explains the verifier) to PNaCl's removal (2017) and WebAssembly.
- [hn-18180017-flatpak-security-nightmare.md](hn-18180017-flatpak-security-nightmare.md) — flatkill.org: "sandboxed" apps with home-directory write access; portals as the capability answer.

## Synthesis

HN never believed Linux containers were a sandbox for hostile code, and
the people who built them said so first. On launch day in 2013 Hykes
advised against untrusted root in a container; after the first public
escape in 2014 he wrote that Docker did not claim to contain untrusted
uid 0. Petazzoni's 2013 challenge to find an LXC exploit was answered
within ten months. From 2014 to 2019 each escape (shocker, `waitid`,
runc 2016 and 2019, the 2022 cgroup `release_agent`) replayed the same
three positions: "it's a Linux bug, not a Docker bug", "user namespaces,
MAC and seccomp would have stopped it", and "a shared kernel cannot be a
tenant boundary".

A second debate ran alongside: designed primitives versus assembled ones.
Cantrill, Kamp and FreeBSD users argued that zones and jails, built as
security features with a single ID in the process table, were sound
where Linux namespaces were immature. By 2021–22 Ptacek's reply had
become the consensus: jails and zones are cleaner, but co-tenants still
share a kernel, and the industry moved multitenant work to cheap
virtualization (gVisor, Firecracker, Kata). "Container image, VM
boundary" is the settled position.

Sentiment on self-sandboxing primitives moved the other way, from
admiration to adoption. pledge (2015) was loved and hard to port, seccomp
was called "almost unusable" for tight policies, and SELinux was
routinely turned off. Landlock (2021) slowly became Linux's answer,
though its API was still called "hard" in 2025. New kernel surface
undercut the syscall-filter model: io_uring bypasses seccomp, and
unprivileged user namespaces became both the enabler of rootless
sandboxes and, by 2026, "the single most significant privesc path",
which led Ubuntu to gate them. The 2026 run of kernel LPEs (Dirty Frag,
Copy Fail) brought back the 2013 conclusion.

Where these threads correct or extend our notes:
- chroot: the 2002 escape still works in its fd form, per the runc maintainer in 2019 ([hn-20969459](hn-20969459-is-chroot-a-security-feature.md)).
- seL4: a memory-corruption bug was in the verified specification, so "bug-free" should be qualified ([hn-43452185](hn-43452185-sel4-introduction.md)).
- LXC: Petazzoni says LXC was largely the OpenVZ team's work; our note credits IBM's Lezcano (unverified claim, [hn-5408002](hn-5408002-docker-launch-2013.md)).
- Capsicum: per an OpenBSD developer, the Capsicum Chromium port was never committed to FreeBSD ports (<https://news.ycombinator.com/item?id=47314165>).
- Ubuntu userns: bypasses of the 2023 restriction were published in 2025 ([hn-21812641](hn-21812641-unprivileged-user-namespaces.md)).

## Best quotes for slides

1. "Yes, you probably don't want to run untrusted code with root privileges inside a container if anything valuable is running on the same host." — Solomon Hykes, Docker launch day, 2013 — <https://news.ycombinator.com/item?id=5408930>
2. "By the way, if anyone knows of a documented exploit for LXC, I would love to hear about it." — Jérôme Petazzoni (dotCloud), Aug 2013, ten months before shocker — <https://news.ycombinator.com/item?id=6252327>
3. "Please remember that at this time, we don't claim Docker out-of-the-box is suitable for containing untrusted programs with root privileges." — Hykes, June 2014 — <https://news.ycombinator.com/item?id=7910117>
4. "How can this even be a question 20 years after FreeBSD Jails ?" — Poul-Henning Kamp (author of jails), 2019 — <https://news.ycombinator.com/item?id=20969584>
5. "if by containers you mean Linux namespaces, then yes, a "lot less solid" is probably phrasing it generously." — Bryan Cantrill (Joyent CTO), 2015 — <https://news.ycombinator.com/item?id=9568692>
6. "The win of virtualization is that the machinery required to hypervise a kernel is much, much smaller than the kernel itself; to use the 70s terminology, it's a minimized trusted computing base." — Thomas Ptacek, 2021 — <https://news.ycombinator.com/item?id=27485272>
7. "Microkernels are about building interfaces which sandbox parts of the kernel. Namespaces are about giving sandboxed userlands full access to kernel interfaces." — bri3d, 2025 — <https://news.ycombinator.com/item?id=43453778>
8. "Seccomp limits the kernel attack surface and Landlock enforces an access control. They are complementary." — Mickaël Salaün (Landlock author), 2025 — <https://news.ycombinator.com/item?id=43473546>

Runners-up: Sarai (runc), "not using user namespaces… is basically
negligence at this point" (<https://news.ycombinator.com/item?id=19140829>);
Ptacek, "io_uring blows that boundary apart"
(<https://news.ycombinator.com/item?id=41815755>); staticassertion, "user
namespaces are basically the single most significant privesc path in the
kernel, maybe io-uring is second"
(<https://news.ycombinator.com/item?id=48061463>).
