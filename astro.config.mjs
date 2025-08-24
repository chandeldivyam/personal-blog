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
        output: { 
          assetFileNames: 'assets/[hash][extname]',
          // Force CSS into fewer chunks to reduce sequential loading
          manualChunks: (id) => {
            // Bundle all CSS into a single chunk
            if (id.includes('.css') || id.includes('styles/')) {
              return 'styles';
            }
          }
        }
      }
    },
    server: {
      allowedHosts: ['720a7673ec40.ngrok-free.app']
    }
  },
});