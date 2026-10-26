# Adrian.Marza

Personal GitHub Pages portfolio at https://e6qu.github.io.

Public, non-fork software projects with main languages, licenses, source/test
line counts, and Adrian's latest default-branch contribution. Documentation,
research and throwaway repositories are excluded in `portfolio.json`.

GitHub Actions refreshes and publishes daily. Repository code is only read;
it is never built or executed. Counting uses cloc 2.10 and tree-sitter for
inline Rust tests. Counts exclude blank lines, comments, vendored dependencies,
generated files, documentation and configuration. Test file/directory names
identify test code; inline Rust tests are separated with tree-sitter. Inline
tests in other languages may remain in source counts. Unsupported languages
are omitted by cloc. Main languages are GitHub's top three accounting for at
least 5% of language bytes. Dates use commits attributed to e6qu or Adrian's
known Git author addresses on each default branch.

Local preview from the checked-in metadata snapshot:

```sh
python3 scripts/build.py
python3 -m http.server 8000 --directory _site
```

Edit exclusions and short descriptions in `portfolio.json`, layout in
`template.html`, design tokens in `assets/tokens.css`, and styles in
`assets/style.css`. Fonts are self-hosted; their licenses are in `assets/fonts/`.

The design system (tokens, site components and presentation templates, in
light and dark) is documented in [docs/design-system.md](docs/design-system.md)
and published as a Storybook at https://e6qu.github.io/storybook/. Slide decks
live in `presentations/` and are published at https://e6qu.github.io/presentations/.
Talks are written in Markdown (`slides.md`); the dual-pane editor at
`/presentations/editor/` previews them live, and `/presentations/viewer/`
presents any pasted Markdown deck entirely in the browser. Run Storybook
locally with `npm ci && npm run storybook`.

The `featured` list in `portfolio.json` controls the showcase. Theme selection
follows the system until changed with the sun/moon button, then persists locally.
Verified Pages demo entry points are configured in `demo_urls`. HTMX is listed
beside languages when found in app templates/imports or production dependencies;
known uses in `frameworks` also keep metadata-only previews complete.
Idle insects start after ten seconds and take slow random walks. Each second,
coin flips can add termites up to ten, and butterflies up to six. Only termites
eat the page. Their jointed legs keep planted feet fixed, time steps independently,
and adapt to turns; brief feeding stops animate the mandibles. The research and
animation model are in [docs/termite-motion.md](docs/termite-motion.md).
Grass gradually sprouts
across the page, and butterflies follow wandering flight paths. The idle scene
clears on pointer, keyboard or scroll activity, pauses in background tabs, and
respects reduced motion.
