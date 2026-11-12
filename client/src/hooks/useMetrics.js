import { useEffect, useState } from 'react';
import { apiGet } from '../api/client.js';

/** Used until the API answers, or if it cannot: the MVP's two metrics. */
export const DEFAULT_METRICS = [
  { id: 'passes', label: 'Completed passes', unit: 'passes' },
  { id: 'shots', label: 'Shots', unit: 'shots' },
];

/**
 * Loads the metrics the API offers (GET /api/metrics), so new server-side metrics
 * appear in the selector without client changes. Falls back to DEFAULT_METRICS.
 */
export function useMetrics() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  useEffect(() => {
    const controller = new AbortController();
    apiGet('/api/metrics', { signal: controller.signal })
      .then((body) => {
        if (Array.isArray(body.metrics) && body.metrics.length > 0) setMetrics(body.metrics);
      })
      .catch(() => {
        // Keep the defaults; the zones request will surface any real outage
      });
    return () => controller.abort();
  }, []);

  return metrics;
}
