import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Central configuration, read once from environment variables.
 * Keeping every env lookup here means the rest of the code never touches process.env directly.
 */
export const config = {
  port: Number(process.env.PORT) || 3001,
  env: process.env.NODE_ENV || 'development',
  version: process.env.npm_package_version || '0.1.0',
  /** Built React app (npm run build). Served by Express in production, if it exists. */
  clientDist: process.env.CLIENT_DIST || join(here, '..', '..', 'client', 'dist'),
};
