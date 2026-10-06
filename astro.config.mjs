// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import robotsTxt from 'astro-robots-txt';
import llmsMd from './src/integrations/llmsMd.mjs';

import tailwindcss from '@tailwindcss/vite';
import { reflowLeadDevPlugin } from './src/dev/reflowLeadDevPlugin.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://cecilecoaching.fr',
  trailingSlash: 'always',
  build: {
    // Le CSS du header dépasse le seuil auto (4 Ko) et bloquait le premier affichage.
    inlineStylesheets: 'always',
  },
  integrations: [
    mdx(),
    llmsMd(),
    sitemap({
      filter: (page) => !page.startsWith('https://cecilecoaching.fr/merci-rendez-vous'),
    }),
    robotsTxt({
      transform(content) {
        return content.replace(
          'User-agent: *\n',
          'User-agent: *\nContent-Signal: ai-train=no, search=yes, ai-input=yes\n',
        );
      },
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
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss(), reflowLeadDevPlugin()],
  },
});