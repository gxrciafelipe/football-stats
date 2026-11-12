import { useState } from 'react';
import Pitch from './components/Pitch.jsx';
import ZoneSpotlight from './components/ZoneSpotlight.jsx';
import DemoBanner from './components/DemoBanner.jsx';
import StatusMessage from './components/StatusMessage.jsx';
import { useZones } from './hooks/useZones.js';

/** Grid size for the MVP; configurable grids arrive in Sprint 2 (FSB-18). */
const GRID = { cols: 6, rows: 4 };

/**
 * Root component: owns the page state (selected zone) and composes the view.
 * Data fetching lives in the useZones hook; components below only render props.
 */
export default function App() {
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const { status, data, error, retry } = useZones({ metric: 'passes', ...GRID });

  const selectedZone = data?.zones.find((zone) => zone.zoneId === selectedZoneId) ?? null;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Brasileirão Action Zones</h1>
        <p className="tagline">Who owns each area of the pitch? Série A 2026, rounds 1–5.</p>
      </header>

      <main className="app-main">
        <DemoBanner source={data?.source} />

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
              busy={status === 'loading'}
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
