---
title: "Solaris Zones: Operating System Support for Consolidating Commercial Workloads"
url: https://www.usenix.org/legacy/events/lisa04/tech/price.html
authors: Daniel Price, Andrew Tucker (Sun Microsystems)
date: 2004-11 (18th USENIX LISA, Atlanta, 14–19 Nov. 2004, pp. 241–254); Solaris 10 GA 2005-01-31 (Sun press release dated 2005-02-01)
accessed: 2026-11-22
kind: paper
---

Full text read from
<https://www.usenix.org/legacy/events/lisa04/tech/full_papers/price/price.pdf>.
Solaris 10 availability from Sun's 1 Feb 2005 press release as archived at
<https://sparc.org/?p=2457>; the "8,000 containers" marketing figure is from
Sun's Nov. 2004 announcement as reported by sparc.org (secondary).

## Summary
Zones virtualize the *application environment* of a single Solaris kernel
rather than the hardware. A *global zone* (traditional, omnipotent root)
hosts many *non-global zones*, each with its own filesystem subtree, process
namespace, network identity, users and root password, delegated to a zone
administrator. Unlike FreeBSD jails, zones were designed from the start to
integrate with resource management (resource pools, fair-share scheduler) and
with Solaris 10's new fine-grained privilege model, so root inside a zone is
*structurally* less powerful than real root.

## Key points
- Motivation: server consolidation after the dot-com bust; typical data
  center utilisation of 15–30%; anecdote of a customer buying a second server
  because two apps both wanted port 80.
- Cites FreeBSD Jails and Linux VServer as related OS-level virtualization;
  contrasts with hardware partitioning and VMs (overheads, admin cost).
- Design principles: namespace isolation, security isolation, resource
  allocation; support unmodified commercial apps; few minutes and few choices
  to create a zone.
- Security: zones run with a reduced privilege set and "are constrained from
  ever achieving all privileges", so even an escape from namespace isolation
  cannot, for example, write /dev/kmem.
- Each zone has a `zsched` kernel process at the root of its process tree;
  zoneadmd manages the "virtual platform".
- Performance: 0–4% overhead (4% on time-sharing workload due to lofs);
  text pages shared across zones. DTrace made zone-aware.
- Branded zones (BrandZ) arrived in Solaris 10 8/07: `lx` brand ran 32-bit
  Linux user space (CentOS/RHEL 3.x), plus `solaris8`/`solaris9` brands
  (Oracle admin guide, ch. 31:
  <https://docs.oracle.com/cd/E19253-01/817-1592/gchhy/index.html>).

## Excerpts
> "By focusing on the support of multiple application environments rather
> than multiple operating system instances, zones meets isolation requirements
> without sacrificing manageability." (Abstract)

> "Fundamentally, a zone is less powerful than the global environment, because
> zones take advantage of the fine-grained privilege mechanism available in
> Solaris 10." (Zone Architecture)

> "Branded zones are available beginning with the Solaris 10 8/07 release."
> (Oracle, System Administration Guide, ch. 31)

## Relevance to the talk
Zones are the most complete pre-Linux "container" design: namespace +
privilege reduction + resource controls, integrated and observable. The
privilege-reduction-as-second-line idea is what Linux later approximates with
capability dropping, user namespaces and seccomp layered under namespaces.
