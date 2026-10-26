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
| `assets/slides.js` | Deck controls: ←/→ or click to move, O overview, B black out, T theme, P print to PDF. |
| `presentations/template/` | Every sheet once, with placeholder text. Copy it to start a talk. |
| `presentations/a-portfolio-that-measures-itself/` | Sample technical talk using every sheet. |
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

## Working locally

```sh
npm ci
npm run storybook          # http://localhost:6006, regenerates fixtures first
npm run build-storybook    # writes _site/storybook
python3 scripts/build.py   # writes _site, including _site/presentations
```

Stories never copy markup by hand: site components come from the rendered
page and slides come from the deck files, so a change to `build.py`,
`template.html` or a deck shows up in Storybook on the next build.
