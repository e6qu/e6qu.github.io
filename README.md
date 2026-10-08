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
