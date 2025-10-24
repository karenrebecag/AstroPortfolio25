import React from 'react';
import { StickyFooter, WhiteStickyFooter } from '../modules/Footer';

interface DynamicFooterProps {
  isDark: boolean;
}

export function DynamicFooter({ isDark }: DynamicFooterProps) {
  return isDark ? <StickyFooter /> : <WhiteStickyFooter />;
}
