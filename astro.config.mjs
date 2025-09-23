// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // ✅ Optimizaciones específicas para Three.js siguiendo la guía
    optimizeDeps: {
      include: ['three', 'three-stdlib', 'zustand'],
      exclude: [] // Mantener vacío para mejor tree-shaking
    },
    build: {
      rollupOptions: {
        output: {
          // ✅ Chunks separados para Three.js - siguiendo recomendaciones
          manualChunks: {
            'three-core': ['three'],
            'three-extras': ['three-stdlib'],
            'state-management': ['zustand']
          }
        }
      }
    },
    ssr: {
      // ✅ Evitar SSR de Three.js - crítico para performance
      noExternal: ['three', 'three-stdlib']
    }
  },
  
  // ✅ Prefetch selectivo siguiendo la guía
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  }
});