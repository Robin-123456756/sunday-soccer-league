'use client';

import { useState } from 'react';
import { buttonStyle, gridStyle, inputStyle, labelStyle, sectionTitleStyle, mutedTextStyle, secondaryButtonStyle } from '@/components/ui/styles';
import type { TeamOption } from '@/server/queries/teams';

export function ExportForm({ teams }: { teams: TeamOption[] }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleExport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const format = String(formData.get('format') ?? 'csv');
    const teamId = String(formData.get('teamId') ?? '');

    const params = new URLSearchParams();
    params.set('format', format);
    if (teamId) params.set('teamId', teamId);

    const url = `/api/exports?${params.toString()}`;

    setDownloading(true);

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => 'Export failed.');
          throw new Error(text || `Export failed with status ${res.status}`);
        }
        return res.blob();
      })
      .then((blob) => {
        const ext = format === 'xlsx' ? 'xlsx' : 'csv';
        const filename = `players-export.${ext}`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Export failed.');
      })
      .finally(() => {
        setDownloading(false);
      });
  }

  return (
    <form onSubmit={handleExport} style={{ display: 'grid', gap: 16 }}>
      <div>
        <h2 style={sectionTitleStyle}>Player export</h2>
        <p style={mutedTextStyle}>
          Download player details including team, jersey number, position, card counts, and appearances.
        </p>
      </div>

      <div style={gridStyle}>
        <label>
          <span style={labelStyle}>Team</span>
          <select name="teamId" defaultValue="" style={inputStyle}>
            <option value="">All teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>

        <label>
          <span style={labelStyle}>Format</span>
          <select name="format" defaultValue="csv" style={inputStyle}>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </label>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="submit"
          disabled={downloading}
          style={{ ...buttonStyle, opacity: downloading ? 0.7 : 1 }}
        >
          {downloading ? 'Generating...' : 'Download export'}
        </button>
        <button
          type="reset"
          style={{ ...secondaryButtonStyle }}
          onClick={() => setError(null)}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
