# OS primitives — index

Linux namespaces, cgroups, seccomp, Landlock, capabilities and LSMs; the container stack built on them
(LXC, Docker, OCI/runc, rootless); Linux sandbox tools (bubblewrap, Firejail, nsjail, minijail, Chromium,
systemd); FreeBSD Capsicum; OpenBSD pledge/unveil; and data on the shared-kernel attack surface.

## Sources

Namespaces
- [namespaces-7-man-page.md](namespaces-7-man-page.md) — namespaces(7): the eight namespace types, flags, `/proc/pid/ns` versions; also time_namespaces(7).
- [lwn-namespaces-in-operation-part1.md](lwn-namespaces-in-operation-part1.md) — Kerrisk, LWN 2013: kernel version history of each namespace (mount 2.4.19/2002 → user 3.8).
- [lwn-namespaces-in-operation-part5-user-namespaces.md](lwn-namespaces-in-operation-part5-user-namespaces.md) — Kerrisk, LWN 2013: unprivileged user namespaces in 3.8.

cgroups
- [lwn-process-containers-2007.md](lwn-process-containers-2007.md) — LWN 2007: Google's "process containers" patches (Seth, Menage), renamed cgroups, merged 2.6.24.
- [kernel-doc-cgroups-v1.md](kernel-doc-cgroups-v1.md) — Paul Menage's cgroup v1 kernel doc, derived from cpusets.
- [kernel-doc-cgroup-v2.md](kernel-doc-cgroup-v2.md) — Tejun Heo's cgroup v2 doc: unified hierarchy, delegation; stable in 4.5 (2016).

seccomp
- [lwn-seccomp-overview-2015.md](lwn-seccomp-overview-2015.md) — LWN 2015: seccomp history (2.6.12/2005 strict, 3.5/2012 filter, 3.17/2014 syscall); Cpushare origin.
- [lwn-seccomp-bpf-2012.md](lwn-seccomp-bpf-2012.md) — LWN 2012: Will Drewry's BPF-based seccomp after earlier designs failed.
- [kernel-doc-seccomp-filter.md](kernel-doc-seccomp-filter.md) — kernel docs: return actions, no_new_privs, "isn't a sandbox".
- [seccomp-unotify-2-man-page.md](seccomp-unotify-2-man-page.md) — user-space notification (Linux 5.0, 2019) and its TOCTOU caveat.

Landlock, capabilities, MAC
- [landlock-7-man-page.md](landlock-7-man-page.md) — landlock(7): ABI 1 (5.13, 2021) through ABI 9 (7.1), plus ABIs 10–12 from kernel docs.
- [lwn-landlock-finally-sets-sail.md](lwn-landlock-finally-sets-sail.md) — LWN 2021: 34 revisions over 5+ years; BPF design dropped.
- [capabilities-7-man-page.md](capabilities-7-man-page.md) — capabilities(7): root split into 41 bits since 2.2; CAP_SYS_ADMIN "the new root".
- [lsm-usenix-2002-paper.md](lsm-usenix-2002-paper.md) — LSM paper (USENIX Security 2002) + SELinux (NSA, Dec 2000) and AppArmor (2.6.36, 2010).

Containers
- [lxc-introduction.md](lxc-introduction.md) — LXC (2008): first mainline-kernel container toolset.
- [docker-pycon-2013-lightning-talk.md](docker-pycon-2013-lightning-talk.md) — Hykes' PyCon lightning talk (2013-03-15) and Docker v0.1.0 README.
- [docker-0.9-libcontainer.md](docker-0.9-libcontainer.md) — Docker 0.9 (2014-03-10) drops LXC for libcontainer.
- [oci-runtime-spec.md](oci-runtime-spec.md) — OCI (2015-06-22) runtime spec v1.0.0 (2017-07-19); runc donated.
- [runc-cve-2019-5736.md](runc-cve-2019-5736.md) — runc host-binary overwrite escape (Feb 2019).
- [rootless-containers.md](rootless-containers.md) — rootless containers via user namespaces.
- [ubuntu-restricted-unprivileged-userns-2023.md](ubuntu-restricted-unprivileged-userns-2023.md) — Ubuntu 23.10/24.04 gate unprivileged user namespaces; 44% exploit stat.

Sandbox tools
- [bubblewrap-readme.md](bubblewrap-readme.md) — bubblewrap: unprivileged namespace-jail builder behind Flatpak.
- [firejail-readme.md](firejail-readme.md) — Firejail: setuid sandbox with 900+ app profiles.
- [nsjail-readme.md](nsjail-readme.md) — Google nsjail: namespaces + cgroups + rlimits + seccomp (Kafel).
- [minijail.md](minijail.md) — minijail: ChromeOS/Android service sandboxing.
- [chromium-linux-sandboxing-doc.md](chromium-linux-sandboxing-doc.md) — Chromium's two-layer Linux sandbox (semantics vs attack-surface reduction).
- [chromium-blog-seccomp-bpf-2012.md](chromium-blog-seccomp-bpf-2012.md) — Chrome ships seccomp-bpf renderer sandbox (2012-11-19).
- [systemd-exec-sandboxing.md](systemd-exec-sandboxing.md) — systemd.exec sandboxing directives with version history.

BSD
- [capsicum-usenix-2010.md](capsicum-usenix-2010.md) — Capsicum paper (USENIX Security 2010): capability mode; Chromium sandbox LoC comparison.
- [openbsd-pledge-hackfest-2015-slides.md](openbsd-pledge-hackfest-2015-slides.md) — Theo de Raadt's pledge slides (Nov 2015).
- [openbsd-pledge-2-man-page.md](openbsd-pledge-2-man-page.md) — pledge(2), OpenBSD 5.9 (2016).
- [openbsd-unveil-2-man-page.md](openbsd-unveil-2-man-page.md) — unveil(2), OpenBSD 6.4 (2018).

Shared-kernel attack surface
- [google-kctf-42-kernel-exploits-2023.md](google-kctf-42-kernel-exploits-2023.md) — Google kCTF 2023: 60% of kernel exploit submissions via io_uring.
- [linux-syscall-table-x86-64.md](linux-syscall-table-x86-64.md) — our count of x86-64 syscalls: ~251 (2005) → 298 (2012) → 370 (2026).

## Synthesis

Linux never got a "sandbox" syscall. Instead it accreted orthogonal primitives over two decades, and
every container or sandbox is a recipe combining them. Namespaces (mount, 2002 → user, 2013 → time, 2020)
control what a process can *name*; cgroups (Google's "process containers", 2008; v2 in 2016) control how
much it can *consume*; capabilities and LSMs (SELinux 2000/2003, AppArmor 2010) constrain privilege by
administrator policy; seccomp (2005, usable with BPF from 2012) limits which kernel entry points are
reachable; Landlock (2021, TCP rules only from 2024) finally lets an unprivileged program restrict its own
filesystem and network access. LXC (2008) and then Docker (2013) packaged these into a product, and OCI
(2015/2017) froze the interface.

The recurring lesson is the shared kernel. A container is a set of processes on the host kernel, so its
strength is bounded by (a) privileged host helpers — runc CVE-2019-5736 needed no kernel bug — and (b)
the kernel surface it can reach: ~370 syscalls on x86-64, with subsystems like io_uring behind 60% of
Google's 2022–23 kernel-exploit submissions and unprivileged user namespaces in 44% of exploits Google saw.
Chromium's design names the answer: one layer for semantics (namespaces), one for attack-surface reduction
(seccomp-bpf). The BSDs chose cleaner models — Capsicum's capability mode (2010) and OpenBSD's
programmer-authored pledge/unveil (2016/2018) — which map almost directly onto what a coding agent needs.

### Timeline
- 2000-12-22 — NSA announces SELinux on LKML
- 2002 — Linux 2.4.19: mount namespaces; LSM paper at USENIX Security (Aug)
- 2005 — Linux 2.6.12: seccomp mode 1 (Arcangeli, Cpushare)
- 2006 — Linux 2.6.19: UTS and IPC namespaces
- 2008-01 — Linux 2.6.24: cgroups and PID namespaces; file capabilities
- 2008 — LXC userspace tools (0.3/0.4 by Oct 2008)
- 2010-08 — Capsicum paper; 2010-10 — AppArmor in 2.6.36
- 2012 — Linux 3.5: seccomp-bpf; 2012-01 Capsicum in FreeBSD 9.0; 2012-11-19 Chrome ships seccomp-bpf
- 2013-02 — Linux 3.8: unprivileged user namespaces
- 2013-03-15 — Docker shown at PyCon; v0.1.0 tagged 2013-03-26
- 2014-03-10 — Docker 0.9 replaces LXC with libcontainer; 2014 — seccomp() syscall (3.17)
- 2015-06-22 — OCI founded; runc donated; 2015-11 — pledge presented
- 2016-03 — Linux 4.5: cgroup v2 stable; OpenBSD 5.9 ships pledge; Linux 4.6: cgroup namespace
- 2017-07-19 — OCI runtime-spec 1.0
- 2018-10 — OpenBSD 6.4 ships unveil
- 2019-02 — runc CVE-2019-5736; 2019-03 — Linux 5.0: seccomp user notification
- 2020-03 — Linux 5.6: time namespaces
- 2021-06 — Linux 5.13: Landlock
- 2023-06 — Google kCTF: 60% io_uring; 2023-10 — Ubuntu restricts unprivileged userns (default in 24.04)
- 2024-01 — Linux 6.7: Landlock TCP rules (ABI 4)
