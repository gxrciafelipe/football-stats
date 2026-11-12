/**
 * Round club badge drawn from the club's colours and 3-letter code.
 * Used instead of official crests, which are trademarks and break when hot-linked (risk R6).
 */
export default function TeamBadge({ team, size = 28 }) {
  return (
    <span
      className="team-badge"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.34,
        background: team.primary,
        color: team.secondary,
        borderColor: team.secondary,
      }}
      title={team.name}
      aria-hidden="true"
    >
      {team.code}
    </span>
  );
}
