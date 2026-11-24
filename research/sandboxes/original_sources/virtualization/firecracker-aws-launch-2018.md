---
title: Firecracker – Lightweight Virtualization for Serverless Computing
url: https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/
authors: Jeff Barr (AWS News Blog)
date: 2018-11-26
accessed: 2026-11-22
kind: blog
---

## Summary
The re:Invent 2018 launch post that open-sourced Firecracker. It explains that Lambda originally isolated customers with dedicated EC2 instances, and introduces Firecracker as a KVM-based VMM producing microVMs that start "in a fraction of a second". It gives the public launch figures (125 ms, ~5 MiB per microVM), names Lambda and Fargate as production users, and lists the security design (minimal device model, jailed process, static linking).

## Key points
- Lambda launched at re:Invent 2014; "trillions of executions for hundreds of thousands of active customers every month" (as of Nov 2018).
- Fargate (launched 2017) "now runs tens of millions of containers for AWS customers every week".
- Original Lambda isolation: "we used dedicated EC2 instances for each customer".
- "You can launch a microVM in as little as 125 ms today (and even faster in 2019)".
- "Firecracker consumes about 5 MiB of memory per microVM."
- "We started with crosvm and set up a minimal device model"; written in Rust.
- Guest device model: network device, block device, PIT, KVM clock, serial console, partial keyboard (just enough to reset the VM).
- "Process Jail – The Firecracker process is jailed using cgroups and seccomp BPF"; statically linked; launched from a jailer.
- Control plane: a REST API over a Unix domain socket (`/machine-config`, `/boot-source`, `/drives`, `/actions`).

## Excerpts
> "In order to attain the desired level of isolation we used dedicated EC2 instances for each customer."

> "Low Overhead – Firecracker consumes about 5 MiB of memory per microVM. You can run thousands of secure VMs with widely varying vCPU and memory configurations on the same instance."

## Relevance to the talk
Date-stamps the microVM era (26 Nov 2018) and the crosvm lineage. Useful for the "serverless forced a new isolation primitive" slide.
