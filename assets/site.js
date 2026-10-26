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
