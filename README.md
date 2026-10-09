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
`template.html`, and styles in `assets/style.css`. Fonts are self-hosted;
their licenses are in `assets/fonts/`.

The `featured` list in `portfolio.json` controls the showcase. Theme selection
follows the system until changed with the sun/moon button, then persists locally.
Idle insects start after ten seconds and take slow random walks. Each second,
coin flips can add termites up to ten, and butterflies up to six. Only termites
eat the page. Their jointed legs keep planted feet fixed, time steps independently,
and adapt to turns; brief feeding stops animate the mandibles. The research and
animation model are in [docs/termite-motion.md](docs/termite-motion.md).
Grass gradually sprouts
across the page, and butterflies follow wandering flight paths. The idle scene
clears on pointer, keyboard or scroll activity, pauses in background tabs, and
respects reduced motion.
