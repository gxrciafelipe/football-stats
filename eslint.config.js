// ESLint flat config shared by the client and server workspaces.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['**/node_modules/**', '**/dist/**', '**/coverage/**'] },
  js.configs.recommended,
  {
    // Server: Node.js ES modules
    files: ['server/**/*.js', '*.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
  },
  {
    // Client: browser React code
    files: ['client/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // JSX identifiers count as "used" only with the React plugin; allow capitalised names
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['client/vite.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    // Vitest globals (describe, it, expect, vi) in test files
    files: ['**/*.test.{js,jsx}', '**/tests/**/*.{js,jsx}'],
    languageOptions: { globals: { ...globals.vitest, ...globals.node } },
  },
  prettier,
];
