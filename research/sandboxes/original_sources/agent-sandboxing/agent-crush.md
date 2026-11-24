---
title: "Crush" README (sections "Allowing Tools", "You only live once", "A note on security")
url: https://github.com/charmbracelet/crush#allowing-tools
authors: Charm (charmbracelet)
date: living document; read 2026-11-22 (repo @ d63960b514, release v0.102.0)
accessed: 2026-11-22
kind: repo
---

## Summary
Crush is current and active (v0.102.0, 2026-11-19, ~29k stars). It is a local terminal agent; configuration is now a Bash-syntax `crushrc` alongside `crush.json`. There is **no OS-level sandbox**: commands run through Crush's built-in Go Bash interpreter as the user. Protection comes from per-tool permission prompts (on by default), a static "dangerous command" blocklist (network tools, sudo, package managers and others), and path checks that prompt for reads outside the working directory. `-y` / `--yolo` skips prompts but still blocks the dangerous list. `-yy` ("sysadmin mode") also turns the blocklist off.

## Key points
- Runs: local process (TUI, `crush run`, or a shared `crush serve` backend) on macOS, Linux and Windows. The Bash interpreter is built in, so shell semantics are the same on Windows.
- Isolation: none on any OS. A grep of the repo @ d63960b514 finds no seatbelt/sandbox-exec/bwrap/landlock/seccomp. The README documents no container or sandbox option.
- Filesystem: no OS enforcement. `view` and `ls` request permission for paths outside the working directory (internal/agent/tools/view.go, ls.go), which is a tool-level check. `.gitignore` and `.crushignore` exclude files from context; they are not an access control.
- Network: no network sandbox. The `bash` tool's built-in `defaultBlockedCommands` list (curl, wget, ssh, scp, nc, browsers, sudo/su/doas, env/eval/xargs/nohup, package managers, firewall and network config tools…) matches command names statically. Matching commands prompt with a warning in normal mode and are blocked in `-y` (internal/agent/tools/bash.go, bash.md.tpl). Tune it with `permissions.blocked_commands` / `permissions.allowed_commands` (schema.json).
- Approvals: by default Crush asks before every tool call. A small set of provably read-only bash commands (`ls`, `pwd`, `git status`, `git log`…) runs without a prompt. `permissions allow <tool>…` in crushrc (`permissions.allowed_tools` in JSON) auto-approves tools, and `permissions deny <tool>…` (`options.disabled_tools`) hides them. Flags: `-y` / `--yolo` ("skip permission prompts, block dangerous commands"), `-yy` (sysadmin: "allow dangerous commands too", prints a warning) (internal/cmd/root.go). On a shared `crush serve` workspace, the first client's `--yolo` wins.
- Config trust caveat: `crushrc` runs in a full shell and `$(...)` in `crush.json` runs at load time. The README warns not to launch Crush in a directory whose config you have not reviewed.

## Excerpts
> "By default, Crush will ask you for permission before running tool calls." (README, Allowing Tools)

> "You can also skip all permission prompts completely by running Crush with the `--yolo` flag. Be very, very careful with this feature." (README, You only live once)

> "Both `crushrc` and `crush.json` are trusted code; `crushrc` runs in a full shell" (README, A note on security)

## Relevance to the talk
Crush shows the "no sandbox, but a denylist" pattern. Blocking network egress by banning `curl`/`wget`/`ssh` by name is easy to get around (our observation: e.g. `python -c`), and the code comments admit that indirect-execution wrappers have to be listed explicitly for the same reason. Its two-level YOLO (`-y` keeps the blocklist, `-yy` drops it) is worth a slide as a UX compromise standing in for a real boundary.
