/**
 * Always-visible notice that the dataset is simulated (requirement NFR-7, risk R2).
 */
export default function DemoBanner({ source }) {
  return (
    <aside className="demo-banner" role="note">
      <strong>Demo data.</strong> The 20 clubs are the real 2026 Série A teams, but players and
      numbers are simulated{source ? ` (source: ${source})` : ''}. Real match data can replace them
      later without changing the app.
    </aside>
  );
}
