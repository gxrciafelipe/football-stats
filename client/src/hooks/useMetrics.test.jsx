import { vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { DEFAULT_METRICS, useMetrics } from './useMetrics.js';
import { jsonResponse } from '../test/fixtures.js';

describe('useMetrics', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('replaces the defaults with the metrics the API offers', async () => {
    const metrics = [...DEFAULT_METRICS, { id: 'tackles', label: 'Tackles', unit: 'tackles' }];
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ metrics })),
    );

    const { result } = renderHook(() => useMetrics());
    expect(result.current).toEqual(DEFAULT_METRICS);
    await waitFor(() => expect(result.current).toHaveLength(3));
  });

  it('keeps the defaults when the API is down', async () => {
    const fetchMock = vi.fn(async () => Promise.reject(new TypeError('Failed to fetch')));
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useMetrics());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(result.current).toEqual(DEFAULT_METRICS);
  });
});
