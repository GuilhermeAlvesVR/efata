// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import miniaturas from './src/integrations/miniaturas.mjs';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://www.efatavr.com.br',
  integrations: [sitemap(), miniaturas()],
});
