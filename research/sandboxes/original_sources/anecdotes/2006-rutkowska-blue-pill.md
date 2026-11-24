---
title: "Introducing Blue Pill"
url: https://theinvisiblethings.blogspot.com/2006/06/introducing-blue-pill.html
authors: Joanna Rutkowska (then COSEINC; later Invisible Things Lab, Qubes OS)
date: 2006-06-22
accessed: 2026-11-22
kind: blog
---

Also read: Rutkowska, "We're ready for the Ptacek's challenge!" (2007-06-28, https://theinvisiblethings.blogspot.com/2007/06/were-ready-for-ptaceks-challenge.html). For the technical rebuttal see `2007-garfinkel-compatibility-is-not-transparency.md`.

## Summary
Rutkowska announced Blue Pill, a proof-of-concept that uses AMD's new SVM ("Pacifica") hardware virtualisation to **move a running OS (Vista x64) into a virtual machine on the fly**, with no reboot, under an ultra-thin malicious hypervisor. Her claim was that its stealth did not rest on an obscure trick, so it would stay undetectable even with the concept and code public: "100% undetectable malware". The name is the Matrix: "your operating system swallows the Blue Pill and it awakes inside the Matrix". She announced a Vista x64 demonstration for SyScan (Singapore) and Black Hat USA in July–August 2006.

**The dispute.** In 2007 Thomas Ptacek "and company" (per press reports, Nate Lawson and Peter Ferrie) challenged her to a detection contest at Black Hat. Rutkowska "accepted" with conditions: 5 machines instead of 2, a detector that may not use more than 90% CPU for more than about a second, and payment for making the prototype "commercial grade", estimated at **6 months' full-time work by 2 people at $200/hour per person** (about $384k, the figure the press reported). According to press coverage (second-hand: Dark Reading, eWeek), the contest never happened. The academic verdict (Garfinkel, Adams, Warfield, Franklin, HotOS 2007) was that a truly transparent VMM is "fundamentally infeasible", because timing, TLB and other anomalies give it away. "100% undetectable" did not survive scrutiny; the narrower and still true point is that hardware virtualisation lets the **sandbox be built underneath you**.

## Key points
- This is the inverted sandbox: the OS thinks it is on bare metal but runs inside the attacker's VM. Popek–Goldberg equivalence used as an attack.
- Her challenge terms ask the detector to work without "significant amount of CPU time", which rules out the timing-loop detectors critics proposed.
- The lasting legacy is not malware. Rutkowska went on to build Qubes OS, a desktop compartmentalised with Xen VMs.

## Excerpts
> "Over the past few months I have been working on a technology code-named Blue Pill, which is just about that - creating 100% undetectable malware, which is not based on an obscure concept." (2006 post)

> "your operating system swallows the Blue Pill and it awakes inside the Matrix controlled by the ultra thin Blue Pill hypervisor" (2006 post)

> "We believe that we would need about 6 months full-time work by 2 people to turn it into such a commercial grade creature that would win the contest described above." (2007 post)

## Relevance to the talk
This belongs in the VMs section, as the moment virtualisation became an attack primitive and "am I in a VM?" became a security question. Hook: *"Your OS swallows the blue pill and wakes up inside the Matrix — undetectable, she said, for $384k."* It also sets up sandbox detection by malware, and by agents (cf. Avida's "play dead" and models' evaluation awareness). Present it as a famous claim that was contested; the contest was never run.
