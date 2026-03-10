'use client';

import { useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { updateMatchScore } from '@/server/actions/matches';
import { buttonStyle, cardStyle, inputStyle, labelStyle, sectionTitleStyle, mutedTextStyle } from '@/components/ui/styles';

export function RecordScoreForm({
  matchId,
  homeTeamName,
  awayTeamName,
  initialHomeScore,
  initialAwayScore,
  currentStatus,
}: {
  matchId: string;
  homeTeamName: string;
  awayTeamName: string;
  initialHomeScore: number | null;
  initialAwayScore: number | null;
  currentStatus: string;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const homeRaw = String(formData.get('homeScore') ?? '').trim();
    const awayRaw = String(formData.get('awayScore') ?? '').trim();
    const markCompleted = formData.get('markCompleted') === 'on';

    startTransition(async () => {
      try {
        await updateMatchScore({
          matchId,
          homeScore: homeRaw !== '' ? Number(homeRaw) : null,
          awayScore: awayRaw !== '' ? Number(awayRaw) : null,
          status: markCompleted ? 'completed' : undefined,
        });
        setMessage(markCompleted ? 'Score saved and match marked as completed.' : 'Score updated.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update score.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...cardStyle, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={sectionTitleStyle}>Match score</h2>
        <p style={mutedTextStyle}>Enter or update the result. Optionally mark the match as completed.</p>
      </div>

      <div className="score-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'end' }}>
        <label>
          <span style={labelStyle}>{homeTeamName}</span>
          <input
            name="homeScore"
            type="number"
            min={0}
            defaultValue={initialHomeScore ?? ''}
            placeholder="0"
            style={{ ...inputStyle, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: '12px 8px' }}
          />
        </label>
        <span style={{ fontSize: 24, fontWeight: 700, paddingBottom: 12 }}>{"\u2013"}</span>
        <label>
          <span style={labelStyle}>{awayTeamName}</span>
          <input
            name="awayScore"
            type="number"
            min={0}
            defaultValue={initialAwayScore ?? ''}
            placeholder="0"
            style={{ ...inputStyle, textAlign: 'center', fontSize: 24, fontWeight: 700, padding: '12px 8px' }}
          />
        </label>
      </div>

      {currentStatus !== 'completed' ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input name="markCompleted" type="checkbox" />
          <span style={{ fontSize: 14 }}>Mark match as completed (full time)</span>
        </label>
      ) : (
        <p style={{ ...mutedTextStyle, fontSize: 13 }}>This match is already marked as completed.</p>
      )}

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? 'Saving...' : 'Save score'}
      </button>
    </form>
  );
}
