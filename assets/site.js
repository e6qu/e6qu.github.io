(() => {
  const list = document.querySelector('#project-list');
  const rows = [...list.children];
  const search = document.querySelector('#search');
  const sort = document.querySelector('#sort');
  const count = document.querySelector('#project-count');
  const empty = document.querySelector('#empty');
  const status = document.querySelector('#filter-status');
  document.querySelector('#tools').hidden = false;
  function update() {
    const query = search.value.toLowerCase().trim();
    let shown = 0;
    for (const row of rows) {
      row.hidden = !row.dataset.search.includes(query);
      if (!row.hidden) shown++;
    }
    const ordered = [...rows].sort((a, b) => {
      if (sort.value === 'name') return a.dataset.name.localeCompare(b.dataset.name);
      if (sort.value === 'date') return b.dataset.date.localeCompare(a.dataset.date) || a.dataset.name.localeCompare(b.dataset.name);
      return Number(b.dataset[sort.value]) - Number(a.dataset[sort.value]) || a.dataset.name.localeCompare(b.dataset.name);
    });
    list.append(...ordered);
    count.textContent = query ? `${shown} / ${rows.length} projects` : `${rows.length} projects`;
    empty.hidden = shown > 0;
    status.textContent = `${shown} ${shown === 1 ? 'project' : 'projects'} shown`;
  }
  search.addEventListener('input', update);
  sort.addEventListener('change', update);
  document.querySelector('#clear-search').addEventListener('click', () => {
    search.value = '';
    update();
    search.focus();
  });
})();

(() => {
  const root = document.documentElement;
  const button = document.querySelector('#theme-toggle');
  const preference = matchMedia('(prefers-color-scheme: dark)');
  function apply(theme) {
    root.dataset.theme = theme;
    button.firstElementChild.textContent = theme === 'dark' ? '☀\uFE0E' : '☾';
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111e2e' : '#f5f7fc';
    document.dispatchEvent(new Event('themechange'));
  }
  apply(root.dataset.theme);
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

(() => {
  const tabs = [...document.querySelectorAll('.showcase-tab')];
  const panels = [...document.querySelectorAll('.featured-panel')];
  const nav = document.querySelector('#showcase-tabs');
  if (!tabs.length) return;
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
})();
