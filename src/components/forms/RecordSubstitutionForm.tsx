'use client';

import { useMemo, useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { recordSubstitution } from '@/server/actions/substitutions';
import { deleteSubstitution } from '@/server/actions/substitutions';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, sectionTitleStyle, mutedTextStyle, secondaryButtonStyle } from '@/components/ui/styles';
import type { PlayerOption } from '@/server/queries/players';
import type { TeamOption } from '@/server/queries/teams';
import type { MatchSubstitutionRow } from '@/server/queries/matches';

export function RecordSubstitutionForm({
  matchId,
  teams,
  playersByTeam,
  existingSubstitutions,
}: {
  matchId: string;
  teams: TeamOption[];
  playersByTeam: Record<string, PlayerOption[]>;
  existingSubstitutions: MatchSubstitutionRow[];
}) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const players = useMemo(() => playersByTeam[teamId] ?? [], [playersByTeam, teamId]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;

    startTransition(async () => {
      try {
        await recordSubstitution({
          matchId,
          teamId: String(formData.get('teamId') ?? ''),
          playerOffId: String(formData.get('playerOffId') ?? ''),
          playerOnId: String(formData.get('playerOnId') ?? ''),
          minute: Number(formData.get('minute') ?? 0),
          reason: String(formData.get('reason') ?? '') || null,
        });
        setMessage('Substitution recorded.');
        form.reset();
        setTeamId(teams[0]?.id ?? '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save substitution.');
      }
    });
  }

  function handleDelete(subId: string) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      try {
        await deleteSubstitution(subId, matchId);
        setMessage('Substitution removed.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not remove substitution.');
      }
    });
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Existing substitutions */}
      <div style={cardStyle}>
        <h2 style={sectionTitleStyle}>Substitutions made</h2>
        {existingSubstitutions.length === 0 ? (
          <p style={mutedTextStyle}>No substitutions recorded yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {existingSubstitutions.map((sub) => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 10 }}>
                <div>
                  <strong>{sub.minute}&apos;</strong>{' '}
                  <span style={{ color: '#b91c1c' }}>{sub.player_off?.full_name ?? 'Unknown'}</span>
                  {" \u2192 "}
                  <span style={{ color: '#047857' }}>{sub.player_on?.full_name ?? 'Unknown'}</span>
                  <p style={{ ...mutedTextStyle, marginTop: 4, fontSize: 13 }}>
                    {sub.team?.name ?? 'Unknown team'}
                    {sub.reason ? ` {"\u00b7"}${sub.reason}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => handleDelete(sub.id)}
                  style={{ ...secondaryButtonStyle, fontSize: 12, padding: '6px 12px', color: '#b91c1c', borderColor: '#fca5a5' }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record new substitution */}
      <form onSubmit={handleSubmit} style={{ ...cardStyle, display: 'grid', gap: 16 }}>
        <div>
          <h2 style={sectionTitleStyle}>Record substitution</h2>
          <p style={{ margin: 0, color: '#4b5563' }}>
            No limit on substitutions. Players who were subbed off can re-enter later.
          </p>
        </div>

        <div style={gridStyle}>
          <label>
            <span style={labelStyle}>Team</span>
            <select name="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} style={inputStyle}>
              {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </label>
          <label>
            <span style={labelStyle}>Player off</span>
            <select name="playerOffId" required style={inputStyle}>
              <option value="">Select player coming off</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.full_name}{player.jersey_number != null ? ` (#${player.jersey_number})` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span style={labelStyle}>Player on</span>
            <select name="playerOnId" required style={inputStyle}>
              <option value="">Select player coming on</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.full_name}{player.jersey_number != null ? ` (#${player.jersey_number})` : ''}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span style={labelStyle}>Minute</span>
            <input name="minute" type="number" min={0} max={130} required style={inputStyle} />
          </label>
          <label>
            <span style={labelStyle}>Reason</span>
            <select name="reason" style={inputStyle}>
              <option value="">None</option>
              <option value="tactical">Tactical</option>
              <option value="injury">Injury</option>
              <option value="fatigue">Fatigue</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

        <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
          {pending ? 'Saving...' : 'Save substitution'}
        </button>
      </form>
    </div>
  );
}
