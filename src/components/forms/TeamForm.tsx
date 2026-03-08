'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createTeam, updateTeam } from '@/server/actions/teams';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';

interface TeamFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    id?: string;
    name?: string | null;
    short_name?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    home_venue?: string | null;
  };
}

export function TeamForm({ mode, initialValues }: TeamFormProps) {
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
            const payload = {
              id: initialValues?.id,
              name: String(formData.get('name') ?? '').trim(),
              shortName: String(formData.get('shortName') ?? '') || null,
              primaryColor: String(formData.get('primaryColor') ?? '') || null,
              secondaryColor: String(formData.get('secondaryColor') ?? '') || null,
              homeVenue: String(formData.get('homeVenue') ?? '') || null,
            };

            if (mode === 'create') {
              const result = await createTeam(payload);
              setMessage(`Team created successfully. ID: ${result.id}`);
              event.currentTarget.reset();
            } else {
              await updateTeam(payload);
              setMessage('Team updated successfully.');
              router.refresh();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save team.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>{mode === 'create' ? 'Create team' : 'Edit team'}</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Manage the team name, colors, short name, and home venue.</p>
      </div>

      <div style={gridStyle}>
        <Field label="Team name"><input name="name" defaultValue={initialValues?.name ?? ''} required style={inputStyle} /></Field>
        <Field label="Short name"><input name="shortName" defaultValue={initialValues?.short_name ?? ''} style={inputStyle} /></Field>
        <Field label="Primary color"><input name="primaryColor" defaultValue={initialValues?.primary_color ?? ''} style={inputStyle} /></Field>
        <Field label="Secondary color"><input name="secondaryColor" defaultValue={initialValues?.secondary_color ?? ''} style={inputStyle} /></Field>
        <Field label="Home venue"><input name="homeVenue" defaultValue={initialValues?.home_venue ?? ''} style={inputStyle} /></Field>
      </div>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
          {pending ? 'Saving...' : mode === 'create' ? 'Create team' : 'Save changes'}
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => router.push('/teams')}>Back to teams</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label><span style={labelStyle}>{label}</span>{children}</label>;
}
