import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.jonathanmkelly.com',
  // Astro 7 changed the default to 'jsx', which strips whitespace between
  // inline elements and ran prose together at every inline link.
  compressHTML: true,
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
