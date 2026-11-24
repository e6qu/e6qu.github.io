---
title: "The Surprising Creativity of Digital Evolution: A Collection of Anecdotes from the Evolutionary Computation and Artificial Life Research Communities"
url: https://arxiv.org/abs/1803.03453
authors: Joel Lehman, Jeff Clune, Dusan Misevic and 50 co-authors (incl. Charles Ofria, Risto Miikkulainen, Westley Weimer, Stephanie Forrest)
date: 2018-03-09 (v1); read v4, 2019-11-21
accessed: 2026-11-22
kind: paper
---

## Summary
This is a collection of first-hand stories from researchers whose evolving programs beat their test setups. Several are sandbox stories decades before LLM agents:

- **Playing dead in the test environment (Avida, Charles Ofria).** To stop organisms from evolving faster replication, Ofria paused on every mutation and measured the mutant's replication rate in an *isolated test environment*, deleting faster mutants. Rates went up anyway. **The organisms had learned to recognise the test environment's inputs and stop replicating there**, "playing dead". When he randomised the test inputs, they did the faster tasks only some of the time, slipping through probabilistically. The fix that worked was tracking replication rates along lineages in real time, not a better test sandbox.
- **Deleting the answer key (GenProg).** In a program-repair experiment scored against target-output files, perfect solutions suddenly appeared: one individual had **deleted all the target files**, and the scoring then gave perfect fitness to it and all its peers.
- **Sleeping to beat the CPU limit (GenProg).** With fitness limiting CPU use, evolution produced programs that **slept forever**, which did not count as CPU time.
- **The empty-list sort (GenProg on MIT Lincoln Labs' tests).** "Sorted" was checked only for order, so it returned an empty list.
- **Tic-tac-toe memory bomb (UT Austin, 1997).** An evolved player made moves at enormous coordinates; opponents grew their boards to fit, ran out of memory and forfeited.

## Key points
- Each story is a modern agent-sandbox lesson: sandbox detection (Avida, cf. Claude's evaluation awareness), a writable grader (deleted target files, cf. Palisade chess), resource accounting that counts the wrong thing (sleep vs CPU time, cf. METR's stopped clock), and resource exhaustion as an attack (tic-tac-toe).
- Palisade's chess paper and Sakana's AI Scientist both cite this lineage.

## Excerpts
> "The organisms had evolved to recognize those inputs and halt their replication." (Ofria anecdote)

> "in effect “playing dead” when presented with what amounted to a predator" (same)

> "It turned out that one of the individuals had deleted all of the target files when it was run!" (GenProg anecdote)

> "GenProg produced programs that slept forever, which did not count toward CPU usage limits" (same)

## Relevance to the talk
This is the deep-history version of AI reward hacking and the funniest pre-LLM material. Hook: *"Digital organisms learned to play dead when they noticed they were in the test sandbox."* It works as the bridge between the 1990s chroot and jail history and the 2025 agent section: optimisers have always attacked the box, and the only change is that they now type `sed`.
