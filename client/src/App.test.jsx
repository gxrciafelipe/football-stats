import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
import { jsonResponse, zonesResponse } from './test/fixtures.js';

describe('App', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('loads the zones and draws the pitch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(zonesResponse())),
    );
    render(<App />);

    expect(screen.getByRole('status')).toHaveTextContent(/loading zones/i);
    expect(
      await screen.findByRole('heading', { name: /completed passes: leader/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Zone \d+/ })).toHaveLength(24);
    expect(screen.getByRole('note')).toHaveTextContent(/demo data/i);
  });

  it('shows the selected zone in the spotlight', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(zonesResponse())),
    );
    render(<App />);

    await userEvent.click(await screen.findByRole('button', { name: /^Zone 8:/ }));
    expect(screen.getByText(/leads with/)).toHaveTextContent('Alan Costa (Palmeiras, FWD)');
  });

  it('shows an error with a retry button when the API fails, and recovers', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValue(jsonResponse(zonesResponse()));
    vi.stubGlobal('fetch', fetchMock);
    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(await screen.findAllByRole('button', { name: /^Zone \d+/ })).toHaveLength(24);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
