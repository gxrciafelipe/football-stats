import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';

/**
 * Builds the /api router. Routes only map URLs to controllers;
 * request parsing and responses live in controllers, business rules in services.
 */
export function createApiRouter() {
  const router = Router();
  router.get('/health', getHealth);
  return router;
}
