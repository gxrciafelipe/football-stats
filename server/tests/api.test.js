import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeedStore } from '../src/data/seedStore.js';

// Load the real seed data once; each test gets a fresh app around it
const store = loadSeedStore();
const api = () => request(createApp({ store }));

describe('GET /api/zones', () => {
  it('returns the leader of all 24 zones of the default 6 × 4 grid', async () => {
    const res = await api().get('/api/zones?metric=passes');

    expect(res.status).toBe(200);
    expect(res.body.grid).toEqual({ cols: 6, rows: 4 });
    expect(res.body.zones).toHaveLength(24);
    expect(res.body).toMatchObject({ source: 'seed', demo: true, metric: { id: 'passes' } });

    const zone = res.body.zones.find((z) => z.leader);
    expect(zone.leader).toEqual({
      playerId: expect.any(String),
      name: expect.any(String),
      position: expect.stringMatching(/^(GK|DEF|MID|FWD)$/),
      count: expect.any(Number),
      team: expect.objectContaining({ id: expect.any(String), code: expect.any(String) }),
    });
    expect(zone.total).toBeGreaterThanOrEqual(zone.leader.count);
  });

  it('puts most shots in the attacking third', async () => {
    const { body } = await api().get('/api/zones?metric=shots');
    const shotsIn = (cols) =>
      body.zones.filter((z) => cols.includes(z.col)).reduce((n, z) => n + z.total, 0);

    expect(shotsIn([4, 5])).toBeGreaterThan(shotsIn([0, 1, 2, 3]));
  });

  it('accepts a custom grid size', async () => {
    const res = await api().get('/api/zones?metric=shots&cols=3&rows=2');

    expect(res.status).toBe(200);
    expect(res.body.zones).toHaveLength(6);
  });

  it('rejects an unknown metric with 400 INVALID_METRIC', async () => {
    const res = await api().get('/api/zones?metric=dribbles');

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual({
      code: 'INVALID_METRIC',
      message: 'Unknown metric "dribbles". Use one of: passes, shots.',
    });
  });

  it('rejects a missing metric', async () => {
    const res = await api().get('/api/zones');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_METRIC');
    expect(res.body.error.message).toMatch(/required/);
  });

  it.each([
    ['cols=abc', 'cols'],
    ['cols=0', 'cols'],
    ['rows=20', 'rows'],
    ['cols=2.5', 'cols'],
  ])('rejects an invalid grid size (%s)', async (param, field) => {
    const res = await api().get(`/api/zones?metric=passes&${param}`);

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_QUERY');
    expect(res.body.error.details[0].field).toBe(field);
  });
});

describe('reference data endpoints', () => {
  it('GET /api/metrics lists passes and shots', async () => {
    const res = await api().get('/api/metrics');

    expect(res.status).toBe(200);
    expect(res.body.metrics.map((m) => m.id)).toEqual(['passes', 'shots']);
  });

  it('GET /api/teams lists the 20 clubs', async () => {
    const res = await api().get('/api/teams');

    expect(res.status).toBe(200);
    expect(res.body.teams).toHaveLength(20);
    expect(res.body.teams[0]).toHaveProperty('primary');
  });
});

describe('rate limiting', () => {
  it('answers with 429 and the JSON error shape after 100 requests a minute', async () => {
    const app = createApp({ store });
    for (let i = 0; i < 100; i += 1) await request(app).get('/api/health');
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('RATE_LIMITED');
  });
});
