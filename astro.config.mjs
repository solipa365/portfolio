// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Substitua pela URL do seu site (necessário para geração do mapa do site)
  site: 'https://example.com',

  //configuração de URL
  trailingSlash: 'never', // Remove barras finais de URLs

  //Configuração do Vite
  vite: {
    plugins: [tailwindcss()],
  },

  // Integrações necessárias
  integrations: [
    react(), // Habilita componentes React
    sitemap({
      // Gera mapa do site
      serialize: (item) => {
        const url = item.url.endsWith('/') ? item.url.slice(0, -1) : item.url;
        return { ...item, url };
      },
    }),
  ],

  // Configuração de implantação
  output: 'server', // Renderização do lado do servidor - necessária para uso da API OpenAI
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
});
