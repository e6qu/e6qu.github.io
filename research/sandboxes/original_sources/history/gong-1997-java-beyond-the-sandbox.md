---
title: "Going Beyond the Sandbox: An Overview of the New Security Architecture in the Java Development Kit 1.2"
url: https://www.usenix.org/legacy/publications/library/proceedings/usits97/gong.html
authors: Li Gong, Marianne Mueller, Hemma Prafullchandra, Roland Schemers (JavaSoft, Sun Microsystems)
date: 1997-12 (USENIX Symposium on Internet Technologies and Systems, Monterey, Calif., Dec. 1997)
accessed: 2026-11-22
kind: paper
---

Full text read from
<https://www.usenix.org/legacy/publications/library/proceedings/usits97/full_papers/gong/gong.pdf>.
Java's public launch (May 1995, SunWorld) is from general histories, not
this paper.

## Summary
Sun's own account of how Java's applet "sandbox" worked and why JDK 1.2
replaced it. In JDK 1.0.x, local code was fully trusted and downloaded
applets ran in a fixed sandbox enforced by type safety, the bytecode
verifier, class-loader namespaces and a `SecurityManager` consulted before
sensitive operations. JDK 1.1 added signed applets (trusted if signed by a
recognized key — all-or-nothing). JDK 1.2 introduced configurable policy
files, typed `Permission` objects, *protection domains* and stack-inspection
access control with privileged blocks — the model JEP 411 retired in 2021.

## Key points
- Four JDK 1.0 layers: type-safe language; compiler + bytecode verifier;
  class loader as a local namespace; `SecurityManager` mediating access to
  system resources.
- JDK 1.0.x: binary trust — local = all, remote applet = sandbox.
- JDK 1.1.x: signed applets in JAR files treated as trusted local code.
- JDK 1.2: fine-grained, policy-file-driven permissions (`FilePermission`
  etc. with `implies`), protection domains created on demand per
  code source/signers, `AccessController.checkPermission` examining every
  frame on the call stack, `beginPrivileged` (later `doPrivileged`) to
  truncate the walk.
- Paper calls the JDK 1.0.2 sandbox "one example of a protection domain with
  a fixed boundary".
- Notes customizing SecurityManager/ClassLoader was "extremely security
  sensitive" and required deep expertise.

## Excerpts
> "The original security model provided by Java is known as the sandbox
> model, which exists in order to provide a very restricted environment in
> which to run untrusted code (called applet) obtained from the open network."
> (Sec. 1.1)

> "The essence of the sandbox model ... is that local code is trusted to have
> full access to vital system resources (such as the file system) while
> downloaded remote code is not trusted and can access only the limited
> resources provided inside the sandbox." (Sec. 1.1)

## Relevance to the talk
Java popularized the word "sandbox" for the mass market (every web browser,
1995–96) and is the main example of *language-based* in-process isolation.
Its evolution from a binary sandbox to fine-grained permissions with stack
inspection — and then to deprecation — is a story about complexity and
usability defeating a theoretically elegant model.
