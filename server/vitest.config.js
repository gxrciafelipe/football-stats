import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/server.js'],
      reporter: ['text', 'html', 'json-summary'],
      // CI fails if coverage of the server code drops below these numbers (NFR-5)
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
    },
  },
});
