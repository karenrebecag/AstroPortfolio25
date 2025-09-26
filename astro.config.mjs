// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://karenortiz.space',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [
    react(),
sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks for better caching
            'motion': ['motion/react', 'motion'],
            'react-vendor': ['react', 'react-dom'],
            'three': ['three'],
            'lenis': ['lenis'],
            'lucide': ['lucide-react']
          }
        }
      }
    },
    ssr: {
      // Optimize SSR performance
      noExternal: ['motion']
    }
  },
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",    // English (default)
      "es",    // Español
      "fr",    // Français
      "hi",    // हिन्दी (Hindi)
      "ja",    // 日本語 (Japanese)
      "zh-cn", // 简体中文 (Chinese Simplified)
      "zh-tw"  // 繁體中文 (Chinese Traditional)
    ],
    routing: {
      prefixDefaultLocale: false,
      fallbackType: "rewrite"
    },
    fallback: {
      "zh-tw": "zh-cn",
      "hi": "en"
    }
  }
});