import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeedStore } from '../src/data/seedStore.js';

const app = createApp({ store: loadSeedStore() });

describe('GET /api/health', () => {
  it('returns status ok with a version', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toEqual(expect.any(String));
  });

  it('answers unknown API routes with the JSON error shape', async () => {
    const res = await request(app).get('/api/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'No route for GET /api/does-not-exist' },
    });
  });
});
