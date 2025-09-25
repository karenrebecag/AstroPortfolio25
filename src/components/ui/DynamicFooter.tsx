import React from 'react';
import { StickyFooter } from './StickyFooter';
import { WhiteStickyFooter } from './WhiteStickyFooter';

interface DynamicFooterProps {
  isDark: boolean;
}

export function DynamicFooter({ isDark }: DynamicFooterProps) {
  return isDark ? <StickyFooter /> : <WhiteStickyFooter />;
}
