from pathlib import Path
import re
import sys
import tempfile
import unittest
import json

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build import build
from stories import fixtures


def declarations(css, selector):
    start = css.index(selector + ' {') + len(selector) + 2
    body = css[start:css.index('}', start)]
    return dict(re.findall(r'--([\w-]+):([^;]+);', body))


def templates(path):
    return re.findall(r'data-template="([\w-]+)"', (ROOT / path).read_text())


class DesignSystemTests(unittest.TestCase):
    def test_both_themes_define_the_same_tokens(self):
        tokens = (ROOT / 'assets' / 'tokens.css').read_text()
        light = declarations(tokens, ":root,[data-theme='light']")
        dark = declarations(tokens, "[data-theme='dark']")
        system_dark = declarations(tokens, '  :root:not([data-theme])')
        self.assertEqual(light.keys(), dark.keys())
        self.assertEqual(dark, system_dark)

    def test_components_take_colors_from_tokens(self):
        for name in ['style.css', 'slides.css']:
            css = (ROOT / 'assets' / name).read_text()
            # Black is only the projector letterbox and the blackout screen.
            self.assertEqual(set(re.findall(r'#[0-9a-fA-F]{3,6}\b', css)) - {'#000'}, set(), name)

    def test_sample_talk_and_storybook_cover_every_slide_template(self):
        template = templates('presentations/template/index.html')
        self.assertEqual(len(template), len(set(template)))
        self.assertCountEqual(templates('presentations/a-portfolio-that-measures-itself/index.html'), template)
        stories = re.findall(r"= story\('[^']+', '([\w-]+)'\)", (ROOT / 'stories' / 'presentation.stories.js').read_text())
        self.assertCountEqual(stories, template)
        slides = (ROOT / 'assets' / 'slides.css').read_text()
        # These are laid out by shared parts (.slide-list, .slide-columns, .slide-flow, .slide-figures).
        for name in set(template) - {'content', 'comparison', 'diagram', 'stats'}:
            self.assertTrue(f'.slide-{name}' in slides, f'.slide-{name} has no styles')

    def test_presentations_are_published_with_their_assets(self):
        snapshot = json.loads((ROOT / 'data.json').read_text())
        with tempfile.TemporaryDirectory() as temp:
            build(snapshot, Path(temp))
            for deck in ['template', 'a-portfolio-that-measures-itself']:
                page = (Path(temp) / 'presentations' / deck / 'index.html').read_text()
                for asset in re.findall(r'(?:href|src)="(\.\./\.\./assets/[^"]+)"', page):
                    self.assertTrue((Path(temp) / 'presentations' / deck / asset).resolve().is_file(), asset)
                for art in re.findall(r'data-illustration="([\w-]+)"', page):
                    self.assertTrue((Path(temp) / 'assets' / 'illustrations' / f'{art}.svg').is_file(), art)
            self.assertTrue((Path(temp) / 'presentations' / 'index.html').is_file())

    def test_storybook_fixtures_come_from_the_built_page(self):
        snapshot = json.loads((ROOT / 'data.json').read_text())
        config = json.loads((ROOT / 'portfolio.json').read_text())
        result = fixtures(snapshot)
        self.assertEqual(list(result['featured']), config['featured'])
        self.assertEqual(len(result['tabs']), len(config['featured']))
        self.assertEqual(len(result['projects']), len(snapshot['projects']))
        self.assertIn('class="search-wrap"', result['tools'])


if __name__ == '__main__':
    unittest.main()
