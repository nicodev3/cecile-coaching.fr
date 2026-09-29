// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { reflowLeadDevPlugin } from './src/dev/reflowLeadDevPlugin.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://cecilecoaching.fr',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.startsWith('https://cecilecoaching.fr/merci-rendez-vous'),
    }),
  ],

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
      name: 'Montserrat',
      cssVariable: '--font-title',
      provider: fontProviders.fontsource(),
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss(), reflowLeadDevPlugin()],
  },
});