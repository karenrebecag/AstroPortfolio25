import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { t, getLangFromUrl } from '../../../i18n/utils.js';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Marquee Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const lang = getLangFromUrl(new URL(window.location.href));
      return (
        this.props.fallback || (
          <div className="marquees-container">
            <div className="marquee-wrapper first-marquee">
              <div className="flex items-center justify-center h-full text-white font-display text-2xl">
                {t('banner.leftMarquee', lang)}
              </div>
            </div>
            <div className="marquee-wrapper second-marquee">
              <div className="flex items-center justify-center h-full text-white font-display text-2xl">
                {t('banner.rightMarquee', lang)}
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
