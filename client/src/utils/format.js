/** Small presentation helpers shared by components. */

/** "Bruno Lima Souza" -> "B. Souza": fits inside small zones. */
export function shortName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0][0]}. ${parts.at(-1)}`;
}

/** 3273 -> "3,273" */
export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

/** Share of a total as a whole percentage; 0 when the total is 0. */
export function percentOf(part, total) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

const THIRDS = ['Defensive third', 'Middle third', 'Attacking third'];
const LANES = ['left flank', 'left centre', 'right centre', 'right flank'];

/**
 * Describes where a zone sits on the pitch in football terms,
 * e.g. column 5 of 6, row 0 of 4 -> "Attacking third, left flank".
 */
export function describeZone(col, row, cols, rows) {
  const third = THIRDS[Math.min(Math.floor(((col + 0.5) / cols) * 3), 2)];
  const lane = LANES[Math.min(Math.floor(((row + 0.5) / rows) * 4), 3)];
  return `${third}, ${lane}`;
}
