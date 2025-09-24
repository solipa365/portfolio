// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import path from 'path';

export default defineConfig({
  site: 'https://example.com', // substitui pela URL real do teu site
  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': path.resolve('./src'),
      },
    },
    build: {
      rollupOptions: {
        external: ['groq-sdk'],
      },
    },
  },

  integrations: [
    react(),
    sitemap({
      serialize: (item) => {
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        return { ...item, url };
      },
    }),
  ],

  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),

  devToolbar: {
    enabled: false,
  },
});
