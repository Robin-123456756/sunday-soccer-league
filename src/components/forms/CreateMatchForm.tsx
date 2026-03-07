'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { createMatch } from '@/server/actions/matches';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, sectionTitleStyle } from '@/components/ui/styles';

interface Option {
  id: string;
  name: string;
}

interface RefereeOption {
  id: string;
  full_name: string;
}

export function CreateMatchForm({ teams, referees }: { teams: Option[]; referees: RefereeOption[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
            const result = await createMatch(formData);
            if (result.error) {
              setError(result.error);
              return;
            }
            setMessage('Match created successfully.');
            (event.target as HTMLFormElement).reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not create match.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>Create match</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Set up a fixture with teams, referee, venue, and jersey colors.</p>
      </div>

      <div style={gridStyle}>
        <Field label="Match date"><input name="matchDate" type="date" required style={inputStyle} /></Field>
        <Field label="Kickoff time"><input name="kickoffTime" type="time" style={inputStyle} /></Field>
        <Field label="Venue"><input name="venueId" placeholder="Venue ID (optional)" style={inputStyle} /></Field>
        <Field label="Status">
          <select name="status" defaultValue="scheduled" style={inputStyle}>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
          </select>
        </Field>
        <Field label="Home team">
          <select name="homeTeamId" required style={inputStyle}>
            <option value="">Select team</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </Field>
        <Field label="Away team">
          <select name="awayTeamId" required style={inputStyle}>
            <option value="">Select team</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </Field>
        <Field label="Home jersey color"><input name="homeJerseyColor" placeholder="Blue" style={inputStyle} /></Field>
        <Field label="Away jersey color"><input name="awayJerseyColor" placeholder="White" style={inputStyle} /></Field>
        <Field label="Referee">
          <select name="refereeId" style={inputStyle}>
            <option value="">Assign later</option>
            {referees.map((referee) => <option key={referee.id} value={referee.id}>{referee.full_name}</option>)}
          </select>
        </Field>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? 'Saving...' : 'Create match'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      {children}
    </label>
  );
}
