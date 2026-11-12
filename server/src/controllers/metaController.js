import { MetricAggregatorFactory } from '../domain/metrics.js';

/** Reference data the client needs to build its controls. */
export function createMetaController(store) {
  return {
    /** GET /api/metrics: metrics the selector can offer */
    getMetrics(_req, res) {
      res.json({ metrics: MetricAggregatorFactory.list() });
    },

    /** GET /api/teams: the 20 clubs with badge colours */
    getTeams(_req, res) {
      res.json({ teams: store.teams });
    },
  };
}
