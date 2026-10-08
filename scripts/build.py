"""Render the portfolio as static HTML; JavaScript only adds filtering and sorting."""
import argparse
from datetime import datetime
from html import escape
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]

FEATURE_ART = {
    'fun-with-pipes': ('Programming language', 'pipes'),
    'theseus': ('Deterministic testing', 'replay'),
    'pos3ql': ('Database engine', 'database'),
    'bleephub': ('Collaboration platform', 'branches'),
    'sockerless-cloud': ('Cloud API simulators', 'cloud'),
    'sockerless': ('Containers on cloud services', 'containers'),
}


def featured(project, first=False):
    e = lambda value: escape(str(value), quote=True)
    category, art = FEATURE_ART.get(project['name'], ('Software', 'branches'))
    illustration = (ROOT / 'assets' / 'illustrations' / f'{art}.svg').read_text()
    code = f'{project["source_lines"]:,}' if project.get('source_lines') is not None else '—'
    tests = f'{project["test_lines"]:,}' if project.get('test_lines') is not None else '—'
    languages = ' · '.join(project['languages'])
    license_html = e(project.get('license', 'Not specified'))
    if project.get('license_url'):
        license_html = f'<a href="{e(project["license_url"])}">{license_html}</a>'
    active = ' data-active' if first else ''
    return f'''<article class="featured-panel featured-{art}" id="featured-{e(project['name'])}"{active}>
  <div class="featured-copy"><p class="feature-category">{e(category)}</p><h3><a href="{e(project['url'])}">{e(project['name'])}<span aria-hidden="true"> ↗</span></a></h3><p class="feature-description">{e(project['description'])}</p><p class="feature-meta">{e(languages)}<span>{license_html}</span></p><div class="feature-stats"><div><span>SLOC</span><strong>{code}</strong></div><div><span>Test SLOC</span><strong>{tests}</strong></div></div><a class="feature-link" href="{e(project['url'])}">View project <span aria-hidden="true">↗</span></a></div>
  <div class="feature-art" aria-hidden="true">{illustration}</div>
</article>'''


def row(project):
    e = lambda value: escape(str(value), quote=True)
    date = project['last_contribution']
    if date:
        label = datetime.fromisoformat(date.replace('Z', '+00:00')).strftime('%d %b %Y')
        date_html = (f'<a class="date" href="{e(project["contribution_url"])}" '
                     f'title="Latest commit by e6qu on {e(project["default_branch"])}">'
                     f'<time datetime="{e(date)}">{label}</time></a>')
    else:
        date_html = '<span class="date unavailable" title="No commit attributed to e6qu on the default branch">—</span>'
    def count(key):
        value = project.get(key)
        if value is None:
            return '<span class="unavailable" title="Count available after the first GitHub Actions build">—</span>'
        label = f'{value:,}'
        if project.get('counted_commit'):
            return (f'<a href="{e(project["url"])}/tree/{e(project["counted_commit"])}" '
                    f'title="Measured at commit {e(project["counted_commit"][:7])}">{label}</a>')
        return label
    languages = ' · '.join(project['languages']) or '—'
    license_html = e(project.get('license', 'Not specified'))
    if project.get('license_url'):
        license_html = f'<a href="{e(project["license_url"])}" title="Project license">{license_html}</a>'
    description = f'<p class="description">{e(project["description"])}</p>' if project['description'] else ''
    return f'''<li class="project" data-name="{e(project['name'])}" data-search="{e(' '.join([project['name'], project['description'], *project['languages']]).lower())}" data-date="{e(date or '')}" data-code="{project.get('source_lines') or 0}" data-tests="{project.get('test_lines') or 0}">
  <div class="project-info"><h3><a class="project-link" href="{e(project['url'])}">{e(project['name'])}<span class="outbound" aria-hidden="true">↗</span></a></h3>{description}<p class="project-meta"><span class="languages">{e(languages)}</span><span class="license">{license_html}</span></p></div>
  <div class="project-numbers"><span class="metric"><span class="sr-only">SLOC: </span><span class="mobile-label" aria-hidden="true">SLOC</span>{count('source_lines')}</span><span class="metric"><span class="sr-only">Test SLOC: </span><span class="mobile-label" aria-hidden="true">Test SLOC</span>{count('test_lines')}</span><span class="contribution"><span class="sr-only">Last contribution: </span><span class="mobile-label" aria-hidden="true">Last contribution</span>{date_html}</span></div>
</li>'''


def build(data, destination):
    destination.mkdir(parents=True, exist_ok=True)
    shutil.copytree(ROOT / 'assets', destination / 'assets', dirs_exist_ok=True)
    updated = datetime.fromisoformat(data['updated_at']).strftime('%d %b %Y')
    page = (ROOT / 'template.html').read_text()
    page = page.replace('{{PROJECTS}}', '\n'.join(row(p) for p in data['projects']))
    config = json.loads((ROOT / 'portfolio.json').read_text())
    by_name = {p['name']: p for p in data['projects']}
    selection = [by_name[name] for name in config['featured'] if name in by_name]
    page = page.replace('{{FEATURED}}', '\n'.join(featured(p, i == 0) for i, p in enumerate(selection)))
    tabs = '\n'.join(f'<button class="showcase-tab" type="button" id="tab-{escape(p["name"])}" aria-controls="featured-{escape(p["name"])}">{escape(p["name"])}</button>' for p in selection)
    page = page.replace('{{FEATURED_TABS}}', tabs)
    page = page.replace('{{COUNT}}', str(len(data['projects']))).replace('{{UPDATED}}', updated)
    (destination / 'index.html').write_text(page)
    (destination / 'data.json').write_text(json.dumps(data, indent=2) + '\n')
    (destination / '.nojekyll').touch()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=Path, default=ROOT / 'data.json')
    parser.add_argument('--output', type=Path, default=ROOT / '_site')
    args = parser.parse_args()
    build(json.loads(args.data.read_text()), args.output)
