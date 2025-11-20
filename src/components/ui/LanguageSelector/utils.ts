/**
 * Utility functions for the Language Selector component.
 */

/**
 * Determines the correct URL path for a given language code, considering special pages
 * like resume, greetings, and privacy policy.
 *
 * @param {string} langCode - The language code (e.g., 'en', 'es').
 * @returns {string} The corresponding URL path.
 */
export const getLanguagePath = (langCode: string): string => {
  const currentPath = window.location.pathname;

  // Resume/CV pages
  const resumePages = ['/resume', '/cv', '/curriculum', '/biodata', '/rirekisho', '/jianli'];
  const isResumePage = resumePages.some(page => currentPath.includes(page));
  if (isResumePage) {
    const resumeRoutes: { [key: string]: string } = {
      'en': '/resume',
      'es': '/es/curriculum',
      'fr': '/fr/resume',
      'hi': '/hi/biodata',
      'ja': '/ja/rirekisho',
      'zh-cn': '/zh-cn/jianli',
      'zh-tw': '/zh-tw/jianli'
    };
    return resumeRoutes[langCode] || '/resume';
  }

  // Greetings pages
  const greetingsPages = ['/greetings', '/agradecimientos', '/remerciements', '/dhanyavaad', '/kansha', '/ganxie'];
  const isGreetingsPage = greetingsPages.some(page => currentPath.includes(page));
  if (isGreetingsPage) {
    const greetingsRoutes: { [key: string]: string } = {
      'en': '/greetings',
      'es': '/es/agradecimientos',
      'fr': '/fr/remerciements',
      'hi': '/hi/dhanyavaad',
      'ja': '/ja/kansha',
      'zh-cn': '/zh-cn/ganxie',
      'zh-tw': '/zh-tw/ganxie'
    };
    return greetingsRoutes[langCode] || '/greetings';
  }

  // Privacy Policy pages
  const privacyPages = ['/privacy', '/privacidad', '/confidentialite', '/guptataa', '/puraibashii', '/yinsi', '/yinsi-zhengce'];
  const isPrivacyPage = privacyPages.some(page => currentPath.includes(page));
  if (isPrivacyPage) {
    const privacyRoutes: { [key: string]: string } = {
      'en': '/privacy',
      'es': '/es/privacidad',
      'fr': '/fr/confidentialite',
      'hi': '/hi/guptataa',
      'ja': '/ja/puraibashii',
      'zh-cn': '/zh-cn/yinsi',
      'zh-tw': '/zh-tw/yinsi-zhengce'
    };
    return privacyRoutes[langCode] || '/privacy';
  }

  // Default behavior (home page)
  if (langCode === 'en') return '/';
  return `/${langCode}/`;
};
