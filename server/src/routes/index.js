import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

/**
 * Builds the /api router. Routes only map URLs to controllers;
 * request parsing and responses live in controllers, business rules in services.
 *
 * @param {{ zones: object, meta: object }} controllers
 */
export function createApiRouter({ zones, meta }) {
  const router = Router();
  router.get('/health', getHealth);
  router.get('/metrics', meta.getMetrics);
  router.get('/teams', meta.getTeams);
  router.get('/zones', zones.getZones);
  return router;
}
