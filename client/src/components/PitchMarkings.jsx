/**
 * Field markings drawn to scale on a 105 × 68 m pitch. The SVG viewBox uses metres,
 * so every line sits where it would on a real pitch, at any screen size.
 */
export default function PitchMarkings() {
  return (
    <svg className="pitch__markings" viewBox="0 0 105 68" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="0.35" vectorEffect="non-scaling-stroke">
        <rect x="0.2" y="0.2" width="104.6" height="67.6" />
        <line x1="52.5" y1="0" x2="52.5" y2="68" />
        <circle cx="52.5" cy="34" r="9.15" />
        {/* Penalty areas (16.5 m deep, 40.3 m wide) and goal areas (5.5 m × 18.3 m) */}
        <rect x="0" y="13.84" width="16.5" height="40.32" />
        <rect x="88.5" y="13.84" width="16.5" height="40.32" />
        <rect x="0" y="24.84" width="5.5" height="18.32" />
        <rect x="99.5" y="24.84" width="5.5" height="18.32" />
        {/* Penalty arcs: the part of a 9.15 m circle around the spot outside the box */}
        <path d="M 16.5 26.69 A 9.15 9.15 0 0 1 16.5 41.31" />
        <path d="M 88.5 26.69 A 9.15 9.15 0 0 0 88.5 41.31" />
      </g>
      <g fill="currentColor">
        <circle cx="52.5" cy="34" r="0.5" />
        <circle cx="11" cy="34" r="0.4" />
        <circle cx="94" cy="34" r="0.4" />
      </g>
    </svg>
  );
}
