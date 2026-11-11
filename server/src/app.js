import express from 'express';
import helmet from 'helmet';
import { createApiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

/**
 * Application factory: builds a fully configured Express app without starting it.
 * Tests call createApp() and hit it with Supertest; server.js calls it and listens.
 */
export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json());

  app.use('/api', createApiRouter());
  app.use('/api', notFound);
  app.use(errorHandler);

  return app;
}
