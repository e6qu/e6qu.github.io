// Speaker-notes view: every slide of a Markdown deck, each followed by its "???" notes.
// <main class="notes-view" data-markdown="../slides.md"> loads the deck; on narrow screens
// the notes sit under each slide, on wide ones beside it. The previews are inert pictures of
// the slides (their links are tiny there); the deck itself presents them.
(() => {
  const view = document.querySelector('.notes-view[data-markdown]');
  if (!view) return;
  const esc = text => String(text).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]);
  fetch(view.dataset.markdown)
    .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then(markdown => {
      const result = DeckMarkdown.render(markdown);
      const title = result.title || document.title;
      document.title = `${title}: speaker notes`;
      view.innerHTML = `<h1 class="notes-heading">${esc(title)}<span>Speaker notes</span></h1>` +
        result.slides.map((slide, i) => `<article class="notes-slide" id="${i + 1}" aria-label="Slide ${i + 1}" style="counter-reset:slide ${i}">` +
          `<div class="notes-preview" inert>${slide.html}</div>` +
          `<div class="notes-text"><p class="notes-number"><a href="../#${i + 1}">Slide ${i + 1}</a></p>${slide.notes || ''}</div></article>`).join('');
      globalThis.Slides?.illustrate(view);
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
    })
    .catch(error => { view.textContent = `Could not load ${view.dataset.markdown}: ${error.message}`; });
})();
