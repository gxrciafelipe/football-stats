import { createZoneService } from '../src/services/zoneService.js';

/** A tiny hand-made store, so expected leaders can be worked out by hand. */
function createFakeStore(events) {
  const teams = [
    {
      id: 'red',
      name: 'Red FC',
      shortName: 'Red',
      code: 'RED',
      primary: '#ff0000',
      secondary: '#ffffff',
    },
    {
      id: 'blue',
      name: 'Blue FC',
      shortName: 'Blue',
      code: 'BLU',
      primary: '#0000ff',
      secondary: '#ffffff',
    },
  ];
  const players = [
    { id: 'p1', name: 'Bruno Lima', teamId: 'red', position: 'MID' },
    { id: 'p2', name: 'Alan Costa', teamId: 'blue', position: 'FWD' },
    { id: 'p3', name: 'Caio Dias', teamId: 'blue', position: 'DEF' },
  ];
  return {
    source: 'seed',
    demo: true,
    teams,
    players,
    events,
    getTeam: (id) => teams.find((team) => team.id === id),
    getPlayer: (id) => players.find((player) => player.id === id),
  };
}

const event = (playerId, type, x, y, success = 1) => ({ playerId, type, x, y, success });

describe('zoneService.getZoneLeaders', () => {
  it('finds the player with the most counted events in each zone', () => {
    const store = createFakeStore([
      event('p1', 'pass', 10, 10),
      event('p1', 'pass', 20, 20),
      event('p2', 'pass', 30, 30),
      event('p3', 'pass', 80, 80),
    ]);
    const result = createZoneService(store).getZoneLeaders({ metric: 'passes', cols: 2, rows: 2 });

    expect(result.grid).toEqual({ cols: 2, rows: 2 });
    expect(result.zones).toHaveLength(4);
    expect(result.zones[0]).toMatchObject({
      zoneId: 0,
      total: 3,
      leader: { name: 'Bruno Lima', count: 2 },
    });
    expect(result.zones[0].leader.team).toEqual(store.teams[0]);
    expect(result.zones[3].leader).toMatchObject({ playerId: 'p3', count: 1 });
  });

  it('returns null leaders and zero totals for empty zones', () => {
    const store = createFakeStore([event('p1', 'pass', 10, 10)]);
    const { zones } = createZoneService(store).getZoneLeaders({
      metric: 'passes',
      cols: 2,
      rows: 2,
    });

    expect(zones[1]).toEqual({ zoneId: 1, col: 1, row: 0, total: 0, leader: null });
  });

  it('applies the metric rule: failed passes do not count, all shots do', () => {
    const store = createFakeStore([event('p1', 'pass', 10, 10, 0), event('p2', 'shot', 10, 10, 0)]);
    const service = createZoneService(store);

    expect(
      service.getZoneLeaders({ metric: 'passes', cols: 1, rows: 1 }).zones[0].leader,
    ).toBeNull();
    expect(service.getZoneLeaders({ metric: 'shots', cols: 1, rows: 1 }).zones[0].leader.name).toBe(
      'Alan Costa',
    );
  });

  it('breaks ties alphabetically so results are stable', () => {
    const store = createFakeStore([event('p3', 'pass', 10, 10), event('p2', 'pass', 10, 10)]);
    const { zones } = createZoneService(store).getZoneLeaders({
      metric: 'passes',
      cols: 1,
      rows: 1,
    });

    expect(zones[0].leader.name).toBe('Alan Costa');
  });

  it('reports the metric and the data source', () => {
    const store = createFakeStore([]);
    const result = createZoneService(store).getZoneLeaders({ metric: 'shots', cols: 1, rows: 1 });

    expect(result.metric).toEqual({ id: 'shots', label: 'Shots', unit: 'shots' });
    expect(result).toMatchObject({ source: 'seed', demo: true });
  });
});
