---
title: Retrofitting Fine Grain Isolation in the Firefox Renderer
url: https://www.usenix.org/conference/usenixsecurity20/presentation/narayan
authors: Shravan Narayan, Craig Disselkoen (UC San Diego); Tal Garfinkel (Stanford); Nathan Froyd, Eric Rahm (Mozilla); Sorin Lerner (UC San Diego); Hovav Shacham (UT Austin); Deian Stefan (UC San Diego)
date: 2020-08-12/14 (29th USENIX Security Symposium)
accessed: 2026-11-22
kind: paper
---

## Summary
Introduces RLBox, a C++ framework for sandboxing third-party libraries *inside* a browser renderer process. Library code runs in an SFI sandbox (NaCl in the paper; WebAssembly in production) or a separate process; all data crossing the boundary is wrapped in `tainted<T>` types so the compiler forces the renderer to validate it. Mozilla shipped it to sandbox the Graphite font library. PDF: https://www.usenix.org/system/files/sec20-narayan.pdf . Companion Mozilla post: https://hacks.mozilla.org/2020/02/securing-firefox-with-webassembly/ (Nathan Froyd, 2020-02-25).

## Key points
- Threat: media/font/compression libraries are a frequent RCE source (e.g. libvorbis exploited at Pwn2Own 2018; libvpx integer overflow hit Chrome and Firefox); over 93% of Alexa Top 500 sites load such content cross-origin.
- Mechanism: static information-flow control in the C++ type system (`tainted<int> status = sandbox_invoke(...)`), plus lightweight dynamic checks; ~100 LOC Clang plugin.
- Libraries sandboxed in evaluation: libjpeg, libpng, libvpx, libtheora, libvorbis, zlib.
- Overheads: end-to-end memory +25% (SFI) / +18% (process isolation), transient at content load; page latency +3% (SFI) / +13% (process).
- Production: RLBox with a Wasm sandbox integrated into Firefox for libGraphite; Tor Browser integrating patches.
- Mozilla post: shipped to Linux in Firefox 74 and Mac in Firefox 75; Wasm compiled ahead-of-time to native via Cranelift/Lucet at Firefox build time; "The wasm code definitely runs slower" (Froyd, comment) but page-load impact not noticeable in tests.

## Excerpts
> "Firefox and other major browsers rely on dozens of third-party libraries to render audio, video, images, and other content. These libraries are a frequent source of vulnerabilities." (Abstract)

> "RLBox supports efficient sandboxing through either software-based-fault isolation or multi-core process isolation." (Abstract)

## Relevance to the talk
Wasm as an *intra-process* sandbox for native code, plus a key insight for agents: isolating the code is half the job — the host must treat everything coming back across the boundary as tainted. Same lesson applies to agent tool outputs.
