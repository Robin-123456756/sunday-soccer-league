'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createReferee, updateReferee } from '@/server/actions/referees';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';

interface RefereeFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    id?: string;
    full_name?: string;
    phone?: string | null;
    email?: string | null;
    level?: string | null;
    is_active?: boolean;
  };
}

export function RefereeForm({ mode, initialValues }: RefereeFormProps) {
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
              fullName: String(formData.get('fullName') ?? '').trim(),
              phone: String(formData.get('phone') ?? '') || null,
              email: String(formData.get('email') ?? '') || null,
              level: String(formData.get('level') ?? '') || null,
              isActive: String(formData.get('isActive') ?? 'true') === 'true',
            };
            if (mode === 'create') {
              const result = await createReferee(payload);
              setMessage(`Referee created successfully. ID: ${result.id}`);
              event.currentTarget.reset();
            } else {
              await updateReferee(payload);
              setMessage('Referee updated successfully.');
              router.refresh();
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not save referee.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>{mode === 'create' ? 'Create referee' : 'Edit referee'}</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Keep referee contact details and availability status current.</p>
      </div>

      <div style={gridStyle}>
        <Field label="Full name"><input name="fullName" defaultValue={initialValues?.full_name ?? ''} required style={inputStyle} /></Field>
        <Field label="Phone"><input name="phone" defaultValue={initialValues?.phone ?? ''} style={inputStyle} /></Field>
        <Field label="Email"><input name="email" type="email" defaultValue={initialValues?.email ?? ''} style={inputStyle} /></Field>
        <Field label="Level"><input name="level" defaultValue={initialValues?.level ?? ''} placeholder="Center Referee" style={inputStyle} /></Field>
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
          {pending ? 'Saving...' : mode === 'create' ? 'Create referee' : 'Save changes'}
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={() => router.push('/referees')}>Back to referees</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label><span style={labelStyle}>{label}</span>{children}</label>;
}
