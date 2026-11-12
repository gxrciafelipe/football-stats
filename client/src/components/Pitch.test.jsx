import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pitch from './Pitch.jsx';
import { zonesResponse } from '../test/fixtures.js';

function renderPitch(props = {}) {
  const data = zonesResponse();
  const onSelectZone = vi.fn();
  render(
    <Pitch
      zones={data.zones}
      cols={6}
      rows={4}
      unit="passes"
      selectedZoneId={null}
      onSelectZone={onSelectZone}
      {...props}
    />,
  );
  return { onSelectZone };
}

describe('Pitch', () => {
  it('renders one button per zone of the 6 × 4 grid', () => {
    renderPitch();
    expect(screen.getAllByRole('button', { name: /^Zone \d+/ })).toHaveLength(24);
  });

  it('shows the leader name, club badge and count in a zone', () => {
    renderPitch();
    const zone = screen.getByRole('button', { name: 'Zone 1: Bruno Lima, Flamengo, 100 passes' });
    expect(zone).toHaveTextContent('B. Lima');
    expect(zone).toHaveTextContent('FLA');
    expect(zone).toHaveTextContent('100');
  });

  it('shows "No data" in empty zones', () => {
    renderPitch();
    expect(screen.getByRole('button', { name: 'Zone 2: no data' })).toHaveTextContent('No data');
    expect(screen.getAllByText('No data')).toHaveLength(22);
  });

  it('reports the clicked zone and marks the selected one', async () => {
    const { onSelectZone } = renderPitch({ selectedZoneId: 7 });

    await userEvent.click(screen.getByRole('button', { name: /^Zone 1:/ }));
    expect(onSelectZone).toHaveBeenCalledWith(0);
    expect(screen.getByRole('button', { name: /^Zone 8:/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('can be used with the keyboard', async () => {
    const { onSelectZone } = renderPitch();

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    expect(onSelectZone).toHaveBeenCalledWith(0);
  });
});
