# Design system

The site, the presentation decks and Storybook share one set of tokens and
components. Storybook is published at https://e6qu.github.io/storybook/ and
the decks at https://e6qu.github.io/presentations/.

## Layers

Every page loads the same design system layers, in this order, and adds only
its own layout on top:

| Layer | File | Holds |
| --- | --- | --- |
| Foundations | `assets/tokens.css` | Fonts, colors, type scale, borders, radii, motion and layout tokens. The only place colors are defined. |
| Base | `assets/base.css` | Reset, headings, links, the focus ring, `.sr-only`, the skip link, reduced and paused motion. |
| Components | `assets/components.css` | Page controls (round icon buttons), buttons, masthead, section heading, showcase and tabs, search and sort, project list, site footer. |
| Presentation | `assets/slides.css` | The 18 slide sheets, 16:9, sized in em so they scale to any container. |
| Page layout | `assets/site.css`, `assets/deck-tools.css` | Where the homepage and presentations index, and the editor and viewer, place components. |

Behaviour that goes with components:

| Script | For |
| --- | --- |
| `assets/theme-toggle.js` | The sun/moon button (`#theme-toggle`) in the page controls, on every page. |
| `assets/motion.js` | The pause button (`#motion-toggle`): stops the homepage's moving decoration and remembers it. |
| `assets/showcase.js` | Showcase tabs (WAI-ARIA tabs pattern). Storybook runs the same script. |
| `assets/slides.js` | Decks: ←/→ or click to move, O overview, B black out, T theme, P print to PDF. |
| `assets/deck-markdown.js` | Renders Markdown decks into sheets, in the browser. |
| `assets/deck-editor.js`, `assets/deck-viewer.js` | The editor and viewer pages. |

| Content | Holds |
| --- | --- |
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
color appears in any layer after the tokens, or if the dark and system-dark
blocks drift apart.

Every page has the same sun/moon toggle in a circle in the top right corner
(☾ in light mode, ☀ in dark). It follows the system until clicked, then the
choice is remembered. The homepage adds a pause button beside it. While a deck
is presenting the controls fade out; hover or tab to them to bring them back,
or press T.

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

Decks print one sheet per page at 1280×720 (P or the overview's Save as PDF, then save as PDF).

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
- `:: closing mario` sends Regular Mario's castaway (`assets/runner.js`, shared with
  the homepage's game invite) running onto the closing sheet's first link: once when
  the slide is shown, again on hover or focus, standing still under reduced motion.
- Sources are untrusted: HTML is escaped, and only http(s), mailto and
  relative URLs (plus data: images) are used.

A talk on the site is a directory under `presentations/` with a `slides.md`
and an `index.html` like the sample's (`<div class="deck" data-markdown="slides.md">`).

The **editor** (`/presentations/editor/`) shows the slide under the cursor,
and clicking a slide jumps to its Markdown. Nothing is stored on a server or in the browser: the deck lives in the address (`#md=`, compressed),
so reloading, bookmarking or sharing the link keeps it. Save as PDF prints the preview.
In a deck, the overview (Esc or O) shows Edit Markdown, which reopens that deck in the editor, and Save as PDF.
It opens `?src=<path>` or a share link. **Copy link** and **Present** put the
whole deck, compressed, in the link (`viewer/#md=…`), so sharing needs no
server. The **viewer** (`/presentations/viewer/`) presents a pasted or dropped
`.md` file, `?src=<path>`, or a share link, with the same keys as any deck.

## Accessibility

The site, the decks, the editor and viewer, and every Storybook story meet
WCAG 2.2 level AA, in light and dark. `npm run test:a11y` (run in CI before
every deploy) checks the built `_site`:

- axe-core against WCAG 2.0, 2.1 and 2.2 A/AA and best practices, on every
  page at 1280 and 320 px, every slide of every deck, each deck's overview
  and every story;
- reflow: no sideways scrolling at 320 px (1.4.10);
- text spacing: with the WCAG overrides applied, no text is clipped and nothing
  scrolls sideways (1.4.12); slides scroll rather than cut content off;
- focus: tabbing through each page, every stop has a visible indicator and is
  not hidden behind other content (2.4.7, 2.4.11);
- keyboard: the deck takes focus, slide changes are announced, single-key
  shortcuts act only while the deck has focus (2.1.4), controls keep their own
  keys, and the editor does not trap Tab (2.1.2).

Storybook's Accessibility panel shows the same axe results for each story.

Rules the components follow:

- `--coral` is for large display marks and decoration (3:1). Small accent text
  and fills behind text use `--coral-strong` (4.5:1); accents on the inverted
  section sheet use `--coral-on-ink`.
- State is never shown by color alone: the selected tab has a thicker bar, the
  current agenda item a bar, the chosen comparison column a ✓, the best table
  row a ▸, highlighted code lines a left rule.
- Toggles keep one name and expose their state with `aria-pressed`
  ("Dark mode", "Pause animations"); the tooltip says what a click does.
- Moving decoration that starts on its own (the game invite runner, the idle
  insects) stops with the pause button, which is remembered, and with
  `prefers-reduced-motion` (2.2.2). Blinking stops within five seconds.
- Decks: the deck is the page's `main`, titled by a visually hidden `h1`; each
  sheet's heading is an `h2` (the title sheet uses `.slide-display`); slides are
  labelled "3 of 18" with the role description "slide" (WAI-ARIA carousel
  pattern); decorative arrows and markers are silent for screen readers.
- Links say where they go in their accessible name, starting with the visible
  text ("Try demo of zzira"); arrows are `aria-hidden`; links in running text
  are underlined.

## Working locally

```sh
npm ci
npm run storybook          # http://localhost:6006, regenerates fixtures first
npm run build-storybook    # writes _site/storybook
python3 scripts/build.py   # writes _site, including _site/presentations
npm run test:a11y          # audits _site (build Storybook first to include the stories)
```

Stories never copy markup by hand: site components come from the rendered
page and slides come from the deck files (the HTML template, and the Markdown
decks through the same renderer the pages use), so a change to `build.py`,
`template.html` or a deck shows up in Storybook on the next build.
`tests/deck-markdown.test.cjs` checks the renderer, including that pasted
HTML and `javascript:` links never render.
