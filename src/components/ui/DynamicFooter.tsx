import React from 'react';
import { StickyFooter } from '../modules/Footer';

interface DynamicFooterProps {
  isDark: boolean;
  lang?: string;
}

export function DynamicFooter({ isDark, lang = 'en' }: DynamicFooterProps) {
  return <StickyFooter lang={lang} variant={isDark ? 'dark' : 'light'} />;
}
