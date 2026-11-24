// scripts/edit-server.mjs against a throwaway git repository with one small deck.
//   node --test tests/edit-server.test.mjs
import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createEditServer, editDeck, hashOf, slideTitle} from '../scripts/edit-server.mjs';

const DECK = [
  '---', 'title: Demo', 'footer: Demo', '---', '', '<!-- a comment before the title -->', '', ':: title', '', '# Demo.', '',
  'A small deck.', '', '---', '', ':: content transition=iris', '', '## First point', '', '- one', '- two', '', '???', 'Notes stay.', '',
  '---', '', '```yaml', '---', 'key: value', '```', '', '---', '', '## Last', '',
].join('\n');

let dir, root, server, base;
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).trim();
const file = name => readFileSync(join(root, name), 'utf8');
const slides = 'presentations/demo/slides.md';
const post = (body, headers = {}) => fetch(`${base}/api/slide`, {method: 'POST',
  headers: {'Content-Type': 'application/json', ...headers}, body: JSON.stringify(body)})
  .then(async response => ({status: response.status, body: await response.json()}));
const current = () => hashOf(file(slides));

before(async () => {
  dir = mkdtempSync(join(tmpdir(), 'edit-server-'));
  root = join(dir, 'repo');
  mkdirSync(join(root, 'presentations', 'demo'), {recursive: true});
  writeFileSync(join(root, slides), DECK);
  writeFileSync(join(root, 'presentations', 'demo', 'index.html'), '<!doctype html><title>Demo</title>');
  writeFileSync(join(root, 'presentations', 'demo', 'talk.json'), '{}\n');
  writeFileSync(join(root, 'notes.txt'), 'staged by the user\n');
  git('init', '--quiet', '--initial-branch=main');
  for (const [key, value] of [['user.name', 'Test'], ['user.email', 'test@example.com'], ['commit.gpgsign', 'false']]) git('config', key, value);
  git('add', '--', slides, 'presentations/demo/index.html', 'presentations/demo/talk.json');
  git('commit', '--quiet', '-m', 'Initial deck');
  git('add', '--', 'notes.txt');  // the user's own staged work, which a save must leave alone
  // a deck directory that leads out of the repository
  mkdirSync(join(dir, 'outside', 'evil'), {recursive: true});
  writeFileSync(join(dir, 'outside', 'evil', 'slides.md'), '## Outside\n');
  symlinkSync(join(dir, 'outside', 'evil'), join(root, 'presentations', 'evil'));
  server = createEditServer({root, log: () => {}});
  await new Promise(done => server.listen(0, '127.0.0.1', done));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server?.close();
  rmSync(dir, {recursive: true, force: true});
});

test('replacing a slide keeps every other byte, CRLF line endings included', () => {
  const crlf = DECK.replace(/\n/g, '\r\n');
  const next = editDeck(crlf, 1, ':: content\n\n## New point\n\n- three\n');
  assert.equal(next, crlf.replace(':: content transition=iris\r\n\r\n## First point\r\n\r\n- one\r\n- two\r\n\r\n???\r\nNotes stay.',
    ':: content\r\n\r\n## New point\r\n\r\n- three'));
  // the first slide's source starts with its comment; the fenced --- belongs to slide 3
  assert.equal(editDeck(DECK, 0, '<!-- a comment before the title -->\n\n:: title\n\n# Demo.\n\nA small deck.'), DECK);
  assert.equal(editDeck(DECK, 2, '```yaml\n---\nkey: other\n```'), DECK.replace('key: value', 'key: other'));
});

test('a slide separator, an open code fence, an unknown sheet or an empty slide is refused', () => {
  assert.throws(() => editDeck(DECK, 1, '## A\n\n---\n\n## B'), {status: 400, message: /Line 3 is a slide separator/});
  assert.throws(() => editDeck(DECK, 1, '## A\n\n```js\nopen('), {status: 400, message: /code fence/});
  assert.throws(() => editDeck(DECK, 1, ':: nonsense\n\n## A'), {status: 400, message: /no "nonsense" sheet/});
  assert.throws(() => editDeck(DECK, 1, '  \n\n'), {status: 400, message: /empty/});
  assert.throws(() => editDeck(DECK, 9, '## A'), {status: 400, message: /no slide 10/});
});

test('commit messages name the slide', () => {
  assert.equal(slideTitle(':: content\n\n### Kicker\n\n## The **world** [map](x)\n'), 'The world map');
  assert.equal(slideTitle('> I thought sandbox was just docker.\n>\n> — me'), 'I thought sandbox was just docker.');
});

test('decks outside presentations/<name>/slides.md are rejected', async () => {
  for (const deck of ['../repo/presentations/demo/slides.md', '/etc/passwd', `${root}/${slides}`, 'presentations/../presentations/demo/slides.md',
    'presentations/demo/talk.json', 'presentations/demo/../demo/slides.md', 'presentations\\demo\\slides.md', 'presentations/evil/slides.md', 42]) {
    const {status, body} = await post({deck, index: 0, source: '## X', hash: current()});
    assert.equal(status, 400, String(deck));
    assert.equal(body.ok, false);
  }
  assert.equal((await post({deck: 'presentations/missing/slides.md', index: 0, source: '## X', hash: ''})).status, 404);
  assert.equal(readFileSync(join(dir, 'outside', 'evil', 'slides.md'), 'utf8'), '## Outside\n');
  assert.equal((await fetch(`${base}/api/edit?deck=presentations/evil/slides.md`)).status, 400);
});

test('saves only come from this server and only as JSON', async () => {
  assert.equal((await post({deck: slides, index: 1, source: '## X', hash: current()}, {Origin: 'https://evil.example'})).status, 403);
  const plain = await fetch(`${base}/api/slide`, {method: 'POST', headers: {'Content-Type': 'text/plain'},
    body: JSON.stringify({deck: slides, index: 1, source: '## X', hash: current()})});
  assert.equal(plain.status, 415);
  assert.equal(file(slides), DECK);
});

test('the server serves the site, but not dotfiles', async () => {
  assert.equal((await fetch(`${base}/presentations/demo/`)).status, 200);
  assert.equal((await fetch(`${base}/presentations/demo`, {redirect: 'manual'})).status, 301);
  assert.equal((await fetch(`${base}/.git/config`)).status, 404);
  assert.equal((await fetch(`${base}/presentations/%2e%2e/%2e%2e/etc/passwd`)).status, 404);
  const info = await (await fetch(`${base}/api/edit?deck=${slides}`)).json();
  assert.deepEqual(info, {editable: true, deck: slides, hash: hashOf(DECK)});
});

test('a save rewrites one slide, regenerates talk.json and commits only those two files', async () => {
  const before = Number(git('rev-list', '--count', 'HEAD'));
  const {status, body} = await post({deck: slides, index: 1, source: ':: content transition=iris\n\n## Better point\n\n- one\n- two\n\n???\nNotes stay.', hash: hashOf(DECK)});
  assert.equal(status, 200, JSON.stringify(body));
  assert.equal(body.ok, true);
  assert.match(body.commit, /^[0-9a-f]{7,}$/);
  assert.equal(file(slides), DECK.replace('First point', 'Better point'));
  assert.equal(body.markdown, file(slides));
  assert.equal(body.hash, current());
  const talk = JSON.parse(file('presentations/demo/talk.json'));
  assert.equal(talk.slides[1].title, 'Better point');
  assert.equal(talk.source, slides);
  assert.equal(Number(git('rev-list', '--count', 'HEAD')), before + 1);
  assert.equal(git('log', '-1', '--format=%s'), 'Edit slide 2 of demo: Better point');
  assert.equal(git('rev-parse', '--short', 'HEAD'), body.commit);
  assert.deepEqual(git('show', '--name-only', '--format=', 'HEAD').split('\n').sort(), [slides, 'presentations/demo/talk.json']);
  // the user's staged file is still staged, and nothing else is
  assert.equal(git('diff', '--cached', '--name-only'), 'notes.txt');
  assert.equal(git('status', '--porcelain', '--', 'presentations/demo'), '');
});

test('a save is refused with 409 when slides.md changed on disk since the page loaded it', async () => {
  const loaded = current();
  const changed = file(slides).replace('## Last', '## Last, edited by someone else');
  writeFileSync(join(root, slides), changed);
  const before = git('rev-parse', 'HEAD');
  const {status, body} = await post({deck: slides, index: 0, source: '# Mine.', hash: loaded});
  assert.equal(status, 409);
  assert.match(body.error, /changed on disk/);
  assert.equal(file(slides), changed);
  assert.equal(git('rev-parse', 'HEAD'), before);
  git('commit', '--quiet', '-m', 'Their edit', '--', slides);
});

test('saves run one at a time: of two saves from the same version, the second gets 409', async () => {
  const hash = current();
  const results = await Promise.all([
    post({deck: slides, index: 3, source: '## Final', hash}),
    post({deck: slides, index: 3, source: '## Finale', hash}),
  ]);
  assert.deepEqual(results.map(result => result.status), [200, 409]);
  assert.match(file(slides), /## Final\n$/);
});

test('a refused edit changes nothing on disk or in git', async () => {
  const text = file(slides);
  const head = git('rev-parse', 'HEAD');
  const {status, body} = await post({deck: slides, index: 1, source: '## A\n\n---\n\n## B', hash: current()});
  assert.equal(status, 400);
  assert.match(body.error, /separator/);
  assert.equal(file(slides), text);
  assert.equal(git('rev-parse', 'HEAD'), head);
});

test('when the commit fails, the files and the index are put back', async () => {
  const hooks = join(dir, 'hooks');
  mkdirSync(hooks, {recursive: true});
  writeFileSync(join(hooks, 'pre-commit'), '#!/bin/sh\necho "hook says no" >&2\nexit 1\n', {mode: 0o755});
  git('config', 'core.hooksPath', hooks);
  try {
    const text = file(slides);
    const talk = file('presentations/demo/talk.json');
    const {status, body} = await post({deck: slides, index: 3, source: '## Refused by the hook', hash: current()});
    assert.equal(status, 500);
    assert.match(body.error, /hook says no/);
    assert.equal(file(slides), text);
    assert.equal(file('presentations/demo/talk.json'), talk);
    assert.equal(git('diff', '--cached', '--name-only'), 'notes.txt');
    assert.equal(git('status', '--porcelain', '--', 'presentations/demo'), '');
  } finally {
    git('config', '--unset', 'core.hooksPath');
  }
});
