---
title: "Triton: Docker and the “best of all worlds”"
url: https://bcantrill.dtrace.org/2015/03/24/triton-docker-and-the-best-of-all-worlds/
authors: Bryan Cantrill (CTO, Joyent)
date: 2015-03-24
accessed: 2026-11-22
kind: blog
---

## Summary
Cantrill announces Joyent Triton: Docker containers run directly on bare
metal as SmartOS (illumos) zones, using a revived *LX brand* that emulates the
Linux system-call interface inside a zone, plus software-defined networking
and a Docker Remote API endpoint that makes a whole datacenter look like one
Docker host. He recounts the LX brand's history: an old Sun project limited
to 32-bit, Linux-2.4-era binaries, "ripped out in 2010", revived by community
member David Mackay, reintegrated into SmartOS by Jerry Jelinek in March 2014,
and brought to 64-bit by late October 2014.

## Key points
- Joyent had run "OS containers in multi-tenant production for nearly a
  decade" by 2015.
- Thesis: OS-based virtualization on bare metal gives "performance,
  elasticity, security and density" without a hypervisor layer.
- LX brand = Linux binaries on an illumos kernel via syscall emulation
  (conceptually a cousin of gVisor and of WSL1).
- Rather than port the Docker daemon, Joyent re-implemented the Docker Remote
  API as a SmartDataCenter service (sdc-docker).
- SmartDataCenter and Manta were open-sourced in preparation (Nov. 2014, per
  the post's chronology).

## Excerpts
> "...David Mackay, a member of the illumos community, attempted to revive
> LX-branded zones, an old Sun project that provided Linux emulation in a
> zone."

> "...it had also been restricted to emulating a 2.4 Linux kernel for 32-bit
> binaries ... the work sat unattended in the system for a while before being
> unceremoniously ripped out in 2010."

> "Triton lets you run secure Linux containers directly on bare metal via an
> elastic Docker host that offers tightly integrated software-defined
> networking."

## Relevance to the talk
The bridge from Solaris Zones to the Docker era, and an example of a
*syscall-emulation* sandbox: Linux apps never touch a Linux kernel. Also the
strongest industry argument (2015) that zones were secure enough for
multi-tenant containers on bare metal, whereas mainstream Linux clouds put
containers inside VMs.
