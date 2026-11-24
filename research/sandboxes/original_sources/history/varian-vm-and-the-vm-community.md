---
title: "VM and the VM Community: Past, Present, and Future"
url: https://www.leeandmelindavarian.com/Melinda/neuvm.pdf
authors: Melinda Varian (Princeton University)
date: 1989 (presented at Australasian SHARE/GUIDE, Melbourne); this edition dated April 1991, with later revisions online
accessed: 2026-11-22
kind: paper
---

## Summary
The standard community history of CP-40, CP-67 and VM/370, built on
interviews and private correspondence with the original Cambridge
Scientific Center developers (Creasy, Comeau, Bayles, Harmon and others). It
supplies the precise dates that Creasy's own retrospective leaves vague,
including the design start in late 1964, production use in January 1967 and
the VM/370 announcement on 2 August 1972.

## Key points
- Creasy and Comeau spent "the last week of 1964" brainstorming CP-40.
- CP-40 supported a fixed 14 virtual machines of 256K each; the Control
  Program partitioned real disks into *minidisks* and mediated disk access by
  translating channel programs (CCW translation).
- CP-40 and CMS went into production with a regular user schedule in
  January 1967; OS/360 had already been made to run in a virtual machine.
- Early 1967: CP-40 was modified to *simulate* a Model 67 so that CP-67 could
  be developed before the real hardware arrived (an early nested
  virtualization).
- 30 June 1970: System/370 announced *without* address translation.
- 2 August 1972: System/370 Advanced Function announcement — 370/158 and
  370/168, relocation hardware on all 370s, and four OSes including VM/370.
- The SHARE VM/370 Project met eight days after the announcement.

## Excerpts
> "Although there were a fixed number (14) of virtual machines with a fixed
> virtual memory size (256K), the Control Program managed and isolated those
> virtual machines in much the way it does today." (p. ~39)

> "CP-40 and CMS were put into production with a regular user schedule in
> January, 1967." (p. ~40)

> Comeau, quoted: the architected System/360 interface "also provided a high
> level of integrity and security."

## Relevance to the talk
Source for the dated timeline of the mainframe VM era (1964 → 1967 → 1972)
and for the point that the VM's security came from reusing a fully
architected hardware interface — the same argument later made by Popek &
Goldberg and by modern microVM advocates.
