'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { submitRefereeReport } from '@/server/actions/referee-reports';
import { buttonStyle, cardStyle, inputStyle, labelStyle, sectionTitleStyle } from '@/components/ui/styles';

export function RefereeReportForm({
  matchId,
  refereeId,
  initialValues,
}: {
  matchId: string;
  refereeId: string;
  initialValues?: {
    general_comment?: string | null;
    time_management_observation?: string | null;
    dress_code_observation?: string | null;
    organization_observation?: string | null;
    conduct_observation?: string | null;
    incidents?: string | null;
  } | null;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
            await submitRefereeReport({
              matchId,
              refereeId,
              generalComment: String(formData.get('generalComment') ?? '') || null,
              timeManagementObservation: String(formData.get('timeManagementObservation') ?? '') || null,
              dressCodeObservation: String(formData.get('dressCodeObservation') ?? '') || null,
              organizationObservation: String(formData.get('organizationObservation') ?? '') || null,
              conductObservation: String(formData.get('conductObservation') ?? '') || null,
              incidents: String(formData.get('incidents') ?? '') || null,
            });
            setMessage('Referee report submitted successfully.');
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not submit report.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>Referee report</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Capture the full match report, including time management, dress code, and organization observations.</p>
      </div>

      <TextArea name="generalComment" label="General comment" defaultValue={initialValues?.general_comment ?? ''} />
      <TextArea name="timeManagementObservation" label="Time management observation" defaultValue={initialValues?.time_management_observation ?? ''} />
      <TextArea name="dressCodeObservation" label="Dress code observation" defaultValue={initialValues?.dress_code_observation ?? ''} />
      <TextArea name="organizationObservation" label="Organization observation" defaultValue={initialValues?.organization_observation ?? ''} />
      <TextArea name="conductObservation" label="Conduct observation" defaultValue={initialValues?.conduct_observation ?? ''} />
      <TextArea name="incidents" label="Additional incidents" defaultValue={initialValues?.incidents ?? ''} />

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? 'Saving...' : 'Submit report'}
      </button>
    </form>
  );
}

function TextArea({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      <textarea name={name} defaultValue={defaultValue} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
    </label>
  );
}
