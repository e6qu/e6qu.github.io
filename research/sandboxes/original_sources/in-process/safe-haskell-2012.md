---
title: Safe Haskell
url: https://www.scs.stanford.edu/~dm/home/papers/terei:safe-haskell.pdf
authors: David Terei, David Mazières (Stanford University); Simon Marlow, Simon Peyton Jones (Microsoft Research)
date: 2012-09-13 (Haskell Symposium 2012, Copenhagen; ACM 978-1-4503-1574-6/12/09)
accessed: 2026-11-22
kind: paper
---
Also used:
- GHC 9.14.1 User's Guide §6.18, "Safe Haskell":
  https://downloads.haskell.org/ghc/latest/docs/users_guide/exts/safe_haskell.html
- Richard Eisenberg, "[Haskell-cafe] Safe Haskell?", 2021-04-16:
  https://mail.haskell.org/pipermail/haskell-cafe/2021-April/133854.html
- Hécate, "Deprecating Safe Haskell, or heavily investing in it?", ghc-devs, 2022-12-27:
  https://mail.haskell.org/pipermail/ghc-devs/2022-December/021046.html
  (also on Discourse: https://discourse.haskell.org/t/deprecating-safe-haskell-or-heavily-investing-in-it/5489)

## Summary
Safe Haskell is a GHC language extension, shipping since GHC 7.2, that closes the
loopholes by which Haskell code can get around types and module encapsulation:
`unsafePerformIO`, `unsafeCoerce`, non-IO FFI imports, Template Haskell, Generalised
Newtype Deriving, RULES, and hand-written `Typeable` instances. With those closed,
*the type of untrusted code is its sandbox*. A computation in a restricted monad (e.g.
`RIO`) can perform only the IO actions that monad's trusted module exports. The key
design is a **trust system** with three module labels: `Safe` (compiler-checked),
`Trustworthy` (uses unsafe features but the author vouches for a safe interface), and
`Unsafe`. Trust in `Trustworthy` modules is decided by whoever *compiles* the code, per
package. The paper is open about limits: no resource limits and no safe compilation.
Nine to ten years later GHC maintainers publicly debated deprecating the extension.

## Key points
- **Guarantees of the safe language (§3.1).**
  - Type safety.
  - Referential transparency: functions are deterministic, but "may result in
    non-termination or an exception".
  - Module encapsulation: abstract types can be touched only through their exports.
  - Modular reasoning: importing a module cannot change the meaning of your code.
- **Loopholes it closes (§2, §3.4).**
  - `unsafePerformIO` and `unsafeLocalState` let IO pose as pure code.
  - `unsafeCoerce` breaks types.
  - Non-IO FFI imports are lies about purity.
  - GND could build a cast `c I -> c Int` and break a module's invariants (the `MinList`
    example).
  - Template Haskell can reach non-exported symbols.
  - RULES can rewrite the importer's code.
  - Hand-written `Typeable` could make `RIO` look like `IO`, so `cast` turns any IO into
    RIO.
- **Trust model (§3.3).**
  - Module M is trusted by user U if M is `Safe` and its safe imports are trusted, or if
    M is `Trustworthy`, lives in a package U trusts, and its safe imports are trusted.
  - "Notice that trust relates to the person doing the compiling (the server in this
    case) not the author of the code."
  - `Trustworthy` places no restrictions on what the module does. It is an assertion.
  - Package trust is enforced only with `-fpackage-trust`, and safety is *inferred* for
    unlabelled modules.
- **Sandbox example (§5.1).**
  - `RIO` is a newtype over `IO` whose constructor `UnsafeRIO` is not exported, defined
    in a `Trustworthy` `PluginAPI` module.
  - It exports only `rioReadFile` and `rioWriteFile`, both gated by a `pathOK` policy.
  - Untrusted plugins compiled with `-XSafe` can then do only those two IO actions.
  - The paper lists the four attacks this blocks without Safe Haskell: `unsafePerformIO`,
    an impure FFI import with a pure type, a fake `Typeable` instance, and Template
    Haskell reaching the hidden constructor.
  - The paper also points to the LIO information-flow-control library as a richer
    monad-based sandbox.
- **GHCi Online.** A web REPL for untrusted users built on the RIO technique. It is
  contrasted with LambdaBot and TryHaskell, which used syntax filtering and disabled all
  IO. The abstract claims it runs untrusted code "with no overhead".
- **Adoption numbers (§6).** In GHC's `base`, 26% of modules were inferred Safe, 66%
  Trustworthy, 6% split and 3% (3 of 89) Unsafe. About 27% of Hackage modules were
  inferred Safe (3,985 Safe-inferred vs 10,660 Unsafe-inferred in Table 2).
- **Self-declared limits (§8).**
  - *Resource exhaustion.* "The only solution we are aware of is resorting to OS,
    process-level resource limits."
  - *Compilation safety is out of scope.* Template Haskell, quasiquotes, ANN, CPP and
    custom preprocessors, and Cabal `Setup.hs` all run code or read files at build time.
    "One simple solution available today is to compile untrusted code in a sandbox, such
    as a jail or virtual machine."
  - The compiler, RTS and every `Trustworthy` module are TCB.
- **Today's GHC docs (9.14.1).** These restate the limits:
  - "Safe Haskell, however, does not offer compilation safety."
  - "While a primary use case of Safe Haskell is running untrusted code, Safe Haskell
    doesn't provide this directly."
  - "GHC provides no guarantee for Trustworthy compiled modules."
  - GND, DerivingVia and `Data.Coerce` are disallowed in Safe code because of "the
    ability of them to violate module boundaries when module authors forget to put
    nominal role annotations".
  - Inferred safety "is volatile" and can change when a dependency changes.
- **Deprecation debate.**
  - *2021-04-16, Richard Eisenberg* on haskell-cafe: "I thus wonder about deprecating and
    eventually removing Safe Haskell." His reasons: "hundreds (maybe thousands) of lines
    of delicate logic within GHC", and "it's unclear which of Safe Haskell's purported
    guarantees are actually guaranteed by GHC", including "The lack of unsafeCoerce is
    not actually guaranteed."
  - *2022-12-27, Hécate* on ghc-devs: Deprecating Safe Haskell, or heavily investing in
    it? Hécate called the status quo "terrible". Safety labels are not covered by the
    PVP (Haskell's package versioning policy) and are "badly integrated" with API
    compatibility.
  - Safe Haskell is still documented in GHC 9.14.1 in 2026. No formal GHC proposal to
    remove it was found in this pass (see Unverified).

## Excerpts
> "Safe Haskell makes it possible to confine and safely execute untrusted, possibly malicious code. By strictly enforcing types, Safe Haskell allows a variety of different policies from API sandboxing to information-flow control to be implemented easily as monads." (Abstract)

> "In short: it is OK for the client's code to import modules that the server trusts. Notice that trust relates to the person doing the compiling (the server in this case) not the author of the code." (§2.3)

> "At this time the only solution we are aware of is resorting to OS, process-level resource limits." (§8, on resource exhaustion)

## Relevance to the talk
Safe Haskell is the cleanest statement of "effects are types, so the type is the sandbox".
It is also the direct precursor of trust annotations in effect- and capability-typed
languages: a checked safe subset, plus an author-asserted `Trustworthy` escape hatch
whose acceptance is the *compiler-runner's* policy decision. That is the same shape as
an `@assumeSafe`-style annotation in Scala capture checking. The `RIO` example maps
directly onto giving an agent's generated code a restricted tool monad. The limits
transfer too. CPU and memory need an OS-level backstop. Building untrusted code (macros,
TH, build scripts) needs a jail or VM. Every `Trustworthy` module is unverified TCB. The
2021–22 deprecation threads show that a language-level sandbox maintained by a
compiler team decays: guarantees become "unclear" as the language grows. That is the same
erosion Caja suffered with JavaScript.

## Unverified
- I did not find, or check, whether a formal GHC proposal to deprecate Safe Haskell was
  filed or decided after the 2022 thread. Search results paraphrased Eisenberg as later
  favouring "renovate, not remove", but I did not read that message.
- I did not track down a concrete published exploit behind Eisenberg's remark that "the
  lack of unsafeCoerce is not actually guaranteed".
