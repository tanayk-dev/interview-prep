// @ts-check
import { defineConfig } from 'astro/config';
import remarkCallouts from './src/plugins/remark-callouts.mjs';

// GitHub Pages project site: https://tanayk-dev.github.io/interview-prep/
export default defineConfig({
  site: 'https://tanayk-dev.github.io',
  base: '/interview-prep',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkCallouts],
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'rose-pine-dawn', dark: 'catppuccin-mocha' },
      defaultColor: false,
      wrap: false,
    },
  },
});
