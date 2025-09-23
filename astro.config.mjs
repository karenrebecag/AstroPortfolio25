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
    plugins: [tailwindcss()]
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