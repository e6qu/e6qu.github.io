#!/usr/bin/env node
// Serves the site on 127.0.0.1 with edit mode for Markdown decks: while presenting or
// rehearsing, press E on a slide, change its Markdown, and Ctrl/Cmd+S writes it to the
// deck's slides.md, regenerates talk.json (if the deck has one) and commits both.
//   node scripts/edit-server.mjs [--port 8766] [--root <repo>]
// then open http://127.0.0.1:8766/presentations/<deck>/
//
// GET  /api/edit?deck=presentations/<name>/slides.md  → {editable: true, deck, hash}
// POST /api/slide {deck, index, source, hash}          → {ok, commit, hash, markdown} or {ok: false, error}
// `index` is the 0-based slide, `source` its new Markdown, `hash` the SHA-256 of the file
// the page was rendered from: if slides.md has changed since, the save is refused (409).
// Saves run one at a time. Each commits only slides.md and talk.json, on the current
// branch; nothing is pushed. Node built-ins only.
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {existsSync, readFileSync, realpathSync, statSync, writeFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {dirname, extname, join, relative, resolve, sep} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {promisify} from 'node:util';
import vm from 'node:vm';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const TALK_JSON = join(here, 'talk-json.mjs');

// The renderer the pages use, so the server parses a slide exactly as the browser does.
const context = {};
context.globalThis = context;
vm.runInNewContext(readFileSync(join(here, '..', 'assets', 'deck-markdown.js'), 'utf8'), context);
const {TEMPLATES, render, sources, replaceSlide} = context.DeckMarkdown;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.pdf': 'application/pdf', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json',
};

export class EditError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// The hash the page sends back: SHA-256 of the file's text (what fetch().text() sees).
export const hashOf = text => createHash('sha256').update(text.replace(/^﻿/, ''), 'utf8').digest('hex');

// `deck` must name an existing presentations/<name>/slides.md inside root, and nothing else.
export function deckPath(root, deck) {
  if (typeof deck !== 'string' || !/^presentations\/[A-Za-z0-9_-][A-Za-z0-9._-]*\/slides\.md$/.test(deck) || deck.includes('..')) {
    throw new EditError(400, 'deck must be presentations/<name>/slides.md');
  }
  const presentations = realpathSync(join(root, 'presentations'));
  let file;
  try { file = realpathSync(join(root, deck)); } catch { throw new EditError(404, `${deck} does not exist`); }
  const inside = relative(presentations, file).split(sep);
  if (inside.length !== 2 || inside[0] === '..' || !statSync(file).isFile()) {
    throw new EditError(400, `${deck} is not a deck inside this repository`);
  }
  return file;
}

// Plain text of the slide's heading, for the commit message.
export function slideTitle(source) {
  const lines = source.replace(/<!--[\s\S]*?-->/g, '').split('\n').filter(line => line.trim() && !/^::/.test(line.trim()));
  const pick = lines.find(line => /^#{1,2}\s/.test(line)) || lines.find(line => /^###\s/.test(line))
    || lines.find(line => /^\s*>/.test(line)) || lines.find(line => !/^\?\?\?\s*$/.test(line)) || '';
  const text = pick.replace(/^\s*(#{1,4}|>|[-*+]|\d+[.)])\s*/, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '').replace(/\s+/g, ' ').trim();
  return (text.length > 60 ? `${text.slice(0, 59).trimEnd()}…` : text) || 'untitled';
}

// The whole file with slide `index` replaced by `source`, or an EditError saying why not.
export function editDeck(markdown, index, source) {
  const slides = sources(markdown);
  if (!Number.isInteger(index) || index < 0 || index >= slides.length) {
    throw new EditError(400, `There is no slide ${Number.isInteger(index) ? index + 1 : index}: the deck has ${slides.length}`);
  }
  if (typeof source !== 'string' || !source.trim()) throw new EditError(400, 'The slide is empty; delete slides in slides.md itself');
  // A separator outside a code fence would split the slide in two.
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let fence = null;
  for (const [i, line] of lines.entries()) {
    const marker = line.match(/^(`{3,}|~{3,})/);
    if (marker) fence = fence ? (line.startsWith(fence) ? null : fence) : marker[1];
    if (!fence && /^---\s*$/.test(line)) {
      throw new EditError(400, `Line ${i + 1} is a slide separator (---); add or split slides in slides.md itself`);
    }
  }
  const sheet = lines.find(line => /^::/.test(line.trim()))?.trim().match(/^::\s*([\w-]+)/)?.[1]?.toLowerCase();
  if (sheet && !TEMPLATES.includes(sheet)) throw new EditError(400, `There is no "${sheet}" sheet; use one of ${TEMPLATES.join(', ')}`);
  const next = replaceSlide(markdown, index, source);
  try {
    render(next);
  } catch (error) {
    throw new EditError(400, `deck-markdown.js could not render the deck: ${error.message}`);
  }
  // Every other slide must come out exactly as before: an unclosed ``` fence, for one,
  // would swallow the separators after it.
  const after = sources(next);
  const wanted = lines.join('\n').replace(/^(\s*\n)+/, '').replace(/(\n\s*)+$/, '');
  if (after.length !== slides.length || after[index].text !== wanted
    || after.some((slide, i) => i !== index && slide.text !== slides[i].text)) {
    throw new EditError(400, 'The edit would change the other slides (is a ``` code fence left open?)');
  }
  return next;
}

async function git(root, args) {
  try {
    return (await run('git', args, {cwd: root})).stdout.trim();
  } catch (error) {
    throw new EditError(500, `git ${args[0]} failed: ${(error.stderr || error.message).trim()}`);
  }
}

// A merge, rebase, cherry-pick or revert in progress: committing now would be part of it.
async function busy(root) {
  for (const ref of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD']) {
    if (await run('git', ['rev-parse', '--quiet', '--verify', ref], {cwd: root}).then(() => true, () => false)) return ref;
  }
  for (const dir of ['rebase-merge', 'rebase-apply']) {
    if (existsSync(resolve(root, await git(root, ['rev-parse', '--git-path', dir])))) return 'a rebase';
  }
  return null;
}

// Saves one slide: check, write, regenerate talk.json, commit. On any failure the files,
// and what the index held for them, are put back as they were.
export async function saveSlide(root, {deck, index, source, hash}) {
  const file = deckPath(root, deck);
  const markdown = readFileSync(file, 'utf8');
  if (typeof hash !== 'string' || hash !== hashOf(markdown)) {
    throw new EditError(409, `${deck} has changed on disk since this page loaded it. Reload the page to see the new version; copy your edit first, it was not saved.`);
  }
  const next = editDeck(markdown, index, source);
  if (next === markdown) return {ok: true, commit: null, unchanged: true, hash, markdown: markdown.replace(/^﻿/, '')};
  const during = await busy(root);
  if (during) throw new EditError(409, `Git is in the middle of ${during}; finish it before saving slides`);
  const talkPath = deck.replace(/slides\.md$/, 'talk.json');
  const talk = join(root, talkPath);
  const hasTalk = existsSync(talk);
  const talkBefore = hasTalk ? readFileSync(talk) : null;
  const paths = [deck, ...(hasTalk ? [talkPath] : [])];
  const staged = await Promise.all(paths.map(path => git(root, ['ls-files', '--stage', '--', path])));
  writeFileSync(file, next);
  try {
    if (hasTalk) {
      try {
        await run(process.execPath, [TALK_JSON, deck], {cwd: root});
      } catch (error) {
        throw new EditError(500, `talk-json.mjs failed: ${(error.stderr || error.message).trim()}`);
      }
    }
    await git(root, ['add', '--', ...paths]);
    const name = deck.split('/')[1];
    await git(root, ['commit', '--quiet', '-m', `Edit slide ${index + 1} of ${name}: ${slideTitle(source)}`, '--only', '--', ...paths]);
    const commit = await git(root, ['rev-parse', '--short', 'HEAD']);
    return {ok: true, commit, hash: hashOf(next), markdown: next.replace(/^﻿/, '')};
  } catch (error) {
    writeFileSync(file, markdown);
    if (hasTalk) writeFileSync(talk, talkBefore);
    for (const [i, path] of paths.entries()) {
      const entry = staged[i].match(/^(\d+) ([0-9a-f]+) 0\t/);
      await run('git', entry ? ['update-index', '--cacheinfo', `${entry[1]},${entry[2]},${path}`]
        : ['update-index', '--force-remove', '--', path], {cwd: root}).catch(() => {});
    }
    throw error;
  }
}

function send(response, status, body, headers = {}) {
  const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  response.writeHead(status, {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
    'Content-Type': typeof body === 'object' && !Buffer.isBuffer(body) ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8', ...headers});
  response.end(data);
}

function readBody(request, limit = 1 << 20) {
  return new Promise((done, fail) => {
    const chunks = [];
    let size = 0;
    request.on('data', chunk => {
      size += chunk.length;
      if (size > limit) { fail(new EditError(413, 'Request too large')); request.destroy(); } else chunks.push(chunk);
    });
    request.on('end', () => done(Buffer.concat(chunks).toString('utf8')));
    request.on('error', fail);
  });
}

async function serveFile(root, url, request, response) {
  let path;
  try { path = decodeURIComponent(url.pathname); } catch { return send(response, 400, 'Bad path'); }
  // no dotfiles (.git, .env, …), no way out of the root
  if (path.includes('\0') || path.split('/').some(part => part.startsWith('.'))) return send(response, 404, 'Not found');
  let file = resolve(root, `.${path}`);
  if (file !== root && !file.startsWith(root + sep)) return send(response, 404, 'Not found');
  try {
    if (statSync(file).isDirectory()) {
      if (!path.endsWith('/')) return send(response, 301, '', {Location: `${url.pathname}/${url.search}`});
      file = join(file, 'index.html');
    }
    const real = realpathSync(file);
    if (real !== root && !real.startsWith(root + sep)) return send(response, 404, 'Not found');
    const body = await readFile(real);
    response.writeHead(200, {'Content-Type': TYPES[extname(real).toLowerCase()] || 'application/octet-stream',
      'Content-Length': body.length, 'Cache-Control': 'no-store'});
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    send(response, 404, 'Not found');
  }
}

export function createEditServer({root, log = console.log}) {
  root = realpathSync(root);
  let queue = Promise.resolve();
  const serialized = task => {
    const result = queue.then(task, task);
    queue = result.catch(() => {});
    return result;
  };
  return createServer(async (request, response) => {
    const port = request.socket.localPort;
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    // Only pages from this server may use the API: other sites (and DNS rebinding) cannot.
    const local = [`127.0.0.1:${port}`, `localhost:${port}`];
    if (!local.includes(request.headers.host)) return send(response, 403, 'Use http://127.0.0.1:' + port);
    try {
      if (url.pathname === '/api/edit' && request.method === 'GET') {
        const deck = url.searchParams.get('deck');
        const file = deckPath(root, deck);
        return send(response, 200, {editable: true, deck, hash: hashOf(readFileSync(file, 'utf8'))});
      }
      if (url.pathname === '/api/slide') {
        if (request.method !== 'POST') return send(response, 405, {ok: false, error: 'POST only'}, {Allow: 'POST'});
        const origin = request.headers.origin;
        if (origin && !local.some(host => origin === `http://${host}`)) throw new EditError(403, 'Saves only come from this server\'s pages');
        if (!/^application\/json\b/.test(request.headers['content-type'] || '')) throw new EditError(415, 'Send JSON');
        let body;
        try { body = JSON.parse(await readBody(request)); } catch (error) { throw error instanceof EditError ? error : new EditError(400, 'Invalid JSON'); }
        const result = await serialized(() => saveSlide(root, body || {}));
        if (result.commit) log(`${result.commit} slide ${body.index + 1} of ${body.deck}`);
        return send(response, 200, result);
      }
      if (url.pathname.startsWith('/api/')) return send(response, 404, {ok: false, error: 'No such API'});
      if (request.method !== 'GET' && request.method !== 'HEAD') return send(response, 405, 'GET only', {Allow: 'GET, HEAD'});
      return serveFile(root, url, request, response);
    } catch (error) {
      const status = error instanceof EditError ? error.status : 500;
      if (status === 500) console.error(error);
      return send(response, status, {ok: false, error: error.message});
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const option = (name, fallback) => {
    const at = process.argv.indexOf(`--${name}`);
    return at > 0 ? process.argv[at + 1] : fallback;
  };
  const root = resolve(option('root', join(here, '..')));
  const port = Number(option('port', 8766));
  createEditServer({root}).listen(port, '127.0.0.1', () => {
    console.log(`Edit server for ${root}\nOpen http://127.0.0.1:${port}/presentations/<deck>/ and press E on a slide (Ctrl+C stops it).`);
  });
}
