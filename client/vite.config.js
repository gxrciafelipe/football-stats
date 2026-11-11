import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config for the React client. In development, /api calls are proxied to the
// Express server so the browser only ever talks to one origin (no CORS needed).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
      reporter: ['text', 'html', 'json-summary'],
    },
  },
});
