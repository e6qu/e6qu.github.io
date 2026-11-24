// Presents a .deck of .slide-frame elements: ←/→ or click to move, O for the overview,
// B to black out the screen, T to switch theme, P to print (save as PDF). The slide
// number is kept in the URL hash (#3, or slide=3 beside other hash fields).
// Accessibility: slides follow the WAI-ARIA carousel pattern (role description "slide",
// labelled "3 of 18") and changes are announced politely. The deck takes focus, and the
// single-key shortcuts only work while it has it (WCAG 2.1.4); keys never act on text
// fields or buttons. A slide whose content overflows scrolls with ↑/↓ before moving on.
// Text can be selected and copied: a click that ends a selection does not change slides.
// The overview (O or Esc) shows the theme toggle, Save as PDF and, for Markdown decks,
// Edit and Download .md. While presenting the page controls are hidden.
// On touch screens and narrow windows a large ✕ (top left) opens that overview, a swipe
// moves between slides, and the root's data-orientation (portrait or landscape) lets the
// styles adapt the layout when the device turns.
// A slide with data-transition="name" plays Slides.transitions[name] when it is reached going
// forward while presenting (see go()); every change of slide fires "slidechange" on the deck.
// Elements with data-illustration get the matching SVG inlined so its colors follow the
// theme. Mermaid figures ([data-mermaid], from ```mermaid blocks) are drawn with the vendored
// Mermaid in the deck's colors, and drawn again when the theme changes. Decks rendered later (Markdown, the editor) call Slides.start(deck),
// Slides.label(container) or Slides.illustrate(element) themselves.
// Edit mode exists only when scripts/edit-server.mjs serves the deck (see the end of this
// file): E or the pencil edits the current slide's Markdown in place and saves it to slides.md.
(() => {
  const root = document.documentElement;
  // this folder; a bundled deck (scripts/build-decks.mjs) has no current script, and is
  // served from the site root like assets/
  const assets = new URL('.', document.currentScript?.src ?? new URL('/assets/', location.href));
  const svgs = new Map();
  const typing = 'input, textarea, select, [contenteditable]';
  const interactive = `a, button, summary, ${typing}`;
  let deck = null;
  let frames = [];
  let current = 0;
  let status = null;
  let clickTimer;
  let hadSelection = false;
  const transitions = {};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = null;

  // Mermaid is large, so it loads only when a deck has a diagram.
  let mermaid = null;
  const drawn = new Set();
  function loadMermaid() {
    mermaid ||= new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('vendor/mermaid/mermaid.min.js', assets).href;
      script.onload = () => resolve(globalThis.mermaid);
      script.onerror = reject;
      document.head.append(script);
    });
    return mermaid;
  }
  let renders = 0;
  async function diagrams(container) {
    const figures = [...container.querySelectorAll('[data-mermaid]')];
    if (!figures.length) return;
    const engine = await loadMermaid().catch(() => null);
    if (!engine) return;
    const token = name => getComputedStyle(root).getPropertyValue(name).trim();
    engine.initialize({startOnLoad: false, securityLevel: 'strict', theme: 'base', fontFamily: token('--body'),
      themeVariables: {background: token('--paper'), mainBkg: token('--surface'), primaryColor: token('--surface'),
        primaryTextColor: token('--ink'), textColor: token('--ink'), primaryBorderColor: token('--blue'),
        nodeBorder: token('--blue'), lineColor: token('--muted'), secondaryColor: token('--paper'),
        tertiaryColor: token('--paper'), clusterBkg: token('--paper'), edgeLabelBackground: token('--paper'),
        labelBackgroundColor: token('--paper'), fontSize: '16px'}});
    for (const figure of figures) {
      figure.dataset.source ??= figure.querySelector('pre')?.textContent || '';
      try {
        const {svg} = await engine.render(`mermaid-${++renders}`, figure.dataset.source);
        figure.innerHTML = svg;
        drawn.add(figure);
      } catch {}
    }
  }
  const redraw = () => { for (const figure of drawn) if (!figure.isConnected) drawn.delete(figure); diagrams({querySelectorAll: () => [...drawn]}); };
  document.addEventListener('themechange', redraw);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);

  function illustrate(container) {
    diagrams(container);
    for (const art of container.querySelectorAll('[data-illustration]')) {
      const name = art.dataset.illustration;
      if (!svgs.has(name)) {
        svgs.set(name, fetch(new URL(`illustrations/${encodeURIComponent(name)}.svg`, assets))
          .then(response => response.ok ? response.text() : ''));
      }
      svgs.get(name).then(svg => { art.innerHTML = svg; });
    }
    // A closing runner shows the castaway standing until its slide is presented.
    if (globalThis.Runner) for (const stage of container.querySelectorAll('[data-runner]')) runnerFor(stage).still();
  }
  const runners = new WeakMap();
  function runnerFor(stage) {
    if (!runners.has(stage)) {
      const runner = globalThis.Runner.attach(stage, {stay: true});
      const link = stage.querySelector('a');
      // runs once when its slide is shown; hovering or focusing the link replays it
      for (const type of ['mouseenter', 'focus']) link.addEventListener(type, () => runner.play());
      runners.set(stage, runner);
    }
    return runners.get(stage);
  }
  function label(container) {
    const slides = [...container.querySelectorAll('.slide')];
    slides.forEach((slide, i) => {
      slide.style.counterSet = `slide ${i + 1}`;
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    });
  }
  function announce(message) {
    if (status) status.textContent = message;
  }
  function title(frame) {
    return frame?.querySelector('h2, blockquote')?.textContent.replace(/\s+/g, ' ').trim() || '';
  }

  function hashSlide() {
    const hash = location.hash.slice(1);
    return (/^\d+$/.test(hash) ? Number(hash) : Number(new URLSearchParams(hash).get('slide'))) - 1 || 0;
  }
  function show(index, quiet = false) {
    if (editBlocks(index)) return;
    current = Math.max(0, Math.min(frames.length - 1, index));
    frames.forEach((frame, i) => frame.toggleAttribute('data-current', i === current));
    const slide = frames[current]?.querySelector('.slide');
    if (slide) slide.scrollTop = 0;
    const hash = location.hash.slice(1);
    let next = String(current + 1);
    if (hash.includes('=')) {
      const params = new URLSearchParams(hash);
      params.set('slide', next);
      next = params.toString();
    }
    history.replaceState(null, '', `#${next}`);
    if (deck.dataset.mode === 'overview') frames[current]?.scrollIntoView({block: 'nearest'});
    const heading = title(frames[current]);
    if (!quiet) announce(`Slide ${current + 1} of ${frames.length}${heading ? `: ${heading}` : ''}`);
    playRunner();
    if (edit.active && edit.index !== current) editSlide(current);
    deck.dispatchEvent(new CustomEvent('slidechange', {detail: {index: current}}));
  }
  // Moves to a slide, playing its transition when it is the next one. A transition is
  // async ({from, to, swap, signal}) => …: it calls swap() once the old slide is covered (or
  // at once, to reveal the new one over it) and stops when `signal` aborts. Any navigation
  // while one plays only finishes it, landing on its slide, so a double press never skips
  // a slide. Nothing plays under prefers-reduced-motion, the pause button (motion.js), in
  // the overview or in a background tab.
  function go(index) {
    if (playing) {
      const running = playing;
      playing = null;
      running.controller.abort();
      running.swap();
      return;
    }
    const target = Math.max(0, Math.min(frames.length - 1, index));
    const play = transitions[frames[target]?.dataset.transition];
    if (target !== current + 1 || !play || deck.dataset.mode !== 'present' || edit.active || reducedMotion.matches
      || root.dataset.motion === 'paused' || document.hidden) return show(target);
    const controller = new AbortController();
    let swapped = false;
    const swap = () => { if (!swapped) { swapped = true; show(target); } };
    const running = {controller, swap};
    playing = running;
    Promise.resolve()
      .then(() => play({from: frames[current], to: frames[target], swap, signal: controller.signal}))
      .catch(() => {})
      .finally(() => { swap(); if (playing === running) playing = null; });
  }
  function playRunner() {
    const stage = deck.dataset.mode === 'present' && frames[current]?.querySelector('[data-runner]');
    if (stage && globalThis.Runner) runnerFor(stage).play();
  }
  function mode(next) {
    if (next === 'overview' && edit.active && !closeEdit()) return;
    deck.dataset.mode = next;
    playRunner();
    frames[current]?.scrollIntoView({block: 'nearest'});
    announce(next === 'overview' ? 'Overview. Arrow keys choose a slide, Enter presents it.' : `Presenting slide ${current + 1} of ${frames.length}`);
  }
  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    document.dispatchEvent(new Event('themechange'));
    announce(`${next[0].toUpperCase()}${next.slice(1)} theme`);
  }
  // ↑/↓, PageUp/PageDown and Space scroll a slide that overflows before changing slides.
  function scroll(direction) {
    const slide = frames[current]?.querySelector('.slide');
    if (!slide || deck.dataset.mode !== 'present') return false;
    const room = direction > 0 ? slide.scrollHeight - slide.clientHeight - slide.scrollTop : slide.scrollTop;
    if (room <= 1) return false;
    slide.scrollBy({top: direction * slide.clientHeight * .8});
    return true;
  }

  function bind() {
    document.addEventListener('keydown', event => {
      if (!deck || deck.hidden || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target.closest?.(typing)) return;
      const onControl = Boolean(target.closest?.(interactive));
      const inDeck = deck.contains(target) && !onControl;
      const key = event.key;
      if (['ArrowRight', 'PageDown', 'ArrowDown', ' '].includes(key)) {
        if (key === ' ' && onControl) return;
        if (key !== 'ArrowRight' && scroll(1)) { event.preventDefault(); return; }
        go(current + 1);
      } else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(key)) {
        if (key !== 'ArrowLeft' && scroll(-1)) { event.preventDefault(); return; }
        go(current - 1);
      } else if (key === 'Home') show(0);
      else if (key === 'End') show(frames.length - 1);
      else if (key === 'Escape') {
        if (edit.active) closeEdit();
        else mode(deck.dataset.mode === 'overview' ? 'present' : 'overview');
      }
      else if (key === 'Enter' && !onControl && deck.dataset.mode === 'overview') mode('present');
      else if (!inDeck) return;
      else if (key === 'o') mode(deck.dataset.mode === 'overview' ? 'present' : 'overview');
      else if (key === 'b' || key === '.') {
        announce(deck.toggleAttribute('data-blackout') ? 'Screen blacked out. Press B to return.' : 'Screen restored');
      } else if (key === 't') toggleTheme();
      else if (key === 'p') print();
      else if (key === 'e' && edit.available) { if (edit.active) closeEdit(); else openEdit(); }
      else return;
      event.preventDefault();
    });
    addEventListener('hashchange', () => deck && show(hashSlide()));
    // Save as PDF in the overview prints every slide, one per page (the print styles in slides.css)
    document.querySelector('#print-deck')?.addEventListener('click', () => print());
    status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    // fixed, so the live region never adds scroll height below a full-screen slide
    status.style.position = 'fixed';
    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'deck-menu';
    menu.setAttribute('aria-label', 'Close slide, show the overview (Esc)');
    menu.innerHTML = '<span aria-hidden="true">✕</span>';
    menu.addEventListener('click', () => { if (deck) mode('overview'); });
    document.body.append(status, menu);
    const portrait = matchMedia('(orientation: portrait)');
    const orient = () => { root.dataset.orientation = portrait.matches ? 'portrait' : 'landscape'; };
    orient();
    portrait.addEventListener('change', orient);
  }

  // A horizontal swipe on the presented slide moves to the next or previous one.
  function swipe(element) {
    let start = null;
    element.addEventListener('touchstart', event => {
      start = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
    }, {passive: true});
    element.addEventListener('touchend', event => {
      if (!start || element.dataset.mode !== 'present') return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      clearTimeout(clickTimer);
      go(current + (dx < 0 ? 1 : -1));
    }, {passive: true});
  }

  function start(element) {
    if (!deck) bind();
    if (deck !== element) {
      // a click that only clears an earlier selection keeps the slide too
      element.addEventListener('mousedown', () => { hadSelection = !getSelection().isCollapsed; });
      swipe(element);
      element.addEventListener('click', event => {
        if (event.target.closest('a, button')) return;
        const frame = event.target.closest('.slide-frame');
        if (element.dataset.mode === 'overview') {
          if (frame) { show(frames.indexOf(frame)); mode('present'); }
          return;
        }
        if (edit.active) return;  // while editing, a click on the slide is for selecting text
        // Text stays selectable for Ctrl/Cmd+C: a click that ends a drag selection keeps the
        // slide, and a single click waits out a double click (which selects a word) first.
        clearTimeout(clickTimer);
        if (event.detail > 1 || hadSelection || !getSelection().isCollapsed) return;
        const step = event.clientX < innerWidth / 3 ? -1 : 1;
        clickTimer = setTimeout(() => { if (getSelection().isCollapsed) go(current + step); }, 250);
      });
    }
    deck = element;
    frames = [...deck.querySelectorAll('.slide-frame')];
    label(deck);
    illustrate(deck);
    deck.tabIndex = -1;
    deck.dataset.mode = 'present';
    show(hashSlide(), true);
    if (!document.activeElement || document.activeElement === document.body) deck.focus({preventScroll: true});
    if (element.hasAttribute('data-markdown') && !edit.probed) probeEdit(element);
  }

  // ---- Edit mode, only under scripts/edit-server.mjs ----
  // On 127.0.0.1 or localhost a Markdown deck asks GET /api/edit whether its server can
  // save it; elsewhere (GitHub Pages, python -m http.server) it never asks and nothing
  // changes. E or the pencil opens the current slide's Markdown beside the slide (below it
  // on phones) and the deck re-renders as you type; Ctrl/Cmd+S or Save writes it to
  // slides.md, which the server commits, and Esc or Cancel restores the slide. The server
  // refuses the save (409) if slides.md has changed since this page loaded it.
  const edit = {probed: false, available: false, active: false, saving: false, path: '', markdown: '', hash: '',
    index: 0, original: '', shown: [], panel: null, source: null, status: null, heading: null, toggle: null, timer: 0};
  const dirty = () => edit.active && edit.source.value !== edit.original;
  function editBlocks(index) {
    if (!dirty() || Math.max(0, Math.min(frames.length - 1, index)) === current) return false;
    say('Save (Ctrl+S) or cancel (Esc) before changing slides', 'error');
    return true;
  }
  function say(text, tone = '') {
    edit.status.textContent = text;
    edit.status.dataset.tone = tone;
  }
  async function sha256(text) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function probeEdit(element) {
    edit.probed = true;
    const markdown = globalThis.DeckMarkdown?.source;
    if (!['127.0.0.1', 'localhost'].includes(location.hostname) || typeof markdown !== 'string' || !globalThis.crypto?.subtle) return;
    const path = decodeURIComponent(new URL(element.dataset.markdown, location.href).pathname.slice(1));
    let info = null;
    try {
      const response = await fetch(`/api/edit?deck=${encodeURIComponent(path)}`, {cache: 'no-store'});
      if (response.ok && response.headers.get('content-type')?.includes('json')) info = await response.json();
    } catch {}
    if (!info?.editable || deck !== element) return;
    Object.assign(edit, {available: true, path, markdown, hash: await sha256(markdown),
      shown: globalThis.DeckMarkdown.render(markdown).slides.map(slide => slide.html)});
    buildEditor(info.hash !== edit.hash);
  }
  function buildEditor(stale) {
    edit.toggle = document.createElement('button');
    edit.toggle.type = 'button';
    edit.toggle.className = 'icon-button deck-edit-toggle';
    edit.toggle.setAttribute('aria-label', 'Edit this slide (E)');
    edit.toggle.title = 'Edit this slide (E)';
    edit.toggle.innerHTML = '<span aria-hidden="true">✎</span>';
    edit.toggle.addEventListener('click', openEdit);
    edit.panel = document.createElement('aside');
    edit.panel.className = 'deck-edit';
    edit.panel.hidden = true;
    edit.panel.setAttribute('aria-labelledby', 'deck-edit-heading');
    edit.panel.innerHTML = '<div class="deck-edit-bar"><h2 class="deck-edit-heading" id="deck-edit-heading"></h2>' +
      '<button class="button" type="button" data-action="cancel">Cancel</button>' +
      '<button class="button primary" type="button" data-action="save">Save</button></div>' +
      '<textarea class="deck-edit-source" spellcheck="false" autocapitalize="off" autocomplete="off" aria-labelledby="deck-edit-heading" aria-describedby="deck-edit-status"></textarea>' +
      '<p class="deck-edit-status" id="deck-edit-status" role="status"></p>';
    edit.source = edit.panel.querySelector('textarea');
    edit.status = edit.panel.querySelector('.deck-edit-status');
    edit.heading = edit.panel.querySelector('h2');
    edit.panel.querySelector('[data-action="save"]').addEventListener('click', save);
    edit.panel.querySelector('[data-action="cancel"]').addEventListener('click', () => closeEdit());
    edit.source.addEventListener('input', () => {
      clearTimeout(edit.timer);
      edit.timer = setTimeout(livePreview, 120);
    });
    edit.panel.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeEdit(); }
    });
    document.addEventListener('keydown', event => {
      if (edit.active && (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        save();
      }
    });
    addEventListener('beforeunload', event => { if (dirty()) event.preventDefault(); });
    document.body.append(edit.toggle, edit.panel);
    edit.stale = stale;
  }
  function editSlide(index) {
    edit.index = index;
    edit.original = globalThis.DeckMarkdown.sources(edit.markdown)[index]?.text ?? '';
    edit.source.value = edit.original;
    const file = document.createElement('span');
    file.className = 'deck-edit-file';
    file.textContent = ` · ${edit.path.split('/').slice(-2).join('/')}`;
    edit.heading.replaceChildren(`Slide ${index + 1} of ${frames.length}`, file);
    if (edit.stale) say(`${edit.path} has changed on disk since this page loaded. Reload before editing, or saving will be refused.`, 'error');
    else say('Ctrl+S (⌘S) saves and commits · Esc cancels');
  }
  function openEdit() {
    if (!edit.available || edit.active) return;
    if (deck.dataset.mode !== 'present') mode('present');
    deck.removeAttribute('data-blackout');
    edit.active = true;
    root.dataset.editing = '';
    edit.panel.hidden = false;
    editSlide(current);
    edit.source.focus();
    announce(`Editing slide ${current + 1}`);
  }
  // Closes the editor and puts the deck back as it was saved; asks first if there are changes.
  function closeEdit() {
    if (!edit.active) return true;
    if (dirty() && !confirm('Discard your changes to this slide?')) return false;
    clearTimeout(edit.timer);
    edit.active = false;
    delete root.dataset.editing;
    edit.panel.hidden = true;
    rerender(edit.markdown);
    deck.focus({preventScroll: true});
    announce(`Presenting slide ${current + 1} of ${frames.length}`);
    return true;
  }
  // Renders the whole deck (a section title shows on every slide of its part) and replaces
  // only the frames whose HTML changed, in place, so the deck keeps its elements.
  function rerender(markdown) {
    const slides = globalThis.DeckMarkdown.render(markdown).slides;
    if (slides.length !== frames.length) return false;
    const changed = [];
    slides.forEach((slide, i) => {
      if (slide.html === edit.shown[i]) return;
      const fresh = document.createElement('template');
      fresh.innerHTML = slide.html;
      const frame = frames[i];
      const next = fresh.content.firstElementChild;
      for (const name of new Set(['class', 'data-transition', 'data-world', 'data-day', 'data-lives', ...next.getAttributeNames()])) {
        if (next.hasAttribute(name)) frame.setAttribute(name, next.getAttribute(name));
        else frame.removeAttribute(name);
      }
      frame.replaceChildren(...next.childNodes);
      edit.shown[i] = slide.html;
      changed.push(frame);
    });
    if (changed.length) {
      label(deck);
      for (const frame of changed) illustrate(frame);
      // a deck's own script (a HUD, say) can redo what it added to these slides
      deck.dispatchEvent(new CustomEvent('slidesupdate', {detail: {frames: changed}}));
    }
    return true;
  }
  function livePreview() {
    if (!edit.active) return;
    let next;
    try {
      next = globalThis.DeckMarkdown.replaceSlide(edit.markdown, edit.index, edit.source.value);
    } catch (error) {
      say(error.message, 'error');
      return;
    }
    if (!rerender(next)) say('A line of --- or an unclosed ``` fence would change the other slides; Save will refuse it', 'error');
    else if (!edit.stale) say(dirty() ? 'Unsaved · Ctrl+S (⌘S) saves and commits · Esc cancels' : 'Ctrl+S (⌘S) saves and commits · Esc cancels');
  }
  async function save() {
    if (!edit.active || edit.saving) return;
    edit.saving = true;
    const source = edit.source.value;
    say('Saving…');
    try {
      const response = await fetch('/api/slide', {method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({deck: edit.path, index: edit.index, source, hash: edit.hash})});
      const result = await response.json().catch(() => ({error: `HTTP ${response.status}`}));
      if (!response.ok || !result.ok) {
        say(`Not saved: ${result.error || `HTTP ${response.status}`}`, 'error');
        return;
      }
      Object.assign(edit, {markdown: result.markdown, hash: result.hash, stale: false});
      edit.original = source;
      rerender(edit.markdown);
      const message = result.commit ? `Saved · commit ${result.commit}` : 'No changes to save';
      say(message, 'ok');
      announce(message);
    } catch (error) {
      say(`Not saved: could not reach the edit server (${error.message})`, 'error');
    } finally {
      edit.saving = false;
    }
  }

  globalThis.Slides = {start, label, illustrate, transitions};
  const page = document.querySelector('.deck');
  if (page && !page.hasAttribute('data-markdown') && !page.hasAttribute('data-manual')) start(page);
})();
