# History — original sources

Where sandboxing came from: mainframe virtual machines, the 1970s protection
literature, capability systems, chroot and its "jails", syscall
interposition, language and SFI sandboxes, and the 2000s wave of OS-level
containers on every Unix. All sources read 2026-11-22.

## Index

### Virtual machines and the formal model
- [creasy-1981-origin-of-vm370.md](creasy-1981-origin-of-vm370.md) — Creasy (IBM JRD, 1981): CP-40 (1966) → CP-67 → VM/370 (1972); "A virtual machine cannot be compromised by the operation of any other virtual machine."
- [varian-vm-and-the-vm-community.md](varian-vm-and-the-vm-community.md) — Varian (1989/1991): precise dates — CP-40 designed late 1964, production Jan 1967, VM/370 announced 2 Aug 1972; 14 VMs × 256K.
- [popek-goldberg-1974-virtualizable-architectures.md](popek-goldberg-1974-virtualizable-architectures.md) — Popek & Goldberg (CACM, July 1974): VM = "efficient, isolated duplicate"; sensitive ⊆ privileged theorem.

### Protection principles
- [schroeder-saltzer-1972-multics-protection-rings.md](schroeder-saltzer-1972-multics-protection-rings.md) — Schroeder & Saltzer (CACM, Mar 1972): Multics hardware rings, gates, argument validation; origin of "ring 0".
- [lampson-1973-confinement-problem.md](lampson-1973-confinement-problem.md) — Lampson (CACM, Oct 1973): the confinement problem; storage, legitimate and covert channels; transitivity rule.
- [saltzer-schroeder-1975-protection-of-information.md](saltzer-schroeder-1975-protection-of-information.md) — Saltzer & Schroeder (Proc. IEEE, Sept 1975): eight design principles incl. least privilege, fail-safe defaults, complete mediation.

### Capability systems
- [dennis-vanhorn-1966-programming-semantics.md](dennis-vanhorn-1966-programming-semantics.md) — Dennis & Van Horn (CACM, Mar 1966): capabilities, C-lists, inferior spheres of protection for running faulty code.
- [wulf-1974-hydra.md](wulf-1974-hydra.md) — Wulf et al. (CACM, June 1974): Hydra capability kernel on C.mmp; separation of mechanism and policy.
- [hardy-1985-keykos-architecture.md](hardy-1985-keykos-architecture.md) — Hardy (OSR, 1985) + KeyKOS nanokernel paper (1992): commercial capability OS since 1983; factories solve confinement.
- [hardy-1988-confused-deputy.md](hardy-1988-confused-deputy.md) — Hardy (OSR, Oct 1988): the compiler that overwrote the billing file; ambient authority vs capabilities.
- [shapiro-1999-eros.md](shapiro-1999-eros.md) — Shapiro, Smith, Farber (SOSP, Dec 1999): EROS, a fast x86 reimplementation of KeyKOS; constructor = confinement.
- [klein-2009-sel4.md](klein-2009-sel4.md) — Klein et al. (SOSP, Oct 2009): seL4, 8,700 lines of C, first full functional-correctness proof of an OS kernel.

### chroot and its escapes
- [unix-v7-chroot.md](unix-v7-chroot.md) — V7 CHDIR(2) man page (1979); Bill Joy adds chroot to BSD 1982-03-18; Linux man page: "not intended to be used for any kind of security purpose".
- [cheswick-1992-berferd.md](cheswick-1992-berferd.md) — Cheswick (USENIX Winter, Jan 1992): the chroot "Jail" built to watch a cracker in 1991; "never quite secure".
- [simes-2002-breaking-chroot.md](simes-2002-breaking-chroot.md) — Simes (2002): the classic root chroot escape (mkdir, chroot, chdir .. loop, chroot .).

### Syscall interposition
- [goldberg-1996-janus.md](goldberg-1996-janus.md) — Goldberg, Wagner, Thomas, Brewer (USENIX Security, July 1996): Janus confines helper apps via Solaris /proc; deny-by-default policy modules.
- [garfinkel-2003-traps-and-pitfalls.md](garfinkel-2003-traps-and-pitfalls.md) — Garfinkel (NDSS, Feb 2003): why syscall interposition is easy to get wrong — TOCTTOU, indirect paths, mirroring OS state.
- [provos-2003-systrace.md](provos-2003-systrace.md) — Provos (USENIX Security, Aug 2003): systrace — training/interactive policy generation, privilege elevation; removed from OpenBSD in 6.0 (2016).

### Language and software-fault-isolation sandboxes
- [wahbe-1993-software-fault-isolation.md](wahbe-1993-software-fault-isolation.md) — Wahbe, Lucco, Anderson, Graham (SOSP, Dec 1993): SFI; names the address-masking rewrite "sandboxing"; 4% overhead.
- [gong-1997-java-beyond-the-sandbox.md](gong-1997-java-beyond-the-sandbox.md) — Gong et al. (USITS, Dec 1997): JDK 1.0 applet sandbox → 1.1 signed applets → 1.2 permissions, protection domains, stack inspection.
- [jep-411-deprecate-security-manager.md](jep-411-deprecate-security-manager.md) — JEP 411 (JDK 17, 2021) and JEP 486 (JDK 24, 2025): the Security Manager deprecated then disabled; "use containers and hypervisors".
- [yee-2009-native-client.md](yee-2009-native-client.md) — Yee et al. (IEEE S&P, May 2009): Native Client — x86 SFI with a 6 KB validator plus a systrace/Janus-style outer sandbox; superseded by WebAssembly (2017).

### Name spaces
- [pike-1992-plan9-name-spaces.md](pike-1992-plan9-name-spaces.md) — Pike et al. (1992): Plan 9 per-process name spaces, bind/mount, `rfork` — ancestor of Linux namespaces.

### OS-level virtualization ("containers") on Unix
- [kamp-watson-2000-freebsd-jails.md](kamp-watson-2000-freebsd-jails.md) — Kamp & Watson (SANE, May 2000): FreeBSD jails in 4.0 (Mar 2000); "confining the omnipotent root"; VNET later.
- [gelinas-2001-linux-vserver.md](gelinas-2001-linux-vserver.md) — Gélinas LKML post (2001-10-11): Linux-VServer security contexts, one IP per vserver, capability ceiling.
- [price-tucker-2004-solaris-zones.md](price-tucker-2004-solaris-zones.md) — Price & Tucker (LISA, Nov 2004): Solaris Zones in Solaris 10 (Jan 2005); privilege-reduced zones; lx brand from Solaris 10 8/07.
- [openvz-2005-first-stable-release.md](openvz-2005-first-stable-release.md) — OpenVZ stable release (2005-12-05): open-source core of Virtuozzo; VPSs + User Beancounters.
- [ibm-2007-aix-wpar-redbook.md](ibm-2007-aix-wpar-redbook.md) — IBM Redbook (Nov 2007): AIX 6.1 system and application WPARs; WPAR mobility.
- [hpux-secure-resource-partitions.md](hpux-secure-resource-partitions.md) — HP-UX 11i v3 compartments (SRP / HP-UX Containers): MAC-style compartments + PRM; date unverified.
- [cantrill-2015-triton-lx-zones.md](cantrill-2015-triton-lx-zones.md) — Cantrill (2015-03-24): Joyent Triton — Docker on bare-metal SmartOS via revived LX-branded zones.

## Synthesis

The sandbox began as a whole machine. IBM's CP-40 (designed late 1964,
running 1966, in production January 1967) gave each user a simulated
System/360, and its authors already sold isolation: one user's experiments
could not touch another's payroll job. VM/370 (announced 2 August 1972) made
that a product; Popek and Goldberg (1974) formalised it as "an efficient,
isolated duplicate of the real machine."

In parallel the protection literature produced the vocabulary we still use.
Dennis and Van Horn (1966) introduced capabilities and child "spheres of
protection" for running faulty code; Multics (1972) gave us rings and gates;
Lampson (1973) named confinement and covert channels; Saltzer and Schroeder
(1975) set out least privilege, fail-safe defaults and complete mediation.
Hydra (1974), KeyKOS (production 1983), EROS (1999) and seL4 (2009) carried
the capability line to a formally verified kernel, and Hardy's confused
deputy (1988) explained why ambient authority fails.

Unix took a cheaper path. chroot (V7, 1979; BSD, 1982) only re-rooted path
names; Cheswick's 1991 "Jail" and later escape write-ups showed root could
walk out. The 1990s added two finer-grained ideas: rewriting code so it
cannot leave its region (SFI, which named "sandboxing" in 1993; Java applets
from 1995; Native Client in 2009) and filtering system calls (Janus 1996,
systrace 2003). Garfinkel (2003) catalogued why user-space interposition
races the kernel.

The durable answer was to scope root rather than remove it: FreeBSD jails
(March 2000), Linux-VServer (2001), Solaris Zones (2004–05), OpenVZ (2005),
AIX WPARs (2007), all borrowing Plan 9's (1992) idea that a process sees
only the name space it is given. Java's Security Manager, deprecated in 2021,
ends on the same note: use containers and hypervisors.

### Timeline
| Date | Event |
|---|---|
| 1965-08 / 1966-03 | Dennis & Van Horn: capabilities, C-lists, spheres of protection |
| 1966 | CP-40 operational at IBM Cambridge (production Jan 1967) |
| 1972-03 | Schroeder & Saltzer: Multics protection rings |
| 1972-08-02 | VM/370 announced |
| 1973-10 | Lampson: confinement problem, covert channels |
| 1974-06 / 07 | Hydra (CACM); Popek & Goldberg virtualization theorem |
| 1975-09 | Saltzer & Schroeder design principles |
| 1979 | chroot in Version 7 Unix |
| 1982-03-18 | Bill Joy adds chroot to BSD |
| 1983-01 | KeyKOS in production |
| 1988-10 | Hardy, "The Confused Deputy" |
| 1991-01 → 1992-01 | Cheswick's chroot "Jail" (published Jan 1992) |
| 1992 | Plan 9 per-process name spaces paper |
| 1993-12 | Wahbe et al.: software fault isolation, "sandboxing" |
| 1996-07 | Janus syscall-interposition sandbox |
| 1997-12 | Java JDK 1.2 security architecture paper |
| 2000-03-14 | FreeBSD 4.0 ships jail(2) (paper May 2000) |
| 2001-10-11 | Linux-VServer announced |
| 2003-02 / 08 | Garfinkel "Traps and Pitfalls"; Provos systrace |
| 2004-11 / 2005-01-31 | Solaris Zones paper; Solaris 10 GA |
| 2005-12-05 | OpenVZ first stable release |
| 2007 | Solaris 10 "8/07" update adds branded (lx) zones; AIX 6.1 WPARs (Redbook Nov 2007) |
| 2009-05 / 10 | Native Client; seL4 proof |
| 2015-03-24 | Joyent Triton: Docker on LX-branded zones |
| 2016-09-01 | OpenBSD 6.0 removes systrace |
| 2017-05-30 | Google deprecates PNaCl for WebAssembly |
| 2021-09-14 | JDK 17 deprecates the Security Manager (JEP 411) |
| 2025-03-18 | JDK 24 permanently disables it (JEP 486) |
