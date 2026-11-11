import { config } from '../config.js';

/**
 * GET /api/health
 * Lightweight liveness check used by Render's health check and uptime monitors.
 */
export function getHealth(_req, res) {
  res.json({
    status: 'ok',
    version: config.version,
    uptimeSeconds: Math.round(process.uptime()),
  });
}
