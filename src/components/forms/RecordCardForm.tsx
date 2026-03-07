'use client';

import { useMemo, useState, useTransition } from 'react';
import type { FormEvent } from 'react';
import { recordCardEvent } from '@/server/actions/cards';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, sectionTitleStyle } from '@/components/ui/styles';
import type { PlayerOption } from '@/server/queries/players';
import type { TeamOption } from '@/server/queries/teams';

export function RecordCardForm({
  matchId,
  teams,
  playersByTeam,
}: {
  matchId: string;
  teams: TeamOption[];
  playersByTeam: Record<string, PlayerOption[]>;
}) {
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const players = useMemo(() => playersByTeam[teamId] ?? [], [playersByTeam, teamId]);

  return (
    <form
      style={{ ...cardStyle, display: 'grid', gap: 16 }}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setError(null);
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            await recordCardEvent({
              matchId,
              teamId: String(formData.get('teamId') ?? ''),
              playerId: String(formData.get('playerId') ?? ''),
              cardType: String(formData.get('cardType') ?? 'yellow') as any,
              minute: Number(formData.get('minute') ?? 0),
              reason: String(formData.get('reason') ?? ''),
              refereeNote: String(formData.get('refereeNote') ?? '') || null,
            });
            setMessage('Card event saved successfully.');
            (event.target as HTMLFormElement).reset();
            setTeamId(teams[0]?.id ?? '');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save card event.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>Record card</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Referees can enter caution and sending-off details directly for their assigned matches.</p>
      </div>

      <div style={gridStyle}>
        <label>
          <span style={labelStyle}>Team</span>
          <select name="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} style={inputStyle}>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </label>
        <label>
          <span style={labelStyle}>Player</span>
          <select name="playerId" required style={inputStyle}>
            <option value="">Select player</option>
            {players.map((player) => <option key={player.id} value={player.id}>{player.full_name}</option>)}
          </select>
        </label>
        <label>
          <span style={labelStyle}>Card type</span>
          <select name="cardType" defaultValue="yellow" style={inputStyle}>
            <option value="yellow">Yellow</option>
            <option value="red">Red</option>
            <option value="second_yellow_red">Second yellow to red</option>
          </select>
        </label>
        <label>
          <span style={labelStyle}>Minute</span>
          <input name="minute" type="number" min={0} max={130} required style={inputStyle} />
        </label>
        <label>
          <span style={labelStyle}>Reason</span>
          <input name="reason" placeholder="Dissent" required style={inputStyle} />
        </label>
        <label>
          <span style={labelStyle}>Referee note</span>
          <input name="refereeNote" placeholder="Optional note" style={inputStyle} />
        </label>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? 'Saving...' : 'Save card event'}
      </button>
    </form>
  );
}
