import React, { useState, useEffect } from 'react';

interface CodeBlockIslandProps {
  code: string;
  language?: string;
  theme?: string;
  showLineNumbers?: boolean;
  title?: string;
}

const CodeBlockIsland: React.FC<CodeBlockIslandProps> = ({
  code,
  language = 'javascript',
  theme = 'github-dark',
  showLineNumbers = false,
  title
}) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    let observer: MutationObserver;

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Dynamic import of Shiki for code splitting
        const { codeToHtml } = await import('shiki');

        if (!mounted) return;

        // Detect current theme
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const currentTheme = isDarkMode ? 'github-dark' : 'github-light';

        const html = await codeToHtml(code, {
          lang: language,
          theme: currentTheme
        });

        if (mounted) {
          setHighlightedHtml(html);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to highlight code');
          setIsLoading(false);
          console.error('Shiki highlighting error:', err);
        }
      }
    };

    highlightCode();

    // Watch for theme changes
    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (mounted) {
            highlightCode();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      mounted = false;
      if (observer) {
        observer.disconnect();
      }
    };
  }, [code, language, theme, showLineNumbers]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (error) {
    return (
      <div className="codeblock-island">
        {title && (
          <div className="codeblock-header">
            <span className="codeblock-title">{title}</span>
          </div>
        )}
        <div className="codeblock-content">
          <pre style={{ 
            fontSize: 'clamp(8px, 1.2vw, 12px)', 
            padding: 'clamp(8px, 2vw, 12px)',
            margin: 0,
            overflowX: 'auto',
            whiteSpace: 'pre',
            fontFamily: 'Courier New, Consolas, Monaco, monospace'
          }}>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="codeblock-island">
      {title && (
        <div className="codeblock-header">
          <span className="codeblock-title">{title}</span>
          <div className="codeblock-actions">
            <button
              className={`copy-button ${copied ? 'success' : ''}`}
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="codeblock-loading">
          <div className="spinner"></div>
          <span>Highlighting code...</span>
        </div>
      ) : (
        <div 
          className="codeblock-content"
          dangerouslySetInnerHTML={{ __html: highlightedHtml || '' }}
        />
      )}
      
      <style>{`
        .codeblock-island {
          width: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(229, 231, 235, 1);
          background: rgba(255, 255, 255, 1);
          border-radius: 12px;
          transition: 
            background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
            border-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        :global(.dark-mode) .codeblock-island {
          border-color: rgba(51, 51, 51, 1);
          background: rgba(31, 31, 31, 1);
        }

        .codeblock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px);
          border-bottom: 1px solid rgba(229, 231, 235, 1);
          background-color: rgba(249, 250, 251, 1);
          transition: 
            background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
            border-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        :global(.dark-mode) .codeblock-header {
          border-bottom-color: rgba(51, 51, 51, 1);
          background-color: rgba(17, 17, 17, 1);
        }

        .codeblock-title {
          font-size: clamp(11px, 2vw, 13px);
          font-weight: 500;
          color: rgba(55, 65, 81, 1);
          font-family: var(--font-primary);
          transition: color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        :global(.dark-mode) .codeblock-title {
          color: rgba(255, 255, 255, 1);
        }

        .codeblock-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .copy-button {
          padding: 8px;
          border-radius: 6px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(107, 114, 128, 1);
          transition: 
            color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            background-color 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .copy-button:hover {
          background-color: rgba(229, 231, 235, 1);
          color: rgba(55, 65, 81, 1);
        }

        :global(.dark-mode) .copy-button {
          color: rgba(229, 229, 229, 1);
        }

        :global(.dark-mode) .copy-button:hover {
          background-color: rgba(51, 51, 51, 1);
          color: rgba(255, 255, 255, 1);
        }

        .copy-button.success {
          color: rgba(34, 197, 94, 1);
        }

        .codeblock-content {
          overflow-x: auto;
        }

        .codeblock-content :global(pre) {
          margin: 0 !important;
          padding: clamp(8px, 2vw, 12px) !important;
          font-size: clamp(8px, 1.2vw, 12px) !important;
          line-height: 1.4 !important;
          font-family: 'Courier New', 'Consolas', 'Monaco', monospace !important;
          border-radius: 0 !important;
          overflow-x: auto !important;
          white-space: pre !important;
        }

        .codeblock-content :global(code) {
          font-family: 'Courier New', 'Consolas', 'Monaco', monospace !important;
          font-size: inherit !important;
        }

        /* Preserve Shiki syntax highlighting colors */
        .codeblock-content :global(.shiki) {
          background: transparent !important;
        }

        .codeblock-content :global(.line-numbers .line-number) {
          display: inline-block;
          width: 2em;
          margin-right: 1em;
          text-align: right;
          opacity: 0.5;
          user-select: none;
        }

        .codeblock-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: clamp(16px, 3vw, 24px);
          color: rgba(107, 114, 128, 1);
          font-size: clamp(12px, 2vw, 14px);
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(229, 231, 235, 1);
          border-top: 2px solid rgba(107, 114, 128, 1);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .codeblock-island {
            border-radius: 8px;
          }
          
          .codeblock-header {
            padding: clamp(4px, 1vw, 8px) clamp(6px, 1.5vw, 10px);
          }
          
          .codeblock-title {
            font-size: clamp(9px, 2.5vw, 11px);
          }
          
          .codeblock-content :global(pre) {
            padding: clamp(6px, 1.5vw, 10px);
          }
        }
      `}</style>
    </div>
  );
};

export default CodeBlockIsland;
