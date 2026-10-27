// Dual-pane Markdown deck editor: Markdown on the left, live slides on the right.
// Every edit rewrites #md=… (the deck, compressed), so reloading, bookmarking or sharing
// the address brings back exactly this deck. Edits are also kept in this browser
// (localStorage, one draft per ?src= file), so a deck's Edit button brings them back
// later; Revert returns to the file. Opens #md=…, then the saved draft of ?src=, then
// ?src=, then the template. Nothing is uploaded.
(() => {
  const {render, slideAt, pack, unpack} = globalThis.DeckMarkdown;
  const TEMPLATE = '../template/slides.md';
  const SAMPLE = '../a-portfolio-that-measures-itself/slides.md';
  const source = document.querySelector('#source');
  const preview = document.querySelector('#preview');
  const status = document.querySelector('#status');
  const file = document.querySelector('#file');
  let slides = [];
  let currentSlide = -1;
  let timer;
  let writes = 0;
  const revert = document.querySelector('#revert');
  // The draft belongs to the deck file being edited, or to "untitled" without one.
  const src = new URLSearchParams(location.search).get('src');
  const draftKey = `deck-draft:${src ? new URL(src, location.href).pathname : 'untitled'}`;
  const readDraft = () => { try { return localStorage.getItem(draftKey); } catch { return null; } };

  const say = message => { status.textContent = message; };
  // Write the deck into the address; a newer write wins over a slower older one.
  async function save() {
    const write = ++writes;
    const packed = await pack(source.value);
    if (write === writes) history.replaceState(null, '', `${location.pathname}${location.search}#md=${packed}`);
    try { localStorage.setItem(draftKey, source.value); } catch {}
  }
  const fetchText = url => fetch(url).then(response => response.ok ? response.text() : Promise.reject(new Error(`${url}: HTTP ${response.status}`)));

  function update() {
    const result = render(source.value);
    slides = result.slides;
    preview.innerHTML = result.html;
    // Frames are size containers, which scope CSS counters, so Slides numbers and labels them.
    globalThis.Slides.label(preview);
    globalThis.Slides.illustrate(preview);
    currentSlide = -1;
    follow();
  }
  // Outline and scroll to the slide the cursor is in.
  function follow() {
    const index = slideAt(source.value, source.selectionStart);
    const frames = preview.querySelectorAll('.slide-frame');
    frames.forEach((frame, i) => frame.toggleAttribute('data-current', i === index));
    // Scroll the preview pane only; on narrow screens the page itself scrolls instead.
    const frame = frames[index];
    if (index !== currentSlide && frame && preview.scrollHeight > preview.clientHeight) {
      const top = frame.offsetTop - preview.offsetTop;
      if (top < preview.scrollTop || top + frame.offsetHeight > preview.scrollTop + preview.clientHeight) preview.scrollTop = top - 24;
    }
    currentSlide = index;
  }
  function load(markdown, message) {
    source.value = markdown;
    source.setSelectionRange(0, 0);
    source.scrollTop = 0;
    preview.scrollTop = 0;
    update();
    save();
    if (message) say(message);
  }
  async function shareUrl() {
    return new URL(`../viewer/#md=${await pack(source.value)}`, location.href).href;
  }
  async function present() {
    window.open(await shareUrl(), '_blank', 'noopener');
  }
  function filename() {
    const title = render(source.value).title || 'slides';
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'slides'}.md`;
  }

  source.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { update(); save(); }, 150);
  });
  for (const type of ['keyup', 'click', 'select']) source.addEventListener(type, follow);
  // Clicking a slide puts the cursor at its first line.
  preview.addEventListener('click', event => {
    const frame = event.target.closest('.slide-frame');
    if (!frame || event.target.closest('a')) return;
    const index = [...preview.querySelectorAll('.slide-frame')].indexOf(frame);
    const offset = source.value.split('\n').slice(0, slides[index].line).join('\n').length + (slides[index].line ? 1 : 0);
    source.focus();
    source.setSelectionRange(offset, offset);
    const lineHeight = parseFloat(getComputedStyle(source).lineHeight);
    source.scrollTop = Math.max(0, slides[index].line * lineHeight - source.clientHeight / 3);
    follow();
  });

  document.querySelector('#load-template').addEventListener('click', () =>
    confirm('Replace the editor contents with the template?') &&
    fetchText(TEMPLATE).then(text => load(text, 'Loaded the template. Comments in it explain each sheet.')).catch(error => say(error.message)));
  document.querySelector('#load-sample').addEventListener('click', () =>
    confirm('Replace the editor contents with the sample talk?') &&
    fetchText(SAMPLE).then(text => load(text, 'Loaded the sample talk.')).catch(error => say(error.message)));
  document.querySelector('#open-file').addEventListener('click', () => file.click());
  file.addEventListener('change', () => {
    if (file.files[0]) file.files[0].text().then(text => load(text, `Opened ${file.files[0].name}.`));
    file.value = '';
  });
  document.querySelector('#download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([source.value], {type: 'text/markdown'}));
    link.download = filename();
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  });
  document.querySelector('#copy-link').addEventListener('click', async () => {
    const url = await shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      say(`Link copied (${url.length.toLocaleString()} characters). It contains the whole deck.`);
    } catch {
      prompt('Copy this link:', url);
    }
  });
  document.querySelector('#present').addEventListener('click', present);
  // Prints the live preview, one slide per page (deck-tools.css has the print layout).
  document.querySelector('#print').addEventListener('click', () => print());

  // Revert drops the saved draft and reloads the deck's file.
  revert.hidden = !src;
  revert.addEventListener('click', () => {
    if (!confirm(`Discard your edits and reload ${src}?`)) return;
    try { localStorage.removeItem(draftKey); } catch {}
    fetchText(src).then(text => load(text, `Reverted to ${src}.`)).catch(error => say(error.message));
  });

  async function initial() {
    const shared = new URLSearchParams(location.hash.slice(1)).get('md');
    if (shared) return [await unpack(shared), 'Editing the deck in this address. Edits are also saved in this browser.'];
    const draft = readDraft();
    if (draft) return [draft, src ? `Restored your saved edits of ${src}. Revert reloads the original.` : 'Restored your saved deck.'];
    if (src) return [await fetchText(src), `Opened ${src}. Edits are saved in this browser and in the address.`];
    return [await fetchText(TEMPLATE), 'Started from the template. Edits are saved in this browser and in the address.'];
  }
  initial()
    .then(([markdown, message]) => load(markdown, message))
    .catch(error => { source.placeholder = '# My talk.'; say(`Could not open the deck: ${error.message}`); });
})();
