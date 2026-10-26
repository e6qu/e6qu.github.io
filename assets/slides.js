// Presents a .deck of .slide-frame elements: ←/→ or click to move, O for the overview,
// B to black out the screen, T to switch theme, P to print (save as PDF). The slide
// number is kept in the URL hash (#3, or slide=3 beside other hash fields).
// Accessibility: slides follow the WAI-ARIA carousel pattern (role description "slide",
// labelled "3 of 18") and changes are announced politely. The deck takes focus, and the
// single-key shortcuts only work while it has it (WCAG 2.1.4); keys never act on text
// fields or buttons. A slide whose content overflows scrolls with ↑/↓ before moving on.
// The overview (O or Esc) shows Save as PDF and, for Markdown decks, Edit Markdown.
// Elements with data-illustration get the matching SVG inlined so its colors follow the
// theme. Decks rendered later (Markdown, the editor) call Slides.start(deck),
// Slides.label(container) or Slides.illustrate(element) themselves.
(() => {
  const root = document.documentElement;
  const assets = new URL('.', document.currentScript.src);
  const svgs = new Map();
  const typing = 'input, textarea, select, [contenteditable]';
  const interactive = `a, button, summary, ${typing}`;
  let deck = null;
  let frames = [];
  let current = 0;
  let status = null;

  function illustrate(container) {
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
  }
  function playRunner() {
    const stage = deck.dataset.mode === 'present' && frames[current]?.querySelector('[data-runner]');
    if (stage && globalThis.Runner) runnerFor(stage).play();
  }
  function mode(next) {
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
        show(current + 1);
      } else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(key)) {
        if (key !== 'ArrowLeft' && scroll(-1)) { event.preventDefault(); return; }
        show(current - 1);
      } else if (key === 'Home') show(0);
      else if (key === 'End') show(frames.length - 1);
      else if (key === 'Escape') mode(deck.dataset.mode === 'overview' ? 'present' : 'overview');
      else if (key === 'Enter' && !onControl && deck.dataset.mode === 'overview') mode('present');
      else if (!inDeck) return;
      else if (key === 'o') mode(deck.dataset.mode === 'overview' ? 'present' : 'overview');
      else if (key === 'b' || key === '.') {
        announce(deck.toggleAttribute('data-blackout') ? 'Screen blacked out. Press B to return.' : 'Screen restored');
      } else if (key === 't') toggleTheme();
      else if (key === 'p') print();
      else return;
      event.preventDefault();
    });
    addEventListener('hashchange', () => deck && show(hashSlide()));
    // Save as PDF in the overview prints every slide, one per page (the print styles in slides.css)
    document.querySelector('#print-deck')?.addEventListener('click', () => print());
    status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    document.body.append(status);
  }

  function start(element) {
    if (!deck) bind();
    if (deck !== element) {
      element.addEventListener('click', event => {
        if (event.target.closest('a, button')) return;
        const frame = event.target.closest('.slide-frame');
        if (element.dataset.mode === 'overview') {
          if (frame) { show(frames.indexOf(frame)); mode('present'); }
        } else {
          show(current + (event.clientX < innerWidth / 3 ? -1 : 1));
        }
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
  }

  globalThis.Slides = {start, label, illustrate};
  const page = document.querySelector('.deck');
  if (page && !page.hasAttribute('data-markdown') && !page.hasAttribute('data-manual')) start(page);
})();
