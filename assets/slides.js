// Presents a .deck of .slide-frame elements: arrows/space/click to move, O for the
// overview, B to black out the screen, T to switch theme, P to print (save as PDF).
// The slide number is kept in the URL hash (#3, or slide=3 beside other hash fields).
// Elements with data-illustration get the matching SVG inlined, so its colors follow
// the theme tokens. Decks that are rendered later (Markdown, the editor) call
// Slides.start(deck) or Slides.illustrate(element) themselves.
(() => {
  const root = document.documentElement;
  const assets = new URL('.', document.currentScript.src);
  const svgs = new Map();
  let deck = null;
  let frames = [];
  let current = 0;

  function illustrate(container) {
    for (const art of container.querySelectorAll('[data-illustration]')) {
      const name = art.dataset.illustration;
      if (!svgs.has(name)) {
        svgs.set(name, fetch(new URL(`illustrations/${encodeURIComponent(name)}.svg`, assets))
          .then(response => response.ok ? response.text() : ''));
      }
      svgs.get(name).then(svg => { art.innerHTML = svg; });
    }
  }

  function hashSlide() {
    const hash = location.hash.slice(1);
    return (/^\d+$/.test(hash) ? Number(hash) : Number(new URLSearchParams(hash).get('slide'))) - 1 || 0;
  }
  function show(index) {
    current = Math.max(0, Math.min(frames.length - 1, index));
    frames.forEach((frame, i) => frame.toggleAttribute('data-current', i === current));
    const hash = location.hash.slice(1);
    let next = String(current + 1);
    if (hash.includes('=')) {
      const params = new URLSearchParams(hash);
      params.set('slide', next);
      next = params.toString();
    }
    history.replaceState(null, '', `#${next}`);
    if (deck.dataset.mode === 'overview') frames[current]?.scrollIntoView({block: 'nearest'});
  }
  function mode(next) {
    deck.dataset.mode = next;
    frames[current]?.scrollIntoView({block: 'nearest'});
  }
  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    document.dispatchEvent(new Event('themechange'));
  }

  function bind() {
    document.addEventListener('keydown', event => {
      if (!deck || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const key = event.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(key)) show(current + 1);
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) show(current - 1);
      else if (key === 'Home') show(0);
      else if (key === 'End') show(frames.length - 1);
      else if (key === 'o' || key === 'Escape') mode(deck.dataset.mode === 'overview' ? 'present' : 'overview');
      else if (key === 'Enter' && deck.dataset.mode === 'overview') mode('present');
      else if (key === 'b' || key === '.') deck.toggleAttribute('data-blackout');
      else if (key === 't') toggleTheme();
      else if (key === 'p') print();
      else return;
      event.preventDefault();
    });
    addEventListener('hashchange', () => deck && show(hashSlide()));
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
    frames.forEach((frame, i) => {
      frame.querySelector('.slide').style.counterSet = `slide ${i + 1}`;
    });
    illustrate(deck);
    deck.dataset.mode = 'present';
    show(hashSlide());
  }

  globalThis.Slides = {start, illustrate};
  const page = document.querySelector('.deck');
  if (page && !page.hasAttribute('data-markdown') && !page.hasAttribute('data-manual')) start(page);
})();
