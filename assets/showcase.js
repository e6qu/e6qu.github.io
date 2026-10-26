// Showcase tabs (WAI-ARIA tabs pattern): one featured panel at a time, chosen with the
// tabs below it; arrow keys, Home and End move between tabs. Without JavaScript every
// panel stays visible. Runs on each .showcase; Storybook calls Showcase.init itself.
(() => {
  function init(showcase) {
    const tabs = [...showcase.querySelectorAll('.showcase-tab')];
    const panels = [...showcase.querySelectorAll('.featured-panel')];
    const nav = showcase.querySelector('.showcase-tabs');
    if (!tabs.length || showcase.dataset.ready) return;
    showcase.dataset.ready = '';
    nav.hidden = false;
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Featured projects');
    function select(index, focus = false) {
      tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].toggleAttribute('data-active', active);
        panels[i].hidden = !active;
      });
      if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panels[index].id);
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    select(0);
  }
  globalThis.Showcase = {init};
  if (typeof document !== 'undefined') document.querySelectorAll('.showcase').forEach(init);
})();
