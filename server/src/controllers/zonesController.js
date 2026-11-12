import { parseZoneQuery } from '../validation/zoneQuery.js';

/**
 * HTTP layer for zones: validates the request, calls the service, sends JSON.
 * Errors thrown here (including validation errors) reach the error handler,
 * because Express 5 forwards exceptions from route handlers automatically.
 */
export function createZonesController(zoneService) {
  return {
    /** GET /api/zones?metric=passes&cols=6&rows=4 */
    getZones(req, res) {
      const query = parseZoneQuery(req.query);
      res.json(zoneService.getZoneLeaders(query));
    },
  };
}
