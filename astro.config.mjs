// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import path from 'path';
import { fileURLToPath } from 'url';

// https://astro.build/config
export default defineConfig({
  site: 'https://karenortiz.space',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
    isr: {
      // Genera un token seguro con: openssl rand -base64 32
      bypassToken: process.env.ISR_BYPASS_TOKEN || 'cambiar-este-token-en-produccion-32-caracteres-minimo',
      // Excluir rutas que no deben usar ISR (pero incluir /api/revalidate)
      exclude: []
    },
    edgeMiddleware: false // Disable edge middleware to avoid cold start issues
  }),
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-3ed7c563bcaa4c7c8ed703c87bbc1631.r2.dev'
      }
    ]
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
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
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src')
      }
    },
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