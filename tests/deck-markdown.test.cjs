const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
// Values from the VM realm have other prototypes; compare them as plain data.
const plain = value => JSON.parse(JSON.stringify(value));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = {Blob, Response, CompressionStream, DecompressionStream, btoa, atob};
context.globalThis = context;
vm.runInNewContext(read('assets/deck-markdown.js'), context);
const {render, slideAt, pack, unpack, TEMPLATES} = context.DeckMarkdown;
const htmlTemplates = [...read('presentations/template/index.html').matchAll(/data-template="([\w-]+)"/g)].map(m => m[1]);

test('both Markdown decks use every sheet, in the HTML template order', () => {
  assert.deepEqual(plain(TEMPLATES), htmlTemplates);
  assert.deepEqual(plain(render(read('presentations/template/slides.md')).slides.map(s => s.template)), htmlTemplates);
  const sample = render(read('presentations/a-portfolio-that-measures-itself/slides.md'));
  assert.deepEqual(plain(sample.slides.map(s => s.template)).sort(), [...htmlTemplates].sort());
  assert.equal(sample.title, 'A portfolio that measures itself');
});

test('sheets are guessed from content when no directive is given', () => {
  const guessed = render([
    '# Hello.', '## Part one', '## Point\n\n- a\n- b', '```js\nx()\n```', '```console\n$ ls\n```',
    '```py\nx = 1  # [1]\n```\n\n1. note', '| a | b |\n| - | - |\n| 1 | 2 |', '![alt](x.png)', '> quoted', '<!-- only notes -->',
  ].join('\n\n---\n\n'));
  assert.deepEqual(plain(guessed.slides.map(s => s.template)),
    ['title', 'section', 'content', 'code', 'terminal', 'code-split', 'table', 'image', 'quote', 'blank']);
});

test('pasted HTML and unsafe URLs are never rendered', () => {
  const {html} = render([
    '## <img src=x onerror=alert(1)>', '- <script>alert(1)</script>', '- [click](javascript:alert(1))',
    '- [ok](https://example.com/?a=1&b="2")',
  ].join('\n'));
  assert.doesNotMatch(html, /<script|<img src=x|javascript:/i);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /href="https:\/\/example.com\/\?a=1&amp;b=&quot;2&quot;"/);
  const image = render('![x](javascript:alert(1))').html;
  assert.match(image, /Image URL not allowed/);
  assert.doesNotMatch(render(':: feature art="><script>').html, /<script/);
});

test('code sheets highlight, mark lines and pin callouts', () => {
  const {html} = render('```python {2}\ndef f(x):  # [1]\n    return g(x)\n```\n\n1. note');
  assert.match(html, /<span class="kw">def<\/span> <span class="fn">f<\/span>/);
  assert.match(html, /<b class="pin">1<\/b>/);
  assert.match(html, /<span class="mark">.*return/);
  assert.match(render('| a | b |\n| - | - |\n| 1 | 2 |').html, /<th scope="col">a<\/th>/);
  assert.match(html, /<ol class="slide-callouts"><li><b class="pin">1<\/b><span>note<\/span><\/li><\/ol>/);
  assert.doesNotMatch(render('```python\nchild.type = 1\n```').html, /class="kw">type/);
});

test('separators inside code fences do not split slides', () => {
  const deck = '## A\n\n```yaml\n---\nkey: value\n```\n\n---\n\n## B';
  assert.equal(render(deck).slides.length, 2);
  assert.equal(slideAt(deck, deck.indexOf('key')), 0);
  assert.equal(slideAt(deck, deck.indexOf('## B')), 1);
});

test('front matter sets the title and footers, directives override them', () => {
  const deck = render('---\ntitle: Talk\nfooter: Foot\n---\n\n## One\n\n---\n\n:: content footer="Other"\n\n## Two');
  assert.equal(deck.title, 'Talk');
  assert.match(deck.slides[0].html, /<span>Foot<\/span>/);
  assert.match(deck.slides[1].html, /<span>Other<\/span>/);
  assert.equal(render('# Untitled *talk*.\n\n---\n\n## Next').title, 'Untitled talk');
  const noted = render('<!--\nnotes\n-->\n\n:: stats\n\n- **1** one').slides[0];
  assert.equal(noted.template, 'stats');
  assert.doesNotMatch(noted.html, /::/);
});

test('a closing sheet can send the castaway running onto its first link', () => {
  const html = render(':: closing mario\n\n## Thanks.\n\n[e6qu.github.io](https://e6qu.github.io/)\n\n[mail](mailto:a@b.c)').html;
  assert.match(html, /<p class="slide-links slide-runner" data-runner><img class="runner-sprite" alt="" aria-hidden="true"><a href="https:\/\/e6qu.github.io\/">/);
  assert.equal((html.match(/data-runner/g) || []).length, 1);
  assert.doesNotMatch(render(':: closing\n\n## Thanks.\n\n[x](https://x.y)').html, /data-runner/);
});

test('share links round-trip the deck', async () => {
  const deck = read('presentations/a-portfolio-that-measures-itself/slides.md');
  const packed = await pack(deck);
  assert.match(packed, /^[\w-]+$/);
  assert.ok(packed.length < deck.length);
  assert.equal(await unpack(packed), deck);
});

test('dense fits more on a slide, on any sheet', () => {
  const {slides} = render('---\n\n:: content dense\n\n## Many points\n\n- one\n- two\n\n---\n\n:: table dense footer="[src](https://example.com)"\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n\n---\n\n## Plain\n\n- one');
  assert.match(slides[0].html, /class="slide slide-content slide-dense"/);
  assert.match(slides[1].html, /class="slide slide-table slide-dense"/);
  assert.match(slides[1].html, /<footer class="slide-footer"><span><a href="https:\/\/example.com"/);
  assert.doesNotMatch(slides[2].html, /slide-dense/);
});

test('a paragraph after a table becomes its note', () => {
  const {slides} = render('---\n\n:: table\n\n## T\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n\nThe [source](https://example.com) of it.');
  assert.match(slides[0].html, /<\/table><p class="slide-note">The <a href="https:\/\/example.com"[^>]*>source<\/a> of it.<\/p>/);
});

test('~~text~~ renders as a deletion, in headings too', () => {
  const {slides} = render('---\n\n:: content\n\n## No place like ~~127.0.0.1~~ 169.254.169.254\n\nA ~~wrong~~ right word.');
  assert.match(slides[0].html, /<h2>No place like <del>127.0.0.1<\/del> 169.254.169.254<\/h2>/);
  assert.match(slides[0].html, /A <del>wrong<\/del> right word./);
});

test('slides inside a part list every part, the current one and its service marked', () => {
  const {slides} = render('---\n\n:: section\n\n## Core\n\n---\n\n:: content\n\n## A\n\nText.\n\n---\n\n:: pause label="Functions"\n\n## Functions\n\n---\n\n:: content\n\n## B\n\nText.\n\n---\n\n:: section\n\n## Edge\n\n---\n\n:: content\n\n## C\n\nText.');
  assert.doesNotMatch(slides[0].html, /slide-part/);
  assert.match(slides[1].html, /<ol class="slide-part" aria-label="Parts"><li aria-current="step">Core<\/li><li>Edge<\/li><\/ol>/);
  assert.match(slides[2].html, /<li aria-current="step">Core<\/li>/);
  assert.match(slides[3].html, /<li aria-current="step">Core · Functions<\/li><li>Edge<\/li>/);
  assert.match(slides[5].html, /<li>Core<\/li><li aria-current="step">Edge<\/li>/);
});
