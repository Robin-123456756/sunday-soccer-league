'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState, useTransition } from 'react';
import { createManagedUser, updateManagedUser } from '@/server/actions/users';
import type { AppRole } from '@/types/database';
import { buttonStyle, cardStyle, gridStyle, inputStyle, labelStyle, secondaryButtonStyle, sectionTitleStyle } from '@/components/ui/styles';

interface TeamOption {
  id: string;
  name: string;
}

interface ExistingUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: AppRole;
  team_id: string | null;
  is_active: boolean;
}

export function UserManagementForm({ teams, existingUsers }: { teams: TeamOption[]; existingUsers: ExistingUser[] }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <form
        style={{ ...cardStyle, display: 'grid', gap: 16 }}
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setError(null);
          setMessage(null);
          const formData = new FormData(event.currentTarget);
          startTransition(async () => {
            try {
              const role = String(formData.get('role') ?? 'team_manager') as AppRole;
              await createManagedUser({
                fullName: String(formData.get('fullName') ?? '').trim(),
                email: String(formData.get('email') ?? '').trim(),
                password: String(formData.get('password') ?? '').trim(),
                role,
                teamId: role === 'team_manager' ? String(formData.get('teamId') ?? '') || null : null,
              });
              setMessage('User created successfully.');
              event.currentTarget.reset();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not create user.');
            }
          });
        }}
      >
        <div>
          <h2 style={sectionTitleStyle}>Create managed user</h2>
          <p style={{ margin: 0, color: '#4b5563' }}>Admins can create users, assign a role, and optionally link a team manager to a team.</p>
        </div>

        <div style={gridStyle}>
          <Field label="Full name"><input name="fullName" required style={inputStyle} /></Field>
          <Field label="Email"><input name="email" type="email" required style={inputStyle} /></Field>
          <Field label="Temporary password"><input name="password" type="password" required minLength={6} style={inputStyle} /></Field>
          <Field label="Role">
            <select name="role" style={inputStyle} defaultValue="team_manager">
              <option value="admin">Admin</option>
              <option value="referee">Referee</option>
              <option value="team_manager">Team manager</option>
            </select>
          </Field>
          <Field label="Team (for team managers)">
            <select name="teamId" style={inputStyle} defaultValue="">
              <option value="">No team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </Field>
        </div>

        {error ? <p style={{ color: '#b91c1c', margin: 0 }}>{error}</p> : null}
        {message ? <p style={{ color: '#047857', margin: 0 }}>{message}</p> : null}

        <div>
          <button disabled={pending} type="submit" style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
            {pending ? 'Creating...' : 'Create user'}
          </button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: 16 }}>
        {existingUsers.map((user) => (
          <form
            key={user.id}
            style={{ ...cardStyle, display: 'grid', gap: 12 }}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setError(null);
              setMessage(null);
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                try {
                  const role = String(formData.get('role') ?? user.role) as AppRole;
                  await updateManagedUser({
                    id: user.id,
                    fullName: String(formData.get('fullName') ?? '').trim(),
                    role,
                    teamId: role === 'team_manager' ? String(formData.get('teamId') ?? '') || null : null,
                    isActive: formData.get('isActive') === 'on',
                  });
                  setMessage(`Updated ${user.email ?? user.id}.`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Could not update user.');
                }
              });
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <strong>{user.email ?? 'No email'}</strong>
                <p style={{ margin: '6px 0 0', color: '#4b5563' }}>User ID: {user.id}</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input name="isActive" type="checkbox" defaultChecked={user.is_active} /> Active
              </label>
            </div>
            <div style={gridStyle}>
              <Field label="Full name"><input name="fullName" defaultValue={user.full_name ?? ''} required style={inputStyle} /></Field>
              <Field label="Role">
                <select name="role" defaultValue={user.role} style={inputStyle}>
                  <option value="admin">Admin</option>
                  <option value="referee">Referee</option>
                  <option value="team_manager">Team manager</option>
                </select>
              </Field>
              <Field label="Team">
                <select name="teamId" defaultValue={user.team_id ?? ''} style={inputStyle}>
                  <option value="">No team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button disabled={pending} type="submit" style={{ ...buttonStyle, opacity: pending ? 0.7 : 1 }}>
                {pending ? 'Saving...' : 'Save user'}
              </button>
              <span style={{ color: '#4b5563' }}>Current role: {user.role}</span>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label><span style={labelStyle}>{label}</span>{children}</label>;
}
