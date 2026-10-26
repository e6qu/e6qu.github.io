---
title: A portfolio that measures itself
footer: A portfolio that measures itself
---

<!-- Sample talk: uses every sheet from presentations/template/slides.md once. -->

### Sample talk

# A portfolio that measures itself.

How e6qu.github.io counts source and test lines across every public project, every day.

- / e6qu
- e6qu.github.io
- Design system demo deck

---

:: agenda

### Agenda

## Where we're going

1. **Why measure at all** — 5 min
2. Counting lines honestly — 15 min
3. Shipping static pages — 10 min
4. Live demo and questions — 15 min

---

## Why measure

---

### The problem

## A list of repositories says little about what's in them

- GitHub shows languages, not how much code there is
- Test code is the clearest signal of care
- Numbers should come from the code, not from memory

Public, non-fork projects only; research and throwaway repos are excluded

---

:: comparison

### Approach

## Where the numbers come from

#### Hand-written list

- Goes stale the day after it's written
- Counts whatever I remember

#### Measured daily — chosen

- GitHub Actions refreshes every morning
- Repository code is read, never run

---

:: feature art=replay

### Featured project

## theseus

Deterministic testing for Linux services in microVMs. Each featured project gets its own illustration and palette.

- Rust · Python
- AGPL-3.0

---

:: code footer=scripts/collect.py

## Test code is found by path

```python {5,6}
def is_test(path):
    p = Path(path)
    if any(part.lower() in TEST_DIRS for part in p.parts[:-1]):
        return True
    return bool(re.search(
        r'(^test[_.-]|[_.-]test\.|[_.-]tests\.|[_.-]spec\.|Tests?\.java$|Tests?\.cs$)',
        p.name, re.IGNORECASE))
```

---

:: code-split footer="scripts/collect.py · simplified"

## Inline Rust tests need a parser

```python
def visit(node):
    attrs = []  # [1]
    for child in node.named_children:
        if child.type == 'attribute_item':
            attrs.append(child)
            continue
        is_test_attr = cfg_test(attrs)  # [2]
        if is_test_attr and child.type.endswith('_item'):
            ranges.append(...)  # [3]
        else:
            visit(child)
```

1. Collect the attributes above each item
2. Match `#[cfg(test)]` and `#[test]`, async tests too
3. Blank those bytes out of the source count

---

## Preview it locally

```console ~/e6qu.github.io
$ python3 scripts/build.py
$ python3 -m http.server 8000 --directory _site
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
✓ built from the checked-in data.json snapshot
```

---

:: diagram key=2

### Pipeline

## From repositories to a static page

1. List: **GitHub API** — Public, non-fork repositories
2. Measure: **collect.py** — cloc 2.10 and tree-sitter count source and tests
3. Render: **build.py** — Plain HTML; JavaScript only filters and sorts
4. Publish: **Pages** — Daily, and on every push to main

---

:: table footer="Up to three main languages per project"

### Snapshot

## Main languages across 32 projects

| Language | Projects | Share |
| --- | --- | --- |
| **Rust** | 12 | 38% |
| Go | 11 | 34% |
| TypeScript | 11 | 34% |
| Python | 6 | 19% |

---

:: stats

### By the numbers

## Small inputs, one page out

One Python build, no framework, self-hosted fonts.

- **32** Public projects
- **9** Featured
- **24h** Refresh interval

---

## The link preview

![Social card: Adrian.Marza in large type, github.com/e6qu above, “Languages. Systems. Software.” below](../../assets/social.png)

`assets/social.png` · the same type and coral dot as the page

---

> Repository code is only read; it is never built or executed.
> — README.md

---

:: demo

### Switching to the browser

## Live demo

- Search by name, language or description
- Sort by latest contribution, SLOC or test SLOC
- Stay idle for ten seconds and the termites arrive
- [e6qu.github.io](https://e6qu.github.io)

---

:: blank

---

:: pause

## Questions so far?

Then: what's next

---

:: closing

### Thank you

## Questions?

[github.com/e6qu/e6qu.github.io](https://github.com/e6qu/e6qu.github.io) [e6qu.github.io](https://e6qu.github.io)
