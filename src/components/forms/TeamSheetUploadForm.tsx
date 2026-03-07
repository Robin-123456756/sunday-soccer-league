'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';
import { uploadTeamSheet } from '@/lib/storage';
import { saveTeamSheetUpload } from '@/server/actions/uploads';
import { buttonStyle, cardStyle, inputStyle, labelStyle, sectionTitleStyle } from '@/components/ui/styles';
import type { TeamOption } from '@/server/queries/teams';

export function TeamSheetUploadForm({
  matchId,
  teams,
}: {
  matchId: string;
  teams: TeamOption[];
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
        const file = formData.get('file');

        if (!(file instanceof File) || file.size === 0) {
          setError('Please select a team sheet image or PDF to upload.');
          return;
        }

        startTransition(async () => {
          try {
            const teamId = String(formData.get('teamId') ?? '');
            const uploadResult = await uploadTeamSheet({ matchId, teamId, file });
            await saveTeamSheetUpload({
              matchId,
              teamId,
              fileName: uploadResult.fileName,
              fileUrl: uploadResult.fileUrl,
              fileType: uploadResult.fileType,
            });
            setMessage('Team sheet uploaded successfully.');
            (event.target as HTMLFormElement).reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not upload file.');
          }
        });
      }}
    >
      <div>
        <h2 style={sectionTitleStyle}>Upload team sheet</h2>
        <p style={{ margin: 0, color: '#4b5563' }}>Upload a photographed or scanned team sheet for future league access.</p>
      </div>

      <label>
        <span style={labelStyle}>Team</span>
        <select name="teamId" required style={inputStyle}>
          <option value="">Select team</option>
          {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
      </label>

      <label>
        <span style={labelStyle}>File</span>
        <input name="file" type="file" accept="image/*,.pdf" required style={inputStyle} />
      </label>

      {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
      {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

      <button type="submit" disabled={pending} style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
        {pending ? 'Uploading...' : 'Upload team sheet'}
      </button>
    </form>
  );
}
