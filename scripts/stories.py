"""Render the site and cut it into component fixtures for Storybook, so stories show the
exact markup build.py publishes instead of a hand-maintained copy."""
import argparse
import json
from pathlib import Path
import re
import tempfile

from build import ROOT, build


def first(pattern, page):
    match = re.search(pattern, page, re.S)
    if not match:
        raise SystemExit(f'Component not found in the built page: {pattern}')
    return match.group(0)


def fixtures(data):
    with tempfile.TemporaryDirectory() as temp:
        build(data, Path(temp))
        page = (Path(temp) / 'index.html').read_text()
    panels = re.findall(r'<article class="featured-panel featured-[\w-]+" id="featured-([\w.-]+)".*?</article>', page, re.S)
    return {
        'masthead': first(r'<header class="masthead">.*?</header>', page),
        'themeToggle': first(r'<button class="theme-toggle".*?</button>', page),
        'identity': first(r'<section class="identity".*?</section>', page),
        'sectionHeading': first(r'<div class="section-heading"><h2 id="projects-heading">.*?</div>', page),
        'tools': first(r'<div class="tools".*?</div>', page),
        'columnLabels': first(r'<div class="column-labels".*?</div></div>', page),
        'empty': first(r'<p class="empty".*?</p>', page),
        'footer': first(r'<footer>.*?</footer>', page),
        'featured': {name: first(rf'<article class="featured-panel [^"]*" id="featured-{re.escape(name)}".*?</article>', page)
                     for name in panels},
        'tabs': re.findall(r'<button class="showcase-tab".*?</button>', page, re.S),
        'projects': {name: html for html, name in
                     ((m.group(0), m.group(1)) for m in re.finditer(r'<li class="project" data-name="([^"]+)".*?</li>', page, re.S))},
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=Path, default=ROOT / 'data.json')
    parser.add_argument('--output', type=Path, default=ROOT / 'stories' / 'fixtures.json')
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(fixtures(json.loads(args.data.read_text())), indent=2) + '\n')
