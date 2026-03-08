'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPlayer, updatePlayer } from '@/server/actions/players';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';

interface TeamOption { id: string; name: string }

interface PlayerFormProps {
  mode: 'create' | 'edit';
  teams: TeamOption[];
  initialValues?: {
    id?: string;
    team_id?: string;
    full_name?: string;
    jersey_number?: number | null;
    position?: string | null;
    registration_number?: string | null;
    is_active?: boolean;
  };
}

export function PlayerForm({ mode, teams, initialValues }: PlayerFormProps) {
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
            const jerseyRaw = String(formData.get('jerseyNumber') ?? '').trim();
            const payload = {
              id: initialValues?.id,
              teamId: String(formData.get('teamId') ?? ''),
              fullName: String(formData.get('fullName') ?? '').trim(),
              jerseyNumber: jerseyRaw ? Number(jerseyRaw) : null,
              position: String(formData.get('position') ?? '') || null,
              registrationNumber: String(formData.get('registrationNumber') ?? '') || null,
              isActive: String(formData.get('isActive') ?? 'true') === 'true',
            };
            if (mode === 'create') {
              const result = await createPlayer(payload);
              setMessage(`Player created successfully. ID: ${result.id}`);
              event.currentTarget.reset();
            } else {
              await updatePlayer(payload);
              setMessage('Player updated successfully.');
              router.refresh();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save player.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>{mode === 'create' ? 'Create player' : 'Edit player'}</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Assign the player to a team and maintain registration details.</p>
      </div>

      <div style={gridStyle}>
        <Field label="Team">
          <select name="teamId" defaultValue={initialValues?.team_id ?? ''} required style={inputStyle}>
            <option value="">Select team</option>
            {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
          </select>
        </Field>
        <Field label="Full name"><input name="fullName" defaultValue={initialValues?.full_name ?? ''} required style={inputStyle} /></Field>
        <Field label="Jersey number"><input name="jerseyNumber" type="number" min="0" defaultValue={initialValues?.jersey_number ?? ''} style={inputStyle} /></Field>
        <Field label="Position"><input name="position" defaultValue={initialValues?.position ?? ''} placeholder="Defender" style={inputStyle} /></Field>
        <Field label="Registration number"><input name="registrationNumber" defaultValue={initialValues?.registration_number ?? ''} style={inputStyle} /></Field>
        <Field label="Status">
          <select name="isActive" defaultValue={String(initialValues?.is_active ?? true)} style={inputStyle}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
          {pending ? 'Saving...' : mode === 'create' ? 'Create player' : 'Save changes'}
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => router.push('/players')}>Back to players</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label><span style={labelStyle}>{label}</span>{children}</label>;
}
