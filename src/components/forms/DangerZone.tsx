'use client';

import { useTransition, useState } from 'react';
import { buttonStyle, cardStyle, mutedTextStyle } from '@/components/ui/styles';

export function DangerZone({
  title,
  description,
  actionLabel,
  action,
}: {
  title: string;
  description: string;
  actionLabel: string;
  action: () => Promise<any>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ ...cardStyle, borderColor: '#fecaca', display: 'grid', gap: 12 }}>
      <div>
        <strong style={{ color: '#991b1b' }}>{title}</strong>
        <p style={{ ...mutedTextStyle, marginTop: 6 }}>{description}</p>
      </div>
      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}
      <div>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setMessage(null);
            startTransition(async () => {
              try {
                await action();
                setMessage('Action completed.');
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Action failed.');
              }
            });
          }}
          disabled={pending}
          style={{ ...buttonStyle, background: '#991b1b', opacity: pending ? 0.7 : 1 }}
        >
          {pending ? 'Working...' : actionLabel}
        </button>
      </div>
    </div>
  );
}
