---
title: "WebAssembly constraints" — Pyodide documentation
url: https://pyodide.org/en/stable/usage/wasm-constraints.html
authors: Pyodide project
date: living document; page header showed version 314.0.8 when read
accessed: 2026-11-22
kind: docs
---

## Summary
Pyodide's list of what CPython loses when compiled to Wasm and run under a JS host: `multiprocessing`, `threading` and sockets import but do not work; terminal, process-resource and GUI modules are removed; networking goes through the browser. It is the concrete "what agents need that Wasm doesn't give" list for Python, the most common agent code-execution language.

## Key points
- "The following modules can be imported, but are not functional due to the limitations of the WebAssembly VM": multiprocessing, threading, sockets — and "any functionality that requires these".
- Removed: curses, dbm, ensurepip, fcntl, grp, idlelib, lib2to3, msvcrt, pwd, resource, syslog, termios, tkinter, turtle, venv, winreg, winsound; pty/tty present but unimportable (termios removed).
- Limited: ssl is a stub; OpenSSL-dependent hashlib algorithms unavailable; network calls go through the browser, so limited control over certificates, timeouts, proxies.
- Packages: pure-Python wheels or packages specially built for Pyodide (via micropip); arbitrary native wheels do not work (implied by the Wasm target).
- The page does not discuss `subprocess` explicitly; there is no way to spawn a native process from Wasm.

## Excerpts
> "The following modules can be imported, but are not functional due to the limitations of the WebAssembly VM:"

## Relevance to the talk
Quantifies the capability gap. A coding agent's normal loop — `pip install`, run `pytest` in subprocesses, start a dev server on a socket, call `git` — hits nearly every item on this list. Hence the split: Wasm for short analysis snippets or typed tools; VMs/containers for coding agents.
