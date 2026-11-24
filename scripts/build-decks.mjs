#!/usr/bin/env node
// Builds every Markdown deck into a minified bundle in the built site. Run after
// scripts/build.py, which copies presentations/ and assets/ into _site:
//   node scripts/build-decks.mjs [_site]
//
// A deck is presentations/<deck>/index.html with <main class="deck" data-markdown=…>.
// Its page stays a plain page in the repository (served as is, it works unbundled, and
// the editor and edit server keep working). For the site, its stylesheets and scripts
// become one module entry that Vite bundles and minifies: the built index.html loads a
// hashed CSS file and a hashed script from /assets/bundle/, shared across decks.
//
// A deck whose front matter says "game: mario" also gets Mario mode (deck-game.js): its
// talk script is generated from slides.md here (talkJson), checked against the
// regular-mario library's own parser, and loaded with the library, Phaser and the
// castaway's sprites as a separate chunk only when someone switches to the game.
import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import {parseTalkScript} from 'regular-mario/talk-script';
import {talkJson} from './talk-json.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const WORK = join(ROOT, '.deck-build');
const PAGE = 'bundle.html';
const ENTRY = 'bundle-entry.js';

const STYLESHEET = /^\s*<link rel="stylesheet" href="([^"]+)">\n/gm;
const SCRIPT = /^\s*<script src="([^"]+)" defer><\/script>\n/gm;

// The deck's page, its stylesheets and scripts swapped for one module entry.
export function bundlePage(html) {
  const styles = [...html.matchAll(STYLESHEET)].map(match => match[1]);
  const scripts = [...html.matchAll(SCRIPT)].map(match => match[1]);
  if (!scripts.length) throw new Error('the page loads no scripts');
  const page = html.replace(STYLESHEET, '').replace(SCRIPT, '')
    .replace('</head>', `  <script type="module" src="./${ENTRY}"></script>\n</head>`);
  return {page, styles, scripts};
}

// The module entry: the page's stylesheets and scripts, in their order, and for a game
// deck the loader deck-game.js calls when someone switches to Mario mode.
export function bundleEntry({styles, scripts, talk}) {
  const lines = [...styles, ...scripts].map(path => `import ${JSON.stringify(path)};`);
  if (talk) {
    lines.push(
      '// Mario mode, loaded on demand (assets/deck-game.js)',
      'globalThis.DeckGame = {',
      "  library: () => import('regular-mario'),",
      `  talk: () => import(${JSON.stringify(talk)}).then(module => module.default),`,
      '};');
  }
  return `${lines.join('\n')}\n`;
}

// The decks: presentations/<deck>/index.html presenting its slides.md.
export function markdownDecks(root = ROOT) {
  return readdirSync(join(root, 'presentations'), {withFileTypes: true})
    .filter(entry => entry.isDirectory() && existsSync(join(root, 'presentations', entry.name, 'index.html')))
    .map(entry => entry.name)
    .filter(name => readFileSync(join(root, 'presentations', name, 'index.html'), 'utf8')
      .includes('<main class="deck" data-markdown="slides.md">'))
    .sort();
}

async function main(site) {
  await import('../assets/deck-markdown.js');
  const {render} = globalThis.DeckMarkdown;
  const decks = markdownDecks();

  rmSync(WORK, {recursive: true, force: true});
  mkdirSync(join(WORK, 'talk'), {recursive: true});
  const made = [];
  try {
    for (const deck of decks) {
      const dir = join(ROOT, 'presentations', deck);
      const markdown = readFileSync(join(dir, 'slides.md'), 'utf8');
      const {meta} = render(markdown);
      let talk = null;
      if (meta.game === 'mario') {
        const script = talkJson(markdown, `presentations/${deck}/slides.md`);
        parseTalkScript(script);  // throws a TalkScriptError naming the bad field
        talk = join(WORK, 'talk', `${deck}.json`);
        writeFileSync(talk, JSON.stringify(script));
      } else if (meta.game) {
        throw new Error(`presentations/${deck}/slides.md: unknown game "${meta.game}" (only "mario")`);
      }
      const {page, styles, scripts} = bundlePage(readFileSync(join(dir, 'index.html'), 'utf8'));
      writeFileSync(join(dir, PAGE), page);
      writeFileSync(join(dir, ENTRY), bundleEntry({styles, scripts, talk}));
      made.push(join(dir, PAGE), join(dir, ENTRY));
    }

    await build({
      configFile: false,
      root: ROOT,
      // relative URLs, so a page works wherever the site is served from
      base: './',
      publicDir: false,
      logLevel: 'warn',
      build: {
        outDir: join(WORK, 'out'),
        emptyOutDir: true,
        assetsDir: 'assets/bundle',
        // Mario mode's chunk holds Phaser (about 1.4 MB); it loads only when asked for
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
          input: Object.fromEntries(decks.map(deck => [deck, join(ROOT, 'presentations', deck, PAGE)])),
          output: {
            // the shared deck runtime, and Mario mode's two halves, under names that say so
            manualChunks: id => id.includes('/node_modules/phaser/') ? 'phaser'
              : id.includes('/node_modules/regular-mario/') ? 'regular-mario'
              : id.startsWith(join(ROOT, 'assets')) ? 'deck-runtime'
              : undefined,
          },
        },
      },
    });
  } finally {
    for (const file of made) rmSync(file, {force: true});
  }

  const out = join(WORK, 'out');
  for (const deck of decks) {
    const built = join(out, 'presentations', deck, PAGE);
    if (!existsSync(built)) throw new Error(`no bundle for ${deck}`);
    cpSync(built, join(site, 'presentations', deck, 'index.html'));
  }
  cpSync(join(out, 'assets', 'bundle'), join(site, 'assets', 'bundle'), {recursive: true});
  rmSync(WORK, {recursive: true, force: true});
  console.log(`Bundled ${decks.length} decks into ${site}: ${decks.join(', ')}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main(resolve(process.argv[2] ?? join(ROOT, '_site')));
}
