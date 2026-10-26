// Sun/moon button (#theme-toggle): follows the system until clicked, then the choice
// persists. Fires "themechange" so canvases redraw; other code that switches the theme
// (the deck T key) fires it too, and the button follows.
(() => {
  const root = document.documentElement;
  const button = document.querySelector('#theme-toggle');
  const meta = document.querySelector('meta[name="theme-color"]');
  const preference = matchMedia('(prefers-color-scheme: dark)');
  function render() {
    const dark = root.dataset.theme === 'dark';
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--paper').trim();
    if (!button) return;
    button.firstElementChild.textContent = dark ? '☀︎' : '☾';
    // A toggle keeps one name; its state is aria-pressed. The tooltip says what a click does.
    button.setAttribute('aria-label', 'Dark mode');
    button.setAttribute('aria-pressed', String(dark));
    button.title = `Switch to ${dark ? 'light' : 'dark'} mode`;
  }
  function apply(theme) {
    root.dataset.theme = theme;
    render();
    document.dispatchEvent(new Event('themechange'));
  }
  document.addEventListener('themechange', render);
  apply(root.dataset.theme);
  if (!button) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch {}
    apply(next);
  });
  preference.addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('theme'); } catch {}
    if (saved !== 'light' && saved !== 'dark') apply(event.matches ? 'dark' : 'light');
  });
})();
