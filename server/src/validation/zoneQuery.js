import { z } from 'zod';
import { MetricAggregatorFactory } from '../domain/metrics.js';
import { ApiError } from '../middleware/errorHandler.js';

/** Grid size limits: a 12 × 8 grid is the finest the UI will offer. */
export const GRID_LIMITS = { cols: { min: 1, max: 12 }, rows: { min: 1, max: 8 } };

const zoneQuerySchema = z.object({
  cols: z.coerce
    .number()
    .int('cols must be a whole number')
    .min(GRID_LIMITS.cols.min)
    .max(GRID_LIMITS.cols.max)
    .default(6),
  rows: z.coerce
    .number()
    .int('rows must be a whole number')
    .min(GRID_LIMITS.rows.min)
    .max(GRID_LIMITS.rows.max)
    .default(4),
});

/**
 * Validates the query string of GET /api/zones and returns typed values.
 * Throws ApiError(400) with a specific code, which the error handler sends as JSON.
 */
export function parseZoneQuery(query) {
  const { metric } = query;
  if (typeof metric !== 'string' || !MetricAggregatorFactory.has(metric)) {
    const allowed = MetricAggregatorFactory.ids().join(', ');
    const message = metric
      ? `Unknown metric "${metric}". Use one of: ${allowed}.`
      : `The "metric" query parameter is required. Use one of: ${allowed}.`;
    throw new ApiError(400, 'INVALID_METRIC', message);
  }

  const result = zoneQuerySchema.safeParse(query);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ApiError(400, 'INVALID_QUERY', 'Invalid grid size.', details);
  }

  return { metric, ...result.data };
}
