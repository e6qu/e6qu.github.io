---
title: Who Contains the Containers?
url: https://projectzero.google/2021/04/who-contains-containers.html
authors: James Forshaw (Google Project Zero)
date: 2021-04-01
accessed: 2026-11-22
kind: blog
---

## Summary
Forshaw examines how process-isolated Windows Server Containers work —
server silos, a special kind of job object that redirects the object manager
root, registry and other resources so a process believes it has its own OS —
and finds four privilege-escalation bugs that let a non-admin container user
escape (fixed early 2021). He documents Microsoft's position that process
isolation is not a security boundary and recommends Hyper-V isolation for
untrusted code. (Originally on googleprojectzero.blogspot.com; now redirects
to projectzero.google.)

## Key points
- Architecture: containers run "under the current kernel as separate
  processes inside a server silo"; silos are a job-object variant with
  per-silo object-manager root and registry redirection.
- Bugs: a registry symlink check skipped inside server silos; a registry
  relative-open flaw exposing host hives; an object-manager root directory
  issue reachable via application silos; `ContainerUser` holding
  `SeImpersonatePrivilege`.
- Microsoft servicing: process-isolated Windows Server Containers are not a
  security boundary, so most bugs get no bulletin; escapes from non-admin
  accounts are treated as serviceable privilege escalations.
- Starting point was Palo Alto Networks' research on global symbolic links.

## Excerpts
> "The primary goal of a container is to hide the real OS from an application."

> "Ideally you should never run untrusted workloads in a Windows Server Container."

> "Obviously, the recommended approach is to use Hyper-V isolation."

## Relevance to the talk
The key caveat for "lighter than a VM" on Windows: the namespace-style
container mechanism exists (silos) but its vendor does not defend it as a
boundary, and the shared kernel's large attack surface (registry, object
manager, win32k) yields escapes. Parallels the Linux "containers don't
contain" debate.
