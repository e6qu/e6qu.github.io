import json
from pathlib import Path
import sys
import unittest
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from collect import eligible, ignored, is_test, split_rust, detect_frameworks
from build import row, build, featured


class PortfolioTests(unittest.TestCase):
    def test_showcase_keeps_the_complete_project_list(self):
        snapshot = json.loads((Path(__file__).resolve().parents[1] / 'data.json').read_text())
        config = json.loads((Path(__file__).resolve().parents[1] / 'portfolio.json').read_text())
        with tempfile.TemporaryDirectory() as temp:
            build(snapshot, Path(temp))
            page = (Path(temp) / 'index.html').read_text()
            published = json.loads((Path(temp) / 'data.json').read_text())
        self.assertEqual(page.count('class="project"'), len(snapshot['projects']))
        self.assertEqual(page.count('class="showcase-tab"'), len(config['featured']))
        self.assertNotIn('{{', page)
        for name in config['featured']:
            self.assertIn(f'id="featured-{name}"', page)
            self.assertIn(f'id="tab-{name}"', page)
        for name, url in config['demo_urls'].items():
            self.assertIn(f'href="{url}" aria-label="Try {name} demo"', page)
        for project in published['projects']:
            if project['name'] in {'zzira', 'someoldchat', 'shauth'}:
                self.assertIn('HTMX', project['frameworks'])
                self.assertNotIn('HTMX', project['languages'])

    def test_htmx_detection_uses_app_code_and_production_dependencies(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / 'page.gohtml').write_text('<form hx-post="/message">')
            (root / 'README.md').write_text('Uses htmx.org')
            (root / 'page_test.go').write_text('<button hx-get="/fixture">')
            (root / 'package.json').write_text('{"dependencies":{"htmx.org":"2.0.0"}}')
            self.assertEqual(detect_frameworks(root, ['README.md', 'page_test.go']), [])
            self.assertEqual(detect_frameworks(root, ['page.gohtml']), ['HTMX'])
            self.assertEqual(detect_frameworks(root, ['package.json']), ['HTMX'])
            self.assertEqual(detect_frameworks(root, ['page.gohtml'], ['*.gohtml']), [])
            (root / 'page.gohtml').write_text('<script src="/static/htmx.min.js"></script>')
            self.assertEqual(detect_frameworks(root, ['page.gohtml']), ['HTMX'])
            (root / 'package.json').write_text('invalid')
            self.assertEqual(detect_frameworks(root, ['package.json']), [])

    def test_demo_links_are_optional_escaped_and_available_in_both_views(self):
        project = {
            'name': 'zzira', 'description': 'Issue tracking',
            'url': 'https://github.com/e6qu/zzira', 'languages': ['Go'],
            'frameworks': ['HTMX'], 'last_contribution': None, 'default_branch': 'main',
            'source_lines': 1, 'test_lines': 1,
        }
        self.assertNotIn('class="demo-link"', row(project))
        self.assertNotIn('class="demo-link"', featured(project))
        project['demo_url'] = 'https://example.test/?a=1&b="value"'
        for html in [row(project), featured(project)]:
            self.assertIn('Try demo', html)
            self.assertIn('HTMX', html)
            self.assertIn('&amp;b=&quot;value&quot;', html)
        self.assertIn('htmx', row(project).split('data-search="')[1].split('"')[0])

    def test_repository_selection(self):
        config = json.loads((Path(__file__).resolve().parents[1] / 'portfolio.json').read_text())
        base = {'name': 'actual-software', 'owner': {'login': 'e6qu'}, 'fork': False, 'private': False}
        self.assertTrue(eligible(base, config))
        for changes in [{'fork': True}, {'private': True}, {'name': 'agentter'},
                        {'name': 'new-throwaway-project'}, {'name': 'language-research'}, {'name': 'frankencode'},
                        {'owner': {'login': 'someone-else'}}]:
            self.assertFalse(eligible({**base, **changes}, config))

    def test_language_specific_test_paths(self):
        for path in ['pkg/parser_test.go', 'tests/parse.rs', 'src/__tests__/parse.ts',
                     'src/parse.test.tsx', 'src/parse.spec.js', 'test_api.py', 'src/ParserTest.java']:
            self.assertTrue(is_test(path), path)
        for path in ['src/testable.rs', 'src/latest.go', 'src/parser.py']:
            self.assertFalse(is_test(path), path)
        self.assertTrue(ignored('vendor/example/src/lib.rs'))
        self.assertTrue(ignored('src/proto/example.pb.go'))
        self.assertFalse(ignored('src/parser.rs'))

    def test_inline_rust_tests_with_nested_braces_and_strings(self):
        data = b'''pub fn value() -> usize { 1 }
#[cfg(test)]
mod tests {
    #[test]
    fn nested() { let text = "}"; assert_eq!(value(), 1); }
}
#[tokio::test]
async fn integration() { assert_eq!(value(), 1); }
pub fn other() -> usize { 2 }
'''
        source, tests = split_rust(data)
        self.assertIn(b'pub fn value()', source)
        self.assertIn(b'pub fn other()', source)
        self.assertNotIn(b'fn nested', source)
        self.assertNotIn(b'fn integration', source)
        self.assertIn(b'fn nested', tests)
        self.assertIn(b'fn integration', tests)
        self.assertEqual(source.count(b'\n'), data.count(b'\n'))

    def test_repository_text_is_escaped_and_missing_values_are_honest(self):
        project = {
            'name': '<script>alert(1)</script>', 'description': '<img onerror=x>',
            'url': 'https://github.com/e6qu/example', 'languages': ['Rust'],
            'last_contribution': None, 'default_branch': 'main',
            'source_lines': None, 'test_lines': 0, 'license': 'MIT',
            'license_url': 'https://github.com/e6qu/example/blob/main/LICENSE',
        }
        html = row(project)
        self.assertNotIn('<script>', html)
        self.assertNotIn('<img', html)
        self.assertIn('&lt;script&gt;', html)
        self.assertIn('No commit attributed', html)
        self.assertIn('first GitHub Actions build', html)
        self.assertIn('Project license', html)


if __name__ == '__main__':
    unittest.main()
