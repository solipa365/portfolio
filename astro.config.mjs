// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import path from 'path'; // <- importa path para alias

export default defineConfig({
  // Substitua pela URL do seu site (necessário para geração do mapa do site)
  site: 'https://example.com',

  // Configuração de URL
  trailingSlash: 'never', // Remove barras finais de URLs

  // Configuração do Vite
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

  // Integrações necessárias
  integrations: [
    react(), // Habilita componentes React
    sitemap({
      serialize: (item) => {
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        return { ...item, url };
      },
    }),
  ],

  // Configuração de implantação
  output: 'server', // Renderização do lado do servidor
  adapter: vercel(),

  devToolbar: {
    enabled: false,
  },
});
