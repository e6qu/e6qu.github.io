---
title: "Docker 0.9: Introducing Execution Drivers and libcontainer"
url: https://www.docker.com/blog/docker-0-9-introducing-execution-drivers-and-libcontainer/
authors: Solomon Hykes / "The Docker team"
date: 2014-03-10
accessed: 2026-11-22
kind: blog
---

## Summary
Announces Docker's own Go library for driving namespaces, cgroups and capabilities directly
(libcontainer), replacing LXC as the default execution driver. libcontainer later became the core of
runc, donated to the OCI in 2015.

## Key points
- LXC becomes optional; switch back with `docker -d -e lxc`.
- Motivation: fewer moving parts, insulation from LXC version/distro differences, stability.
- Lineage: libcontainer → runc (donated to OCI, June 2015) → the reference OCI runtime.

## Excerpts
> "This drastically reduces the number of moving parts, and insulates Docker from the side-effects introduced across versions and distributions of LXC."

> "In fact, libcontainer delivered such a boost to stability that we decided to make it the default."

## Relevance to the talk
Shows that the "container runtime" is a thin userspace program over kernel syscalls — which is exactly
why a bug in that program (CVE-2019-5736) or in the kernel underneath escapes the box.
