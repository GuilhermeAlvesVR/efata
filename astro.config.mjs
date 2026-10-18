// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Troque pelo domínio definitivo quando houver um.
  site: process.env.SITE_URL ?? 'https://efata-seven.vercel.app',
  integrations: [
    react(),
    keystatic(),
    sitemap({ filter: (page) => !page.includes('/keystatic') }),
  ],
  // Páginas são estáticas; só o painel (/keystatic) roda no servidor.
  adapter: vercel(),
});
