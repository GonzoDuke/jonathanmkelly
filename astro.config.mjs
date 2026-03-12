import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jonathanmkelly.com',
  integrations: [react(), sitemap()],
  vite: {
    ssr: {
      noExternal: ['@vercel/analytics'],
    },
  },
});
