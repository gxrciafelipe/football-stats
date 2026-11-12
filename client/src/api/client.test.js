import { vi } from 'vitest';
import { apiGet, ApiRequestError, zonesPath } from './client.js';
import { jsonResponse } from '../test/fixtures.js';

describe('apiGet', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the parsed JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ status: 'ok' })),
    );
    await expect(apiGet('/api/health')).resolves.toEqual({ status: 'ok' });
    expect(fetch).toHaveBeenCalledWith('/api/health', expect.any(Object));
  });

  it('turns an API error into an ApiRequestError with its code and message', async () => {
    const body = { error: { code: 'INVALID_METRIC', message: 'Unknown metric "x".' } };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(body, 400)),
    );

    const error = await apiGet('/api/zones?metric=x').catch((e) => e);
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error).toMatchObject({
      status: 400,
      code: 'INVALID_METRIC',
      message: 'Unknown metric "x".',
    });
  });

  it('reports a friendly message when the server is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))),
    );

    const error = await apiGet('/api/zones').catch((e) => e);
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toMatch(/could not reach the server/i);
  });

  it('handles error pages that are not JSON', async () => {
    const htmlPage = {
      ok: false,
      status: 502,
      json: async () => Promise.reject(new SyntaxError()),
    };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => htmlPage),
    );

    const error = await apiGet('/api/zones').catch((e) => e);
    expect(error).toMatchObject({
      status: 502,
      code: 'HTTP_ERROR',
      message: 'Request failed (502).',
    });
  });

  it('rejects a successful response without a JSON body', async () => {
    const empty = { ok: true, status: 200, json: async () => Promise.reject(new SyntaxError()) };
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => empty),
    );

    await expect(apiGet('/api/zones')).rejects.toMatchObject({ code: 'BAD_RESPONSE' });
  });

  it('lets aborted requests through untouched', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(abort)),
    );

    await expect(apiGet('/api/zones')).rejects.toBe(abort);
  });
});

describe('zonesPath', () => {
  it('builds the zones URL with query parameters', () => {
    expect(zonesPath({ metric: 'shots', cols: 6, rows: 4 })).toBe(
      '/api/zones?metric=shots&cols=6&rows=4',
    );
  });
});
