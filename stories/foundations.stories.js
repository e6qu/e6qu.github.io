import tokens from '../assets/tokens.css?raw';

const illustrations = import.meta.glob('../assets/illustrations/*.svg', {query: '?raw', import: 'default', eager: true});
const svg = name => illustrations[`../assets/illustrations/${name}.svg`];

// Values as written in tokens.css, so swatches can name both themes at once.
function block(selector) {
  const start = tokens.indexOf(`${selector} {`);
  const body = tokens.slice(start, tokens.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
const base = block(':root');
const light = block(":root,[data-theme='light']");
const dark = block("[data-theme='dark']");

const COLORS = [
  ['paper', 'Page background'], ['surface', 'Raised panels and controls'], ['ink', 'Primary text, strong rules'],
  ['muted', 'Secondary text and labels'], ['line', 'Borders and dividers'], ['blue', 'Links, languages, hover'],
  ['coral', 'Large accent marks, decoration, focus rings (3:1)'],
  ['coral-strong', 'Accent for small text and fills behind text (4.5:1)'],
  ['coral-on-ink', 'Accent on an ink background'], ['teal', 'Strings in code slides, secondary accent'],
  ['section-bg', 'Section sheet background, a tinted paper'], ['section-ink', 'Section sheet text'],
  ['section-accent', 'Section sheet number and mark'],
];
const ART = ['pipes', 'replay', 'database', 'branches', 'cloud', 'containers', 'board', 'chat', 'terminal'];
const TEXT = [
  ['h1', 'display', '800', 'Marza.'], ['h2', 'display', '800', 'Featured projects'],
  ['lg', 'body', '400', 'Project name'], ['lead', 'body', '400', 'Feature description text'],
  ['body', 'body', '400', 'Body copy at the base reading size'], ['base', 'body', '400', 'Project description'],
  ['md', 'mono', '400', 'showcase-tab'], ['sm', 'mono', '400', '12,345 SLOC'], ['xs', 'mono', '400', 'MIT · Rust'],
  ['2xs', 'mono', '400', 'FEATURE CATEGORY'], ['3xs', 'mono', '400', 'Mobile label'],
];

const heading = (title, text) => `<h2 class="ds-heading">${title}</h2><p>${text}</p>`;

export default {title: 'Foundations'};

export const Colors = {
  render: () => `${heading('Colors', 'Theme colors swap as a set. Use them by role, never by value.')}
    <div class="ds-grid">${COLORS.map(([name, role]) => `<div class="ds-swatch">
      <div class="ds-swatch-chip" style="background:var(--${name})"></div>
      <p>--${name}</p><p>${role}</p><p>light ${light[name]} · dark ${dark[name]}</p></div>`).join('')}</div>`,
};

export const IllustrationPalettes = {
  name: 'Illustration palettes',
  render: () => `${heading('Illustration palettes', 'Each illustration has its own paper color (darkened for the dark theme) and a fixed accent. Apply with .featured-&lt;name&gt; on the site or .art-&lt;name&gt; on slides.')}
    <div class="ds-grid">${ART.map(name => `<div class="ds-swatch">
      <div class="ds-swatch-chip" style="--art-paper:var(--art-${name});--art-accent:var(--art-${name}-accent);background:var(--art-paper);color:var(--art-ink)">${svg(name)}</div>
      <p>.art-${name}</p><p>light ${light[`art-${name}`]} · dark ${dark[`art-${name}`]}</p><p>accent ${base[`art-${name}-accent`]}</p></div>`).join('')}</div>`,
};

export const Typography = {
  render: () => `${heading('Typography', 'Archivo for display, IBM Plex Sans for reading, IBM Plex Mono for data and labels. All fonts are self-hosted.')}
    <div class="ds-rows">${TEXT.map(([size, family, weight, sample]) => `<div class="ds-row">
      <code>--text-${size}<br>${base[`text-${size}`]} · --${family}</code>
      <span style="font:${weight} var(--text-${size})/1.1 var(--${family});${family === 'display' ? `letter-spacing:var(--tracking-${size})` : ''};overflow-wrap:anywhere">${sample}</span></div>`).join('')}</div>`,
};

export const ShapeAndMotion = {
  name: 'Shape, layout and motion',
  render: () => `${heading('Shape, layout and motion', 'Everything else components share. Motion is disabled under prefers-reduced-motion.')}
    <div class="ds-rows">${Object.entries(base)
      .filter(([name]) => /^(radius|border|duration|page|masthead|theme|tracking)/.test(name))
      .map(([name, value]) => `<div class="ds-row"><code>--${name}</code><span style="font:var(--text-sm) var(--mono)">${value}</span></div>`).join('')}</div>`,
};
