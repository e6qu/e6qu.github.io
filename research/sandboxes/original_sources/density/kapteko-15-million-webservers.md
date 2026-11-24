---
title: "15 million web servers on one VM - smoltcp, DPDK, AF_XDP"
url: https://kapteko.com/15-million-webservers/
authors: kapteko (author not named on the page; X handle @kaptekoguid)
date: 2026-11-18
accessed: 2026-11-22
kind: blog
---

## Summary
A partly tongue-in-cheek density experiment: try to run 15 million web servers
(“one per human”) on one VM with 10 GB RAM and one core. Separate Linux processes
fail first on ports, then on memory (~1.5 MB per process); kernel sockets fail
next (~3.3 KB per `socket()`, OOM near 10M sockets). The author moves all guests
into one host process sandboxed with LFI, schedules them in userland, and replaces
the kernel TCP/IP stack with smoltcp fed by DPDK or AF_XDP. They report ~620 bytes
per idle server and ~1 KB per active one, reaching 16M servers.

## Key points
- Budget: one VM, 10 GB RAM, 1 CPU core.
- Ports: default `ip_local_port_range` is 32768–60999; widening it gives 1–65535,
  roughly doubled by using both TCP and UDP. The workaround for addresses is an IPv6
  /64 routed to `lo` via AnyIP (`ip -6 route add local 2001:db8:1234:5678::/64 dev lo`).
- One minimal C server process ≈ 1.5 MB RAM, so 15M processes would need ~20 TB.
- Kernel socket cost table: `tcp_sock` 2240 B + `socket_alloc` 768 B + `file` 184 B
  + `dentry` 192 B = 3384 B, allocated whether the socket is busy or idle. 10M sockets
  run out of memory in 10 GB; the kernel stack tops out around 2.5M servers.
- Runtime: LFI guests loaded into one process; per-guest scheduler context is
  16 bytes (pc + two fds), so 15M × 16 B ≈ 220 MB; the author says it could be packed to ~8 B.
- smoltcp: 620 B per idle server, ~1 KB per active one; 16M servers. DPDK is fastest,
  AF_XDP just behind. DPDK takes the NIC away from the OS (SSH is lost), while AF_XDP
  keeps the kernel driver and filters with eBPF.
- Most figures are arithmetic or estimates. The only benchmark is an SVG chart.
  The ~5 KB per active connection figure is attributed to a Codex CLI answer, not
  a measurement.
- Isolation is asserted, not analysed: there is no threat model and no side-channel
  discussion, and nothing on what a compromised guest could reach.
- Source code: https://github.com/artemyarulin/AI10M/tree/main/poc/ten-million-webservers

## Excerpts
> “The goal is to run 15 million web servers on one VM with 10GB of RAM and 1 CPU core.” (intro)

> “It gives us memory isolation and replaces all syscalls with calls to our host handler” (TLDR, on LFI)

> “The `socket` syscall allocates around 3300 bytes, whether the socket is active, listening, or doing nothing.”

> “With `smoltcp`, RAM usage grows slower - 620 bytes per idle server and around a kilobyte for an active one”

## Relevance to the talk
This is the extreme end of the density axis. Per-instance cost goes from about
1.5 MB per process to under 1 KB per guest once the kernel is taken out of the
per-guest path, both for isolation (SFI instead of address spaces) and for
networking (a userland stack instead of kernel sockets). It makes a good provocation
for the claim that the kernel's per-process and per-socket bookkeeping, not the
CPU, is what limits density. The counterpoint for the talk is that the security of
such a design rests entirely on the SFI verifier and the runtime.
