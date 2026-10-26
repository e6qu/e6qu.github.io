# Design system

The site, the presentation decks and Storybook share one set of tokens and
components. Storybook is published at https://e6qu.github.io/storybook/ and
the decks at https://e6qu.github.io/presentations/.

## Files

| File | Holds |
| --- | --- |
| `assets/tokens.css` | Fonts, colors, type scale, borders, radii, motion and layout tokens. The only place colors are defined. |
| `assets/style.css` | Site components (masthead, identity, featured showcase, project index, footer). |
| `assets/slides.css` | Presentation sheets, 16:9, sized in em so they scale to any container. |
| `assets/theme-toggle.css`, `assets/theme-toggle.js` | The sun/moon button in the top right corner of every page. |
| `assets/slides.js` | Deck controls: ←/→ or click to move, O overview, B black out, T theme, P print to PDF. |
| `assets/deck-markdown.js` | Renders Markdown decks into sheets, in the browser. |
| `assets/deck-editor.js`, `assets/deck-viewer.js`, `assets/deck-tools.css` | The editor and viewer pages. |
| `presentations/template/` | Every sheet once: `index.html` in HTML, `slides.md` in Markdown with the syntax explained. |
| `presentations/a-portfolio-that-measures-itself/` | Sample technical talk using every sheet, written in `slides.md`. |
| `presentations/editor/` | Dual-pane editor: Markdown on the left, live slides on the right. |
| `presentations/viewer/` | Paste or open your own Markdown and present it. |
| `stories/`, `.storybook/` | Storybook stories and configuration. |
| `scripts/stories.py` | Cuts component markup out of the page `build.py` renders, for the stories. |

## Light and dark

Theme tokens are declared for `:root`, `[data-theme='light']` and
`[data-theme='dark']`, with the system preference as the fallback when no
theme is set. Because a theme applies to any element with `data-theme`,
Storybook can show the same component in both themes side by side (toolbar:
Theme → Side by side). Components use `var(--*)` only; the tests fail if a hex
color appears in `style.css` or `slides.css`, or if the dark and system-dark
blocks drift apart.

Every page has the same sun/moon toggle in a circle in the top right corner
(☾ in light mode, ☀ in dark). It follows the system until clicked, then the
choice is remembered. While a deck is presenting the button fades out; hover
or tab to it to bring it back, or press T.

Illustration colors follow the same rule: each illustration has a themed
paper token (`--art-replay`) and a fixed accent (`--art-replay-accent`),
applied with `.featured-<name>` on the site or `.art-<name>` on slides.

## Slide sheets

| Sheet | Use it for |
| --- | --- |
| title | Opening: kicker, title, subtitle, author and venue |
| agenda | Parts of the talk with timings; `aria-current="step"` marks the next one |
| section | Numbered divider between parts |
| content | Heading and three to five points |
| comparison | Two options side by side; `.is-pick` marks the chosen one |
| feature | A project with one of the site illustrations |
| code | A code listing; `.kw`, `.fn`, `.str`, `.cm` highlight and `.mark` picks out lines |
| code-split | Code with numbered `.pin` markers explained beside it |
| terminal | Commands and output in a window that stays dark in both themes |
| diagram | A left-to-right flow of three to five steps; `.is-key` marks the current one |
| table | Benchmarks or comparisons; `.num` aligns figures, `.is-best` highlights a row |
| stats | Two to four large figures |
| image | A screenshot or figure with a caption (`.slide-placeholder` until there is one) |
| quote | A large quotation with its source |
| demo | Hand-off to a live demo, listing what to watch for |
| pause | A break, or a stop for questions |
| blank | An empty sheet to rest on while switching screens (B also blacks out any slide) |
| closing | Thanks and links |

Decks print one sheet per page at 1280×720 (P, then save as PDF).

## Markdown decks

Write a talk as Markdown and it renders in the browser; nothing is uploaded
and nothing is built. `presentations/template/slides.md` uses every sheet and
explains the syntax in comments. The short version:

```markdown
---
title: My talk
footer: My talk · Conference 2026
---

# My talk.

A one-line subtitle.

---

:: diagram key=2

### How it works

## Three steps

1. In: **Parse** — read the input
2. Core: **Transform** — the interesting part
3. Out: **Render** — write the result
```

- A line of `---` separates slides (not inside code fences).
- `:: <sheet> key=value` on a slide's first line picks the sheet. Without it
  the sheet is guessed: `#` makes a title, a lone `##` a section, a
  ` ```console ` block a terminal, code plus a numbered list code with notes,
  code a code slide, a table a table, an image an image, a quote a quote,
  and anything else a content slide.
- `###` is the small kicker above the heading, `##` the heading, `####` a
  column label on comparison slides.
- Code: ` ```python {3,5-7} ` highlights lines; `# [1]` at the end of a line
  becomes pin 1 beside a numbered list.
- Options: `section number=03`, `comparison pick=1`, `feature art=replay`,
  `diagram key=2`, `terminal title=~/app`, and `footer="…"` on any slide.
- `<!-- comments -->` are speaker notes and are never shown.
- Sources are untrusted: HTML is escaped, and only http(s), mailto and
  relative URLs (plus data: images) are used.

A talk on the site is a directory under `presentations/` with a `slides.md`
and an `index.html` like the sample's (`<div class="deck" data-markdown="slides.md">`).

The **editor** (`/presentations/editor/`) shows the slide under the cursor,
and clicking a slide jumps to its Markdown. Drafts are saved in the browser.
It opens `?src=<path>` or a share link. **Copy link** and **Present** put the
whole deck, compressed, in the link (`viewer/#md=…`), so sharing needs no
server. The **viewer** (`/presentations/viewer/`) presents a pasted or dropped
`.md` file, `?src=<path>`, or a share link, with the same keys as any deck.

## Working locally

```sh
npm ci
npm run storybook          # http://localhost:6006, regenerates fixtures first
npm run build-storybook    # writes _site/storybook
python3 scripts/build.py   # writes _site, including _site/presentations
```

Stories never copy markup by hand: site components come from the rendered
page and slides come from the deck files (the HTML template, and the Markdown
decks through the same renderer the pages use), so a change to `build.py`,
`template.html` or a deck shows up in Storybook on the next build.
`tests/deck-markdown.test.cjs` checks the renderer, including that pasted
HTML and `javascript:` links never render.
