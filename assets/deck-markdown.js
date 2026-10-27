// Turns Markdown into slide sheets from slides.css. Slides are separated by a line of
// "---"; an optional first line ":: <template> key=value" picks the sheet, otherwise it
// is guessed from the content. All HTML in the source is escaped and only http(s),
// mailto and relative URLs become links, so pasted decks are safe to render.
// See presentations/template/slides.md for every sheet.
(() => {
  const TEMPLATES = ['title', 'agenda', 'section', 'content', 'comparison', 'feature', 'code', 'code-split',
    'terminal', 'diagram', 'table', 'stats', 'image', 'quote', 'demo', 'pause', 'blank', 'closing'];
  const ART = ['pipes', 'replay', 'database', 'branches', 'cloud', 'containers', 'board', 'chat', 'terminal'];
  const TERMINAL = ['console', 'terminal', 'shell-session', 'sh-session'];
  const NO_FOOTER = ['title', 'pause', 'blank'];
  const PART_LESS = ['title', 'section', 'closing', 'blank'];
  const KEYWORDS = new Set(('def return if elif else for while in not and or is import from as class try except finally ' +
    'with yield async await lambda pass break continue raise True False None fn let mut pub impl struct enum match use ' +
    'mod trait where self Self const static func package var type interface go defer chan map range select switch case ' +
    'default function new this typeof instanceof export extends null undefined true false nil do end then local').split(' '));

  const esc = text => String(text).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);

  function safeUrl(url, image = false) {
    const value = url.trim();
    if (/^(https?:|mailto:)/i.test(value) || !/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
    if (image && /^data:image\/(png|jpe?g|gif|webp);/i.test(value)) return value;
    return null;
  }

  const emphasis = html => html
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>');

  function links(text) {
    let html = '';
    let last = 0;
    for (const match of text.matchAll(/\[([^\]]+)\]\(((?:[^()\s]|\([^()\s]*\))+)\)/g)) {
      html += emphasis(esc(text.slice(last, match.index)));
      const url = safeUrl(match[2]);
      html += url ? `<a href="${esc(url)}">${emphasis(esc(match[1]))}</a>` : emphasis(esc(match[1]));
      last = match.index + match[0].length;
    }
    return html + emphasis(esc(text.slice(last)));
  }

  // Inline Markdown: `code`, **bold**, *emphasis*, ~~strikethrough~~ and [links](url).
  const inline = text => text.split(/(`[^`]+`)/).map((part, i) => i % 2 ? `<code>${esc(part.slice(1, -1))}</code>` : links(part)).join('');

  function blocks(lines) {
    const out = [];
    const listItem = /^\s*([-*+]|\d+[.)])\s+(.*)$/;
    const starts = line => /^(`{3,}|~{3,}|#{1,4}\s|\s*>|\s*\||!\[|<!--)/.test(line) || listItem.test(line);
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      let match;
      if (!line.trim()) { i++; continue; }
      if (line.trim().startsWith('<!--')) {
        while (i < lines.length && !lines[i].includes('-->')) i++;
        i++;
      } else if ((match = line.match(/^(`{3,}|~{3,})\s*([\w+-]*)\s*(.*)$/))) {
        const body = [];
        for (i++; i < lines.length && !lines[i].startsWith(match[1]); i++) body.push(lines[i]);
        out.push({type: 'code', lang: match[2].toLowerCase(), info: match[3].trim(), text: body.join('\n')});
        i++;
      } else if ((match = line.match(/^(#{1,4})\s+(.*)$/))) {
        out.push({type: 'heading', level: match[1].length, text: match[2].trim()});
        i++;
      } else if (/^\s*>/.test(line)) {
        const body = [];
        for (; i < lines.length && /^\s*>/.test(lines[i]); i++) body.push(lines[i].replace(/^\s*>\s?/, ''));
        out.push({type: 'quote', lines: body});
      } else if (listItem.test(line)) {
        const items = [];
        const ordered = /^\s*\d/.test(line);
        for (; i < lines.length && lines[i].trim(); i++) {
          const item = lines[i].match(listItem);
          if (item) items.push(item[2]);
          else if (/^\s+\S/.test(lines[i]) && items.length) items[items.length - 1] += ' ' + lines[i].trim();
          else break;
        }
        out.push({type: 'list', ordered, items});
      } else if (/^\s*\|/.test(line)) {
        const rows = [];
        for (; i < lines.length && /^\s*\|/.test(lines[i]); i++) {
          const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
          if (!cells.every(cell => /^:?-{2,}:?$/.test(cell))) rows.push(cells);
        }
        out.push({type: 'table', head: rows[0] || [], rows: rows.slice(1)});
      } else if ((match = line.match(/^!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))+)\)\s*$/))) {
        out.push({type: 'image', alt: match[1], src: match[2]});
        i++;
      } else {
        const body = [];
        for (; i < lines.length && lines[i].trim() && !(body.length && starts(lines[i])); i++) body.push(lines[i].trim());
        out.push({type: 'paragraph', text: body.join(' ')});
      }
    }
    return out;
  }

  // Lines of a deck, split on "---" outside code fences, after optional front matter.
  function split(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const meta = {};
    let start = 0;
    if (lines[0] && lines[0].trim() === '---') {
      const end = lines.findIndex((line, i) => i > 0 && line.trim() === '---');
      const fields = end > 0 ? lines.slice(1, end) : [];
      if (end > 0 && fields.every(line => !line.trim() || /^\w+\s*:/.test(line))) {
        for (const line of fields) {
          const match = line.match(/^(\w+)\s*:\s*(.*)$/);
          if (match) meta[match[1].toLowerCase()] = match[2].trim();
        }
        start = end + 1;
      }
    }
    const slides = [];
    let current = {start, lines: []};
    let fence = null;
    for (let i = start; i < lines.length; i++) {
      const line = lines[i];
      const marker = line.match(/^(`{3,}|~{3,})/);
      if (marker) fence = fence ? (line.startsWith(fence) ? null : fence) : marker[1];
      if (!fence && /^---\s*$/.test(line)) {
        slides.push(current);
        current = {start: i + 1, lines: []};
      } else {
        current.lines.push(line);
      }
    }
    slides.push(current);
    return {meta, slides: slides.filter(slide => slide.lines.some(line => line.trim()))};
  }

  // The directive is the first line that is neither blank nor inside a comment.
  function directive(lines) {
    let first = 0;
    for (let comment = false; first < lines.length; first++) {
      const line = lines[first].trim();
      if (comment || line.startsWith('<!--')) comment = !line.includes('-->');
      else if (line) break;
    }
    const match = first < lines.length && lines[first].match(/^::\s*([\w-]+)(.*)$/);
    if (!match) return {template: null, args: {}, lines};
    const args = {};
    // key=value, key="quoted value", or a bare flag such as `mario`
    for (const arg of match[2].matchAll(/(\w+)(?:=(?:"([^"]*)"|(\S+)))?/g)) args[arg[1].toLowerCase()] = arg[2] ?? arg[3] ?? true;
    return {template: match[1].toLowerCase(), args, lines: [...lines.slice(0, first), ...lines.slice(first + 1)]};
  }

  function guess(content) {
    const has = type => content.some(block => block.type === type);
    if (!content.length) return 'blank';
    if (content.some(block => block.type === 'heading' && block.level === 1)) return 'title';
    if (content.every(block => block.type === 'heading' && block.level === 2)) return 'section';
    if (content.some(block => block.type === 'code' && TERMINAL.includes(block.lang))) return 'terminal';
    if (has('code')) return content.some(block => block.type === 'list' && block.ordered) ? 'code-split' : 'code';
    if (has('table')) return 'table';
    if (has('image')) return 'image';
    if (content.every(block => block.type === 'quote')) return 'quote';
    return 'content';
  }

  function highlight(line, lang) {
    if (!lang || lang === 'text' || lang === 'plain') return esc(line);
    const comment = ['python', 'py', 'ruby', 'rb', 'sh', 'bash', 'shell', 'zsh', 'yaml', 'yml', 'toml', 'r', 'perl', 'elixir'].includes(lang) ? '#'
      : ['sql', 'lua', 'haskell', 'hs'].includes(lang) ? '--' : '//';
    const pattern = new RegExp(`(${comment.replace(/[/-]/g, '\\$&')}.*$)|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`[^\`]*\`)|\\b([A-Za-z_]\\w*)\\b(\\s*\\()?`, 'g');
    let html = '';
    let last = 0;
    for (const match of line.matchAll(pattern)) {
      html += esc(line.slice(last, match.index));
      if (match[1]) html += `<span class="cm">${esc(match[1])}</span>`;
      else if (match[2]) html += `<span class="str">${esc(match[2])}</span>`;
      else if (KEYWORDS.has(match[3]) && line[match.index - 1] !== '.') html += `<span class="kw">${esc(match[3])}</span>${esc(match[4] || '')}`;
      else if (match[4]) html += `<span class="fn">${esc(match[3])}</span>${esc(match[4])}`;
      else html += esc(match[3]);
      last = match.index + match[0].length;
    }
    return html + esc(line.slice(last));
  }

  // ```python {3,5-6} highlights lines 3, 5 and 6; a trailing "# [1]" comment becomes pin 1.
  function codeBlock(block) {
    const marked = new Set();
    for (const range of (block.info.match(/\{([\d,\s-]+)\}/)?.[1] || '').split(',')) {
      const [from, to = from] = range.split('-').map(Number);
      for (let n = from; n <= to && n - from < 500; n++) marked.add(n);
    }
    const lines = block.text.split('\n').map((line, index) => {
      const pin = line.match(/\s*(?:#|\/\/|--|;)\s*\[(\d{1,2})\]\s*$/);
      let html = highlight(pin ? line.slice(0, pin.index) : line, block.lang);
      if (pin) html += ` <b class="pin">${pin[1]}</b>`;
      return marked.has(index + 1) ? `<span class="mark">${html}</span>` : html;
    });
    return `<pre class="slide-pre"><code>${lines.join('\n')}</code></pre>`;
  }

  function terminalBlock(block, title) {
    const lines = block.text.split('\n').map(line => {
      if (/^\$\s/.test(line)) return `<span class="prompt">$</span> ${esc(line.slice(2))}`;
      if (/^(✓|✔|ok\b)/i.test(line)) return `<span class="ok">${esc(line)}</span>`;
      return `<span class="out">${esc(line)}</span>`;
    });
    return `<div class="slide-window"><div class="slide-window-bar">${esc(title || block.info || '~')}</div><pre>${lines.join('\n')}</pre></div>`;
  }

  // A trailing . ? or ! is drawn in the accent color, like the site's name.
  const dotted = text => {
    const match = text.match(/^(.*?)([.?!])$/);
    return match ? `${inline(match[1])}<span class="slide-dot">${match[2]}</span>` : inline(text);
  };
  const pad = n => String(n).padStart(2, '0');

  function render(markdown) {
    const {meta, slides} = split(markdown);
    let sections = 0;
    let part = '';
    let subpart = '';
    const parts = [];
    let firstTitle = '';
    const rendered = slides.map((slide, index) => {
      const {template: chosen, args, lines} = directive(slide.lines);
      const content = blocks(lines);
      const template = TEMPLATES.includes(chosen) ? chosen : guess(content);
      const take = (type, test = () => true) => {
        const i = content.findIndex(block => block.type === type && test(block));
        return i < 0 ? null : content.splice(i, 1)[0];
      };
      const heading = level => take('heading', block => block.level === level)?.text;
      const kicker = (text = heading(3)) => text ? `<p class="slide-kicker">${inline(text)}</p>` : '';
      const h2 = (fallback = '') => {
        const text = heading(2) ?? fallback;
        return text ? `<h2>${inline(text)}</h2>` : '';
      };
      const list = () => take('list');
      const items = (block, wrap = item => `<li><span>${inline(item)}</span></li>`) => (block ? block.items : []).map(wrap).join('');
      const paragraphs = () => {
        const found = [];
        for (let block; (block = take('paragraph'));) found.push(block.text);
        return found;
      };
      let body;
      switch (template) {
        case 'title': {
          const top = kicker();
          const title = heading(1) ?? heading(2) ?? meta.title ?? '';
          firstTitle ||= title.replace(/[*_`]/g, '').replace(/[.?!]$/, '');
          const lead = take('paragraph');
          const metaList = list();
          body = `${top}<h2 class="slide-display">${dotted(title)}</h2>${lead ? `<p class="slide-lead">${inline(lead.text)}</p>` : ''}` +
            (metaList ? `<p class="slide-meta">${items(metaList, item => `<span>${inline(item)}</span>`)}</p>` : '');
          break;
        }
        case 'agenda': {
          body = `${kicker()}${h2()}<ol>${items(list(), item => {
            const [, title, time] = item.match(/^(.*?)(?:\s+[—–-]\s+([^—–-]+))?$/);
            const current = title.match(/^\*\*(.+)\*\*$/);
            return `<li${current ? ' aria-current="step"' : ''}><span>${inline(current ? current[1] : title)}</span>${time ? ` <span class="slide-time">${inline(time)}</span>` : ''}</li>`;
          })}</ol>`;
          break;
        }
        case 'section': {
          sections++;
          const title = heading(2) ?? heading(1) ?? '';
          part = `${args.number || pad(sections)} · ${title}`;
          parts.push(title);
          subpart = '';
          body = `<p class="slide-number">${esc(args.number || pad(sections))}</p><h2>${inline(title)}<span class="slide-mark"> ✳</span></h2>`;
          break;
        }
        case 'comparison': {
          const top = kicker() + h2();
          const columns = [];
          while (content.length) {
            const label = heading(4);
            const block = list();
            if (label === undefined && !block) break;
            columns.push({label, block});
          }
          const pick = Number(args.pick || columns.length);
          body = `${top}<div class="slide-columns">${columns.map((column, i) =>
            `<div class="slide-column${i + 1 === pick ? ' is-pick' : ''}">${column.label ? `<h3>${inline(column.label)}</h3>` : ''}<ul class="slide-list">${items(column.block)}</ul></div>`).join('')}</div>`;
          break;
        }
        case 'feature': {
          const art = ART.includes(args.art) ? args.art : 'pipes';
          const top = kicker() + h2();
          const lead = take('paragraph');
          const metaList = list();
          body = `<div class="slide-copy">${top}${lead ? `<p class="slide-lead">${inline(lead.text)}</p>` : ''}` +
            (metaList ? `<p class="slide-meta">${items(metaList, item => `<span>${inline(item)}</span>`)}</p>` : '') +
            `\u0000footer\u0000</div><div class="slide-art art-${art}" data-illustration="${art}" aria-hidden="true"></div>`;
          break;
        }
        case 'code': {
          const block = take('code');
          body = h2() + (block ? codeBlock(block) : '');
          break;
        }
        case 'code-split': {
          const block = take('code');
          body = h2() + (block ? codeBlock(block) : '<pre class="slide-pre"></pre>') +
            `<ol class="slide-callouts">${items(list(), (item, i) => `<li><b class="pin">${i + 1}</b><span>${inline(item)}</span></li>`)}</ol>`;
          break;
        }
        case 'terminal': {
          const block = take('code');
          body = h2() + terminalBlock(block || {text: '', info: ''}, args.title);
          break;
        }
        case 'diagram': {
          const key = Number(args.key || 0);
          body = `${kicker()}${h2()}<ol class="slide-flow">${items(list(), (item, i) => {
            const match = item.match(/^(?:([^:*]+):\s*)?\*\*(.+?)\*\*\s*(?:[—–-]\s*)?(.*)$/);
            const [label, title, detail] = match ? [match[1], match[2], match[3]] : [null, item, ''];
            return `<li${i + 1 === key ? ' class="is-key"' : ''}><b>${pad(i + 1)}${label ? ` · ${inline(label.trim())}` : ''}</b><strong>${inline(title)}</strong>${detail ? `<span>${inline(detail)}</span>` : ''}</li>`;
          })}</ol>`;
          break;
        }
        case 'table': {
          const top = kicker() + h2();
          const table = take('table') || {head: [], rows: []};
          const numeric = table.head.map((_, column) => table.rows.length > 0 && table.rows.every(row =>
            /^(\*\*)?[\d.,\s]+\s*(%|ms|s|µs|ns|kb|mb|gb|k|m|x|×)?(\*\*)?$/i.test(row[column] || '')));
          const cell = (tag, text, column) => `<${tag}${tag === 'th' ? ' scope="col"' : ''}${numeric[column] ? ' class="num"' : ''}>${inline(text || '')}</${tag}>`;
          body = `${top}<table><thead><tr>${table.head.map((text, i) => cell('th', text, i)).join('')}</tr></thead><tbody>${table.rows.map(row => {
            const best = /^\*\*.+\*\*$/.test(row[0] || '');
            return `<tr${best ? ' class="is-best"' : ''}>${row.map((text, i) => cell('td', best ? text.replace(/^\*\*(.+)\*\*$/, '$1') : text, i)).join('')}</tr>`;
          }).join('')}</tbody></table>${paragraphs().map(text => `<p class="slide-note">${inline(text)}</p>`).join('')}`;
          break;
        }
        case 'stats': {
          const top = kicker() + h2();
          const lead = take('paragraph');
          body = `${top}${lead ? `<p class="slide-lead">${inline(lead.text)}</p>` : ''}<div class="slide-figures">${items(list(), item => {
            const match = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
            return match ? `<div><strong>${inline(match[1])}</strong><span>${inline(match[2])}</span></div>` : `<div><strong>${inline(item)}</strong></div>`;
          })}</div>`;
          break;
        }
        case 'image': {
          const top = h2();
          const image = take('image');
          const url = image && safeUrl(image.src, true);
          const caption = take('paragraph');
          body = `${top}<figure>${url ? `<img src="${esc(url)}" alt="${esc(image.alt)}">` : `<div class="slide-placeholder">${esc(image ? 'Image URL not allowed' : 'Add an image: ![alt](url)')}</div>`}` +
            `${caption ? `<figcaption>${inline(caption.text)}</figcaption>` : ''}</figure>`;
          break;
        }
        case 'quote': {
          const quote = take('quote');
          const text = quote ? [...quote.lines] : [];
          const cite = text.length > 1 && /^\s*(—|--)/.test(text[text.length - 1]) ? text.pop().replace(/^\s*(—|--)\s*/, '') : null;
          body = `<blockquote>${inline(text.join(' ').trim())}</blockquote>${cite ? `<cite>— ${inline(cite)}</cite>` : ''}`;
          break;
        }
        case 'demo': {
          body = `${kicker()}${h2('Live demo')}<ul class="slide-list">${items(list())}</ul>`;
          break;
        }
        case 'pause': {
          const title = heading(2) ?? 'Short break';
          const lead = take('paragraph');
          body = `<p class="slide-mark" aria-hidden="true">✳</p><h2>${inline(title)}</h2>${lead ? `<p class="slide-lead">${inline(lead.text)}</p>` : ''}`;
          break;
        }
        case 'blank':
          body = '';
          break;
        case 'closing': {
          const top = kicker();
          const title = heading(2) ?? 'Questions?';
          // `:: closing mario` sends Regular Mario's castaway running onto the first link (slides.js plays it)
          let runner = Boolean(args.mario);
          body = `${top}<h2>${dotted(title)}</h2>${paragraphs().map(text => {
            if (!runner || !/\[[^\]]+\]\(/.test(text)) return `<p class="slide-links">${inline(text)}</p>`;
            runner = false;
            return `<p class="slide-links slide-runner" data-runner><img class="runner-sprite" alt="" aria-hidden="true">${inline(text)}</p>`;
          }).join('')}`;
          break;
        }
        default: {
          // content: blocks in order; paragraphs before the first list lead, after it they are notes
          let seenList = false;
          body = content.map(block => {
            if (block.type === 'heading') return block.level === 3 ? kicker(block.text) : `<h2>${inline(block.text)}</h2>`;
            if (block.type === 'list') { seenList = true; return `<${block.ordered ? 'ol' : 'ul'} class="slide-list">${items(block)}</${block.ordered ? 'ol' : 'ul'}>`; }
            if (block.type === 'paragraph') return `<p class="${seenList ? 'slide-note' : 'slide-lead'}">${inline(block.text)}</p>`;
            if (block.type === 'code') return codeBlock(block);
            if (block.type === 'quote') return `<p class="slide-lead">${inline(block.lines.join(' '))}</p>`;
            return '';
          }).join('');
        }
      }
      // Every slide inside a part lists all parts at the very top, the current one (and its service) highlighted.
      if (template === 'pause' && part) subpart = args.label ?? '';
      if (part && !PART_LESS.includes(template)) {
        const service = template === 'pause' ? '' : subpart;
        // The list needs every part's title, so it is filled in once all slides are rendered.
        body = `\u0000parts:${sections - 1}:${service}\u0000` + body;
      }
      const footerText = args.footer ?? meta.footer ?? meta.title;
      const footer = NO_FOOTER.includes(template) || !footerText ? '' : `<footer class="slide-footer"><span>${inline(footerText)}</span></footer>`;
      body = body.includes('\u0000footer\u0000') ? body.replace('\u0000footer\u0000', footer) : body + footer;
      return {template, line: slide.start, html: `<div class="slide-frame"><section class="slide slide-${template}${args.dense ? ' slide-dense' : ''}" data-template="${template}">${body}</section></div>`};
    });
    const partList = (current, service) => `<ol class="slide-part" aria-label="Parts">${parts.map((title, i) => i === current
      ? `<li aria-current="step">${inline(title)}${service ? ` · ${inline(service)}` : ''}</li>`
      : `<li>${inline(title)}</li>`).join('')}</ol>`;
    for (const slide of rendered) slide.html = slide.html.replace(/\u0000parts:(\d+):([^\u0000]*)\u0000/, (_, current, service) => partList(Number(current), service));
    return {title: meta.title || firstTitle, slides: rendered, html: rendered.map(slide => slide.html).join('\n')};
  }

  // Index of the slide that contains a character offset, for editor cursor sync.
  function slideAt(markdown, offset) {
    const line = markdown.slice(0, offset).split('\n').length - 1;
    const {slides} = split(markdown);
    let index = 0;
    slides.forEach((slide, i) => { if (slide.start <= line) index = i; });
    return index;
  }

  // Compressed, URL-safe form of a deck for share links (#md=…); nothing leaves the browser.
  async function pack(markdown) {
    const stream = new Blob([markdown]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  async function unpack(packed) {
    const binary = atob(packed.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
  }

  // The page heading a presented deck needs: its title, for screen readers only.
  const heading = title => `<h1 class="sr-only" id="deck-title">${esc(title)}</h1>`;

  globalThis.DeckMarkdown = {TEMPLATES, render, heading, slideAt, pack, unpack};

  // <body class="deck" data-markdown="slides.md"> loads and presents a Markdown deck.
  if (typeof document === 'undefined') return;
  const deck = document.querySelector('.deck[data-markdown]');
  if (!deck) return;
  fetch(deck.dataset.markdown)
    .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(markdown => {
      const result = render(markdown);
      deck.innerHTML = heading(result.title || document.title) + result.html;
      deck.setAttribute('aria-labelledby', 'deck-title');
      const editor = document.querySelector('#edit-deck');
      if (editor) {
        editor.href = new URL(`../editor/?src=${encodeURIComponent(new URL(deck.dataset.markdown, location.href).pathname)}`, location.href).href;
        editor.hidden = false;
      }
      const download = document.querySelector('#download-deck');
      if (download) {
        download.href = deck.dataset.markdown;
        download.download = `${location.pathname.split('/').filter(Boolean).pop() || 'slides'}.md`;
        download.hidden = false;
      }
      if (result.title) document.title = result.title;
      globalThis.Slides.start(deck);
    })
    .catch(error => { deck.textContent = `Could not load ${deck.dataset.markdown}: ${error.message}`; });
})();
