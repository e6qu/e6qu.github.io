---
title: "EC2 Maintenance Update"
url: https://aws.amazon.com/blogs/aws/ec2-maintenance-update/
authors: Jeff Barr (AWS)
date: 2014-09-25
accessed: 2026-11-22
kind: blog
---

Also read: Xen Security Advisory XSA-108 / CVE-2014-7188, "Improper MSR range used for x2APIC emulation" (public 2014-10-01, https://xenbits.xen.org/xsa/advisory-108.html).

## Summary
In late September 2014 AWS told customers it would **reboot part of the EC2 fleet (under 10%) within days** for an embargoed Xen security issue that had to be fixed before 1 October. When the embargo lifted, XSA-108 turned out to be a small range bug. The x2APIC model uses 256 MSRs, but Xen's emulation **covered 1024**. Writes to the extra MSRs were harmless no-ops, but reads went past the single page allocated for APIC emulation, so **a malicious HVM guest could crash the host or read other guests' or the hypervisor's memory**. Jeff Barr's post also had to clarify that the reboots had nothing to do with Shellshock, the Bash bug in the news that same week.

## Key points
- Off by a factor of four in one constant: 256 versus 1024 MSRs. Hypervisor emulation code is security code.
- Mitigation per the advisory: "Running only PV guests will avoid this vulnerability". The guest type is a security choice.
- This is a platform-engineering lesson: the provider had to schedule fleet-wide host reboots under embargo. Today live migration and live patching are expected so that customers never see this.

## Excerpts
> "we started notifying some of our customers of a timely security and operational update we need to perform on a small percentage (less than 10%) of our EC2 fleet globally" (AWS post)

> "the instances that need the update require a system restart of the underlying hardware and will be unavailable for a few minutes while the patches are being applied and the host is being rebooted" (AWS post)

> "Hypervisor code emulating read and write accesses to these MSRs erroneously covered 1024 MSRs." (XSA-108)

> "A buggy or malicious HVM guest can crash the host or read data relating to other guests or the hypervisor itself." (XSA-108)

## Relevance to the talk
This is a short platform-engineering anecdote for the VMs section on the operational cost of a shared hypervisor. Hook: *"AWS rebooted a chunk of the cloud because Xen counted to 1024 instead of 256."* It shows why microVM fleets care about live patching and minimal emulation.
