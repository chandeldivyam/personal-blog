// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://divyam.site',

  integrations: [
    mdx(), 
    sitemap()
  ],

  // Enhanced prefetch configuration
  prefetch: true,
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
      allowedHosts: ['720a7673ec40.ngrok-free.app']
    }
  },
});