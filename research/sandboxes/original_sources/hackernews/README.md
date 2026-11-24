# Hacker News — stories and comments on every topic of the talk

Mined 2026-11-22 through the HN Algolia API (`hn.algolia.com/api/v1`): about 1,000
query variants across four agents, covering stories and comments. Each folder
has three parts:

- `index.md`: the exhaustive raw list, one line per story
  (`date · points · comments · HN link · original link`), grouped by subtopic,
  newest first. Stories with a note are marked.
- `hn-<id>-<slug>.md`: notes on the most significant threads (`kind: discussion`),
  each with 3–8 short comment quotes and their permalinks.
- `README.md`: the note index, a synthesis, and the best quotes for slides.

| Folder | Stories indexed | Thread notes | Covers |
|---|---|---|---|
| [history-os-primitives](history-os-primitives/README.md) | 1,048 | 22 | chroot, jails, Zones, capabilities, Plan 9, namespaces, cgroups, seccomp, Landlock, pledge, Docker's launch, container escapes, io_uring |
| [virtualization-density](virtualization-density/README.md) | 1,037 | 27 | Xen/KVM/QEMU, Firecracker, gVisor, Kata, unikernels, Wasm, V8 isolates, Spectre, SFI/LFI, snapshots, density |
| [macos-windows](macos-windows/README.md) | 577 | 25 | Seatbelt, App Sandbox, Apple `container`, Docker Desktop/OrbStack, the 2-VM limit, WSL1/WSL2, Windows Sandbox, MXC |
| [agents](agents/README.md) | 376 | 30 | agent sandboxes, hosted sandboxes, prompt injection and MCP, incidents, parallel agents; plus [practitioner-setups.md](agents/practitioner-setups.md) (399 setups from 330 commenters) |

Quotes were checked against the fetched thread text, and handles and point counts
against the API. Commenters' roles (e.g. "Apple engineer") come from what they
say in the thread; unverified roles are flagged in the notes. fws and fwe have not
appeared on HN. The only e6qu repository posted is
[`e6qu/sclaude`](https://news.ycombinator.com/item?id=49710493) (2026-09-15).

## Cross-cutting synthesis

1. **Containers were never the boundary, and their builders said so.**
   - Docker launch day, 2013: "you probably don't want to run untrusted code with
     root privileges inside a container" ([Hykes](https://news.ycombinator.com/item?id=5408930)).
   - Every escape since (shocker, `waitid`, runc, cgroups) replayed the same
     argument, settling on "container image, VM boundary".
2. **The real line is the shared kernel, not hardware vs software.**
   - "The big difference is between shared-kernel multitenant and guest kernels"
     ([tptacek](https://news.ycombinator.com/item?id=50398546)).
   - Cloudflare dissents for isolates on density grounds: 10,000+ tenants per
     machine, and the threshold is "mostly vibes"
     ([kentonv](https://news.ycombinator.com/item?id=49925639)).
   - Spectre caps all in-process schemes: "break confidentiality for in-process
     memory, regardless of sandboxing technology"
     ([titzer](https://news.ycombinator.com/item?id=29466606)).
3. **On the desktop, VMs win by default, and people resent the cost.**
   - "Still deprecated. Still in use by everyone." on Seatbelt
     ([selridge](https://news.ycombinator.com/item?id=47102070)).
   - The 2-VM licence limit and VM memory that is "never freed"
     ([kdrag0n](https://news.ycombinator.com/item?id=34720219)) push agent vendors
     into a VM each anyway (Anthropic's 10 GB Cowork bundle, Claude Desktop's 1.8 GB
     Hyper-V VM).
   - WSL1's post-mortem shows how hard syscall translation is, which is directly
     relevant to fwe.
4. **For agents, vendors ship gates while practitioners build boxes.**
   - About 3% of practitioners who describe a setup rely on the agent's built-in
     sandbox; the rest use a VM (26%), a container (25%), off-machine hosts (12%)
     or a process sandbox (17%).
   - In an unprompted setup thread, only about 12% mention any isolation at all.
   - Damage comes from authority the agent already had, not escapes.
   - Prompt injection goes straight through VMs via any allowed site that hosts
     user content.

## Data quality notes
- The four agents shared one scratch directory and overwrote each other's raw
  query results at times. Each noticed, re-ran its lost queries and checked
  counts against the API. The indexes are the checked output; the raw dumps
  in the session scratchpad are not durable.
- Algolia search is fuzzy, so off-topic hits were removed by hand. A few may
  remain, and stories whose titles don't name the technology are missing unless
  a targeted query found them.
- HN coverage is thin for Janus, systrace, AIX WPAR, Linux-VServer and JEP 411.
