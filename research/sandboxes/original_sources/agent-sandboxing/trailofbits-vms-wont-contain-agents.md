---
title: "VMs won't contain cyber-capable agents"
url: https://blog.trailofbits.com/2026/08/26/vms-wont-contain-cyber-capable-agents/
authors: Artem Dinaburg (Trail of Bits)
date: 2026-08-26
accessed: 2026-11-22
kind: blog
---

Read: the original post on blog.trailofbits.com (full text, fetched 2026-11-22). HN discussion: https://news.ycombinator.com/item?id=49450188 (submitted 2026-08-26 by polyrand; 198 points, 147 comments per the Algolia API).

## Summary
Trail of Bits, with preview access to OpenAI's GPT 5.6-Cyber (via its Patch the Planet programme, running in Codex "goal mode"), set the model a CTF: get out of a QEMU/KVM guest on the author's Debian 12 dev box and read a flag on the host. It escaped three times, each time after the author hardened the setup: first with a recently disclosed host-kernel bug, then with unpatched or unmarked libslirp bugs that Debian oldstable had not picked up, and finally, against upstream QEMU and libslirp rebuilt from source, with a chain of three 0-days and one KVM fix the distribution kernel lacked. The threat model is the agent itself, not a third party: a capable agent given a VM should be treated as an advanced persistent threat. The conclusion is that a general-purpose VM (QEMU + KVM + slirp networking + host services) exposes too much attack surface. The author recommends a minimal, security-focused VMM such as Firecracker, fast-moving patched hosts, least privilege, logging and monitoring, time limits, and a fresh environment for each run.

## Key points
- **Threat model.** The agent is the adversary. It needs full capabilities (download/build/debug, fuzzing, running services, some network access), so the VM is the only thing between it and the host. The author: "treat such agents as an advanced persistent threat". He cites OpenAI's "Hugging Face model evaluation security incident" as the "recent events" behind the test.
- **Setup.** QEMU/KVM guest on Debian 12 (oldstable) on AMD Zen3. The agent ran on the host with SSH into the guest and was told to work inside the VM (it was started outside because escape attempts were expected to crash the VM; the final exploits were checked for cheating). It kept a research log.
- **Escape 1 (about 1 hour in): Januscape, CVE-2026-53359.** A host-kernel bug disclosed a few weeks earlier, with no public exploit. The agent wrote one; testing it hard-locked the host rather than landing cleanly. The author then updated to Debian 12's latest kernel.
- **Escape 2: libslirp (user-mode networking).** Debian 12 still ships libslirp 4.7.0, which is vulnerable to CVE-2026-9539. The agent combined it with an upstream bug-fix commit that had no CVE to get arbitrary host memory read/write. Lesson: fixes that are "not classified as security bugs" never reach stable distros. The author then built the latest upstream QEMU and libslirp from source, with a minimal feature set.
- **Escape 3 (about 12 hours, many compactions and subagents, little prompting).** Dead ends first: a host CUPS server reachable through slirp (CVE-2026-34990, unpatched in oldstable) was blocked by AppArmor. Hardware side-channels were tried because the host ran `mitigations=off`, but the read oracle was too unreliable. Then it went bug-hunting in the host kernel, QEMU and libs. The final chain:
  - QEMU (0-day, reported): VAPIC ROM alias could overlap locked SMRAM, giving attacker-controlled SMM execution.
  - Linux KVM (0-day, patched upstream, details embargoed): attacker-modified shadow page left unsynchronized and reusable.
  - Linux KVM (fixed upstream, not in the distro kernel because it was not flagged as a security fix): `paging64_invlpg()` stale level-2 role gave a writable 2 MiB host-physical mapping, so QEMU's heap could be modified.
  - libslirp (0-day, reported): mixed-fragment IHL ICMP reflection over-read, used to spray and locate live `NetPacket` objects and hijack a callback.
- **Found but not used:** a libslirp IPv6 payload-length bug (host-stream injection); CUPS's root Local certificate exposed through slirp loopback forwarding (root file overwrite, but AppArmor blocked the flag path); a QEMU display panning-buffer heap overflow (a 96-byte buffer for a 1,024-byte render; unreachable because the guest ran with `-display none`); a QEMU virtqueue reset bug (DoS and bounded corruption only).
- **Escape classes, in summary:** (1) known but unpatched host-kernel/KVM bugs; (2) the device-emulation and user-mode-networking stack (QEMU, libslirp); (3) host services reachable over the guest network (CUPS); (4) hardware side-channels (tried, failed); (5) new 0-days in all of the above. Every "convenience" path (networking, display, file sharing, host services) counted as attack surface.
- **Operational detail.** "My main job was to physically reboot the machine when it hardlocked the host kernel." Failed exploit attempts are themselves a host DoS.
- **Recommendations.** An off-the-shelf VM is not enough. Run a rapidly updated distro, because the backport cycle is too slow and an un-updated oldstable "should be assumed vulnerable". Use a purpose-built minimal VMM: against **Firecracker** the agent hard-locked the host through more (upstream-patched) kernel bugs but did not escape. That is "a substantially harder target", though it "may have, given even more time". Apply least privilege (network, credentials, features), logging and active monitoring, time limits on agent runs, and a pristine environment per use.
- **Evidence and numbers.** n=1 setup, one author, a preview model. 3 escapes. About 1 hour to the first host crash and about 12 hours for the 0-day chain. 3 0-days plus 1 unshipped fix in the final chain and 4 more bugs found but unused. No escape from Firecracker. No exploit code published (bugs reported or embargoed).

## Excerpts
> "It escaped the VM three different times." (intro)

> "If it wasn’t clear before, I will state it plainly: you can no longer assume a mere VM will contain a sufficiently advanced AI agent. To use a 2010s term of art, you should treat such agents as an advanced persistent threat." (intro)

> "For a long time the answer was “no, absolutely not.” More recently, I’d have thought “maybe, after a while.” It turns out the real answer was “yes, and quickly.”" (Advancing cybersecurity capabilities)

> "An off-the-shelf VM is not enough to contain a modern, cyber-capable AI agent. There is simply too much attack surface." (Challenging current software security assumptions)

> "It was able to hardlock the machine due to more Linux kernel flaws (all patched in upstream), but could not successfully escape. It may have, given even more time, but Firecracker is obviously a substantially harder target." (Challenging current software security assumptions)

## Relevance to the talk
This is the strongest 2026 data point against "just put it in a VM". The hardware-virtualization boundary was never the weak part. The trouble is everything stacked around it to make the VM useful: QEMU device emulation, slirp networking, a display, host services reachable from the guest, and a slowly patched host kernel. It links the virtualization section (Popek–Goldberg-style boundary vs. the real TCB of a full emulator; Firecracker's minimal-device design) to the agent section. Attack surface, not the isolation mechanism, decides containment. Agents that can find and chain 0-days turn every convenience channel (network, file sharing, display) into an escape path. The recommendations also support the talk's defence-in-depth framing: a minimal VMM, egress and credential limits, short-lived pristine environments, and monitoring. One caveat for the slide: this is a single anecdotal experiment on a deliberately stale, `mitigations=off` dev box. It is strong as an existence proof, not as a rate.
