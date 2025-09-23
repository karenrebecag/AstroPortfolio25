import js from '@eslint/js';
import globals from 'globals';

export default [
  // Base configuration
  js.configs.recommended,
  
  // Configuration for JavaScript files only (for now)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // General rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'public/',
      '**/*.astro',
      '**/*.ts',
      '**/*.tsx',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'tailwind.config.js',
      'astro.config.mjs',
    ],
  },
];
