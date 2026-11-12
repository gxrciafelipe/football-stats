import TeamBadge from './TeamBadge.jsx';
import { describeZone, formatNumber, percentOf } from '../utils/format.js';

/**
 * Details of the selected zone, under the pitch. Carried over from the
 * prototype's "Zone Spotlight"; the top-5 list arrives in Sprint 2 (FSB-12).
 */
export default function ZoneSpotlight({ zone, grid, metric }) {
  if (!zone) {
    return (
      <section className="spotlight" aria-live="polite">
        <h2>Zone spotlight</h2>
        <p className="muted">Select a zone on the pitch to see who dominates it.</p>
      </section>
    );
  }

  const where = describeZone(zone.col, zone.row, grid.cols, grid.rows);
  const { leader, total } = zone;

  return (
    <section className="spotlight" aria-live="polite">
      <h2>
        Zone {zone.zoneId + 1} <span className="muted">· {where}</span>
      </h2>
      {leader ? (
        <div className="spotlight__body">
          <TeamBadge team={leader.team} size={44} />
          <p>
            <strong>{leader.name}</strong> ({leader.team.name}, {leader.position}) leads with{' '}
            <strong>
              {formatNumber(leader.count)} {metric.unit}
            </strong>
            , {percentOf(leader.count, total)}% of the {formatNumber(total)}{' '}
            {metric.label.toLowerCase()} recorded in this zone.
          </p>
        </div>
      ) : (
        <p className="muted">No {metric.label.toLowerCase()} recorded in this zone.</p>
      )}
    </section>
  );
}
