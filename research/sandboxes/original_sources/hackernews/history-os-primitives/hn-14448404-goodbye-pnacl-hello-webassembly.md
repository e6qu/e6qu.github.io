---
title: "Goodbye PNaCl, Hello WebAssembly"
url: https://news.ycombinator.com/item?id=14448404
story_url: https://blog.chromium.org/2017/05/goodbye-pnacl-hello-webassembly.html
authors: HN discussion of the Chromium blog post; related threads with tptacek (2008–2009), jfbastien (JF Bastien, PNaCl/WebAssembly), azakai (Alon Zakai, Emscripten), BrendanEich
date: 2017-05-30
accessed: 2026-11-22
kind: discussion
points: 655
comments: 343
---

Read via the HN Algolia items API. Related threads used here:
[Native Client: A Technology for Running Native Code on the Web](https://news.ycombinator.com/item?id=390352)
(2008-12-08, launch), [The Security Implications Of Google Native Client](https://news.ycombinator.com/item?id=610511)
(2009-05-15, Matasano post), [Portable Native Client](https://news.ycombinator.com/item?id=6719217)
(2013-11-12, 179 points). Our note: [yee-2009-native-client](../../history/yee-2009-native-client.md).

## Summary
Google announced it would remove PNaCl in early 2018 in favour of
WebAssembly. The 2017 thread is mostly about the web platform: Mozilla's
refusal of Pepper and PNaCl, asm.js, Chrome Apps, and lost
functionality (raw sockets for the Chromebook SSH client). The security
story is in the older threads. At the 2008 launch, Ptacek explained
that NaCl was not ActiveX: a verifier allowed only a checked subset of
x86, with segment-based isolation and a fixed set of virtual syscalls.
By 2016 a NaCl engineer described its record as "an extremely secure
sandbox", and the people who built PNaCl moved on to WebAssembly.

## Key points
- NaCl's model in Ptacek's words (2008): "a strictly controlled subset of x86, with all bblock edges verified, in a per-process environment that uses segment access controls… without access to the full system call table… basically a faster version of the Java applet sandbox".
- 2009: NaCl programs cannot make native syscalls; the verifier limits them to "a set of virtual system calls defined by Google" — "like its own cross-platform OS interface" (Ptacek). A commenter counts 44 syscalls.
- Recurring misreading: "Google is re-implementing ActiveX!" (2008) and "1996 is knocking" (2013); Ptacek: ActiveX runs "unchecked native x86 code with full access to the system call table".
- Continuity to Wasm: "several of the people working on WebAssembly are actually from the PNaCl team" (azakai, 2015); Bastien (2016) expected PNaCl's capabilities to become polyfillable on Wasm.
- 2017 complaints: PNaCl was faster for some workloads (a chess engine: 2000 vs. 300 knode/s, lawthemi); Chromebook SSH needed real sockets; ZeroVM, a server sandbox built on NaCl, never caught on (willvarfar).
- Mozilla's side: "When Mozilla didn't accept PNaCl and Pepper API proposed by Google, Mozilla went down the ASM path" (withjive).

## Excerpts
> "It is basically a faster version of the Java applet sandbox." — tptacek (2008), <https://news.ycombinator.com/item?id=390678>

> "Your coworker doesn't really understand ActiveX; ActiveX controls execute unchecked native x86 code with full access to the system call table. NaCL falls somewhere in between VMWare and the Java Bytecode Verifier." — tptacek (2008), <https://news.ycombinator.com/item?id=390676>

> "NaCl programs are restricted by the verifier so that they can only run a set of virtual system calls defined by Google." — tptacek (2009), <https://news.ycombinator.com/item?id=610816>

> "Otherwise NaCl and PNaCl have a solid track record of running code near native speed in an extremely secure sandbox." — jfbastien (2016), <https://news.ycombinator.com/item?id=11290439>

> "Of course, several of the people working on WebAssembly are actually from the PNaCl team." — azakai (2015), <https://news.ycombinator.com/item?id=9735027>

> "This is a sad day. NaCL was excellent tech, and its a shame it didn't get incorporated into LLVM proper, and that it didn't take off." — willvarfar, <https://news.ycombinator.com/item?id=14450590>

## Relevance to the talk
The SFI line from Wahbe (1993) to NaCl (2009) to WebAssembly (2017), with
a contemporary explanation of how a verifier differs from a plugin with
full syscall access. Shows that the sandbox survived even though the
product (NaCl, PNaCl, Pepper) was killed by standards politics.
