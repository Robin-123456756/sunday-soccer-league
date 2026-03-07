export default function ExportsPage() {
  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Exports</h1>
      <p>Generate CSV or Excel files for player details and other league reports.</p>

      <section style={{ marginTop: 24, border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h2>Export Filters</h2>
        <ul>
          <li>Team</li>
          <li>Player</li>
          <li>Season</li>
          <li>Matchday</li>
          <li>Date range</li>
          <li>Card type</li>
        </ul>
      </section>

      <section style={{ marginTop: 24, border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h2>Formats</h2>
        <p>CSV and Excel (.xlsx)</p>
      </section>
    </main>
  );
}
