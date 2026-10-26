// Markup comes from scripts/stories.py, which cuts it out of the page build.py renders.
import fixtures from './fixtures.json';

const unhide = html => html.replace(/ hidden(?=[\s>])/g, '');
const featuredNames = Object.keys(fixtures.featured);
const projectNames = Object.keys(fixtures.projects);

export default {title: 'Components'};

export const Masthead = {render: () => fixtures.masthead};

export const ThemeToggle = {
  name: 'Theme toggle',
  render: () => `<div class="ds-static-toggle" style="display:flex;gap:24px">
    ${unhide(fixtures.themeToggle).replace('class="theme-toggle"', 'class="theme-toggle" style="position:static"')}
    ${unhide(fixtures.themeToggle).replace('class="theme-toggle"', 'class="theme-toggle" style="position:static"').replace('☾', '☀︎')}
  </div>`,
};

export const Identity = {render: () => fixtures.identity};

export const FeaturedPanel = {
  name: 'Featured panel',
  argTypes: {project: {control: 'select', options: featuredNames}},
  args: {project: featuredNames[0]},
  render: ({project}) => `<div class="showcase-panels">${fixtures.featured[project]}</div>`,
};

export const Showcase = {
  render: () => {
    const section = document.createElement('section');
    section.className = 'showcase js';
    section.innerHTML = `<div class="showcase-panels">${Object.values(fixtures.featured).join('')}</div>
      <div class="showcase-tabs" role="tablist">${fixtures.tabs.join('')}</div>`;
    const panels = [...section.querySelectorAll('.featured-panel')];
    const tabs = [...section.querySelectorAll('.showcase-tab')];
    const select = index => tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      panels[i].toggleAttribute('data-active', i === index);
    });
    tabs.forEach((tab, i) => tab.addEventListener('click', () => select(i)));
    select(0);
    return section;
  },
};

export const ProjectRow = {
  name: 'Project row',
  argTypes: {project: {control: 'select', options: projectNames}},
  args: {project: projectNames[0]},
  render: ({project}) => `<ul class="project-list">${fixtures.projects[project]}</ul>`,
};

export const ProjectIndex = {
  name: 'Project index',
  argTypes: {rows: {control: {type: 'range', min: 1, max: projectNames.length}}},
  args: {rows: 6},
  render: ({rows}) => `<section class="project-index">${fixtures.sectionHeading}${unhide(fixtures.tools)}
    ${fixtures.columnLabels}<ul class="project-list">${Object.values(fixtures.projects).slice(0, rows).join('')}</ul></section>`,
};

export const EmptySearch = {name: 'Empty search', render: () => unhide(fixtures.empty)};

export const Footer = {render: () => fixtures.footer};
