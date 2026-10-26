// Slides come straight from the decks in presentations/, so stories can't drift from them:
// the HTML template, and the Markdown decks rendered by assets/deck-markdown.js.
import '../assets/deck-markdown.js';
import template from '../presentations/template/index.html?raw';
import templateMarkdown from '../presentations/template/slides.md?raw';
import sample from '../presentations/a-portfolio-that-measures-itself/slides.md?raw';

const illustrations = import.meta.glob('../assets/illustrations/*.svg', {query: '?raw', import: 'default', eager: true});
const parse = html => [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.slide-frame')];
const templateFrames = parse(template);
const markdown = text => parse(`<body>${globalThis.DeckMarkdown.render(text).html}</body>`);
const sampleFrames = markdown(sample);
const templateMarkdownFrames = markdown(templateMarkdown);

// Decks live two levels down; Storybook serves the same assets at assets/.
function prepare(frame, index) {
  const copy = frame.cloneNode(true);
  const slide = copy.querySelector('.slide');
  // the same numbering and labels assets/slides.js gives slides in a deck
  slide.style.counterSet = `slide ${index + 1}`;
  slide.setAttribute('aria-roledescription', 'slide');
  slide.setAttribute('aria-label', `${index + 1}`);
  for (const art of copy.querySelectorAll('[data-illustration]')) {
    art.innerHTML = illustrations[`../assets/illustrations/${art.dataset.illustration}.svg`];
  }
  for (const img of copy.querySelectorAll('img[src^="../../assets/"]')) {
    img.setAttribute('src', img.getAttribute('src').replace('../../', ''));
  }
  return copy;
}
const grid = frames => {
  const deck = document.createElement('div');
  deck.className = 'ds-deck';
  deck.append(...frames.map(prepare));
  return deck;
};
const story = (name, template) => ({name, render: () => {
  const index = templateFrames.findIndex(frame => frame.querySelector(`[data-template="${template}"]`));
  const holder = document.createElement('div');
  holder.className = 'ds-slide';
  holder.append(prepare(templateFrames[index], index));
  return holder;
}});

export default {title: 'Presentation'};

export const AllTemplates = {name: 'All templates', render: () => grid(templateFrames)};
export const SampleTalk = {name: 'Sample talk', render: () => grid(sampleFrames)};
export const MarkdownTemplate = {name: 'Markdown template', render: () => grid(templateMarkdownFrames)};
export const Title = story('Title', 'title');
export const Agenda = story('Agenda', 'agenda');
export const Section = story('Section', 'section');
export const Content = story('Content', 'content');
export const Comparison = story('Comparison', 'comparison');
export const Feature = story('Feature', 'feature');
export const Code = story('Code', 'code');
export const CodeWithNotes = story('Code with notes', 'code-split');
export const Terminal = story('Terminal', 'terminal');
export const Diagram = story('Diagram', 'diagram');
export const Table = story('Table', 'table');
export const Stats = story('Stats', 'stats');
export const Image = story('Image', 'image');
export const Quote = story('Quote', 'quote');
export const LiveDemo = story('Live demo', 'demo');
export const Pause = story('Pause', 'pause');
export const Blank = story('Blank', 'blank');
export const Closing = story('Closing', 'closing');
