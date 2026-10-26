// Markup comes from scripts/stories.py, which cuts it out of the page build.py renders.
import fixtures from './fixtures.json';
import '../assets/showcase.js';

const unhide = html => html.replace(/ hidden(?=[\s>])/g, '');
const featuredNames = Object.keys(fixtures.featured);
const projectNames = Object.keys(fixtures.projects);

export default {title: 'Components'};

export const Masthead = {render: () => fixtures.masthead};

export const PageControls = {
  name: 'Page controls',
  render: () => unhide(fixtures.pageControls).replace('class="page-controls"', 'class="page-controls" style="position:static"'),
};

export const Identity = {render: () => fixtures.identity};

export const FeaturedPanel = {
  name: 'Featured panel',
  argTypes: {project: {control: 'select', options: featuredNames}},
  args: {project: featuredNames[0]},
  render: ({project}) => `<div class="showcase-panels">${fixtures.featured[project]}</div>`,
};

// Runs the same tabs script as the site (assets/showcase.js).
export const Showcase = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'js';
    wrapper.innerHTML = `<section class="showcase"><div class="showcase-panels">${Object.values(fixtures.featured).join('')}</div>
      <div class="showcase-tabs" hidden>${fixtures.tabs.join('')}</div></section>`;
    globalThis.Showcase.init(wrapper.firstElementChild);
    return wrapper;
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
