---
title: "Caja: Safe active content in sanitized JavaScript"
url: https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/google-caja/caja-spec-2008-01-15.pdf
authors: Mark S. Miller, Mike Samuel, Ben Laurie, Ihab Awad, Mike Stay (Google)
date: 2008-01-15 (draft spec/paper; PDF metadata creation date 2008-01-15). Project archived 2021-01-31 (announced 2020-11-13)
accessed: 2026-11-22
kind: paper
---
Also used:
- Repo and README deprecation notice: https://github.com/google/caja (archived; README
  commit 6e89f92 of 2020-11-13; last push 2020-12-02).
- Security advisories: https://github.com/googlearchive/caja/wiki/SecurityAdvisories, read
  from the raw wiki pages.
- Apps Script SandboxMode reference: https://developers.google.com/apps-script/reference/html/sandbox-mode
- Apps Script deprecation post (2015-10-13):
  https://developers.googleblog.com/2015/10/google-apps-script-update-to-htmlservice.html

## Summary
Caja ("KA-hah", Spanish for "box") was Google's object-capability subset of JavaScript.
Third-party HTML, CSS and JS could run inside a host page with only the authority the
host passed in. A static "sanitizer" rejected non-Caja input and "cajoled" the rest into
JavaScript with runtime checks. JavaScript was too dynamic for anything beyond simple
syntactic rules to be checked statically. Later "modern Caja" moved the JavaScript part
onto **SES (Secure EcmaScript)**, which relies on ES5 strict mode and freezing rather than
rewriting. It was used for, among other things, Google Apps Script's HtmlService
sandbox. Between 2009 and 2019 it published 25 security advisories, several labelled
"complete breach". Google archived it on 2021-01-31, saying it had not kept up with web
security research and had accumulated reported vulnerabilities.

## Key points
- **Thesis of the 2008 paper.** "Caja represents our discovery that a subset of JavaScript
  is an object-capability language." An object-capability language is "a memory-safe
  object language with encapsulation, with additional restrictions that protect the
  outside world from the objects". Objects have no powerful references by default.
- **Mechanisms.**
  - Frozen objects. Functions and prototypes are implicitly frozen, and everything in
    the default global environment is transitively frozen.
  - **No shared global environment.** Each module gets its own global object, which
    inherits from the frozen default.
  - Names ending in `__` are forbidden, which reserves them for runtime bookkeeping.
    Names ending in `_` are protected and usable only after `this.`.
  - No `with` and no `eval`. A safe JSON parser and `caja.eval` replace them.
  - Restrictions on `this`, to stop "this-stealing".
  - **Cajita** is "essentially the subset of Caja without 'this'", described as "a
    reasonably expressive language resembling an object-oriented Scheme".
- **The OS analogy (§3.1).** Full JavaScript is the machine instruction set, the global
  environment is physical memory, and DOM objects are devices. The sanitizer enforces a
  "user-mode" subset that "can compute any computable function, but cannot cause
  external effects nor sense the outside world". The recommended host design is a
  *micro-kernel*: the Caja runtime plus a small app-specific **powerbox** that hands out
  device objects.
- **Static plus dynamic checking.** "Caja's static restrictions can only enforce simple
  syntactic rules. Remaining restrictions must be enforced by runtime checks." Performance
  depended on a fast path for frequent operations.
- **Escapes: the advisory record.** The googlearchive wiki index lists 25 advisories, from
  20 Feb 2009 to 6 Jun 2019.
  - **2009-06-23:** Felix Lee (Yahoo!) found a flaw in the DOM wrappers that allowed
    "arbitrary code with full access to the containing page". It was escalated to a full
    breach on IE6/7. Fixed in r3545.
  - **2012-09-19:** "Arbitrary code execution via setTimeout."
  - **2013-02-13:** "ES5 mode is insufficiently frozen" ("a flaw in the freezing process
    left some objects unfrozen"), and a URI policy that let guests "sneak javascript:
    URIs past Caja". Fixed in r5288.
  - **2015-03-13 (SES):** new ES6 features were reachable without being on the
    whitelist. Prototype links to non-whitelisted objects such as `%TypedArray%`, and new
    syntax such as `function*` reaching `%Generator%`, bypassed taming. The advisory
    lists "Code execution, capability leak, endangered integrity".
  - **2017-11-14:** browsers shipped new ways to run code from strings (dynamic
    `import()`, async function and async generator constructors) that SES did not know
    about: "a complete breach of the Caja sandbox". Fixed in v6012. In response, Caja
    went back to *always parsing and rewriting* input JS so it stayed within the
    understood subset.
  - **2018-04-02:** "Complete breach, only if Flash enabled."
  - **2019-06-06:** renaming a non-whitelisted element (e.g. `<title>` to
    `<caja-v-title>`) changed raw-text parsing, so unfiltered markup reached the browser:
    "a complete breach of the Caja DOM sandbox". Fixed in v6014.
  - Other "Complete breach" entries: 2016-01-28 (guest HTML only) and 2016-04-21.
- **Pattern in the escapes.** Few escapes came from the ocap model itself. Most came from
  the gap between Caja's model of the platform and the platform's real behaviour: new
  language features, new built-ins, browser quirks, HTML parser differentials, and taming
  of host APIs (DOM wrappers, `setTimeout`, `google.load`, Flash). This is the same
  "taming database" weakness Joe-E admits.
- **Deprecation, Apps Script.** Google deprecated HtmlService's Caja-based `NATIVE` and
  `EMULATED` sandbox modes on 2015-10-13. `EMULATED` was sunset 2015-12-10 and `NATIVE`
  on 2016-07-06. `IFRAME` mode "uses iframe sandboxing instead of the Caja sandbox
  technology". The public reason given was that IFRAME "provides faster UIs and has more
  capabilities".
- **Deprecation, project archive.** The README notice (commit 2020-11-13) reads: "On
  January 31st, 2021, we will be archiving the Caja project." Patches stop, including
  "patches for security issues". The stated reason is quoted below. Users of Caja's
  HTML/CSS sanitizers are pointed to the Closure toolkit, with CSP and Trusted Types.
- **Lineage (context, not from these documents).** SES continued outside Google as
  "Hardened JavaScript" (Agoric/Endo, `lockdown()`/`harden()`, Compartments), and Miller
  was involved in ES5 standardisation. Neither claim was checked against a primary source
  for this note.

## Excerpts
> "Caja represents our discovery that a subset of JavaScript is an object-capability language." (Caja paper, abstract/§1)

> "This is a complete breach of the Caja sandbox. All users should immediately upgrade to Caja v6012 or later." (Caja Security Advisory 2017-11-14)

> "Caja has not been actively maintained or developed to keep up with the latest research on web security. As a result, several security vulnerabilities have been reported to Caja, both by Google's security engineers and by external researchers." (google/caja README, "Deprecation")

## Relevance to the talk
Caja is the cautionary tale for in-process sandboxing on a host language you do not
control. The model was sound. The enforcement depended on a whitelist of a platform
(JavaScript plus the DOM) that kept growing underneath it. Each new built-in, syntax form
or parser quirk was a potential escape until someone tamed it. For agent runtimes that
expose a language interpreter (JS/Python "code mode" tools, QuickJS/V8 isolates,
Starlark-like DSLs), the lesson is to *parse and rewrite to a known subset* rather than
blacklist, and to treat every host binding as a taming decision. It is also a reminder
that Google itself replaced the language-level sandbox with a browser-enforced one (iframe
sandbox, i.e. an out-of-process or origin boundary) for its own product. See also V8's
"Spectre is here to stay" (elsewhere): same-process isolation also lost to side channels.
