'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateMatch } from '@/server/actions/matches';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';

interface TeamOption { id: string; name: string }
interface RefereeOption { id: string; full_name: string }

export function EditMatchForm({
  match,
  teams,
  referees,
}: {
  match: {
    id: string;
    match_date: string;
    kickoff_time: string | null;
    venue: string | null;
    home_team_id: string;
    away_team_id: string;
    home_jersey_color: string | null;
    away_jersey_color: string | null;
    referee_id: string | null;
    status: 'scheduled' | 'in_progress' | 'completed' | 'postponed';
    home_score: number | null;
    away_score: number | null;
  };
  teams: TeamOption[];
  referees: RefereeOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      style={{ ...cardStyle, display: 'grid', gap: 16 }}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            const homeScoreRaw = String(formData.get('homeScore') ?? '').trim();
            const awayScoreRaw = String(formData.get('awayScore') ?? '').trim();
            await updateMatch({
              matchId: match.id,
              matchDate: String(formData.get('matchDate') ?? ''),
              kickoffTime: String(formData.get('kickoffTime') ?? '') || null,
              venue: String(formData.get('venue') ?? '') || null,
              homeTeamId: String(formData.get('homeTeamId') ?? ''),
              awayTeamId: String(formData.get('awayTeamId') ?? ''),
              homeJerseyColor: String(formData.get('homeJerseyColor') ?? '') || null,
              awayJerseyColor: String(formData.get('awayJerseyColor') ?? '') || null,
              refereeId: String(formData.get('refereeId') ?? '') || null,
              status: String(formData.get('status') ?? 'scheduled') as 'scheduled' | 'in_progress' | 'completed' | 'postponed',
              homeScore: homeScoreRaw ? Number(homeScoreRaw) : null,
              awayScore: awayScoreRaw ? Number(awayScoreRaw) : null,
            });
            setMessage('Match updated successfully.');
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not update match.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>Edit match and result</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Update fixture details, scores, status, referee assignment, and jersey colors.</p>
      </div>

      <div style={gridStyle}>
        <Field label="Match date"><input name="matchDate" type="date" defaultValue={match.match_date} required style={inputStyle} /></Field>
        <Field label="Kickoff time"><input name="kickoffTime" type="time" defaultValue={match.kickoff_time ?? ''} style={inputStyle} /></Field>
        <Field label="Venue"><input name="venue" defaultValue={match.venue ?? ''} style={inputStyle} /></Field>
        <Field label="Status">
          <select name="status" defaultValue={match.status} style={inputStyle}>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
          </select>
        </Field>
        <Field label="Home team">
          <select name="homeTeamId" defaultValue={match.home_team_id} required style={inputStyle}>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </Field>
        <Field label="Away team">
          <select name="awayTeamId" defaultValue={match.away_team_id} required style={inputStyle}>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </Field>
        <Field label="Home jersey color"><input name="homeJerseyColor" defaultValue={match.home_jersey_color ?? ''} style={inputStyle} /></Field>
        <Field label="Away jersey color"><input name="awayJerseyColor" defaultValue={match.away_jersey_color ?? ''} style={inputStyle} /></Field>
        <Field label="Referee">
          <select name="refereeId" defaultValue={match.referee_id ?? ''} style={inputStyle}>
            <option value="">Assign later</option>
            {referees.map((referee) => <option key={referee.id} value={referee.id}>{referee.full_name}</option>)}
          </select>
        </Field>
        <Field label="Home score"><input name="homeScore" type="number" min="0" defaultValue={match.home_score ?? ''} style={inputStyle} /></Field>
        <Field label="Away score"><input name="awayScore" type="number" min="0" defaultValue={match.away_score ?? ''} style={inputStyle} /></Field>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
          {pending ? 'Saving...' : 'Save match'}
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => router.push(`/matches/${match.id}`)}>Back to overview</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label><span style={labelStyle}>{label}</span>{children}</label>;
}
