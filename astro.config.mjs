// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import prefetch from '@astrojs/prefetch';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://divyam.site',

  integrations: [
    mdx(), 
    sitemap(),
    prefetch({
      selector: 'a[href^="/"]', // Only prefetch internal links
      throttle: 3,
    })
  ],

  // Enhanced prefetch configuration
  prefetch: {
    prefetchAll: false, // More selective prefetching
    defaultStrategy: 'hover', // Prefetch on hover for better performance
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
      allowedHosts: ['720a7673ec40.ngrok-free.app']
    }
  },

  adapter: cloudflare()
});