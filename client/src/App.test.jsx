import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { jsonResponse, zonesResponse } from './test/fixtures.js';
import { DEFAULT_METRICS } from './hooks/useMetrics.js';

/**
 * Fake API: answers /api/metrics and /api/zones like the real server.
 * `failZones` makes the first zones request fail as if the network were down.
 */
function mockApi({ failZones = false } = {}) {
  let zoneCalls = 0;
  const fetchMock = vi.fn(async (url) => {
    const { pathname, searchParams } = new URL(url, 'http://localhost');
    if (pathname === '/api/metrics') return jsonResponse({ metrics: DEFAULT_METRICS });
    zoneCalls += 1;
    if (failZones && zoneCalls === 1) throw new TypeError('Failed to fetch');
    return jsonResponse(zonesResponse({ metric: searchParams.get('metric') }));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const zoneButtons = () => screen.findAllByRole('button', { name: /^Zone \d+/ });

describe('App', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads the zones and draws the pitch', async () => {
    mockApi();
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent(/loading zones/i);
    expect(
      await screen.findByRole('heading', { name: /completed passes: leader/i }),
    ).toBeInTheDocument();
    expect(await zoneButtons()).toHaveLength(24);
    expect(screen.getByRole('note')).toHaveTextContent(/demo data/i);
  });

  it('shows the selected zone in the spotlight', async () => {
    mockApi();
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: /^Zone 8:/ }));
    expect(screen.getByText(/leads with/)).toHaveTextContent('Alan Costa (Palmeiras, FWD)');
  });

  it('switches metric without reloading the page', async () => {
    const fetchMock = mockApi();
    render(<App />);
    await screen.findByRole('heading', { name: /completed passes: leader/i });

    await userEvent.click(screen.getByRole('radio', { name: 'Shots' }));

    expect(await screen.findByRole('heading', { name: /shots: leader/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Zone 8:/ })).toHaveAccessibleName(
      'Zone 8: Caio Dias, Palmeiras, 9 shots',
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/zones?metric=shots&cols=6&rows=4',
      expect.any(Object),
    );
  });

  it('shows an error with a retry button when the API fails, and recovers', async () => {
    mockApi({ failZones: true });
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await zoneButtons()).toHaveLength(24);
  });
});
