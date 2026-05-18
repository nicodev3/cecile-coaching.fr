// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cecilecoaching.fr',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],

  fonts: [
    {
      name: 'Hanken Grotesk',
      cssVariable: '--font-body',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
    },
    {
      name: 'Libre Caslon Text',
      cssVariable: '--font-title',
      provider: fontProviders.fontsource(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});