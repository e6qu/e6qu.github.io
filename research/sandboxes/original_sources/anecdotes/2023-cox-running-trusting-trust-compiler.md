---
title: "Running the “Reflections on Trusting Trust” Compiler"
url: https://research.swtch.com/nih
authors: Russ Cox
date: 2023-10-25
accessed: 2026-11-22
kind: blog
---

## Summary
In a conference Q&A (Cox watched the video in September 2023), Ken Thompson said nobody had ever asked him for the code ("Never been asked. I still have the code."). Cox emailed and got it: **`nih.a`, 99 lines of code plus a 20-line shell script**, dating from about June 1974 to June 1975. Cox runs it on a simulated Research Unix, shows `login: root` / `Password: codenih` working, and ports the idea to the Go toolchain. He also untangles the deployment story from the many tellings. Thompson released it "in a very controlled sense" to Bell Labs' **PWB group**, not USG as is often said. The `login` program there did get backdoored. **PWB noticed something was wrong because the compiler got bigger every time it compiled itself.** They broke the reproduction without ever finding the cause.

## Key points
- **Rumour debunked:** the Jargon File repeats reports that the backdoored `login` reached **BBN** and allowed a late-night login as `kt`. Cox says Thompson told him it could not have gotten to BBN, and the technical details do not fit either.
- The detection signal was a **size side channel**: the binary grew on each self-compile. Behavioural anomalies (size, time, syscalls) often betray what source review misses.
- Thompson in the Q&A: "I got it released, or I got somebody to steal it from me, in a very controlled sense, and then tracked whether they found it or not. And they didn’t."
- The magic password was `codenih` ("nih" = "not invented here").

## Excerpts
> "PWB discovered something was amiss because the compiler got bigger each time it compiled itself" (Controlled Deployment)

> "99 lines of code, plus a 20-line shell script" (Reflections on Reflections)

> "I mentioned this to Ken, and he said it could not have gotten to BBN." (Controlled Deployment)

## Relevance to the talk
Use it as the second half of the Trusting Trust slide: it was real, it was deployed inside Bell Labs, and it was caught by a side channel, not by reading source. Hook: *"The backdoor was found because the compiler kept getting fatter."* It is also a model for the talk's method of checking the famous story against the primary source: the BBN tale is folklore.
