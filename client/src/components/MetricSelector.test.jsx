import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MetricSelector from './MetricSelector.jsx';
import { DEFAULT_METRICS } from '../hooks/useMetrics.js';

describe('MetricSelector', () => {
  it('lists every metric and marks the selected one', () => {
    render(<MetricSelector metrics={DEFAULT_METRICS} value="passes" onChange={() => {}} />);

    expect(screen.getAllByRole('radio')).toHaveLength(2);
    expect(screen.getByRole('radio', { name: 'Completed passes' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Shots' })).not.toBeChecked();
  });

  it('reports the chosen metric', async () => {
    const onChange = vi.fn();
    render(<MetricSelector metrics={DEFAULT_METRICS} value="passes" onChange={onChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Shots' }));
    expect(onChange).toHaveBeenCalledWith('shots');
  });
});
