---
title: "Safe Mode" (Scala 3 reference, Experimental › Capture Checking), with "Scala 3.8.3 is now available!" and "Safe Scala: an introduction"
url: https://scala-lang.org/api/3.x/docs/experimental/capture-checking/safe.html
authors: Scala 3 team (EPFL LAMP / Scala Core Team); release notes by Wojciech Mazur (VirtusLab); blog by Adam Warski (VirtusLab)
date: reference page as of Scala 3.10.1 docs; safe mode first shipped in Scala 3.8.3 (2026-03-31); VirtusLab blog 2026 (page shows 2026-04-14; schema datePublished 2026-05-13)
accessed: 2026-11-22
kind: docs
---

## Summary
Safe mode (`import language.experimental.safe` or `-language:experimental.safe`) is a capability-safe subset of Scala 3. It builds on capture checking and removes the escape hatches that would let code "forget" a tracked capability: unchecked casts and pattern matches, `caps.unsafe`, `@unchecked`, and runtime reflection. Code in safe mode may reach global objects only if they are themselves safe, either compiled in safe mode or marked `@assumeSafe` by a human who vouches for them. The reference page says outright that this is meant for agent-generated code and names TACIT as the user. The 3.8.3 release notes describe it as "a capability-safe subset intended for agent-generated or otherwise untrusted code."

## Key points
- **Restrictions** (reference page): (1) no unchecked type casts or pattern matches; (2) no `caps.unsafe`; (3) no `@unchecked` annotations or variants; (4) no runtime reflection; (5) capture checking on, "including tracking all mutation effects"; (6) global objects accessible "only if they are implemented safely themselves". TACIT's README adds that explicit nulls are on as well.
- **`@assumeSafe`** (in `caps`) marks a module as callable from safe code. It "comes with none of the restrictions that `safe` implies. Instead it is the obligation of the programmer to verify that the module is indeed safe." The examples are a memo cache using `@untrackedCaptures`, and a `CheckedMailer` that asks the user before calling an unsafe `Mailer`. **`@rejectSafe`** is the dual: it hides selected members of an assumed-safe module.
- This is the **plugin/trust boundary**. Effectful libraries (file system, network, exec) are written in full Scala and published to agent code via `@assumeSafe`. Agent code may not use `@assumeSafe` itself; ATC's validator rejects it ("@assumeSafe may only be used by the library"). The Warski blog says the same: an agent cannot grant itself trust.
- **The standard library allowlist** lives in the compiler (`dotty.tools.dotc.cc.SafeRefs`). It includes the `scala` package except global `print` functions, the java.lang number classes, `Enum`, `String` and `Object`, plus `java.lang.Class` with its reflection methods rejected. The page says it "is expected to evolve over time".
- **Only globals are restricted.** "Capabilities passed as parameters to untrusted code can come from any module, whether it is safe or unsafe. Here it is the job of the API designer to only expose appropriate functionality in these capabilities." This is the classic object-capability rule: authority comes only from what you are handed.
- **Exceptions are deliberately not controlled.** Statically controlling them is called impractical, since they come from stack overflow, division by zero, OOM and so on. The guidance is to wrap untrusted calls in `Try`. Exception classes are treated as pure, so a capability cannot be smuggled out in an exception field. Non-local returns, `break` and continuation resumption are exceptions too, so `Try` covers them. This leaves a termination/exception channel open (see TACIT issue #15).
- **Status:** experimental. The release notes call safe mode "not just 'stricter capture checking'". Warski's blog (spring 2026) says it was "currently available only in the nightly compiler builds", while the 3.8.3 release notes (31 March 2026) say 3.8.3 introduced it. The likely reading is that it first appeared in 3.8.3 but kept changing, and TACIT tracks the nightlies. *Unverified which stable release carries the version TACIT uses; TACIT's build pins a nightly.*
- Warski's blog places Safe Scala next to Docker, Bubblewrap/Landlock, eBPF and Wasm isolation. "Level 1" restricts the language and APIs; "Level 2" adds capabilities. Its strongest claim is compile-time "pure-only" zones. It also notes that "Safe programs without side-effecting libraries are not very useful", so the work moves into designing trusted libraries.

## Excerpts
> "Full Scala 3 has elements that are incompatible with capability safety, such as type casts and other unsafe features. These are essential escape hatches in some situations. But they should be used with care, and should not be available in agent-generated code or other untrusted code that does not pass review." (Introduction)

> "It makes sense for agentic tooling to subject all compilations of agent-generated code to be compiled in safe mode using this language import." (Introduction)

> "Once a Safe Scala program passes compilation, it is guaranteed to execute safely." (Warski, VirtusLab blog. Note that this is stronger than the reference page or the TACIT paper claim.)

## Relevance to the talk
Safe mode is the language half of the Scala story, and it is a direct descendant of Joe-E and Safe Haskell: a verifier-enforced safe subset, plus a human-vouched "trustworthy" escape hatch for libraries (`@assumeSafe` corresponds to Safe Haskell's `Trustworthy`). The security of the whole system therefore rests on the `@assumeSafe` libraries and on the compiler being sound. Both are TCB, and both are new. The Warski quote is useful as an example of overclaiming next to the paper's careful non-goals (side channels, exec'd processes, JVM bugs).
