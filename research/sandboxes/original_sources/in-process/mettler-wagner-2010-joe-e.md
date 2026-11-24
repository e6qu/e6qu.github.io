---
title: "Joe-E: A Security-Oriented Subset of Java"
url: https://www.ndss-symposium.org/wp-content/uploads/2017/09/met.pdf
authors: Adrian Mettler, David Wagner (University of California, Berkeley), Tyler Close (waterken.org)
date: 2010 (NDSS 2010, San Diego, 28 Feb – 3 Mar 2010)
accessed: 2026-11-22
kind: paper
---
Author copy: http://www.cs.berkeley.edu/~daw/papers/joe-e-ndss10.pdf (the PDF is 18 pp.).
Code: https://github.com/davidwagner/joe-e. It is not archived, but the last code commit is
dated 2011-06-15 and the README was added in 2015. Related: Joe-E Language Specification
v1.0, UCB/EECS-2008-91. Finifter, Mettler, Sastry, Wagner, "Verifiable functional purity
in Java", CCS 2008 (the paper's ref. [4]).

## Summary
Joe-E is a **subset** of Java, checked by a source-level verifier, that makes Java an
object-capability language without changing its syntax, semantics, compiler or JVM. It
removes the features that break encapsulation (native methods, finalizers, reflective
access-check bypass, catching `Error`, `finally`). It removes **ambient authority** by
"taming" the Java class library down to a capability-safe whitelist and by requiring all
static state to be transitively immutable. With an `Immutable` marker interface checked by
the verifier, Java's static types become a security policy: a method signature bounds the
capabilities a callee can ever reach. The flagship use is the Waterken server, which hosts
mutually distrustful apps in one JVM.

## Key points
- **What the verifier enforces (Fig. 4).**
  - *Reference unforgeability:* no native methods.
  - *No unexpected reference propagation:* all throwables must be immutable.
  - *No ambient authority:* tamed Java APIs, and every static field `final` and of an
    immutable type.
  - *Secure encapsulation:* no overriding `finalize()`, a tamed reflection API, no
    catching `Error`s, no `finally`.
- **Why each rule exists.**
  - *Reflection:* without the ban, a holder of a `Log` object could read its `private
    StringBuilder` and break "append-only".
  - *Finalizers:* they can resurrect half-constructed objects that skipped the
    constructor's checks (Fig. 5, `OddInt`).
  - *Exceptions:* they can smuggle a capability up the stack to an attacker (Fig. 6,
    Alice/Bob/Chuck).
  - *Catching `Error` and `finally`:* an attacker can force `OutOfMemoryError` or
    `StackOverflowError` mid-update and then observe broken invariants. Joe-E guarantees
    no Joe-E code runs after an `Error` is thrown.
- **Ambient authority in Java (§4.2).** "In Java, even code that starts out without any
  references has essentially all the privileges of the program." Joe-E's fix is the same
  refactoring as dependency injection, done for security review instead of testability.
- **Taming (§4.2.1).**
  - The verifier rejects any mention of a class, constructor, method or field outside
    the tamed subset.
  - `new File(String)` is ambient authority, so it is excluded.
  - `File.getParentFile()` is excluded because it walks up to the root.
  - `new File(null, path)` treats `path` as absolute, so the constructor is replaced by a
    Joe-E wrapper that checks for non-null.
  - Joe-E provides safe wrappers for the filesystem, reflection and proxies, and
    character encodings.
- **Self-declared weakness.** The authors call taming "a substantial weakness in our
  approach". They cite the DarpaBrowser review, which found methods that violate capability
  discipline inadvertently allowed in E's taming database. They admit they may have made
  the same kind of mistake.
- **Immutability and determinism.**
  - A class implementing `org.joe_e.Immutable` must have only `final` fields of primitive
    or `Immutable` types. The verifier checks this rule and does no inference.
  - Library types such as `String` are treated as immutable.
  - `ConstArray<T>` and `ImmutableArray<T>` (the latter checked at runtime because Java
    generics are unsound) replace mutable arrays.
  - *Plugin example (Fig. 2):* `interface Decoder extends Immutable { byte[][][] decode(byte[]) }`.
    Calls are independent, nothing leaks between images, and the plugin cannot reach
    the network or filesystem.
  - *Caching:* because Joe-E code cannot read sources of nondeterminism, Waterken
    computes ETags as a hash of the inputs to the response generator and can cache every
    app coherently.
  - The companion CCS'08 work ported a 10K+-line HTML parser to Joe-E for "deterministic
    and side-effect free" parsing.
- **Implementation.**
  - The verifier is an Eclipse 3.x plugin. It is enabled per package with `@IsJoeE`,
    file-at-a-time, with no whole-program analysis.
  - It works on source, not bytecode. Bytecode can do more than Java source allows, but
    working on source means the verifier must model compiler-generated code (implicit
    `toString`, enhanced-for, default constructors), a stated source of possible bugs.
  - Over 300 unit tests.
  - Waterken is about 13K SLOC of Joe-E plus 4K SLOC of Java.
- **Trust boundary.** Any plain-Java component in the same application is fully trusted
  (part of the TCB). It "has the potential to, via the abstraction-breaking features of
  Java, violate the security properties of Joe-E code". Parts of the Joe-E library itself
  are unrestricted Java.
- **Explicitly out of scope (§3).** CPU, memory and timeliness: "Our approach is to place
  no limits on the purely computational power of untrusted code, limiting only its access
  to data and external resources."
- **On Scala (§8).** Scala replaces statics with singleton objects, but "this approach can
  still provide capabilities in the global scope", so it "does not provide security
  properties comparable to Joe-E". This is the 2010 baseline against which later
  capability-tracking work in Scala should be compared.
- **Contrast with the SecurityManager (§8).** Java's stack-inspection policy is central
  and separate from the code. Joe-E's policies live in the program as capability
  delegation and encapsulating reference monitors. The authors expect Java's mechanism to
  suit legacy code better.

## Excerpts
> "In Joe-E, no authority is ambiently available, so the resources needed by Joe-E code must be explicitly provided, typically as constructor arguments." (§4.2)

> "We consider the difficult and critical nature of this process to be a substantial weakness in our approach, and an area in which there is substantial room for improvement in future work." (§4.2.1, on taming)

> "Our approach is to place no limits on the purely computational power of untrusted code, limiting only its access to data and external resources." (§3)

## Relevance to the talk
Joe-E is the clearest worked example of the in-process recipe applied to a mainstream,
statically typed language. Subset the language, tame the standard library, ban mutable
globals, and let the type of the entry point be the policy. For agents, the `Decoder
extends Immutable` example is the pattern of a tool that receives only bytes and returns
only bytes, so it can be proven unable to exfiltrate. The paper is also candid about the
costs. The *taming database* is the soft underbelly: every whitelisted library method is
an attack surface, and E's was found leaky. Unrestricted host-language code is always TCB.
Resource exhaustion is not addressed. Each of these limits recurs in Caja/SES and Safe
Haskell, and in any modern "capability-safe agent runtime" built on Scala or JVM libraries.
