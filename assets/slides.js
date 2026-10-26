// Presents a .deck of .slide-frame elements: arrows/space/click to move, O for the
// overview, B to black out the screen, T to switch theme, P to print (save as PDF).
// The slide number is kept in the URL hash. Elements with data-illustration get the
// matching SVG inlined, so its colors follow the theme tokens.
(() => {
  const deck = document.querySelector('.deck');
  if (!deck) return;
  const root = document.documentElement;
  const frames = [...deck.querySelectorAll('.slide-frame')];
  const assets = new URL('.', document.currentScript.src);
  let current = 0;

  frames.forEach((frame, i) => {
    frame.querySelector('.slide').style.counterSet = `slide ${i + 1}`;
  });
  for (const art of deck.querySelectorAll('[data-illustration]')) {
    fetch(new URL(`illustrations/${art.dataset.illustration}.svg`, assets))
      .then(response => response.ok ? response.text() : '')
      .then(svg => { art.innerHTML = svg; });
  }

  function show(index) {
    current = Math.max(0, Math.min(frames.length - 1, index));
    frames.forEach((frame, i) => frame.toggleAttribute('data-current', i === current));
    history.replaceState(null, '', `#${current + 1}`);
    if (deck.dataset.mode === 'overview') frames[current].scrollIntoView({block: 'nearest'});
  }
  function mode(next) {
    deck.dataset.mode = next;
    frames[current].scrollIntoView({block: 'nearest'});
  }
  function toggleTheme() {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
  }

  document.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
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
  deck.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const frame = event.target.closest('.slide-frame');
    if (deck.dataset.mode === 'overview') {
      if (frame) { show(frames.indexOf(frame)); mode('present'); }
    } else {
      show(current + (event.clientX < innerWidth / 3 ? -1 : 1));
    }
  });
  addEventListener('hashchange', () => show(Number(location.hash.slice(1)) - 1 || 0));

  deck.dataset.mode = 'present';
  show(Number(location.hash.slice(1)) - 1 || 0);
})();
