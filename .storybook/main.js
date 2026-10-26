/** @type {import('@storybook/html-vite').StorybookConfig} */
export default {
  framework: '@storybook/html-vite',
  addons: ['@storybook/addon-a11y'],
  stories: ['../stories/**/*.stories.js'],
  // Site markup references assets/… relative to the page (fonts, sprites).
  staticDirs: [{from: '../assets', to: '/assets'}],
  core: {disableTelemetry: true},
};
