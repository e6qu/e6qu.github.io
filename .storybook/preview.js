import '../assets/tokens.css';
import '../assets/base.css';
import '../assets/components.css';
import '../assets/site.css';
import '../assets/slides.css';
import './preview.css';

const THEMES = ['light', 'dark'];

// Each story renders inside a [data-theme] scope, so "Side by side" shows the same
// markup in both themes at once. Renders may return HTML strings or DOM nodes.
function scope(theme, content) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ds-theme';
  wrapper.dataset.theme = theme;
  if (typeof content === 'string') wrapper.innerHTML = content;
  else wrapper.append(content);
  return wrapper;
}

export default {
  parameters: {
    layout: 'fullscreen',
    // The Accessibility panel runs axe on every story; scripts/a11y.mjs fails CI on any violation.
    a11y: {test: 'error', options: {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']}}},
    options: {storySort: {order: ['Foundations', 'Components', 'Presentation']}},
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          {value: 'light', title: 'Light', icon: 'sun'},
          {value: 'dark', title: 'Dark', icon: 'moon'},
          {value: 'both', title: 'Side by side', icon: 'sidebyside'},
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'},
  decorators: [
    (storyFn, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
      if (THEMES.includes(theme)) return scope(theme, storyFn());
      const grid = document.createElement('div');
      grid.className = 'ds-side-by-side';
      grid.append(...THEMES.map(t => scope(t, storyFn())));
      return grid;
    },
  ],
};
