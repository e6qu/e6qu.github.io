---
title: Talk title
footer: Deck title
---

<!--
Slides are separated by a line with three dashes. The first line of a slide can
pick a sheet with ":: <name> key=value"; without it the sheet is guessed from the
content. ### is a small kicker above the heading, ## the slide heading.
Comments like this one are speaker notes: they are never shown.
Any slide can override the footer with ":: <name> footer="Other text"", and
"dense" (":: content dense") fits more text on a crowded slide.
-->

:: title

### Talk kicker

# Talk title.

A one-line subtitle that says what this talk is about and why it matters.

- / e6qu
- Date
- Event or venue

---

:: agenda

### Agenda

## What we'll cover

<!-- Bold marks the next part. Text after " — " is the timing. -->

1. **First part** — 10 min
2. Second part — 15 min
3. Live demo — 10 min
4. Questions — 10 min

---

:: section

<!-- Sections number themselves; set number=03 to override. -->

## Section title

---

### Context

## A clear claim as the slide heading

- One idea per line, written as a short sentence
- Three to five points keep a slide readable
- Say the details; don't put them on the slide

Source or footnote: paragraphs after a list are notes.

---

:: comparison pick=2

### Trade-off

## Option A or option B

#### Option A

- What it costs
- Where it breaks

#### Option B — chosen

- Why it wins
- What we gave up

---

:: feature art=pipes

<!-- art: pipes, replay, database, branches, cloud, containers, board, chat or terminal -->

### Category

## Project name

Pair a short description with one of the site illustrations.

- Languages
- License

---

## Show the code that matters

<!-- {3} highlights line 3; ranges like {2,4-6} work too. -->

```python {3}
# keywords, functions, strings and comments are colored
def greet(name):
    message = f'Hello, {name}'
    return message
```

---

## Walk through the code

<!-- A code block with a numbered list beside it. "# [1]" at the end of a line
     becomes pin 1; use "// [1]" in languages with // comments. -->

```python
def handler(request):  # [1]
    user = authenticate(request)
    if not user:  # [2]
        return forbidden()
    return render(user)  # [3]
```

1. Number the parts you want to talk about
2. Keep each note to one line
3. Three or four pins per slide at most

---

:: terminal title=~/project

## Run it

<!-- Lines starting with "$ " are commands, lines starting with ✓ are results. -->

```console
$ command --flag argument
output that matters, trimmed to a few lines
✓ the result you want people to notice
```

---

:: diagram key=2

### How it works

## A pipeline in three to five steps

1. Input: **Step one** — What goes in
2. Transform: **Step two** — key=2 marks the step you're explaining
3. Output: **Step three** — What comes out

---

### Benchmark

## Compare in a table

<!-- Numeric columns align right. A bold first cell highlights the row. -->

| Approach | Time | Memory |
| --- | --- | --- |
| Baseline | 120 ms | 64 MB |
| **Improved** | 35 ms | 40 MB |
| Alternative | 80 ms | 22 MB |

---

:: stats

### By the numbers

## Numbers carry the slide

Use two to four figures with short labels.

- **42** First figure
- **1.2M** Second figure
- **99%** Third figure

---

## Screenshot or figure

![Describe the image for people who can't see it](../../assets/social.png)

Caption: what the audience should look at

---

> A memorable line, quoted large enough to read from the back of the room.
> — Name, role or source

---

:: demo

### Switching to the demo

## Live demo

- What to watch for first
- What to watch for next
- [link-to-the-demo](https://e6qu.github.io)

---

:: pause

## Short break

Back at 15:30

---

:: blank

<!-- An empty sheet to rest on while switching screens. B also blacks out any slide. -->

---

:: closing

### Thank you

## Questions?

<!-- ":: closing mario" sends Regular Mario's castaway running onto the first link. -->

[github.com/e6qu](https://github.com/e6qu) [e6qu.github.io](https://e6qu.github.io)
