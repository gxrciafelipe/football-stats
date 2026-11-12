import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeedStore } from '../src/data/seedStore.js';

const store = loadSeedStore();

describe('serving the React build', () => {
  let clientDir;

  beforeAll(() => {
    // A fake build folder with an index page and one hashed asset
    clientDir = mkdtempSync(join(tmpdir(), 'client-dist-'));
    mkdirSync(join(clientDir, 'assets'));
    writeFileSync(join(clientDir, 'index.html'), '<!doctype html><title>Action Zones</title>');
    writeFileSync(join(clientDir, 'assets', 'app-123.js'), 'console.log("app")');
  });
  afterAll(() => rmSync(clientDir, { recursive: true, force: true }));

  const app = () => createApp({ store, clientDir });

  it('serves index.html at the root', async () => {
    const res = await request(app()).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>Action Zones</title>');
  });

  it('serves hashed assets with long-lived caching', async () => {
    const res = await request(app()).get('/assets/app-123.js');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toMatch(/immutable/);
  });

  it('answers a missing asset with 404, not the app page', async () => {
    const res = await request(app()).get('/assets/missing.js');
    expect(res.status).toBe(404);
  });

  it('falls back to index.html for client-side routes', async () => {
    const res = await request(app()).get('/zones/7');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Action Zones');
  });

  it('only falls back to the app page for GET requests', async () => {
    const res = await request(app()).post('/zones/7');
    expect(res.status).toBe(404);
  });

  it('keeps unknown API routes as JSON 404s', async () => {
    const res = await request(app()).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('does not serve the client when no build exists', async () => {
    const res = await request(createApp({ store, clientDir: join(clientDir, 'nope') })).get('/');
    expect(res.status).toBe(404);
  });
});
