// Hand-made API responses shared by client tests.
export const flamengo = {
  id: 'flamengo',
  name: 'Flamengo',
  shortName: 'Flamengo',
  code: 'FLA',
  primary: '#c8102e',
  secondary: '#000000',
};

export const palmeiras = {
  id: 'palmeiras',
  name: 'Palmeiras',
  shortName: 'Palmeiras',
  code: 'PAL',
  primary: '#006437',
  secondary: '#ffffff',
};

/** A zones response for a cols × rows grid; zone 0 and zone 7 have leaders, the rest are empty. */
export function zonesResponse({ metric = 'passes', cols = 6, rows = 4 } = {}) {
  const meta =
    metric === 'shots'
      ? { id: 'shots', label: 'Shots', unit: 'shots' }
      : { id: 'passes', label: 'Completed passes', unit: 'passes' };

  const zones = Array.from({ length: cols * rows }, (_, zoneId) => ({
    zoneId,
    col: zoneId % cols,
    row: Math.floor(zoneId / cols),
    total: 0,
    leader: null,
  }));
  zones[0] = {
    ...zones[0],
    total: 400,
    leader: { playerId: 'fla-02', name: 'Bruno Lima', position: 'DEF', count: 100, team: flamengo },
  };
  zones[7] = {
    ...zones[7],
    total: 50,
    leader: {
      playerId: 'pal-11',
      name: metric === 'shots' ? 'Caio Dias' : 'Alan Costa',
      position: 'FWD',
      count: 9,
      team: palmeiras,
    },
  };

  return { metric: meta, grid: { cols, rows }, source: 'seed', demo: true, zones };
}

/** A minimal fetch Response stand-in. */
export function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}
