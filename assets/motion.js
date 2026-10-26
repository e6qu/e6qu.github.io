// Pause button (#motion-toggle) for moving decoration that starts on its own (WCAG 2.2.2):
// it stops the game invite runner and the idle insects, and the choice is remembered.
// Pressed means paused; CSS swaps the pause and play icons. Fires "motionchange".
(() => {
  const root = document.documentElement;
  const button = document.querySelector('#motion-toggle');
  if (!button) return;
  function render() {
    const paused = root.dataset.motion === 'paused';
    button.setAttribute('aria-pressed', String(paused));
    button.title = paused ? 'Play animations' : 'Pause animations';
  }
  button.hidden = false;
  render();
  button.addEventListener('click', () => {
    const paused = root.dataset.motion !== 'paused';
    if (paused) root.dataset.motion = 'paused';
    else delete root.dataset.motion;
    try { if (paused) localStorage.setItem('motion', 'paused'); else localStorage.removeItem('motion'); } catch {}
    render();
    document.dispatchEvent(new Event('motionchange'));
  });
})();
