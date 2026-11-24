#!/usr/bin/env node
// Converts a deck's slides.md into talk.json, the plain-text form Regular Mario's talk
// mode draws in its world (one room per slide). Markdown is reduced to text: links keep
// their text and are listed separately, emphasis and code marks are dropped, speaker
// notes (after ???) and HTML comments are left out. A table row may open with an icon,
// ![](icons/<prop>.svg), which becomes the game prop of that name (table.icons).
//
// A `:: diagram` slide's ```mermaid block also becomes `diagram`, which the game draws in
// place of the slide's list (the list stays, as the slide's text). A sequenceDiagram
// keeps its participants/actors, its messages (A->>B solid, A-->>B a dashed reply) and its
// `Note over A,B: …` lines. A flowchart needs every node placed on the game's grid by a
// comment line Mermaid ignores:
//   %% game at <node> <column> <row> [<prop>] [| <label for the game>]
// (the label's own `|` break lines; without one, the node's Mermaid label is used, split
// at <br/>). A sequence actor may get an icon the same way:
//   %% game icon <actor> <prop>
// A flowchart with an unplaced node gets no `diagram`: the game shows its list.
//   node scripts/talk-json.mjs presentations/who-answers-the-syscall/slides.md
// writes talk.json next to slides.md.
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';

const source = process.argv[2];
if (!source) {
  console.error('usage: node scripts/talk-json.mjs <slides.md>');
  process.exit(2);
}
const markdown = readFileSync(source, 'utf8').replace(/\r\n/g, '\n');

// --- inline Markdown → text, collecting links ---
// Each link also records the text it sits in (`context`), so the game links that
// occurrence and not the same words elsewhere on the slide.
function plain(text, links) {
  const first = links.length;
  const out = text
    .replace(/!\[[^\]]*\]\([^)\s]+\)\s*/g, '')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => { links.push({text: plain(label, []), url}); return label; })
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^\w*])\*([^*]+)\*(?=$|[^\w*])/g, '$1$2')
    .replace(/(^|\W)_([^_]+)_(?=$|\W)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim();
  for (const link of links.slice(first)) link.context = out;
  return out;
}

// --- Mermaid → the game's diagram ---

const mermaidText = text => text.replace(/<br\s*\/?>/gi, ' ').replace(/^"(.*)"$/, '$1').replace(/\s+/g, ' ').trim();

function parseMermaid(lines, where) {
  const kind = (lines.find(line => line.trim() && !line.trim().startsWith('%%')) ?? '').trim().split(/\s+/)[0];
  const hints = lines.map(line => line.trim().match(/^%%\s*game\s+(\w+)\s+(.*)$/)).filter(Boolean);
  if (kind === 'sequenceDiagram') {
    const actors = [], steps = [];
    const actor = id => { if (!actors.some(a => a.id === id)) actors.push({id, label: id, icon: null}); };
    for (const raw of lines) {
      const line = raw.trim();
      let m;
      if ((m = line.match(/^(?:participant|actor)\s+(\S+)(?:\s+as\s+(.+))?$/))) {
        actor(m[1]);
        actors.find(a => a.id === m[1]).label = mermaidText(m[2] ?? m[1]);
      } else if ((m = line.match(/^(\S+?)\s*(--?)>>\s*(\S+?)\s*:\s*(.*)$/))) {
        actor(m[1]); actor(m[3]);
        steps.push({kind: 'message', from: m[1], to: m[3], text: mermaidText(m[4]), reply: m[2] === '--'});
      } else if ((m = line.match(/^Note\s+(?:over|left of|right of)\s+([^:]+):\s*(.*)$/i))) {
        steps.push({kind: 'note', over: m[1].split(',').map(id => id.trim()), text: mermaidText(m[2])});
      }
    }
    for (const [, verb, rest] of hints) {
      const [id, prop] = rest.split(/\s+/);
      const target = actors.find(a => a.id === id);
      if (verb !== 'icon' || !target || !prop) throw new Error(`${where}: unknown diagram hint: %% game ${verb} ${rest}`);
      target.icon = prop;
    }
    return {kind: 'sequence', actors, steps};
  }
  if (kind === 'flowchart' || kind === 'graph') {
    const nodes = new Map(), edges = [];
    const node = token => {
      const m = token.trim().match(/^([\w-]+)\s*(?:\[\(|\(\[|\[\[|\(\(|\[|\(|\{)?\s*(.*?)\s*(?:\)\]|\]\)|\]\]|\)\)|\]|\)|\})?$/);
      if (!m) throw new Error(`${where}: cannot read the Mermaid node ${token}`);
      const id = m[1];
      if (!nodes.has(id)) nodes.set(id, {id, lines: [id], icon: null, column: null, row: null});
      if (m[2]) nodes.get(id).lines = m[2].replace(/^"(.*)"$/, '$1').split(/<br\s*\/?>/i).map(part => part.trim()).filter(Boolean);
      return id;
    };
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      if (!line || line.startsWith('%%')) continue;
      // a chain: node, arrow, node, arrow, … (an arrow may carry a label: -- text --> or -->|text|)
      const parts = line.split(/\s*(-\.->|-->|--\s+"[^"]*"\s+-->|--\s+[^-]+?\s+-->)\s*(?:\|[^|]*\|\s*)?/);
      if (parts.length < 3) { node(line); continue; }
      let previous = node(parts[0]);
      for (let i = 1; i + 1 < parts.length; i += 2) {
        const next = node(parts[i + 1]);
        edges.push({from: previous, to: next, dotted: parts[i] === '-.->'});
        previous = next;
      }
    }
    for (const [, verb, rest] of hints) {
      const m = rest.match(/^(\S+)\s+(\d+)\s+(\d+)(?:\s+([\w-]+))?\s*(?:\|\s*(.*))?$/);
      const target = m && nodes.get(m[1]);
      if (verb !== 'at' || !target) throw new Error(`${where}: unknown diagram hint: %% game ${verb} ${rest}`);
      target.column = Number(m[2]); target.row = Number(m[3]);
      if (m[4]) target.icon = m[4];
      if (m[5]) target.lines = m[5].split('|').map(part => part.trim()).filter(Boolean);
    }
    if ([...nodes.values()].some(n => n.column === null)) return null;
    return {kind: 'flow', nodes: [...nodes.values()], edges};
  }
  return null;
}

function parseArgs(rest) {
  const args = {};
  for (const match of rest.matchAll(/(\w+)(?:=(?:"([^"]*)"|(\S+)))?/g)) args[match[1].toLowerCase()] = match[2] ?? match[3] ?? true;
  return args;
}

let body = markdown;
const meta = {};
const front = body.match(/^---\n([\s\S]*?)\n---\n/);
if (front) {
  for (const line of front[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2];
  }
  body = body.slice(front[0].length);
}

const slides = [];
for (const chunk of body.split(/\n---\n/)) {
  let lines = chunk.replace(/<!--[\s\S]*?-->/g, '').split('\n');
  const notesAt = lines.findIndex(line => /^\?\?\?\s*$/.test(line));
  if (notesAt >= 0) lines = lines.slice(0, notesAt);
  if (!lines.some(line => line.trim())) continue;
  const slide = {template: 'content', world: null, day: null, transition: null, kicker: null, title: null,
    lead: [], bullets: [], quote: null, cite: null, columns: [], table: null, links: [], art: null};
  let column = null;
  let quote = [];
  let table = [];
  // the open fence's language ('' for none), or null outside a fenced block
  let fence = null;
  let isDiagram = false;
  const mermaid = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    // a fenced code block: each line is shown as it is (fence markers dropped). A
    // ```mermaid drawing is the deck's alone: the game shows the slide's list instead.
    if ((m = line.match(/^(?:`{3,}|~{3,})\s*([\w-]*)/))) { fence = fence === null ? m[1].toLowerCase() : null; continue; }
    if (fence !== null) { if (fence === 'mermaid') mermaid.push(line); else if (line.trim()) slide.lead.push(line.trim().replace(/\s+/g, ' ')); continue; }
    if ((m = line.match(/^::\s*([\w-]+)(.*)$/))) {
      // the game has no diagram template: a diagram slide is drawn as content, by its list
      isDiagram = m[1].toLowerCase() === 'diagram';
      slide.template = isDiagram ? 'content' : m[1].toLowerCase();
      const args = parseArgs(m[2]);
      slide.world = typeof args.world === 'string' ? args.world : null;
      slide.day = typeof args.day === 'string' ? args.day : null;
      slide.transition = typeof args.transition === 'string' ? args.transition : null;
      slide.art = typeof args.art === 'string' ? args.art : null;
      // `dialogue`: each bullet is `Speaker: words`, drawn as a script
      if (args.dialogue === true) slide.dialogue = true;
      if (args.number === 'none') slide.numbered = false;
    } else if ((m = line.match(/^###\s+(.*)$/)) && !line.startsWith('####')) slide.kicker = plain(m[1], slide.links);
    else if ((m = line.match(/^####\s+(.*)$/))) { column = {label: plain(m[1], slide.links), bullets: []}; slide.columns.push(column); }
    else if ((m = line.match(/^#{1,2}\s+(.*)$/))) slide.title = plain(m[1], slide.links);
    else if ((m = line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/))) (column ? column.bullets : slide.bullets).push(plain(m[1], slide.links));
    else if ((m = line.match(/^>\s?(.*)$/))) quote.push(m[1]);
    else if (/^\|.*\|$/.test(line)) table.push(line);
    // a picture, ![alt](pictures/<id>.svg), on a section or content slide: the game draws the
    // picture of that name. Any other image on a section (e.g. animations/…) is the deck's
    // alone: the game animates the slide's props in the level instead.
    else if ((m = line.match(/^!\[[^\]]*\]\(([^)\s]+)\)\s*$/))) {
      if (slide.template !== 'section' && slide.template !== 'content') throw new Error(`${source}: a picture belongs on a section or content slide: ${line}`);
      if (m[1].startsWith('pictures/')) slide.picture = m[1].split('/').pop().replace(/\.\w+$/, '');
    }
    else if (line.trim()) slide.lead.push(plain(line, slide.links));
  }
  quote = quote.filter(text => text.trim());
  if (quote.length) {
    const last = quote[quote.length - 1];
    if (quote.length > 1 && /^\s*(—|--)/.test(last)) { slide.cite = plain(last.replace(/^\s*(—|--)\s*/, ''), slide.links); quote.pop(); }
    slide.quote = plain(quote.join(' '), slide.links);
  }
  if (isDiagram && mermaid.length) {
    const diagram = parseMermaid(mermaid, `${source}: ${slide.title ?? 'a diagram slide'}`);
    if (diagram) slide.diagram = diagram;
  }
  if (table.length) {
    const raw = table.filter(row => !/^\|\s*:?-{3,}/.test(row)).map(row => row.slice(1, -1).split('|'));
    const rows = raw.map(cells => cells.map(cell => plain(cell, slide.links)));
    slide.table = {head: rows[0], rows: rows.slice(1)};
    // a row may open with an icon, ![](icons/<prop>.svg): the game draws that prop
    const icons = raw.slice(1).map(cells => {
      const m = (cells[0] ?? '').match(/^\s*!\[[^\]]*\]\(([^)\s]+)\)/);
      return m ? m[1].split('/').pop().replace(/\.\w+$/, '') : null;
    });
    if (icons.some(icon => icon !== null)) slide.table.icons = icons;
  }
  slides.push(slide);
}

const out = {title: meta.title ?? slides.find(slide => slide.template === 'title')?.title ?? '', source: source, slides};
const target = join(dirname(source), 'talk.json');
writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);
console.log(`${target}: ${slides.length} slides`);
