---
title: "Stalking the Wily Hacker"
url: https://nsarchive.gwu.edu/sites/default/files/documents/5626281/Clifford-Stoll-Communications-of-the-ACM.pdf
authors: Clifford Stoll (Lawrence Berkeley Laboratory)
date: 1988-05 (Communications of the ACM 31(5), pp. 484–497, doi:10.1145/42411.42412); events from August 1986
accessed: 2026-11-22
kind: paper
---

Read from the National Security Archive's scan (the ACM DL PDF returned 403). Stoll's book *The Cuckoo's Egg* (1989) tells the same story at length; the book was not read for this note.

## Summary
In August 1986 an LBL computer reported an accounting error: a new account had been created without a billing address. Stoll, an astronomer turned sysadmin, found an intruder acting as system manager. **Instead of locking him out, LBL let him stay and watched**: printers and recorders on every incoming line captured every keystroke, so the intruder could not detect the monitoring. He got root through a bug in **GNU Emacs's setuid-root `movemail`**: he moved a shell script into a system area so that it would run as a periodic system job. Over ten months he tried about 450 computers and got into more than 30, mostly military and defence-contractor machines, using default accounts and passwords found lying around. To keep him connected long enough for the phone trace, Stoll **baited him with fake "SDI" (Star Wars) memos** from a non-existent secretary, with alarms set on who read them. The intruder read them for over an hour, the trace completed, and the team celebrated with milkshakes. Months later a letter arrived from someone in the US asking to join the fictitious SDI mailing list. The trail led to Germany and the case went to the FBI and the BKA.

## Key points
- This is the original "keep the attacker inside and observe" operation: a human honeypot that predates Cheswick's Berferd jail (1991).
- The monitors were **off-line** (line printers on the serial lines), so the attacker could not see or tamper with them even with root. That is the same principle as monitoring an agent from outside its sandbox.
- The KGB connection (the intruder was later tied to selling material to the KGB) comes from the book and later reporting. This 1988 paper only says it "suggested espionage" and left that to the FBI.
- The famous detail that the intrusion was spotted through a **75-cent accounting discrepancy** comes from the book. This paper says only "an accounting error" from an account without a billing address.
- The privilege escalation was a confused-deputy bug in a setuid helper. That class later motivated capability and sandboxing work already in the corpus (`history/hardy-1988-confused-deputy.md`).

## Excerpts
> "Instead of trying to keep the intruder out, we took the novel approach of allowing him access while we printed out his activities and traced him to his source." (opening)

> "We first suspected a break-in when one of LBL’s computers reported an accounting error." (Detection)

> "We baited the intruder by creating several files of fictitious text . . . [that] appeared to be memos about how computers were to support research for SDI." (pull quote)

> "We celebrated with milk shakes made with homegrown Berkeley strawberries, but the celebration proved premature." (A Stinger to Complete the Trace)

## Relevance to the talk
This belongs in the history section, before chroot jails, as the founding story of observing an adversary inside a box you control. Hook: *"An astronomer caught a German intruder with fake Star Wars memos and a room full of printers."* It sets up Berferd ("the jail") and the 2026 Mythos sandwich email (the inmate contacting the warden). The off-line monitor point carries over directly to agent oversight.
