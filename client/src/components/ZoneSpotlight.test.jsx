import { render, screen } from '@testing-library/react';
import ZoneSpotlight from './ZoneSpotlight.jsx';
import { zonesResponse } from '../test/fixtures.js';

const data = zonesResponse();

describe('ZoneSpotlight', () => {
  it('invites the user to pick a zone when none is selected', () => {
    render(<ZoneSpotlight zone={null} grid={data.grid} metric={data.metric} />);
    expect(screen.getByText(/select a zone/i)).toBeInTheDocument();
  });

  it("describes the zone and its leader's share", () => {
    render(<ZoneSpotlight zone={data.zones[0]} grid={data.grid} metric={data.metric} />);

    expect(screen.getByRole('heading')).toHaveTextContent('Zone 1 · Defensive third, left flank');
    expect(screen.getByText(/leads with/)).toHaveTextContent(
      'Bruno Lima (Flamengo, DEF) leads with 100 passes, 25% of the 400 completed passes recorded in this zone.',
    );
  });

  it('says when a zone has no data', () => {
    render(<ZoneSpotlight zone={data.zones[1]} grid={data.grid} metric={data.metric} />);
    expect(screen.getByText('No completed passes recorded in this zone.')).toBeInTheDocument();
  });
});
