'use server';

import { revalidatePath } from 'next/cache';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { requireRole } from '@/server/queries/auth';
import type { AppRole } from '@/types/database';

export interface CreateManagedUserInput {
  fullName: string;
  email: string;
  password: string;
  role: AppRole;
  teamId?: string | null;
}

export interface UpdateManagedUserInput {
  id: string;
  fullName: string;
  role: AppRole;
  teamId?: string | null;
  isActive: boolean;
}

export async function createManagedUser(input: CreateManagedUserInput) {
  await requireRole(['admin']);
  const admin = createAdminSupabaseClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { full_name: input.fullName },
  });

  if (createError || !created.user) {
    throw new Error(createError?.message ?? 'Could not create auth user.');
  }

  const supabase = await createServerSupabaseClient();
  const { error: profileError } = await supabase.from('users_profile').upsert({
    id: created.user.id,
    full_name: input.fullName,
    email: input.email,
    role: input.role,
    team_id: input.role === 'team_manager' ? input.teamId ?? null : null,
    is_active: true,
  });

  if (profileError) throw new Error(profileError.message);

  revalidatePath('/admin/users');
  revalidatePath('/dashboard');
  return { id: created.user.id };
}

export async function updateManagedUser(input: UpdateManagedUserInput) {
  await requireRole(['admin']);
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('users_profile')
    .update({
      full_name: input.fullName,
      role: input.role,
      team_id: input.role === 'team_manager' ? input.teamId ?? null : null,
      is_active: input.isActive,
    })
    .eq('id', input.id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/users');
  revalidatePath('/dashboard');
  return { success: true };
}
