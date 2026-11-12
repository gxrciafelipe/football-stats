import PitchMarkings from './PitchMarkings.jsx';
import ZoneCell from './ZoneCell.jsx';
import './Pitch.css';

/**
 * The football pitch with its zone grid laid on top.
 * Purely presentational: it receives zones from the parent and reports clicks back up.
 */
export default function Pitch({ zones, cols, rows, unit, selectedZoneId, onSelectZone, busy }) {
  return (
    <figure className="pitch-figure">
      <div className={`pitch${busy ? ' pitch--busy' : ''}`} aria-busy={busy}>
        <PitchMarkings />
        <div
          className="pitch__grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {zones.map((zone) => (
            <ZoneCell
              key={zone.zoneId}
              zone={zone}
              unit={unit}
              selected={zone.zoneId === selectedZoneId}
              onSelect={onSelectZone}
            />
          ))}
        </div>
      </div>
      <figcaption className="pitch__caption">
        <span>Own goal</span>
        <span className="pitch__direction">Attacking direction →</span>
        <span>Opponent goal</span>
      </figcaption>
    </figure>
  );
}
