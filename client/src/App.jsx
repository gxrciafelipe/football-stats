import { useState } from 'react';
import Pitch from './components/Pitch.jsx';
import ZoneSpotlight from './components/ZoneSpotlight.jsx';
import DemoBanner from './components/DemoBanner.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import MetricSelector from './components/MetricSelector.jsx';
import { useZones } from './hooks/useZones.js';
import { useMetrics } from './hooks/useMetrics.js';

/** Grid size for the MVP; configurable grids arrive in Sprint 2 (FSB-18). */
const GRID = { cols: 6, rows: 4 };

/**
 * Root component: owns the page state (metric, selected zone) and composes the view.
 * Data fetching lives in hooks; the components below only render props.
 */
export default function App() {
  const [metric, setMetric] = useState('passes');
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const metrics = useMetrics();
  const { status, data, error, retry } = useZones({ metric, ...GRID });
  const updating = Boolean(data) && status === 'loading';

  const selectedZone = data?.zones.find((zone) => zone.zoneId === selectedZoneId) ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Brasileirão Action Zones</h1>
        <p className="tagline">Who owns each area of the pitch? Série A 2026, rounds 1–5.</p>
      </header>

      <main className="app-main">
        <DemoBanner source={data?.source} />

        <div className="toolbar">
          <MetricSelector metrics={metrics} value={metric} onChange={setMetric} />
          {updating && (
            <span className="updating" role="status">
              <span className="spinner" aria-hidden="true" /> Updating…
            </span>
          )}
        </div>

        {data && <h2 className="pitch-title">{data.metric.label}: leader in each zone</h2>}

        <StatusMessage status={data ? null : status} error={error} onRetry={retry} />

        {data && (
          <>
            <Pitch
              zones={data.zones}
              cols={data.grid.cols}
              rows={data.grid.rows}
              unit={data.metric.unit}
              selectedZoneId={selectedZoneId}
              onSelectZone={setSelectedZoneId}
              busy={updating}
            />
            <ZoneSpotlight zone={selectedZone} grid={data.grid} metric={data.metric} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Sprint 1 MVP · Built with React and Node.js ·{' '}
          <a href="https://github.com/gxrciafelipe/football-stats">Source on GitHub</a>
        </p>
      </footer>
    </div>
  );
}
