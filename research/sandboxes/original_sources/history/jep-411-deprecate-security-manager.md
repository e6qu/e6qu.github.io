---
title: "JEP 411: Deprecate the Security Manager for Removal"
url: https://openjdk.org/jeps/411
authors: Sean Mullan (owner); reviewed by Alan Bateman, Alex Buckley, Brian Goetz; endorsed by Brian Goetz (OpenJDK)
date: 2021-04-05 (JEP created); delivered in JDK 17, GA 2021-09-14. Follow-up JEP 486 "Permanently Disable the Security Manager" delivered in JDK 24, GA 2025-03-18
accessed: 2026-11-22
kind: spec
---

Read JEP 411 in full at openjdk.org; also read the summary of JEP 486
(<https://openjdk.org/jeps/486>) and the JDK 17 / JDK 24 project pages for GA
dates.

## Summary
OpenJDK deprecates the Security Manager — Java's in-process sandbox since
Java 1.0 — for removal, alongside the Applet API. The JEP gives an unusually
candid post-mortem: the model was brittle, hard to program against, slow,
almost never used for server code, and incapable of addressing most modern
vulnerability classes. It recommends instead integrity at lower layers
(strong module encapsulation) and isolating the whole runtime with
out-of-process mechanisms such as containers and hypervisors. JEP 486 (JDK
24) then made it impossible to enable.

## Key points
- Java 1.0 had only eight `java.*` packages, making "consult the Security
  Manager before every operation" feasible; the library explosion later made
  it "dozens of permissions and hundreds of permission checks".
- Applet API deprecated in Java 9 (2017), for removal in Java 17 (2021);
  browser plugin and Web Start removed from Oracle JDK 11 (2018).
- Cannot address 19 of the 25 most dangerous issues on 2020 industry lists;
  cannot stop speculative-execution attacks.
- Failure reasons: brittle permission model (no partial security, no
  negative permissions), difficult programming model (stack-walk makes
  library permissions viral; `AllPermission` becomes the easy path), poor
  performance (always off by default on the command line).
- Java 17: deprecate APIs + startup warnings; Java 18: `setSecurityManager`
  disallowed by default; JEP 486 (JDK 24): cannot be enabled at all.
- Notes .NET also dropped permission-based code access security.

## Excerpts
> "The Security Manager dates from Java 1.0. It has not been the primary means
> of securing client-side Java code for many years, it has rarely been used to
> secure server-side code, and it is costly to maintain." (Summary)

> "In the quarter-century since the Security Manager was introduced, adoption
> has been low." (Motivation)

> "Security is better achieved by providing integrity at lower levels of the
> Java Platform ... and by isolating the entire Java runtime from sensitive
> resources via out-of-process mechanisms such as containers and
> hypervisors." (Motivation)

## Relevance to the talk
A 26-year experiment in in-process, language-level sandboxing ends with the
platform owner recommending OS- and hypervisor-level isolation. Strong
evidence for the talk's arc: fine-grained in-process permission systems
lose to coarse, out-of-process boundaries. The "brittle permission model"
critique applies directly to over-granular agent permission schemes.
