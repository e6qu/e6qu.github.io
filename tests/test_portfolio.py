import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from collect import eligible, ignored, is_test, split_rust
from build import row


class PortfolioTests(unittest.TestCase):
    def test_repository_selection(self):
        config = json.loads((Path(__file__).resolve().parents[1] / 'portfolio.json').read_text())
        base = {'name': 'actual-software', 'owner': {'login': 'e6qu'}, 'fork': False, 'private': False}
        self.assertTrue(eligible(base, config))
        for changes in [{'fork': True}, {'private': True}, {'name': 'agentter'},
                        {'name': 'new-throwaway-project'}, {'name': 'language-research'},
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
