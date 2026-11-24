---
title: Capability Myths Demolished
url: http://www.erights.org/talks/myths/
authors: Mark S. Miller (Combex, Inc.), Ka-Ping Yee (UC Berkeley), Jonathan Shapiro (Johns Hopkins University)
date: 2003-03 (Technical Report SRL2003-02, Systems Research Laboratory, Dept. of Computer Science, Johns Hopkins University)
accessed: 2026-11-22
kind: paper
---
The original PDF link (http://srl.cs.jhu.edu/pubs/SRL2003-02.pdf) no longer returns the PDF.
Read from the mirror https://classpages.cselabs.umn.edu/Fall-2024/csci5271/papers/SRL2003-02.pdf (6 pp.).
The month "mar 2003" comes from the bibliography entry [MYS03] in Miller's 2006 thesis; the PDF itself shows no date.

## Summary
The paper rebuts three claims about capability systems that were common wisdom at the time.
The **Equivalence Myth** holds that ACLs and capabilities are formally equivalent views of
Lampson's access matrix. The **Confinement Myth** holds that capability systems cannot
enforce confinement. The **Irrevocability Myth** holds that capability-based access cannot
be revoked. The authors argue that the myths arise from weaker models of what a
"capability" is: rows of the access matrix, or copyable physical keys. To show this they
define four models and seven distinguishing properties (A–G). Under the "object
capability" model, the one actual capability systems implement, confinement and
revocation both follow directly, and capabilities beat ACLs on least privilege and on
confused-deputy problems.

## Key points
- **Four models.** (1) ACLs as columns; (2) capabilities as rows; (3) capabilities as keys;
  (4) object capabilities, in which capabilities are object references.
- **Seven properties.**
  - **A. No Designation Without Authority.** Naming a resource conveys the authority to use it.
  - **B. Dynamic Subject Creation.**
  - **C. Subject-Aggregated Authority Management.**
  - **D. No Ambient Authority.** Subjects must *select* which authority to exercise.
  - **E. Composability of Authorities.** Resources are also subjects.
  - **F. Access-Controlled Delegation Channels.** X needs access to Y to pass Y an authority.
  - **G. Dynamic Resource Creation.**

  Figure 13 tabulates which model has which. Unix and NT filesystem ACLs "lack all six of
  Properties A through F". "POSIX capabilities" fit capabilities-as-rows but lack G.
- **Ambient authority, defined.** It is authority "that is exercised, but not selected, by
  its user". The example is Unix `open()`: "the request merely succeeds or fails". The
  paper ties the absence of Property D to confused-deputy vulnerability ("hopeless
  without D, best if A").
- **Confinement.** In the object-capability model, Alice can give Bob access to Carol only
  if she already holds both. So "no capability transfer can introduce a new connection
  between two objects that were not already connected by some path". Confinement is
  graph disconnection: to keep Bob isolated, do not give anyone a path to him. The
  existence proof is KeyKOS *factories*, cited from Karger 1988.
- **Who spread the confinement myth.** The paper quotes Wallach, Balfanz, Dean & Felten's
  paper on extensible security architectures for Java, which called it "the fundamental
  flaw in an unmodified capability system" that programs can share references without
  mediation. It is a direct link to the Java stack-inspection / SecurityManager
  lineage (covered elsewhere).
- **Boebert's 1984 *-property argument.** Boebert's result holds only where the system
  cannot tell data transfer from capability transfer, as in password capabilities such as
  Amoeba. Partitioned or type-enforced capability systems can enforce the *-property.
  The paper cites a formal verification of this point [22].
- **Revocation.** Revocation is Redell's 1974 forwarder pair. Alice creates a forwarding
  facet F and a revoking facet R, gives Bob F, and keeps R. Invoking R makes F useless to
  Bob and to anyone Bob passed F to. "No capabilities were themselves revoked," which is
  the grain of truth behind the myth. This requires Property E, since forwarders must be
  able to stand in for resources. The scheme was implemented in CAP-III, and KeyKOS and
  EROS cache the indirection.
- **Limits (our reading, not stated as such in the paper).** The arguments are about overt
  authority (who can cause what through references). Nothing in them addresses covert or
  timing channels. They also assume
  references cannot be forged or turned into bit strings, which is exactly the property
  in-process sandboxes must preserve.

## Excerpts
> "We will use the term ambient authority to describe authority that is exercised, but not selected, by its user." (section "Keys versus Rows: Ambient Authority")

> "The requirement for both capabilities makes confinement possible, since no capability transfer can introduce a new connection between two objects that were not already connected by some path." ("Achieving Confinement")

> "Alice hasn't revoked Bob's capability itself, but she has revoked the access to Carol represented by that capability." ("Revocable Access in Object-Capability Systems")

## Relevance to the talk
This paper is the short answer to "but can a capability-passing sandbox revoke or contain
anything?". For an in-process agent runtime, the answer is yes. Containment means not
handing the agent a reference to the network or filesystem object. Revocation means
handing it a caretaker or forwarder rather than the raw tool, and disabling it later.
"Ambient authority" (Property D) is the term to use when contrasting tool calls that
inherit the whole process's rights, as in a shell subprocess running as the user, with
tools passed in as explicit references. It also connects Hardy's confused deputy
(elsewhere) to the language-level design rule: designation must carry authority (A), and
authority must be selected (D).
