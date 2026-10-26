// Presents a Markdown deck from ?src=<path>, a #md=… share link, or pasted text.
// Pasted decks are written into the link (#md=…), so reloading or sharing keeps them.
(() => {
  const {render, pack, unpack} = globalThis.DeckMarkdown;
  const paste = document.querySelector('#paste');
  const deck = document.querySelector('#deck');
  const source = document.querySelector('#source');
  const status = document.querySelector('#status');
  const file = document.querySelector('#file');

  function present(markdown) {
    const result = render(markdown);
    if (!result.slides.length) {
      status.textContent = 'There are no slides yet. Write some Markdown first.';
      return;
    }
    deck.innerHTML = result.html;
    if (result.title) document.title = result.title;
    paste.hidden = true;
    deck.hidden = false;
    globalThis.Slides.start(deck);
  }
  function ask(message) {
    paste.hidden = false;
    if (message) status.textContent = message;
    source.focus();
  }
  const read = blob => blob.text().then(text => { source.value = text; });

  document.querySelector('#present').addEventListener('click', async () => {
    history.replaceState(null, '', `#md=${await pack(source.value)}`);
    present(source.value);
  });
  document.querySelector('#open-file').addEventListener('click', () => file.click());
  file.addEventListener('change', () => {
    if (file.files[0]) read(file.files[0]);
    file.value = '';
  });
  document.querySelector('#edit').addEventListener('click', async () => {
    location.href = `../editor/#md=${await pack(source.value)}`;
  });
  source.addEventListener('dragover', event => { event.preventDefault(); source.classList.add('tool-drop'); });
  source.addEventListener('dragleave', () => source.classList.remove('tool-drop'));
  source.addEventListener('drop', event => {
    event.preventDefault();
    source.classList.remove('tool-drop');
    if (event.dataTransfer.files[0]) read(event.dataTransfer.files[0]);
  });

  const src = new URLSearchParams(location.search).get('src');
  const shared = new URLSearchParams(location.hash.slice(1)).get('md');
  if (shared) {
    unpack(shared).then(present, () => ask('That link does not contain a readable deck.'));
  } else if (src) {
    fetch(src)
      .then(response => response.ok ? response.text() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then(present, error => ask(`Could not load ${src}: ${error.message}`));
  } else {
    ask();
  }
})();
