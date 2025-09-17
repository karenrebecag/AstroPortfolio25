/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['InterTight', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'secondary': ['Boysen', 'InterTight', 'sans-serif'],
        'display': ['Median', 'Boysen', 'serif'],
        'signature': ['Karstar Signature', 'cursive'],
        // Aliases for easier use
        'inter': ['InterTight', 'Inter', 'system-ui', 'sans-serif'],
        'boysen': ['Boysen', 'sans-serif'],
        'median': ['Median', 'serif'],
        'karstar': ['Karstar Signature', 'cursive'],
      },
      spacing: {
        'header-gap': 'var(--header-nav-gap)',
      },
      width: {
        'header-button': 'var(--header-button-width)',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        // Custom responsive sizes
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1' }],
        'display': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.2' }],
        'heading': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.3' }],
        // Header specific responsive sizes
        'header-logo': ['var(--header-logo-size)', { lineHeight: 'var(--header-logo-line-height)' }],
        'header-nav': ['var(--header-nav-size)', { lineHeight: 'var(--header-nav-line-height)' }],
        // Button specific responsive sizes
        'button': ['var(--button-text-size)', { lineHeight: 'var(--button-text-line-height)' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
    },
  },
  plugins: [],
}
