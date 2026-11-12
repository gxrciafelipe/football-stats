import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createApiRouter } from './routes/index.js';
import { ApiError, errorHandler, notFound } from './middleware/errorHandler.js';
import { loadSeedStore } from './data/seedStore.js';
import { createZoneService } from './services/zoneService.js';
import { createZonesController } from './controllers/zonesController.js';
import { createMetaController } from './controllers/metaController.js';

/**
 * Application factory: builds a fully configured Express app without starting it.
 *
 * Layers are wired here, from the bottom up (MVC-style separation):
 *   data store  ->  services (business rules)  ->  controllers (HTTP)  ->  routes
 * Passing the store in makes the app easy to test with any dataset.
 *
 * @param {{ store?: object }} [options]
 */
export function createApp({ store = loadSeedStore() } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1); // Render runs the app behind one proxy; needed for correct client IPs
  app.use(helmet());
  app.use(express.json());

  // Basic abuse protection: 100 API requests per minute per IP address (NFR-8)
  app.use(
    '/api',
    rateLimit({
      windowMs: 60_000,
      limit: 100,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      // Answer in the shared JSON error shape instead of plain text
      handler: (_req, _res, next) =>
        next(new ApiError(429, 'RATE_LIMITED', 'Too many requests. Please wait a minute.')),
    }),
  );

  const zoneService = createZoneService(store);
  const controllers = {
    zones: createZonesController(zoneService),
    meta: createMetaController(store),
  };

  app.use('/api', createApiRouter(controllers));
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
