// Accessibility audit of the built site (_site): runs axe-core against WCAG 2.0, 2.1
// and 2.2 A/AA plus best practices on every page, every slide of every deck, and every
// Storybook story, in light and dark. Exits non-zero on any violation.
//   python3 scripts/build.py && npm run build-storybook && npm run test:a11y
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {createReadStream, existsSync, readFileSync, statSync} from 'node:fs';
import {extname, join, resolve} from 'node:path';
import {createRequire} from 'node:module';

const SITE = resolve(process.argv[2] || '_site');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const TYPES = {'.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf',
  '.woff2': 'font/woff2', '.md': 'text/markdown'};
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

const server = createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let file = join(SITE, decodeURIComponent(url.pathname));
  if (!file.startsWith(SITE)) { response.writeHead(403); return response.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!url.pathname.endsWith('/')) { response.writeHead(301, {location: url.pathname + '/' + url.search}); return response.end(); }
    file = join(file, 'index.html');
  }
  if (!existsSync(file)) { response.writeHead(404); return response.end(); }
  response.writeHead(200, {'content-type': TYPES[extname(file)] || 'application/octet-stream'});
  createReadStream(file).pipe(response);
});
await new Promise(done => server.listen(0, done));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const failures = [];
let checks = 0;

async function audit(page, label, include) {
  await page.evaluate(() => document.fonts.ready);
  if (!await page.evaluate(() => 'axe' in window)) await page.addScriptTag({content: axeSource});
  const result = await page.evaluate(([tags, context]) =>
    window.axe.run(context || document, {runOnly: {type: 'tag', values: tags}, resultTypes: ['violations']}), [TAGS, include]);
  checks++;
  for (const violation of result.violations) {
    failures.push({label, id: violation.id, impact: violation.impact, help: violation.help,
      nodes: violation.nodes.slice(0, 4).map(node => `${node.target.join(' ')}: ${node.failureSummary.split('\n').slice(1, 2).join(' ').trim()}`)});
  }
}

// WCAG 1.4.12: the spacing users must be able to apply without losing content.
const TEXT_SPACING = '* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}' +
  ' p, li, dd, blockquote {margin-bottom:2em!important}';

// Checks axe cannot make: reflow, text spacing, visible and unobscured focus.
async function layout(page, label, {spacing = false} = {}) {
  if (spacing) await page.addStyleTag({content: TEXT_SPACING});
  checks++;
  const problems = await page.evaluate(() => {
    const found = [];
    const name = el => el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}${el.classList.length ? '.' + [...el.classList].join('.') : ''}`;
    if (document.documentElement.scrollWidth > innerWidth + 1) found.push(['reflow', `page scrolls sideways: ${document.documentElement.scrollWidth}px wide at ${innerWidth}px`]);
    for (const el of document.querySelectorAll('body *')) {
      const style = getComputedStyle(el);
      if (!/hidden|clip/.test(style.overflowX + style.overflowY) || el.closest('[aria-hidden="true"], .sr-only, [hidden]')) continue;
      if (!el.innerText?.trim() || el.offsetParent === null) continue;
      if (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) found.push(['clipped', `${name(el)} cuts off text (${el.scrollWidth}×${el.scrollHeight} in ${el.clientWidth}×${el.clientHeight})`]);
    }
    return found;
  });
  for (const [id, help] of problems) failures.push({label: `${label}${spacing ? ' +text spacing' : ''}`, id, help, nodes: []});
}

async function focusWalk(page, label, limit = 80) {
  checks++;
  const seen = new Set();
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press('Tab');
    const result = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const ring = (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none';
      const box = el.getBoundingClientRect();
      const points = [[box.left + 2, box.top + 2], [box.right - 2, box.bottom - 2], [box.left + box.width / 2, box.top + box.height / 2]];
      const visible = points.some(([x, y]) => { const hit = document.elementFromPoint(x, y); return hit && (hit === el || el.contains(hit) || hit.contains(el)); });
      const id = el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} "${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"`;
      return {id, ring, visible, key: id + box.top};
    });
    if (!result || seen.has(result.key)) break;
    seen.add(result.key);
    if (!result.ring) failures.push({label, id: 'focus-visible', help: `${result.id} shows no focus indicator`, nodes: []});
    if (!result.visible) failures.push({label, id: 'focus-obscured', help: `${result.id} is hidden behind other content when focused`, nodes: []});
  }
}

async function open(path, theme, viewport = {width: 1280, height: 800}) {
  const context = await browser.newContext({viewport, colorScheme: theme, reducedMotion: 'reduce'});
  const page = await context.newPage();
  page.on('pageerror', error => failures.push({label: `${theme} ${path}`, id: 'page-error', help: error.message, nodes: []}));
  await page.goto(base + path);
  return page;
}

async function deck(path, theme, ready) {
  const page = await open(path, theme);
  await page.waitForFunction(ready);
  const count = await page.locator('.slide-frame').count();
  for (let i = 0; i < count; i++) {
    await audit(page, `${theme} ${path} slide ${i + 1}`);
    checks++;
    const overflow = await page.evaluate(() => { const s = document.querySelector('[data-current] .slide'); return s.scrollHeight > s.clientHeight + 1 || s.scrollWidth > s.clientWidth + 1; });
    if (overflow) failures.push({label: `${theme} ${path} slide ${i + 1}`, id: 'slide-overflow', help: 'content does not fit the 16:9 slide', nodes: []});
    await page.keyboard.press('ArrowRight');
  }
  await focusWalk(page, `${theme} ${path}`);
  await page.keyboard.press('o');
  await audit(page, `${theme} ${path} overview`);
  await page.context().close();
}

for (const theme of ['light', 'dark']) {
  for (const path of ['/', '/presentations/', '/presentations/viewer/', '/presentations/editor/']) {
    for (const viewport of [undefined, {width: 320, height: 640}]) {
      const label = `${theme} ${path}${viewport ? ' @320px' : ''}`;
      const page = await open(path, theme, viewport);
      if (path.includes('editor')) await page.waitForFunction(() => document.querySelectorAll('#preview .slide-frame').length > 0);
      await audit(page, label);
      await layout(page, label);
      await focusWalk(page, label);
      await layout(page, label, {spacing: true});
      await page.context().close();
    }
  }
  await deck('/presentations/a-portfolio-that-measures-itself/', theme, () => document.querySelector('.slide-frame'));
  await deck('/presentations/template/', theme, () => document.querySelector('.slide-frame'));
  await deck('/presentations/so-you-want-to-code-your-own-cloud/', theme, () => document.querySelector('.slide-frame'));
  await deck('/presentations/viewer/?src=../a-portfolio-that-measures-itself/slides.md', theme, () => document.querySelector('#deck .slide-frame'));
}

// Keyboard behaviour: the deck takes focus, slide changes are announced, single-key
// shortcuts only act while the deck has focus (2.1.4), controls keep their own keys, and
// the editor's text area does not trap Tab (2.1.2).
{
  const expect = (label, ok, help) => { checks++; if (!ok) failures.push({label, id: 'keyboard', help, nodes: []}); };
  const page = await open('/presentations/a-portfolio-that-measures-itself/', 'light');
  await page.waitForFunction(() => document.querySelector('.slide-frame'));
  const label = 'keyboard deck';
  expect(label, await page.evaluate(() => document.activeElement.matches('.deck')), 'the deck does not take focus when it starts');
  await page.keyboard.press('ArrowRight');
  const said = await page.evaluate(() => document.querySelector('[role="status"]').textContent);
  expect(label, said.startsWith('Slide 2 of 18: '), `slide change not announced (got "${said}")`);
  await page.keyboard.press('o');
  expect(label, await page.evaluate(() => document.querySelector('.deck').dataset.mode === 'overview'), 'O does not open the overview');
  expect(label, await page.isVisible('#edit-deck') && await page.isVisible('#print-deck'), 'the overview does not offer Edit Markdown and Save as PDF');
  await page.keyboard.press('Enter');
  expect(label, !await page.isVisible('#edit-deck') && !await page.isVisible('#print-deck'), 'Edit Markdown or Save as PDF shows while presenting');
  await page.focus('#theme-toggle');
  await page.keyboard.press('o');
  expect(label, await page.evaluate(() => document.querySelector('.deck').dataset.mode === 'present'), 'O acts while focus is outside the deck');
  const before = await page.evaluate(() => location.hash);
  await page.keyboard.press('Space');
  expect(label, await page.evaluate(([hash]) => location.hash === hash && document.documentElement.dataset.theme === 'dark', [before]), 'Space on the theme button changed the slide or did nothing');
  await page.context().close();

  const editor = await open('/presentations/editor/', 'light');
  await editor.waitForFunction(() => document.querySelectorAll('#preview .slide-frame').length > 0);
  await editor.focus('#source');
  await editor.keyboard.press('Tab');
  expect('keyboard editor', await editor.evaluate(() => document.activeElement.id !== 'source'), 'Tab is trapped in the Markdown text area');
  await editor.context().close();
}

const storybook = join(SITE, 'storybook', 'index.json');
if (existsSync(storybook)) {
  const stories = Object.values(JSON.parse(readFileSync(storybook, 'utf8')).entries).filter(entry => entry.type === 'story');
  for (const theme of ['light', 'dark']) {
    const page = await open('/storybook/iframe.html', theme);
    for (const story of stories) {
      // Manual mode keeps Storybook's a11y addon from starting its own axe run on each story,
      // which would race this one ("Axe is already running"); the audit injects its own axe.
      await page.goto(`${base}/storybook/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      await page.waitForSelector('.ds-theme');
      await audit(page, `${theme} storybook ${story.id}`, '#storybook-root');
    }
    await page.context().close();
  }
}

await browser.close();
server.close();
const byRule = Map.groupBy(failures, failure => `${failure.id} (${failure.impact || 'error'}): ${failure.help}`);
for (const [rule, list] of byRule) {
  console.log(`\n✗ ${rule} — ${list.length} page(s)`);
  for (const failure of list.slice(0, 6)) console.log(`  ${failure.label}\n    ${failure.nodes.join('\n    ')}`);
  if (list.length > 6) console.log(`  … and ${list.length - 6} more`);
}
console.log(`\n${checks} checks, ${failures.length} violations`);
process.exit(failures.length ? 1 : 0);
