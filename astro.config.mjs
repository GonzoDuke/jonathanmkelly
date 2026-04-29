import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.jonathanmkelly.com',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  vite: {
    ssr: {
      noExternal: ['@vercel/analytics'],
    },
  },
});
