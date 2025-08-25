// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://divyam.site',

  integrations: [
    mdx(), 
    sitemap()
  ],

  // Enhanced prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  },

  vite: {
    build: {
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: { assetFileNames: 'assets/[hash][extname]' }
      }
    },
    server: {
      allowedHosts: ['divyam.site']
    }
  },
});