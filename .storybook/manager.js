import {addons} from 'storybook/manager-api';
import {create} from 'storybook/theming';

// Storybook's own chrome follows the system theme; stories have their own toolbar switch.
const dark = matchMedia('(prefers-color-scheme: dark)').matches;
addons.setConfig({
  theme: create({
    base: dark ? 'dark' : 'light',
    brandTitle: 'e6qu design system',
    brandUrl: 'https://e6qu.github.io/',
    colorSecondary: dark ? '#f3917b' : '#dd654e',
    appBg: dark ? '#111e2e' : '#f5f7fc',
    appContentBg: dark ? '#1b2b3e' : '#ffffff',
    fontBase: 'Arial, sans-serif',
    fontCode: 'monospace',
  }),
});
