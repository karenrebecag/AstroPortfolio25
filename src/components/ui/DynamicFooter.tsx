import React from 'react';
import { StickyFooter, WhiteStickyFooter } from '../modules/Footer';

interface DynamicFooterProps {
  isDark: boolean;
  lang?: string;
}

export function DynamicFooter({ isDark, lang = 'en' }: DynamicFooterProps) {
  return isDark ? <StickyFooter lang={lang} /> : <WhiteStickyFooter lang={lang} />;
}
