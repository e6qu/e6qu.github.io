// scripts/build-decks.mjs: how a deck page becomes a bundle's entry.
//   node --test tests/build-decks.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bundleEntry, bundlePage, markdownDecks} from '../scripts/build-decks.mjs';

const page = readFileSync(new URL('../presentations/who-answers-the-syscall/index.html', import.meta.url), 'utf8');

test('a deck page loses its stylesheets and scripts to one module entry, keeping the rest', () => {
  const {page: built, styles, scripts} = bundlePage(page);
  assert.deepEqual(styles.slice(0, 2), ['../../assets/tokens.css', '../../assets/base.css']);
  assert.ok(styles.includes('../../assets/deck-game.css'));
  assert.deepEqual(scripts, ['../../assets/theme-toggle.js', '../../assets/runner.js', '../../assets/slides.js',
    '../../assets/deck-markdown.js', '../../assets/deck-game.js']);
  assert.doesNotMatch(built, /rel="stylesheet"|<script src=/);
  assert.match(built, /<script type="module" src="\.\/bundle-entry\.js"><\/script>\n<\/head>/);
  // the inline theme script, the icon and the deck element stay
  assert.match(built, /localStorage\.getItem\('theme'\)/);
  assert.match(built, /rel="icon"/);
  assert.match(built, /<main class="deck" data-markdown="slides\.md"><\/main>/);
});

test('the entry imports in page order; only a game deck gets the Mario mode loader', () => {
  const classic = bundleEntry({styles: ['a.css'], scripts: ['b.js', 'c.js'], talk: null});
  assert.equal(classic, 'import "a.css";\nimport "b.js";\nimport "c.js";\n');
  const game = bundleEntry({styles: [], scripts: ['b.js'], talk: '/tmp/x/talk.json'});
  assert.match(game, /globalThis\.DeckGame = \{/);
  assert.match(game, /library: \(\) => import\('regular-mario'\)/);
  assert.match(game, /talk: \(\) => import\("\/tmp\/x\/talk\.json"\)\.then\(module => module\.default\)/);
});

test('a page with no scripts is refused', () => {
  assert.throws(() => bundlePage('<head></head>'), /no scripts/);
});

test('the decks are the pages that present their slides.md', () => {
  const decks = markdownDecks();
  assert.ok(decks.includes('who-answers-the-syscall'));
  assert.ok(decks.includes('who-answers-the-syscall-lite'));
  assert.ok(decks.includes('so-you-want-to-code-your-own-cloud'));
  assert.ok(!decks.includes('editor') && !decks.includes('viewer') && !decks.includes('template'));
});
