---
title: "Continuation-Centric Computing with Arca"
url: https://www.usenix.org/conference/osdi26/presentation/srivatsan
authors: Akshay Srivatsan, Yuhan Deng, Katherine Mohr, Emma Sudo, Sebastian Ingino, Francis Chua, Keith Winstein (Stanford University)
date: 2026-07 (OSDI '26, Seattle, July 13–15, 2026)
accessed: 2026-11-22
kind: paper
---
PDF: https://www.usenix.org/system/files/osdi26-srivatsan.pdf (only the abstract and introduction read so far)

## Summary
Proposes “continuation-centric computing” for serverless-style work: short tasks
that spend much of their time waiting on dependencies. In Arca, an OS that provides
continuation capture as a core service, a running function can capture its current
continuation, a lightweight snapshot of its state, as a separate function that can
be paused, migrated or copied. Processes have Unix-like guarantees and isolation.

## Key points
- Commercial serverless slices invocations down to a few ms or 128 MiB of RAM;
  research pushes finer.
- Continuations are serializable and portable.

## Excerpts
> “a running function can capture its current continuation—a lightweight snapshot of its state—as a distinct function that can be paused, migrated, or copied as needed.” (Abstract)

## Relevance to the talk
Agents also spend most of their wall time waiting, on the model or on tools.
Capturing a sandbox when it blocks and resuming or forking it later is a direct
route to density (idle agents cost storage, not RAM) and to “fork the workspace,
try N approaches”. TODO: read the evaluation for numbers.
