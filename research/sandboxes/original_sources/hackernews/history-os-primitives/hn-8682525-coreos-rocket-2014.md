---
title: "CoreOS is building a container runtime, Rocket"
url: https://news.ycombinator.com/item?id=8682525
story_url: https://coreos.com/blog/rocket/
authors: HN discussion of the CoreOS announcement; commenters include shykes (Solomon Hykes, Docker), philips (Brandon Philips, CoreOS CTO), bcantrill (Joyent), kentonv (Kenton Varda, Sandstorm), thockingoog (Tim Hockin, Google)
date: 2014-12-01
accessed: 2026-11-22
kind: discussion
points: 902
comments: 277
---

Read via the HN Algolia items API.

## Summary
CoreOS announced Rocket (later `rkt`) and the App Container spec,
calling Docker's model "fundamentally flawed" and its scope too large.
The thread is the start of the runtime wars that ended in the OCI (June
2015). Hykes replies as Docker's creator, saying competition is good
(LXC to OpenVZ/vserver, Docker to LXC) but he is "disappointed" by the
press campaign. The security-relevant thread is about the daemon: rkt
runs the container directly under the caller's process tree, with no
root daemon forking it. Kenton Varda explains why neither runtime would
make untrusted containers safe.

## Key points
- Design difference (Philips): "there is no rktd that forks the process", so a container can run under systemd or any process supervisor. Hockin: this "was a key principle of LMCTFY, too".
- The first rkt "stage1" used systemd-nspawn (pron, linking the code); Philips says it is not tied to systemd and other stage1s, including a qemu-kvm one, are welcome. (Our addition, not from the thread and not verified here: a KVM stage1 later shipped with rkt, built with Intel's Clear Containers work, a predecessor of Kata Containers.)
- Hykes' lineage: "Lxc brought competition to openvz and vserver. Docker brought competition to lxc. And now tools like lxd, rocket and nspawn are bringing competition to Docker."
- Varda (Sandstorm): safe untrusted containers need "disabling vast swaths of the kernel API in order to reduce attack surface"; Docker and Rocket promise "Standard Linux" inside, so they cannot.
- Cantrill: the Docker Remote API allows implementation freedom, including SmartOS via sdc-docker; Rocket "appears to be much more bound to the OS platform".
- Users ask for non-root container launch for HPC (mbreese); a commenter notes the post criticises the root daemon but `rkt` itself must run as root (vito).

## Excerpts
> "When you do `rkt run` it is actually executing under that PID hierarchy; there is no rktd that forks the process." — philips, <https://news.ycombinator.com/item?id=8682798>

> "This was a key principle of LMCTFY, too, FWIW." — thockingoog, <https://news.ycombinator.com/item?id=8685508>

> "Lxc brought competition to openvz and vserver. Docker brought competition to lxc. And now tools like lxd, rocket and nspawn are bringing competition to Docker." — shykes, <https://news.ycombinator.com/item?id=8683705>

> "Doing that requires a willingness to break things (disabling vast swaths of the kernel API in order to reduce attack surface)." — kentonv, <https://news.ycombinator.com/item?id=8686065>

> "I'm all for a new container runtime if it lets me start containers as a non-root user." — mbreese, <https://news.ycombinator.com/item?id=8682627>

## Relevance to the talk
Marks the split between "container = packaging and API" (Docker) and
"container = a process the OS supervises" (rkt, nspawn, later Podman).
The daemonless, non-root direction it pushed ended up in Podman and
rootless runc. Varda's comment states the trade-off our talk keeps
returning to: real isolation means breaking compatibility.
