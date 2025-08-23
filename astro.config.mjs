// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://divyam.site',
  integrations: [mdx(), sitemap()],
  // Built-in prefetch
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport' // or 'hover' | 'tap' | 'load'
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
    }
  }
});
