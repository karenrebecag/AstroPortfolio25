import { translations } from './translations.js';

export const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  ja: '日本語',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文'
};

export const defaultLang = 'en';

export function getLangFromUrl(url) {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang;
  return defaultLang;
}

export function useTranslatedPath(lang, path = '') {
  const pathWithoutLang = path.replace(/^\/[a-z]{2}(-[a-z]{2})?/, '');

  // Handle specific page mappings
  const pageRoutes = {
    // Privacy policy pages
    '/privacy': {
      'en': '/privacy',
      'es': '/es/privacidad',
      'fr': '/fr/confidentialite',
      'hi': '/hi/guptataa',
      'ja': '/ja/puraibashii',
      'zh-cn': '/zh-cn/yinsi',
      'zh-tw': '/zh-tw/yinsi-zhengce'
    },
    '/privacidad': {
      'en': '/privacy',
      'es': '/es/privacidad',
      'fr': '/fr/confidentialite',
      'hi': '/hi/guptataa',
      'ja': '/ja/puraibashii',
      'zh-cn': '/zh-cn/yinsi',
      'zh-tw': '/zh-tw/yinsi-zhengce'
    },
    '/confidentialite': {
      'en': '/privacy',
      'es': '/es/privacidad',
      'fr': '/fr/confidentialite',
      'hi': '/hi/guptataa',
      'ja': '/ja/puraibashii',
      'zh-cn': '/zh-cn/yinsi',
      'zh-tw': '/zh-tw/yinsi-zhengce'
    },
    // Resume/CV pages
    '/resume': {
      'en': '/resume',
      'es': '/es/curriculum',
      'fr': '/fr/resume',
      'hi': '/hi/biodata',
      'ja': '/ja/rirekisho',
      'zh-cn': '/zh-cn/jianli',
      'zh-tw': '/zh-tw/jianli'
    },
    '/curriculum': {
      'en': '/resume',
      'es': '/es/curriculum',
      'fr': '/fr/resume',
      'hi': '/hi/biodata',
      'ja': '/ja/rirekisho',
      'zh-cn': '/zh-cn/jianli',
      'zh-tw': '/zh-tw/jianli'
    },
    // Greetings pages
    '/greetings': {
      'en': '/greetings',
      'es': '/es/agradecimientos',
      'fr': '/fr/remerciements',
      'hi': '/hi/dhanyavaad',
      'ja': '/ja/kansha',
      'zh-cn': '/zh-cn/ganxie',
      'zh-tw': '/zh-tw/ganxie'
    },
    '/agradecimientos': {
      'en': '/greetings',
      'es': '/es/agradecimientos',
      'fr': '/fr/remerciements',
      'hi': '/hi/dhanyavaad',
      'ja': '/ja/kansha',
      'zh-cn': '/zh-cn/ganxie',
      'zh-tw': '/zh-tw/ganxie'
    },
    '/remerciements': {
      'en': '/greetings',
      'es': '/es/agradecimientos',
      'fr': '/fr/remerciements',
      'hi': '/hi/dhanyavaad',
      'ja': '/ja/kansha',
      'zh-cn': '/zh-cn/ganxie',
      'zh-tw': '/zh-tw/ganxie'
    }
  };

  // Check if current path has a specific route mapping
  if (pageRoutes[pathWithoutLang]) {
    return pageRoutes[pathWithoutLang][lang] || pageRoutes[pathWithoutLang][defaultLang];
  }

  // Default behavior for home and other pages
  if (lang === defaultLang) {
    return pathWithoutLang || '/';
  }

  return `/${lang}${pathWithoutLang}`;
}

export function t(key, lang = defaultLang) {
  const keys = key.split('.');
  let value = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

// Detect browser language
export function getBrowserLanguage() {
  if (typeof navigator === 'undefined') return defaultLang;

  const lang = navigator.language.toLowerCase();

  // Map browser language codes
  const langMap = {
    'es': 'es',
    'es-es': 'es',
    'es-mx': 'es',
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'fr': 'fr',
    'fr-fr': 'fr',
    'fr-ca': 'fr',
    'hi': 'hi',
    'hi-in': 'hi',
    'ja': 'ja',
    'ja-jp': 'ja',
    'zh': 'zh-cn',
    'zh-cn': 'zh-cn',
    'zh-tw': 'zh-tw',
    'zh-hk': 'zh-tw'
  };

  return langMap[lang] || defaultLang;
}

// Validate if language is supported
export function isValidLanguage(lang) {
  return lang in languages;
}

// Get language metadata
export function getLanguageMetadata(lang) {
  const metadata = {
    en: { dir: 'ltr', charset: 'UTF-8', region: 'US' },
    es: { dir: 'ltr', charset: 'UTF-8', region: 'ES' },
    fr: { dir: 'ltr', charset: 'UTF-8', region: 'FR' },
    hi: { dir: 'ltr', charset: 'UTF-8', region: 'IN' },
    ja: { dir: 'ltr', charset: 'UTF-8', region: 'JP' },
    'zh-cn': { dir: 'ltr', charset: 'UTF-8', region: 'CN' },
    'zh-tw': { dir: 'ltr', charset: 'UTF-8', region: 'TW' }
  };

  return metadata[lang] || metadata[defaultLang];
}

// Language selector data with market information
export const languageOptions = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    greeting: 'Hello there!',
    market: 'Global',
    growth: 'Stable'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸',
    greeting: '¡Hola, qué tal!',
    market: 'Spain & LATAM',
    growth: '+25%'
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷',
    greeting: 'Salut, ça va?',
    market: 'France & Canada',
    growth: '+15%'
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    flag: '🇮🇳',
    greeting: 'नमस्ते जी!',
    market: 'India',
    growth: '+30%'
  },
  {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵',
    greeting: 'こんにちは！',
    market: 'Japan',
    growth: '+20%'
  },
  {
    code: 'zh-cn',
    name: '简体中文',
    flag: '🇨🇳',
    greeting: '你好！',
    market: 'Mainland China',
    growth: '+35%'
  },
  {
    code: 'zh-tw',
    name: '繁體中文',
    flag: '🇹🇼',
    greeting: '您好！',
    market: 'Taiwan & HK',
    growth: '+12%'
  }
];