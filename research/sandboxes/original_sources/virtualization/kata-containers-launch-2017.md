---
title: OpenStack Foundation Announces Kata Containers (InfoQ news report on the launch)
url: https://www.infoq.com/news/2017/12/openstack-kata-containers
authors: InfoQ (reporting the OpenStack Foundation announcement; press release at https://openstack.org/news/view/365/kata-containers-project-launches-to-build-secure-container-infrastructure)
date: 2017-12 (project announced 2017-12-05 at KubeCon Austin; GitHub org repo created 2017-12-07)
accessed: 2026-11-22
kind: blog
---

## Summary
Kata Containers was launched by the OpenStack Foundation in December 2017 by merging Intel's Clear Containers (containers in lightweight VMs using VT) with Hyper.sh's runV (an OCI runtime for Xen/KVM). The aim: an OCI-compatible runtime where each pod/container gets its own lightweight VM, giving VM isolation while plugging into Docker/Kubernetes. Note: the OpenStack press-release page rendered empty to our fetcher; date and contributors were confirmed via InfoQ and search results (press release, TechCrunch 2017-12-05).

## Key points
- "born out of contributions from Intel's Clear Containers and Hyper's runV projects" (InfoQ).
- "Clear Containers launches containers in lightweight virtual machines by utilizing Intel's VT technology."
- "Hyper's runV is a compliant implementation of the OCI runtime."
- Governed under the OpenStack open governance model (now OpenInfra Foundation).
- Launch date 2017-12-05 (press release / TechCrunch, per search results); Kata 1.0 reported 2018-05-22 (eWeek, per search results — not read directly).
- The Kata TSC members (Intel's Samuel Ortiz, Hyper's Xu Wang) are quoted welcoming gVisor in Google's May 2018 announcement — the two approaches emerged side by side.

## Excerpts
> "Clear Containers launches containers in lightweight virtual machines by utilizing Intel's VT technology." (InfoQ)

## Relevance to the talk
Dates the "VM-per-container" runtime idea (2015 Clear Containers / runV → Dec 2017 Kata), a year before Firecracker was open-sourced. The marketing line "the speed of containers, the security of VMs" is attributed to Kata by Young et al. (HotCloud 2019).
