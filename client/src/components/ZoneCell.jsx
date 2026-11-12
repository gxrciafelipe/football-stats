import TeamBadge from './TeamBadge.jsx';
import { formatNumber, shortName } from '../utils/format.js';

/**
 * One zone of the pitch grid: the leading player's badge, name and count,
 * or "No data" when nobody recorded that action there.
 * Rendered as a button so it works with mouse, touch and keyboard (Enter/Space).
 */
export default function ZoneCell({ zone, unit, selected, onSelect }) {
  const { leader } = zone;
  const label = leader
    ? `Zone ${zone.zoneId + 1}: ${leader.name}, ${leader.team.name}, ${leader.count} ${unit}`
    : `Zone ${zone.zoneId + 1}: no data`;

  return (
    <button
      type="button"
      className={`zone${selected ? ' zone--selected' : ''}${leader ? '' : ' zone--empty'}`}
      aria-label={label}
      aria-pressed={selected}
      onClick={() => onSelect(zone.zoneId)}
    >
      {leader ? (
        <>
          <TeamBadge team={leader.team} />
          <span className="zone__name">{shortName(leader.name)}</span>
          <span className="zone__count">{formatNumber(leader.count)}</span>
        </>
      ) : (
        <span className="zone__empty">No data</span>
      )}
    </button>
  );
}
