import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jonathanmkelly.com',
  integrations: [
    react(),
    // Keep the hidden /crates page out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/crates') }),
  ],
  vite: {
    ssr: {
      noExternal: ['@vercel/analytics'],
    },
  },
});
