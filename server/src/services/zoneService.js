import { gridZones, zoneOf } from '../domain/zones.js';
import { MetricAggregatorFactory } from '../domain/metrics.js';

/**
 * Business logic for zone leaders. Knows nothing about HTTP: it takes plain
 * arguments and returns plain objects, so it can be unit-tested with a fake store.
 *
 * @param {object} store data access object (see data/seedStore.js)
 */
export function createZoneService(store) {
  /** Team fields the client needs to draw a badge. */
  function teamSummary(teamId) {
    const { id, name, shortName, code, primary, secondary } = store.getTeam(teamId);
    return { id, name, shortName, code, primary, secondary };
  }

  /**
   * For each zone of a cols × rows grid, finds the player with the most counted events.
   * Ties go to the player whose name comes first alphabetically, so results are stable.
   */
  function getZoneLeaders({ metric, cols, rows }) {
    const aggregator = MetricAggregatorFactory.create(metric);
    // countsByZone[zoneId] = Map(playerId -> count)
    const countsByZone = Array.from({ length: cols * rows }, () => new Map());

    for (const event of store.events) {
      if (!aggregator.counts(event)) continue;
      const { zoneId } = zoneOf(event.x, event.y, cols, rows);
      const counts = countsByZone[zoneId];
      counts.set(event.playerId, (counts.get(event.playerId) ?? 0) + 1);
    }

    const zones = gridZones(cols, rows).map((zone) => {
      let leader = null;
      let total = 0;

      for (const [playerId, count] of countsByZone[zone.zoneId]) {
        total += count;
        const player = store.getPlayer(playerId);
        const beatsLeader =
          !leader ||
          count > leader.count ||
          (count === leader.count && player.name.localeCompare(leader.name) < 0);
        if (beatsLeader) {
          leader = {
            playerId,
            name: player.name,
            position: player.position,
            count,
            team: player.teamId,
          };
        }
      }

      if (leader) leader.team = teamSummary(leader.team);
      return { ...zone, total, leader };
    });

    return {
      metric: aggregator.describe(),
      grid: { cols, rows },
      source: store.source,
      demo: store.demo,
      zones,
    };
  }

  return { getZoneLeaders };
}
