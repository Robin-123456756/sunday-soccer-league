'use client';

import { useMemo, useState, useTransition } from 'react';
import { saveMatchLineup } from '@/server/actions/lineups';
import { buttonStyle, cardStyle, inputStyle, labelStyle, sectionTitleStyle, secondaryButtonStyle } from '@/components/ui/styles';
import type { PlayerOption } from '@/server/queries/players';

export function SaveLineupForm({
  matchId,
  teamId,
  teamName,
  players,
  initialStarterIds,
  initialBenchIds,
  initialCaptainId,
}: {
  matchId: string;
  teamId: string;
  teamName: string;
  players: PlayerOption[];
  initialStarterIds: string[];
  initialBenchIds: string[];
  initialCaptainId?: string | null;
}) {
  const [selectedStarters, setSelectedStarters] = useState<string[]>(initialStarterIds);
  const [selectedBench, setSelectedBench] = useState<string[]>(initialBenchIds);
  const [captainPlayerId, setCaptainPlayerId] = useState<string>(initialCaptainId ?? '');
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableCaptainOptions = useMemo(
    () => players.filter((player) => selectedStarters.includes(player.id)),
    [players, selectedStarters]
  );

  const togglePlayer = (playerId: string, type: 'starter' | 'bench') => {
    setMessage(null);
    setError(null);
    if (type === 'starter') {
      setSelectedStarters((current) => {
        const next = current.includes(playerId) ? current.filter((id) => id !== playerId) : [...current, playerId];
        setSelectedBench((bench) => bench.filter((id) => id !== playerId));
        if (!next.includes(captainPlayerId)) setCaptainPlayerId('');
        return next;
      });
      return;
    }

    setSelectedBench((current) => {
      const next = current.includes(playerId) ? current.filter((id) => id !== playerId) : [...current, playerId];
      setSelectedStarters((starters) => starters.filter((id) => id !== playerId));
      if (captainPlayerId === playerId) setCaptainPlayerId('');
      return next;
    });
  };

  return (
    <div style={{ ...cardStyle, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={sectionTitleStyle}>{teamName} lineup</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Choose starters, bench players, and the captain for this match.</p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {players.map((player) => {
          const descriptor = [player.position, player.jersey_number ? `#${player.jersey_number}` : null].filter(Boolean).join(" \u00b7 ");
          return (
            <div key={player.id} style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{player.full_name}</div>
              <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{descriptor || 'No player metadata'}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedStarters.includes(player.id)}
                    onChange={() => togglePlayer(player.id, 'starter')}
                  />
                  Starter
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedBench.includes(player.id)}
                    onChange={() => togglePlayer(player.id, 'bench')}
                  />
                  Bench
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <label>
        <span style={labelStyle}>Captain</span>
        <select value={captainPlayerId} onChange={(e) => setCaptainPlayerId(e.target.value)} style={inputStyle}>
          <option value="">Select captain from starters</option>
          {availableCaptainOptions.map((player) => (
            <option key={player.id} value={player.id}>{player.full_name}</option>
          ))}
        </select>
      </label>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', color: '#4b5563', fontSize: 14 }}>
        <span>Starters: {selectedStarters.length}</span>
        <span>Bench: {selectedBench.length}</span>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={pending}
          style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}
          onClick={() => {
            startTransition(async () => {
              try {
                await saveMatchLineup({
                  matchId,
                  teamId,
                  starterIds: selectedStarters,
                  benchIds: selectedBench,
                  captainPlayerId: captainPlayerId || null,
                });
                setMessage('Lineup saved successfully.');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Could not save lineup.');
              }
            });
          }}
        >
          {pending ? 'Saving...' : 'Save lineup'}
        </button>
        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => {
            setSelectedStarters(initialStarterIds);
            setSelectedBench(initialBenchIds);
            setCaptainPlayerId(initialCaptainId ?? '');
            setMessage(null);
            setError(null);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
